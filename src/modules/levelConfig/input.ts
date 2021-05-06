import { Field, InputType } from "type-graphql";

@InputType()
export default class LevelConfigArgs {
    @Field()
    level: number;

    @Field()
    dailyLimit: number;

    @Field()
    monthlyLimit: number;
}
