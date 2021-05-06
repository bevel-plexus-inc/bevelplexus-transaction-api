// eslint-disable-next-line max-classes-per-file
import Country from "@modules/country/types";
import { PaymentType } from "@shared/types";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class PaymentProperty {
    @Field()
    id: string;

    @Field()
    paymentChannelId: string;

    @Field()
    label: string;

    @Field()
    value: string;
}

// tslint:disable-next-line:max-classes-per-file
@ObjectType()
export default class PaymentChannel {
    @Field()
    id: string;

    @Field(returns => PaymentType)
    paymentType: PaymentType;

    @Field()
    countryId: string;

    @Field()
    header: string;

    @Field(returns => Country)
    country: Country;

    @Field(returns => [PaymentProperty])
    paymentProperties: Array<PaymentProperty>;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}

// tslint:disable-next-line:max-classes-per-file
@ObjectType()
export class PaymentChannelList {
    @Field(returns => [PaymentChannel])
    paymentChannels: Array<PaymentChannel>;

    @Field()
    total: number;
}
