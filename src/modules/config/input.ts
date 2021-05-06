import { Field, InputType } from "type-graphql";
import { ReceiveType } from "../../shared/types";

@InputType()
export default class TransferFeeArgs {
    @Field()
    sendCurrency: string;

    @Field()
    destinationCurrency: string;

    @Field(returns => ReceiveType)
    product: ReceiveType;

    @Field()
    fee: number;

    @Field()
    rate: number;
}
