import { lookupArchive } from "@subsquid/archive-registry";
import { Store, TypeormDatabase } from "@subsquid/typeorm-store";
import { EvmBatchProcessor, EvmBlock, LogHandlerContext } from "@subsquid/evm-processor";
import { In, MaxKey } from "typeorm";
import { ethers } from "ethers";
import { Market } from "./model";

import { events as cTokenEvents } from "./abi/ctoken";
import { events as feedEvents } from "./abi/feed";
import { Contract as OracleContract } from "./abi/priceOracle";
import { Contract as CTokenContract } from "./abi/ctoken";
import { BigDecimal } from "@subsquid/big-decimal";
import { BlockContext } from "./abi/abi.support";

const mGLMROracleContract = "0xED301cd3EB27217BDB05C4E9B820a8A3c8B665f9";
const mGLMRPriceFeedContract = "0x62ca6b55f0bb1241c635e3dff51883f8b9f49aa4";
const mGLMRcontractAddress = "0x091608f4e4a15335145be0a279483c0f8e4c7955";
export let mantissaFactor = 18;
export let cTokenDecimals = 8;
export let mantissaFactorBD: BigDecimal = exponentToBigDecimal(mantissaFactor);
export let cTokenDecimalsBD: BigDecimal = exponentToBigDecimal(cTokenDecimals);

const processor = new EvmBatchProcessor()
  .setDataSource({
    chain: process.env.RPC_ENDPOINT || "wss://wss.api.moonbeam.network",
    archive: lookupArchive("moonbeam", { type: "EVM" }),
  })
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
  
  const lastBlock = ctx.blocks[ctx.blocks.length - 1];
  let latestIntegerPrice = BigDecimal(0);
  // update the latest price as frequently as possible
  for (let block of ctx.blocks) {
    for (let i of block.items) {
      if (i.address === mGLMRPriceFeedContract && i.kind === "evmLog") {
        if (i.evmLog.topics[0] === feedEvents.AnswerUpdated.topic) {
          try {
            latestIntegerPrice = await handleAnswerUpdated({ ...ctx, block: block.header});
          } catch (error) {
            ctx.log.warn(`[API] Error fetching price from oracle ${mGLMRcontractAddress}, on block ${block.header.height}`);
            if (error instanceof Error) {
              ctx.log.warn(`${error.message}`);
            }
          }
        }
      }
    }
  }
  // since the logic is rather trivial and only updates 1 market (GMLR)
  // and does not calculate based on events, rather "polls" the contract
  // status, might as well save RPC calls and do it at the end of every batch.

  for (let i of lastBlock.items) {
    if (i.address === mGLMRcontractAddress && i.kind === "evmLog") {
      if (i.evmLog.topics[0] === cTokenEvents.AccrueInterest.topic) {
        await updateMarket({
          ...ctx,
          block: lastBlock.header,
          ...i,
        }, lastBlock.header, latestIntegerPrice);
      }
    }
  }
});

async function updateMarket(
  ctx: LogHandlerContext<
    Store,
    { evmLog: { topics: true; data: true }; transaction: { hash: true } }
  >,
  lastBlock: EvmBlock,
  latestIntegerPrice: BigDecimal
): Promise<Market> {
  const { cashPrior, borrowIndex, interestAccumulated, totalBorrows } =
    cTokenEvents.AccrueInterest.decode(ctx.evmLog);
  let market = await ctx.store.findOne(Market, {
    where: { id: mGLMRcontractAddress },
  });
  if (market == null) {
    market = new Market({
      id: mGLMRcontractAddress,
      name: "GLRM",
      symbol: "GLRM",
      underlyingPriceUSD: BigDecimal(0),
      underlyingDecimals: 18,
      underlyingName: "GLRM",
    });
  }
  // Only update the market if it hasn't already been updated this block
  if (market.accrualBlockTimestamp === lastBlock.timestamp) return market;

  ctx.evmLog.address;
  const contract = new CTokenContract(
    ctx,
    { height: lastBlock.height },
    mGLMRcontractAddress
  );

  market.accrualBlockTimestamp = (
    await contract.accrualBlockTimestamp()
  ).toNumber();
  market.blockTimestamp = ctx.block.timestamp;
  market.totalSupply = BigDecimal((await contract.totalSupply()).toNumber());

  market.exchangeRate = BigDecimal(
    (await contract.exchangeRateStored()).toNumber()
  )
    .div(exponentToBigDecimal(market.underlyingDecimals))
    .times(cTokenDecimalsBD)
    .div(mantissaFactorBD)
    .round(mantissaFactor, 0);

  market.reserves = BigDecimal((await contract.totalReserves()).toNumber())
    .div(exponentToBigDecimal(market.underlyingDecimals))
    .round(market.underlyingDecimals, 0);

  market.totalBorrows = BigDecimal(totalBorrows.toBigInt())
    .div(exponentToBigDecimal(market.underlyingDecimals))
    .round(market.underlyingDecimals, 0);
  market.cash = BigDecimal(cashPrior.toBigInt())
    .div(exponentToBigDecimal(market.underlyingDecimals))
    .round(market.underlyingDecimals, 0);
  market.borrowIndex = borrowIndex.toBigInt();
  market.reserveFactor = (await contract.reserveFactorMantissa()).toBigInt()

  return market;
}

async function handleAnswerUpdated(
  ctx: BlockContext
): Promise<BigDecimal> {
  const contract = new OracleContract(
    ctx,
    mGLMROracleContract
  );
  const price = BigDecimal((
    await contract.getUnderlyingPrice(mGLMRcontractAddress)
  ).toBigInt());
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
