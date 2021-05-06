import { Field, ObjectType } from "type-graphql";

@ObjectType()
export default class InstitutionBankInfo {
    @Field()
    id: string;

    @Field()
    institutionId: string;

    @Field()
    bank: string;

    @Field()
    bankCode: string;

    @Field()
    accountNumber: string;

    @Field({ nullable: true })
    transitOrSortCode?: string;
}
