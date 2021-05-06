// eslint-disable-next-line max-classes-per-file
import { Field, InputType } from "type-graphql";

@InputType()
export class InstitutionBankInfoArgs {
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

// tslint:disable-next-line:max-classes-per-file
@InputType()
export class InstitutionBankInfoUpdateArgs {
    @Field()
    bank: string;

    @Field()
    bankCode: string;

    @Field()
    accountNumber: string;

    @Field({ nullable: true })
    transitOrSortCode?: string;
}
