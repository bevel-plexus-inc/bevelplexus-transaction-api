// eslint-disable-next-line max-classes-per-file
import { ReceiveType } from "@shared/types";
import { Field, InputType } from "type-graphql";

@InputType()
export default class FxRateArgs {
    @Field()
    sendCurrency: string;

    @Field()
    destinationCurrency: string;

    @Field()
    baseAmount: number;

    @Field(returns => ReceiveType)
    receiveType: ReceiveType;
}
