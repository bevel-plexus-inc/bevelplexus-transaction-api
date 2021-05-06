import { Field, InputType } from "type-graphql";

@InputType()
export default class InstitutionArg {
    @Field()
    name: string;

    @Field()
    city: string;

    @Field()
    countryId: string;

    @Field()
    bank: string;

    @Field()
    bankCode: string;

    @Field()
    accountNumber: string;

    @Field({ nullable: true })
    transitOrSortCode?: string;
}
