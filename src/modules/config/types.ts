// eslint-disable-next-line max-classes-per-file
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Config {
    @Field()
    id: string;

    @Field()
    defaultAccountNumber: string;

    @Field()
    defaultAccountName: string;

    @Field()
    minimumSendAmount: number;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}

// tslint:disable-next-line:max-classes-per-file
@ObjectType()
export class TransferFee {
    @Field()
    id: string;

    @Field()
    sendCurrency: string;

    @Field()
    destinationCurrency: string;

    @Field()
    product: string;

    @Field()
    fee: number;

    @Field()
    rate: number;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}
