// eslint-disable-next-line max-classes-per-file
import BankInfo from "@shared/bankInfo";
import Recipient from "@shared/recipient";
import { ReceiveType, TransactionStatus, TransactionType } from "@shared/types";
import User from "@shared/user";
import { Field, ObjectType } from "type-graphql";
import Institution from "../institution/types";

@ObjectType()
export class Transaction {
    @Field()
    id: string;

    @Field()
    recipientId: string;

    @Field()
    userId: string;

    @Field()
    bankInfoId: string;

    @Field({ nullable: true })
    reference?: string;

    @Field()
    rate: number;

    @Field()
    fee: number;

    @Field()
    baseAmount: number;

    @Field()
    actualAmount: number;

    @Field()
    sendCurrency: string;

    @Field()
    destinationCurrency: string;

    @Field()
    convertedAmount: number;

    @Field()
    conversionReference: number;

    @Field()
    accountNumber: string;

    @Field({ nullable: true })
    quidaxId?: string;

    @Field(returns => TransactionStatus)
    status: TransactionStatus;

    @Field(returns => TransactionType)
    transactionType: TransactionType;

    @Field(returns => ReceiveType)
    receiveType: ReceiveType;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    @Field({ nullable: true })
    deletedAt?: Date;

    @Field({ nullable: true })
    recipient?: Recipient;

    @Field({ nullable: true })
    institution?: Institution;

    @Field({ nullable: true })
    bankInfo?: BankInfo;

    @Field({ nullable: true })
    user?: User;
}

// tslint:disable-next-line:max-classes-per-file
@ObjectType()
export class TransactionAnalytics {
    @Field()
    weekCount: number;

    @Field()
    monthCount: number;

    @Field()
    dayCount: number;
}

// tslint:disable-next-line:max-classes-per-file
@ObjectType()
export class TransactionList {
    @Field(returns => [Transaction])
    transactions: Array<Transaction>;

    @Field()
    total: number;
}

// tslint:disable-next-line:max-classes-per-file
@ObjectType()
export class TransactionUserAnalytics {
    @Field()
    totalTransactionsAmount: number;

    @Field()
    baseCurrencyCode: string;
}
