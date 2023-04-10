module.exports = class Data1681157999290 {
    name = 'Data1681157999290'

    async up(db) {
        await db.query(`CREATE TABLE "market" ("id" character varying NOT NULL, "address" text NOT NULL, "name" text NOT NULL, "symbol" text NOT NULL, "underlying_name" text NOT NULL, "underlying_price_usd" numeric NOT NULL, "underlying_decimals" integer NOT NULL, "total_borrows" numeric NOT NULL, "total_supply" numeric NOT NULL, "reserves" numeric NOT NULL, "cash" numeric NOT NULL, "supply_rate" numeric NOT NULL, "borrow_rate" numeric NOT NULL, "exchange_rate" numeric NOT NULL, "borrow_index" numeric NOT NULL, "reserve_factor" numeric NOT NULL, "accrual_block_timestamp" integer NOT NULL, "block_timestamp" numeric NOT NULL, CONSTRAINT "PK_1e9a2963edfd331d92018e3abac" PRIMARY KEY ("id"))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "market"`)
    }
}
