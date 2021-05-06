import { ReceiveType } from "@shared/types";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export default class FxRateResponse {
    @Field()
    sendCurrency: string;

    @Field()
    destinationCurrency: string;

    @Field()
    baseAmount: number;

    @Field()
    convertedAmount: number;

    @Field()
    rate: number;

    @Field()
    fee: number;

    @Field()
    actualAmount: number;

    @Field(returns => ReceiveType)
    receiveType: ReceiveType;
}
