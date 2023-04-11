import { lookupArchive } from "@subsquid/archive-registry";
import { Store, TypeormDatabase } from "@subsquid/typeorm-store";
import { EvmBatchProcessor, LogHandlerContext } from "@subsquid/evm-processor";
import { Market } from "./model";

import { events as feedEvents } from "./abi/feed";
import { Contract as OracleContract } from "./abi/chainlinkOracle";
import { Contract as mGLMRContract, events as mGLRMEvents } from "./abi/mGLMR";
import { BigDecimal } from "@subsquid/big-decimal";
import { BlockContext } from "./abi/abi.support";

const mGLMROracleContract = "0xED301cd3EB27217BDB05C4E9B820a8A3c8B665f9";
const mGLMRPriceFeedContract = "0x62ca6b55f0bb1241c635e3dff51883f8b9f49aa4";
const mGLMRcontractAddress = "0x091608f4e4a15335145be0a279483c0f8e4c7955";

const mantissaFactor = 18;
const cTokenDecimals = 8;
const mantissaFactorBD: BigDecimal = exponentToBigDecimal(mantissaFactor);
const cTokenDecimalsBD: BigDecimal = exponentToBigDecimal(cTokenDecimals);
const secondsPerHour = 24 * 60;
const secondsPerDay = secondsPerHour * 60;
const daysPerYear = 365;

const processor = new EvmBatchProcessor()
  .setDataSource({
    chain: process.env.RPC_ENDPOINT || "wss://wss.api.moonbeam.network",
    archive: lookupArchive("moonbeam", { type: "EVM" }),
  })
  .setBlockRange({ from: 1277865 })
  .addLog(mGLMRcontractAddress, {
    filter: [[mGLRMEvents.AccrueInterest.topic]],
    data: {
      evmLog: {
        topics: true,
        data: true,
      },
      transaction: {
        hash: true,
      },
    },
  })
  .addLog(mGLMRPriceFeedContract, {
    filter: [[feedEvents.AnswerUpdated.topic]],
    data: {
      evmLog: {
        topics: true,
        data: true,
      },
      transaction: {
        hash: true,
      },
    },
  });

processor.run(new TypeormDatabase(), async (ctx) => {
  let latestPriceUpdateEventCtx:
    | LogHandlerContext<
        Store,
        { evmLog: { topics: true; data: true }; transaction: { hash: true } }
      >
    | undefined = undefined;
  let accrueInterestEventCtxArr:
    | LogHandlerContext<
        Store,
        { evmLog: { topics: true; data: true }; transaction: { hash: true } }
      >[] = [];
  let accrueEventsCounter = 0;
  let latestIntegerPrice = BigDecimal(0);

  // one full loop to get the latest price in this batch
  // solves initialization problem for the market updates
  for (let block of ctx.blocks) {
    for (let i of block.items) {
      if (i.address === mGLMRPriceFeedContract && i.kind === "evmLog") {
        if (i.evmLog.topics[0] === feedEvents.AnswerUpdated.topic) {
          latestPriceUpdateEventCtx = {
            ...ctx,
            block: block.header,
            ...i,
          };
        }
      }
    }
  }
  if (latestPriceUpdateEventCtx !== undefined) {
    try {
      latestIntegerPrice = await handleAnswerUpdated(latestPriceUpdateEventCtx);
    } catch (error) {
      ctx.log.warn(
        `[API] Error fetching price from oracle ${mGLMRcontractAddress}, on block ${latestPriceUpdateEventCtx.block.height}`
      );
      if (error instanceof Error) {
        ctx.log.warn(`${error.message}`);
      }
    }
  }

  // one other loop over the batch to process market updates, with the price established.
  for (let block of ctx.blocks) {
    for (let i of block.items) {
      if (i.address === mGLMRcontractAddress && i.kind === "evmLog") {
        if (i.evmLog.topics[0] === mGLRMEvents.AccrueInterest.topic) {
          accrueEventsCounter += 1;
          // add events to be indexed when they are at least 1 hour apart
          let blockTSDiff = timestampDiffInSecs(accrueInterestEventCtxArr.at(-1)?.block.timestamp, block.header.timestamp);
          if (accrueInterestEventCtxArr.length === 0 ||  blockTSDiff > secondsPerHour ) {
            ctx.log.debug(`Market Update events were ${blockTSDiff} seconds apart, adding to the list`)
            accrueInterestEventCtxArr.push({
              ...ctx,
              block: block.header,
              ...i,
            });
          }
        }
      }
    }
  }
  ctx.log.info(`First block's timestamp: ${ctx.blocks.at(0)?.header.timestamp}`)
  ctx.log.info(`Last block's timestamp: ${ctx.blocks.at(-1)?.header.timestamp}`)
  ctx.log.info(`Found ${accrueInterestEventCtxArr.length} market update events to be processed in a batch with ${accrueEventsCounter} total events.`)
  // process all market updates found in the batch
  for (let accrueInterestEventCtx of accrueInterestEventCtxArr) {
    await updateMarket(accrueInterestEventCtx, latestIntegerPrice);
  }
});

