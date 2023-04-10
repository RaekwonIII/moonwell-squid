import { lookupArchive } from "@subsquid/archive-registry";
import { Store, TypeormDatabase } from "@subsquid/typeorm-store";
import { EvmBatchProcessor, LogHandlerContext } from "@subsquid/evm-processor";
import { Market } from "./model";

import { events as cTokenEvents } from "./abi/ctoken";
import { events as feedEvents } from "./abi/feed";
import { Contract as OracleContract } from "./abi/chainlinkOracle";
import { Contract as mGLMRContract } from "./abi/mGLMR";
import { BigDecimal } from "@subsquid/big-decimal";
import { BlockContext } from "./abi/abi.support";

const mGLMROracleContract = "0xED301cd3EB27217BDB05C4E9B820a8A3c8B665f9";
const mGLMRPriceFeedContract = "0x62ca6b55f0bb1241c635e3dff51883f8b9f49aa4";
const mGLMRcontractAddress = "0x091608f4e4a15335145be0a279483c0f8e4c7955";

let mantissaFactor = 18;
let cTokenDecimals = 8;
let mantissaFactorBD: BigDecimal = exponentToBigDecimal(mantissaFactor);
let cTokenDecimalsBD: BigDecimal = exponentToBigDecimal(cTokenDecimals);

const processor = new EvmBatchProcessor()
  .setDataSource({
    chain: process.env.RPC_ENDPOINT || "wss://wss.api.moonbeam.network",
    archive: lookupArchive("moonbeam", { type: "EVM" }),
  })
  .setBlockRange({ from: 1277865 })
  .addLog(mGLMRcontractAddress, {
    filter: [[cTokenEvents.AccrueInterest.topic]],
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
  let latestPriceUpdateEvent:
    | LogHandlerContext<
        Store,
        { evmLog: { topics: true; data: true }; transaction: { hash: true } }
      >
    | undefined = undefined;
  let latestAccrueInterestEventCtx:
    | LogHandlerContext<
        Store,
        { evmLog: { topics: true; data: true }; transaction: { hash: true } }
      >
    | undefined = undefined;
  let latestIntegerPrice = BigDecimal(0);

  for (let block of ctx.blocks) {
    for (let i of block.items) {
      if (i.address === mGLMRPriceFeedContract && i.kind === "evmLog") {
        if (i.evmLog.topics[0] === feedEvents.AnswerUpdated.topic) {
          latestPriceUpdateEvent = {
            ...ctx,
            block: block.header,
            ...i,
          };
        }
      }
      if (i.address === mGLMRcontractAddress && i.kind === "evmLog") {
        if (i.evmLog.topics[0] === cTokenEvents.AccrueInterest.topic) {
          latestAccrueInterestEventCtx = {
            ...ctx,
            block: block.header,
            ...i,
          };
        }
      }
    }
  }
  if (latestPriceUpdateEvent !== undefined) {
    try {
      latestIntegerPrice = await handleAnswerUpdated(latestPriceUpdateEvent);
    } catch (error) {
      ctx.log.warn(
        `[API] Error fetching price from oracle ${mGLMRcontractAddress}, on block ${latestPriceUpdateEvent.block.height}`
      );
      if (error instanceof Error) {
        ctx.log.warn(`${error.message}`);
      }
    }
  }
  if (latestAccrueInterestEventCtx !== undefined) {
    await updateMarket(latestAccrueInterestEventCtx, latestIntegerPrice);
  }
});

async function updateMarket(
  ctx: LogHandlerContext<
    Store,
    { evmLog: { topics: true; data: true }; transaction: { hash: true } }
  >,
  latestIntegerPrice: BigDecimal
): Promise<void> {
  const { cashPrior, borrowIndex, interestAccumulated, totalBorrows } =
    cTokenEvents.AccrueInterest.decode(ctx.evmLog);
  const market = new Market({
    id: `${mGLMRcontractAddress}-${ctx.evmLog.id}-${ctx.block.timestamp}`,
    address: mGLMRcontractAddress,
    name: "GLRM",
    symbol: "GLRM",
    underlyingPriceUSD: latestIntegerPrice || BigDecimal(0),
    underlyingDecimals: 18,
    underlyingName: "GLRM",
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
  ] = await Promise.all([
    contractAPI.accrualBlockTimestamp(),
    contractAPI.totalSupply(),
    contractAPI.exchangeRateStored(),
    contractAPI.totalReserves(),
    contractAPI.reserveFactorMantissa(),
  ]);

  market.accrualBlockTimestamp = accrualBlockTimestamp.toNumber();
  market.blockTimestamp = ctx.block.timestamp;
  market.totalSupply = BigDecimal(totalSupply.toNumber());

  market.exchangeRate = BigDecimal(exchangeRateStored.toNumber())
    .div(exponentToBigDecimal(market.underlyingDecimals))
    .times(cTokenDecimalsBD)
    .div(mantissaFactorBD)
    .round(mantissaFactor, 0);

  market.reserves = BigDecimal(totalReserves.toNumber())
    .div(exponentToBigDecimal(market.underlyingDecimals))
    .round(market.underlyingDecimals, 0);

  market.totalBorrows = BigDecimal(totalBorrows.toBigInt())
    .div(exponentToBigDecimal(market.underlyingDecimals))
    .round(market.underlyingDecimals, 0);
  market.cash = BigDecimal(cashPrior.toBigInt())
    .div(exponentToBigDecimal(market.underlyingDecimals))
    .round(market.underlyingDecimals, 0);
  market.borrowIndex = borrowIndex.toBigInt();
  market.reserveFactor = reserveFactorMantissa.toBigInt();

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
