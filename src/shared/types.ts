// eslint-disable-next-line max-classes-per-file
import {
    Field, InputType, ObjectType, registerEnumType,
} from "type-graphql";

@ObjectType()
export class ErrorResponse {
    @Field()
    message: string;

    @Field()
    identifier: string;

    @Field()
    error: string;
}

export enum TransactionType {
    Individual = "Individual",
    Tuition = "Tuition",
}

registerEnumType(TransactionType, {
    name:        "TransactionType",
    description: "types of transaction, either individual or tuition",
});

export enum PaymentType {
    Bank = "Bank",
    ETransfer = "ETransfer",
}

registerEnumType(PaymentType, {
    name:        "PaymentType",
    description: "types of payment channel",
});

export enum ReceiveType {
    SameDay = "SameDay",
    Delayed = "Delayed",
}

registerEnumType(ReceiveType, {
    name:        "ReceiveType",
    description: "types of receiving method, either same day or delayed",
});

export enum TransactionStatus {
    InProgress = "In Progress",
    FundInTransit = "Fund in transit",
    FundTransferFailed = "Fund transfer failed",
    FundTransferCancelled = "Fund transfer cancelled",
    FundTransferCanceled = "Fund transfer cancelled",
    AwaitingUserPayment = "Awaiting user payment",
    UserPaymentReceived = "User payment received",
    TransferCompleted = "Transfer has been completed",
}

registerEnumType(TransactionStatus, {
    name:        "TransactionStatus",
    description: "current status of transaction",
});

export enum EmailType {
    TransactionConfirmation = "TransactionConfirmation",
    EmailVerification = "EmailVerification",
}

registerEnumType(EmailType, {
    name:        "EmailType",
    description: "types of email",
});

// tslint:disable-next-line:max-classes-per-file
@InputType()
export default class EmailRecipient {
    @Field()
    name: string;

    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    email: string;
}

// tslint:disable-next-line:max-classes-per-file
@InputType()
export class EmailParameter {
    @Field({ nullable: true })
    otp?: string;

    @Field(returns => [EmailRecipient])
    receivers: Array<EmailRecipient>;
}

// tslint:disable-next-line:max-classes-per-file
@InputType()
export class EmailArgs {
    @Field(returns => EmailParameter)
    parameters: EmailParameter;

    @Field(returns => EmailType)
    emailType: EmailType;
}

export enum GenericRole {
    Admin = "ADMIN",
}
