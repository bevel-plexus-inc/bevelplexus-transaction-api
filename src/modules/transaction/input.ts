// eslint-disable-next-line max-classes-per-file
import { ReceiveType, TransactionStatus, TransactionType } from "@shared/types";
import { Field, InputType } from "type-graphql";

@InputType()
export class TransactionArgs {
    @Field({ nullable: true })
    recipientId?: string;

    @Field({ nullable: true })
    bankInfoId?: string;

    @Field()
    sendCurrency: string;

    @Field()
    destinationCurrency: string;

    @Field()
    baseAmount: number;

    @Field(returns => TransactionType)
    transactionType: TransactionType;

    @Field(returns => ReceiveType)
    receiveType: ReceiveType;
}

// tslint:disable-next-line:max-classes-per-file
@InputType()
export class TransactionUpdateArgs {
    @Field()
    transactionId: string;

    @Field(returns => TransactionStatus)
    status: TransactionStatus;
}
