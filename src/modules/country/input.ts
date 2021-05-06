import { Field, InputType } from "type-graphql";

@InputType()
export default class CountryArg {
    @Field()
    name: string;

    @Field()
    countryCode: string;

    @Field()
    currencyCode: string;
}
