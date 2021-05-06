// eslint-disable-next-line max-classes-per-file
import { Field, ObjectType } from "type-graphql";
import Country from "../country/types";
import InstitutionBankInfo from "../institutionBankInfo/types";

@ObjectType()
export default class Institution {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field()
    city: string;

    @Field()
    countryId: string;

    @Field(returns => Country)
    country: Country;

    @Field(returns => InstitutionBankInfo, { nullable: true })
    institutionBankInfo?: InstitutionBankInfo;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    @Field({ nullable: true })
    deletedAt?: Date;
}

// tslint:disable-next-line:max-classes-per-file
@ObjectType()
export class InstitutionList {
    @Field(returns => [Institution])
    institutions: Array<Institution>;

    @Field()
    total: number;
}
