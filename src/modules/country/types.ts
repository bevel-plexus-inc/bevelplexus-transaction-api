// eslint-disable-next-line max-classes-per-file
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export default class Country {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field()
    countryCode: string;

    @Field()
    currencyCode: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    @Field({ nullable: true })
    deletedAt?: Date;
}

// tslint:disable-next-line:max-classes-per-file
@ObjectType()
export class CountryList {
    @Field(returns => [Country])
    countries: Array<Country>;

    @Field()
    total: number;
}
