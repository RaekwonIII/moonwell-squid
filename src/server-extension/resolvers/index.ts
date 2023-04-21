import "reflect-metadata";
import type { EntityManager } from "typeorm";
import { Field, ObjectType, Query, Resolver } from "type-graphql";
import { Market } from "../../model";
import { BigDecimal } from "@subsquid/big-decimal";

@ObjectType()
export class MarketDayData {
  @Field(() => Date, { nullable: false })
  day!: Date;

  @Field(() => Number, { nullable: true })
  totalSupply!: number;

  @Field(() => Number, { nullable: true })
  totalBorrows!: number;

  constructor(props: Partial<MarketDayData>) {
    Object.assign(this, props);
  }
}

@Resolver()
export class MarketDayDataResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [MarketDayData])
  async getMarketDayData(): Promise<MarketDayData[]> {
    const manager = await this.tx();
    const repository = manager.getRepository(Market);

    const data: {
      day: string;
      total_supply: number;
      total_borrows: number;
      // SELECT DATE(to_timestamp(block_timestamp::numeric/1000)) AS day, MAX(total_supply) as total_supply, MAX(total_borrows) as total_borrows
    }[] = await repository.query(`
            SELECT 
            DATE(to_timestamp(block_timestamp::numeric/1000)) AS day, 
            AVG(total_supply) as total_supply, 
            AVG(total_borrows) as total_borrows
            FROM market
            GROUP BY day
            ORDER BY day ASC
        `);
    return data.map(
      (i) =>
        new MarketDayData({
          day: new Date(i.day),
          totalSupply: i.total_supply,
          totalBorrows: i.total_borrows
        })
    );
  }
}

@ObjectType()
export class PostDayData {
  @Field(() => Date, { nullable: false })
  day!: Date;

  @Field(() => Number, { nullable: false })
  count!: number;

  constructor(props: Partial<PostDayData>) {
    Object.assign(this, props);
  }
}
