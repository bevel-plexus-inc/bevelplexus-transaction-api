import { Injectable } from "@graphql-modules/di";
import Country from "@models/country";
import { CountryList } from "@modules/country/types";
import { ErrorResponse } from "@shared/types";
import CountryArg from "./input";

@Injectable()
export default class CountryProvider {
    async createCountry(countryArg: CountryArg): Promise<Country> {
        const country = await Country.findOne({ where: { countryCode: countryArg.countryCode } });
        if (country) {
            throw new Error(`Country with country code: ${countryArg.countryCode} already exist`);
        }

        return Country.create(countryArg);
    }

    async getCountry(countryId: string): Promise<Country | null> {
        return Country.findByPk(countryId, { paranoid: false });
    }

    async getAllCountry(): Promise<Array<Country>> {
        return Country.findAll({ order: [["createdAt", "DESC"]] });
    }

    async getAllCountryV2(limit?: number, offset?: number): Promise<CountryList> {
        const countries = await Country.findAll({
            limit,
            offset,
            paranoid: false,
            order:    [["createdAt", "DESC"]],
        });
        const total = await Country.count();

        return {
            total,
            countries,
        };
    }

    async getCountryByCountryCode(countryCode: string): Promise<Country | null> {
        return Country.findOne({
            where:    { countryCode },
            paranoid: false,
        });
    }

    async getCountryByCurrencyCode(currencyCode: string): Promise<Country | null> {
        return Country.findOne({
            where:    { currencyCode },
            paranoid: false,
        });
    }

    async updateCountry(countryId: string, countryArg: CountryArg): Promise<Country | ErrorResponse> {
        const country = await this.getCountry(countryId);
        if (!country) {
            return {
                message:    "Record not found",
                identifier: countryId,
                error:      "Country not found",
            };
        }

        country.name = countryArg.name;
        country.countryCode = countryArg.countryCode;
        country.currencyCode = countryArg.currencyCode;
        await country.save();

        return country;
    }

    async deactivateCountry(countryId: string): Promise<Country | ErrorResponse> {
        const country = await this.getCountry(countryId);
        if (!country) {
            return {
                message:    "Record not found",
                identifier: countryId,
                error:      "Country not found",
            };
        }

        await country.destroy();

        return country;
    }

    async activateCountry(countryId: string): Promise<Country | ErrorResponse> {
        const country = await this.getCountry(countryId);
        if (!country) {
            return {
                message:    "Record not found",
                identifier: countryId,
                error:      "Country not found",
            };
        }

        await country.restore();

        return country;
    }
}
