// eslint-disable-next-line max-classes-per-file
import { PaymentType } from "@shared/types";
import { Field, InputType } from "type-graphql";

@InputType()
export default class PaymentChannelArg {
    @Field(returns => PaymentType)
    paymentType: PaymentType;

    @Field()
    countryId: string;

    @Field()
    header: string;
}

// tslint:disable-next-line:max-classes-per-file
@InputType()
export class PaymentPropertyArg {
    @Field()
    paymentChannelId: string;

    @Field()
    label: string;

    @Field()
    value: string;
}
