import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"
import {MaketOrderType} from "./_maketOrderType"

@Entity_()
export class Account {
    constructor(props?: Partial<Account>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    /**
     * Timestamp of most recent order
     */
    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    latestOrder!: bigint

    @Column_("varchar", {length: 16, nullable: false})
    orderType!: MaketOrderType
}
