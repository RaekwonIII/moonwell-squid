import {BigDecimal} from "@subsquid/big-decimal"
import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"

/**
 * Market stores all high level variables for a cToken market
 */
@Entity_()
export class Market {
    constructor(props?: Partial<Market>) {
        Object.assign(this, props)
    }

    /**
     * CToken address
     */
    @PrimaryColumn_()
    id!: string

    @Column_("text", {nullable: false})
    address!: string

    /**
     * Name of the cToken
     */
    @Column_("text", {nullable: false})
    name!: string

    /**
     * CToken symbol
     */
    @Column_("text", {nullable: false})
    symbol!: string

    /**
     * Underlying token name
     */
    @Column_("text", {nullable: false})
    underlyingName!: string

    /**
     * Underlying token price in USD
     */
    @Column_("numeric", {transformer: marshal.bigdecimalTransformer, nullable: false})
    underlyingPriceUSD!: BigDecimal

    /**
     * Underlying token decimal length
     */
    @Column_("int4", {nullable: false})
    underlyingDecimals!: number

    /**
     * Borrows in the market
     */
    @Column_("numeric", {transformer: marshal.bigdecimalTransformer, nullable: false})
    totalBorrows!: BigDecimal

    /**
     * CToken supply.
     */
    @Column_("numeric", {transformer: marshal.bigdecimalTransformer, nullable: false})
    totalSupply!: BigDecimal

    /**
     * Reserves stored in the contract
     */
    @Column_("numeric", {transformer: marshal.bigdecimalTransformer, nullable: false})
    reserves!: BigDecimal

    /**
     * The cToken contract balance of ERC20 or ETH
     */
    @Column_("numeric", {transformer: marshal.bigdecimalTransformer, nullable: false})
    cash!: BigDecimal

    /**
     * Yearly supply rate.
     */
    @Column_("numeric", {transformer: marshal.bigdecimalTransformer, nullable: false})
    supplyRate!: BigDecimal

    /**
     * Yearly borrow rate.
     */
    @Column_("numeric", {transformer: marshal.bigdecimalTransformer, nullable: false})
    borrowRate!: BigDecimal

    /**
     * Exchange rate of tokens / cTokens
     */
    @Column_("numeric", {transformer: marshal.bigdecimalTransformer, nullable: false})
    exchangeRate!: BigDecimal

    /**
     * The history of the markets borrow index return (Think S&P 500)
     */
    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    borrowIndex!: bigint

    /**
     * The factor determining interest that goes to reserves
     */
    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    reserveFactor!: bigint

    /**
     * Block the market is updated to
     */
    @Column_("int4", {nullable: false})
    accrualBlockTimestamp!: number

    /**
     * Timestamp the market was most recently updated
     */
    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    blockTimestamp!: bigint
}
