import { Field, ObjectType } from "type-graphql";

@ObjectType()
export default class BankInfo {
    @Field()
    id: string;

    @Field({ nullable: true })
    recipientId?: string;

    @Field({ nullable: true })
    institutionId?: string;

    @Field()
    bank: string;

    @Field()
    bankCode: string;

    @Field()
    accountNumber: string;
}
