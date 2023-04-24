module.exports = class Data1682349637851 {
    name = 'Data1682349637851'

    async up(db) {
        await db.query(`CREATE TABLE "market" ("id" character varying NOT NULL, "address" text NOT NULL, "name" text NOT NULL, "symbol" text NOT NULL, "underlying_name" text NOT NULL, "underlying_price_usd" numeric NOT NULL, "underlying_decimals" integer NOT NULL, "total_borrows" numeric NOT NULL, "total_supply" numeric NOT NULL, "reserves" numeric NOT NULL, "cash" numeric NOT NULL, "supply_rate" numeric NOT NULL, "borrow_rate" numeric NOT NULL, "exchange_rate" numeric NOT NULL, "borrow_index" numeric NOT NULL, "reserve_factor" numeric NOT NULL, "accrual_block_timestamp" integer NOT NULL, "block_timestamp" numeric NOT NULL, CONSTRAINT "PK_1e9a2963edfd331d92018e3abac" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "market_order" ("id" character varying NOT NULL, "type" character varying(16) NOT NULL, "amount" numeric NOT NULL, "to" text NOT NULL, "from" text NOT NULL, "block_number" integer NOT NULL, "block_time" numeric NOT NULL, "c_token_symbol" text NOT NULL, "underlying_symbol" text NOT NULL, "underlying_amount" numeric, "underlying_repay_amount" numeric, CONSTRAINT "PK_c68018a332c65b55bf2e52c9a82" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "account" ("id" character varying NOT NULL, "latest_order" numeric NOT NULL, "order_type" character varying(16) NOT NULL, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "market"`)
        await db.query(`DROP TABLE "market_order"`)
        await db.query(`DROP TABLE "account"`)
    }
}
