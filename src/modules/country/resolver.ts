import { isInstanceOfError } from "@lib/instanceChecker";
import { ErrorResponse, GenericRole } from "@shared/types";
import {
    Arg, Authorized, Mutation, Query, Resolver,
} from "type-graphql";
import CountryArg from "./input";
import CountryProvider from "./provider";
import Country, { CountryList } from "./types";

@Resolver(of => Country)
export default class CountryResolver {
    // eslint-disable-next-line no-empty-function
    constructor(
        private readonly countryProvider: CountryProvider,
    ) {}

    @Authorized()
    @Query(returns => Country, { nullable: true })
    async getCountry(@Arg("countryId") countryId: string)
        : Promise<Country | null> {
        return this.countryProvider.getCountry(countryId);
    }

    @Authorized()
    @Query(returns => Country, { nullable: true })
    async getCountryByCountryCode(@Arg("countryCode") countryCode: string)
        : Promise<Country | null> {
        return this.countryProvider.getCountryByCountryCode(countryCode);
    }

    @Authorized()
    @Query(returns => Country, { nullable: true })
    async getCountryByCurrencyCode(@Arg("currencyCode") currencyCode: string)
        : Promise<Country | null> {
        return this.countryProvider.getCountryByCurrencyCode(currencyCode);
    }

    @Authorized()
    @Query(returns => [Country])
    async getAllCountry(): Promise<Array<Country>> {
        return this.countryProvider.getAllCountry();
    }

    @Authorized(GenericRole.Admin)
    @Query(returns => CountryList)
    async getAllCountryV2(
        @Arg("limit", { nullable: true }) limit?: number,
        @Arg("offset", { nullable: true }) offset?: number,
    ): Promise<CountryList> {
        return this.countryProvider.getAllCountryV2(limit, offset);
    }

    @Authorized(GenericRole.Admin)
    @Mutation(returns => Country)
    async createCountry(
        @Arg("countryArg", returns => CountryArg) countryArg: CountryArg,
    ): Promise<Country> {
        return this.countryProvider.createCountry(countryArg);
    }

    @Authorized(GenericRole.Admin)
    @Mutation(returns => Country)
    async updateCountry(
        @Arg("countryId") countryId: string,
        @Arg("countryArg", returns => CountryArg) countryArg: CountryArg,
    ): Promise<Country> {
        const response = await this.countryProvider.updateCountry(countryId, countryArg);
        if (isInstanceOfError(response)) {
            throw new Error((response as ErrorResponse).error);
        }

        return response as Country;
    }

    @Authorized(GenericRole.Admin)
    @Mutation(returns => Country)
    async deactivateCountry(@Arg("countryId") countryId: string): Promise<Country> {
        const response = await this.countryProvider.deactivateCountry(countryId);
        if (isInstanceOfError(response)) {
            throw new Error((response as ErrorResponse).error);
        }

        return response as Country;
    }

    @Authorized(GenericRole.Admin)
    @Mutation(returns => Country)
    async activateCountry(@Arg("countryId") countryId: string): Promise<Country> {
        const response = await this.countryProvider.activateCountry(countryId);
        if (isInstanceOfError(response)) {
            throw new Error((response as ErrorResponse).error);
        }

        return response as Country;
    }
}
