import {BigDecimal} from "@subsquid/big-decimal"
import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"
import {MarketOrderType} from "./_marketOrderType"

@Entity_()
export class MarketOrder {
    constructor(props?: Partial<MarketOrder>) {
        Object.assign(this, props)
    }

    /**
     * Transaction hash concatenated with log index
     */
    @PrimaryColumn_()
    id!: string

    @Column_("varchar", {length: 16, nullable: false})
    type!: MarketOrderType

    /**
     * cTokens transferred
     */
    @Column_("numeric", {transformer: marshal.bigdecimalTransformer, nullable: false})
    amount!: BigDecimal

    /**
     * Account that received tokens
     */
    @Column_("text", {nullable: false})
    to!: string

    /**
     * Account that sent tokens
     */
    @Column_("text", {nullable: false})
    from!: string

    /**
     * Block number
     */
    @Column_("int4", {nullable: false})
    blockNumber!: number

    /**
     * Block time
     */
    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    blockTime!: bigint

    /**
     * Symbol of the cToken transferred
     */
    @Column_("text", {nullable: false})
    cTokenSymbol!: string

    /**
     * Symbol of the underlying asset repaid through liquidation
     */
    @Column_("text", {nullable: false})
    underlyingSymbol!: string

    /**
     * Underlying token amount transferred
     */
    @Column_("numeric", {transformer: marshal.bigdecimalTransformer, nullable: true})
    underlyingAmount!: BigDecimal | undefined | null

    /**
     * Underlying cToken amount that was repaid by liquidator
     */
    @Column_("numeric", {transformer: marshal.bigdecimalTransformer, nullable: true})
    underlyingRepayAmount!: BigDecimal | undefined | null
}
