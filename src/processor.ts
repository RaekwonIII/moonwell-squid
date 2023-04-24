import { lookupArchive } from "@subsquid/archive-registry";
import { Store, TypeormDatabase } from "@subsquid/typeorm-store";
import {
  BlockHandlerContext,
  EvmBatchProcessor,
  LogHandlerContext,
} from "@subsquid/evm-processor";
import { Account, MaketOrderType, Market, MarketOrder } from "./model";

import { events as feedEvents } from "./abi/feed";
import { Contract as OracleContract } from "./abi/chainlinkOracle";
import { Contract as mGLMRContract, events as mGLRMEvents } from "./abi/mGLMR";
import { BigDecimal } from "@subsquid/big-decimal";
import { BlockContext } from "./abi/abi.support";
import { BigNumber } from "ethers";
import { In } from "typeorm";

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
    chain: process.env.MOONBEAM_CHAIN_NODE || "wss://wss.api.moonbeam.network",
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
  .addLog(mGLMRcontractAddress, {
    filter: [
      [
        mGLRMEvents.AccrueInterest.topic,
        mGLRMEvents.Borrow.topic,
        mGLRMEvents.LiquidateBorrow.topic,
        mGLRMEvents.Mint.topic,
        mGLRMEvents.Redeem.topic,
        mGLRMEvents.RepayBorrow.topic,
        mGLRMEvents.Transfer.topic,
      ],
    ],
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
  let marketOrders: MarketOrder[] = [];

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
          let blockTSDiff = timestampDiffInSecs(
            accrueInterestEventCtxArr.at(-1)?.block.timestamp,
            block.header.timestamp
          );
          if (
            accrueInterestEventCtxArr.length === 0 ||
            blockTSDiff > secondsPerHour * 3
          ) {
            ctx.log.debug(
              `Market Update events were ${blockTSDiff} seconds apart, adding to the list`
            );
            accrueInterestEventCtxArr.push({
              ...ctx,
              block: block.header,
              ...i,
            });
          }
        } else if (i.evmLog.topics[0] === mGLRMEvents.Borrow.topic) {
          const { borrower, borrowAmount, totalBorrows, accountBorrows } =
            mGLRMEvents.Borrow.decode(i.evmLog);
          ctx.log.debug(
            `totalBorrows ${totalBorrows}, accountBorrows ${accountBorrows}`
          );

          marketOrders.push(
            handleMArketOrder(
              mGLMRcontractAddress, // when tokens are redeemed, they are coming from the token address itself
              borrower,
              borrowAmount,
              i.transaction.hash,
              i.evmLog.index,
              block.header.height,
              BigInt(block.header.timestamp),
              MaketOrderType.TRANSFER
            )
          );
        } else if (i.evmLog.topics[0] === mGLRMEvents.LiquidateBorrow.topic) {
          const {
            liquidator,
            borrower,
            repayAmount,
            mTokenCollateral,
            seizeTokens,
          } = mGLRMEvents.LiquidateBorrow.decode(i.evmLog);
          ctx.log.debug(
            `seizeTokens ${seizeTokens}, repayAmount ${repayAmount}, marketCTokenLiquidated ${mTokenCollateral}`
          );

          marketOrders.push(
            handleMArketOrder(
              borrower, // when tokens are redeemed, they are coming from the token address itself
              liquidator,
              seizeTokens,
              i.transaction.hash,
              i.evmLog.index,
              block.header.height,
              BigInt(block.header.timestamp),
              MaketOrderType.TRANSFER
            )
          );
        } else if (i.evmLog.topics[0] === mGLRMEvents.Mint.topic) {
          const { minter, mintAmount, mintTokens } = mGLRMEvents.Mint.decode(
            i.evmLog
          );
          ctx.log.debug(`mintAmount ${mintAmount}, mintTokens ${mintTokens}`);

          marketOrders.push(
            handleMArketOrder(
              mGLMRcontractAddress, // when tokens are minted, they are coming from the token address itself
              minter,
              mintTokens,
              i.transaction.hash,
              i.evmLog.index,
              block.header.height,
              BigInt(block.header.timestamp),
              MaketOrderType.TRANSFER
            )
          );
        } else if (i.evmLog.topics[0] === mGLRMEvents.Redeem.topic) {
          const { redeemer, redeemAmount, redeemTokens } =
            mGLRMEvents.Redeem.decode(i.evmLog);
          ctx.log.debug(
            `redeemAmount ${redeemAmount}, redeemTokens ${redeemTokens}`
          );

          marketOrders.push(
            handleMArketOrder(
              redeemer, // when tokens are redeemed, they are going back the token address itself
              mGLMRcontractAddress,
              redeemTokens,
              i.transaction.hash,
              i.evmLog.index,
              block.header.height,
              BigInt(block.header.timestamp),
              MaketOrderType.TRANSFER
            )
          );
        } else if (i.evmLog.topics[0] === mGLRMEvents.RepayBorrow.topic) {
          const { payer, borrower, repayAmount, accountBorrows, totalBorrows } =
            mGLRMEvents.RepayBorrow.decode(i.evmLog);

          marketOrders.push(
            handleMArketOrder(
              payer,
              borrower,
              repayAmount,
              i.transaction.hash,
              i.evmLog.index,
              block.header.height,
              BigInt(block.header.timestamp),
              MaketOrderType.TRANSFER
            )
          );
        } else if (i.evmLog.topics[0] === mGLRMEvents.Transfer.topic) {
          const { from, to, amount } = mGLRMEvents.Transfer.decode(i.evmLog);

          marketOrders.push(
            handleMArketOrder(
              from,
              to,
              amount,
              i.transaction.hash,
              i.evmLog.index,
              block.header.height,
              BigInt(block.header.timestamp),
              MaketOrderType.TRANSFER
            )
          );
        }
      }
    }
  }
  ctx.log.debug(
    `First block's timestamp: ${ctx.blocks.at(0)?.header.timestamp}`
  );
  ctx.log.debug(
    `Last block's timestamp: ${ctx.blocks.at(-1)?.header.timestamp}`
  );
  ctx.log.debug(
    `Found ${accrueInterestEventCtxArr.length} market update events to be processed in a batch with ${accrueEventsCounter} total events.`
  );
  // process all market updates found in the batch
  for (let accrueInterestEventCtx of accrueInterestEventCtxArr) {
    await updateMarket(accrueInterestEventCtx, latestIntegerPrice);
  }
  await ctx.store.save(marketOrders);
  await saveAccounts(
    {
      ...ctx,
      block: ctx.blocks[ctx.blocks.length - 1].header,
    },
    marketOrders)
});

