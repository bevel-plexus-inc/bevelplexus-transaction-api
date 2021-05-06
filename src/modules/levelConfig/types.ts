import { Field, ObjectType } from "type-graphql";

@ObjectType()
export default class LevelConfig {
    @Field()
    id: string;

    @Field()
    level: number;

    @Field()
    dailyLimit: number;

    @Field()
    monthlyLimit: number;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}