function timestampDiffInSecs(start: number | undefined, end: number | undefined) {
  if (!end) return 0;
  if (!start) return 0;
  return (end - start) / 1000;
}

async function updateMarket(
  ctx: LogHandlerContext<
    Store,
    { evmLog: { topics: true; data: true }; transaction: { hash: true } }
  >,
  latestIntegerPrice: BigDecimal
): Promise<void> {
  const { cashPrior, borrowIndex, interestAccumulated, totalBorrows } =
    mGLRMEvents.AccrueInterest.decode(ctx.evmLog);
  const market = new Market({
    id: `${mGLMRcontractAddress}-${ctx.evmLog.id}-${ctx.block.timestamp}`,
    address: mGLMRcontractAddress,
    name: "GLRM",
    symbol: "GLRM",
    blockTimestamp: BigInt(ctx.block.timestamp),
    underlyingDecimals: mantissaFactor,
    underlyingName: "GLRM",
    totalBorrows: BigDecimal(totalBorrows.toBigInt())
      .div(exponentToBigDecimal(mantissaFactor))
      .round(mantissaFactor, 0),
    cash: BigDecimal(cashPrior.toBigInt())
      .div(exponentToBigDecimal(mantissaFactor))
      .round(mantissaFactor, 0),
    borrowIndex: borrowIndex.toBigInt()
  });
  const contractAPI = new mGLMRContract(
    ctx,
    { height: ctx.block.height },
    mGLMRcontractAddress
  );

  const [
    accrualBlockTimestamp,
    totalSupply,
    exchangeRateStored,
    totalReserves,
    reserveFactorMantissa,
    supplyRatePerTimestampResult,
    borrowRatePerTimestampResult,
  ] = await Promise.all([
    contractAPI.accrualBlockTimestamp(),
    contractAPI.totalSupply(),
    contractAPI.exchangeRateStored(),
    contractAPI.totalReserves(),
    contractAPI.reserveFactorMantissa(),
    contractAPI.supplyRatePerTimestamp(),
    contractAPI.borrowRatePerTimestamp(),
  ]);

  if (latestIntegerPrice) {
    market.underlyingPriceUSD = latestIntegerPrice.div(
      exponentToBigDecimal(18 - market.underlyingDecimals + 18)
    );
  }

  market.accrualBlockTimestamp = accrualBlockTimestamp.toNumber();
  market.totalSupply = BigDecimal(totalSupply.toString()).div(cTokenDecimalsBD);

  market.exchangeRate = BigDecimal(exchangeRateStored.toString())
    .div(exponentToBigDecimal(market.underlyingDecimals))
    .times(cTokenDecimalsBD)
    .div(mantissaFactorBD)
    .round(mantissaFactor, 0);

  market.reserves = BigDecimal(totalReserves.toBigInt())
    .div(exponentToBigDecimal(market.underlyingDecimals))
    .round(market.underlyingDecimals, 0);

  market.reserveFactor = reserveFactorMantissa.toBigInt();
  market.supplyRate = BigDecimal(
    (
      100.0 *
      (Math.pow(
        1.0 + (supplyRatePerTimestampResult.toNumber() * secondsPerDay) / 1e18,
        daysPerYear
      ) -
        1)
    ).toString()
  );

  market.borrowRate = BigDecimal(
    (
      100.0 *
      (Math.pow(
        1.0 + (borrowRatePerTimestampResult.toNumber() * secondsPerDay) / 1e18,
        daysPerYear
      ) -
        1)
    ).toString()
  );

  await ctx.store.save(market);
}

async function handleAnswerUpdated(ctx: BlockContext): Promise<BigDecimal> {
  const contract = new OracleContract(ctx, mGLMROracleContract);
  const price = BigDecimal(
    (await contract.getUnderlyingPrice(mGLMRcontractAddress)).toBigInt()
  );
  return price;
}

export function exponentToBigDecimal(decimals: number): BigDecimal {
  let ten = BigInt(10);
  let res = BigDecimal(1);
  for (let i = 0; i < decimals; i++) {
    res = res.times(ten);
  }
  return res;
}