function timestampDiffInSecs(
  start: number | undefined,
  end: number | undefined
) {
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
    borrowIndex: borrowIndex.toBigInt(),
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

function handleMArketOrder(
  from: string,
  to: string,
  amount: BigNumber,
  transactionHash: string,
  evmLogIndex: number,
  blockNumber: number,
  timestamp: bigint,
  type: MaketOrderType,
  underlyingRepayAmount?: BigNumber
): MarketOrder {
  let transferID = transactionHash.concat("-").concat(evmLogIndex.toString());

  let marketOrder = new MarketOrder({
    id: transferID,
    amount: BigDecimal(amount.toBigInt())
      .div(cTokenDecimalsBD)
      .round(mantissaFactor, 0),
    to,
    from,
    blockNumber,
    blockTime: timestamp,
    type: type,
    cTokenSymbol: "GLMR",
    underlyingSymbol: "GLMR",
  });
  marketOrder.underlyingAmount = marketOrder.amount;

  if (type === MaketOrderType.LIQUIDATE_BORROW)
    marketOrder.underlyingRepayAmount = BigDecimal(
      underlyingRepayAmount?.toBigInt() || 0
    ).div(cTokenDecimalsBD);

  return marketOrder;
}

async function saveAccounts(
  ctx: BlockHandlerContext<Store>,
  marketOrders: MarketOrder[]
) {
  const accountIds: Set<string> = new Set();

  for (const marketOrder of marketOrders) {
    if (marketOrder.from) accountIds.add(marketOrder.from.toLowerCase());
    if (marketOrder.to) accountIds.add(marketOrder.to.toLowerCase());
  }

  const accounts: Map<string, Account> = new Map(
    (await ctx.store.findBy(Account, { id: In([...accountIds]) })).map((account) => [
      account.id,
      account,
    ])
  );

  for (const marketOrder of marketOrders) {

    let fromAccount = accounts.get(marketOrder.from);
    if (fromAccount == null) {
      fromAccount = new Account({ 
        id: marketOrder.from.toLowerCase(),
        latestOrder: marketOrder.blockTime,
        orderType: marketOrder.type
      });
      accounts.set(fromAccount.id, fromAccount);
    }
    if (fromAccount.latestOrder < marketOrder.blockTime) {
      fromAccount.latestOrder = marketOrder.blockTime
      fromAccount.orderType = marketOrder.type
    }

    let toAccount = accounts.get(marketOrder.to);
    if (toAccount == null) {
      toAccount = new Account({ 
        id: marketOrder.to.toLowerCase(),
        latestOrder: marketOrder.blockTime,
        orderType: marketOrder.type
      });
      accounts.set(toAccount.id, toAccount);
    }
    if (toAccount.latestOrder < marketOrder.blockTime) {
      toAccount.latestOrder = marketOrder.blockTime
      toAccount.orderType = marketOrder.type
    }
  }

  ctx.log.info(`Saving ${accounts.size} accounts`)

  await ctx.store.save([...accounts.values()]);
}
