import { isInstanceOfError } from "@lib/instanceChecker";
import { ErrorResponse, GenericRole } from "@shared/types";
import {
    Arg, Authorized, Mutation, Query, Resolver,
} from "type-graphql";
import CountryProvider from "../country/provider";
import InstitutionArg from "./input";
import InstitutionProvider from "./provider";
import Institution, { InstitutionList } from "./types";

@Resolver(of => Institution)
export default class InstitutionResolver {
    // eslint-disable-next-line no-empty-function
    constructor(
        private readonly institutionProvider: InstitutionProvider,
        private readonly countryProvider: CountryProvider,
    ) {}

    @Authorized()
    @Query(returns => Institution, { nullable: true })
    async getInstitution(@Arg("institutionId") institutionId: string): Promise<Institution | null> {
        return this.institutionProvider.getInstitution(institutionId);
    }

    @Authorized()
    @Query(returns => [Institution])
    async getInstitutionByCountry(@Arg("countryId") countryId: string): Promise<Array<Institution>> {
        return this.institutionProvider.getInstitutionByCountry(countryId);
    }

    @Authorized()
    @Query(returns => [Institution])
    async getAllInstitution(): Promise<Array<Institution>> {
        return this.institutionProvider.getAllInstitution();
    }

    @Authorized(GenericRole.Admin)
    @Query(returns => InstitutionList)
    async getAllInstitutionV2(
        @Arg("limit", { nullable: true }) limit?: number,
        @Arg("offset", { nullable: true }) offset?: number,
    ): Promise<InstitutionList> {
        return this.institutionProvider.getAllInstitutionV2(limit, offset);
    }

    @Authorized(GenericRole.Admin)
    @Mutation(returns => Institution)
    async createInstitution(
        @Arg("institutionArg", returns => InstitutionArg) institutionArg: InstitutionArg,
    ): Promise<Institution> {
        const country = await this.countryProvider.getCountry(institutionArg.countryId);
        if (!country) {
            throw new Error("Country does not exist");
        }

        return this.institutionProvider.createInstitution(institutionArg);
    }

    @Authorized(GenericRole.Admin)
    @Mutation(returns => Institution)
    async updateInstitution(
        @Arg("institutionArg", returns => InstitutionArg) institutionArg: InstitutionArg,
        @Arg("institutionId") institutionId: string,
    ): Promise<Institution> {
        return this.institutionProvider.updateInstitution(institutionArg, institutionId);
    }

    @Authorized(GenericRole.Admin)
    @Mutation(returns => Institution)
    async deactivateInstitution(@Arg("institutionId") institutionId: string): Promise<Institution> {
        const response = await this.institutionProvider.deactivateInstitution(institutionId);
        if (isInstanceOfError(response)) {
            throw new Error((response as ErrorResponse).error);
        }

        return response as Institution;
    }

    @Authorized(GenericRole.Admin)
    @Mutation(returns => Institution)
    async activateInstitution(@Arg("institutionId") institutionId: string): Promise<Institution> {
        const response = await this.institutionProvider.activateInstitution(institutionId);
        if (isInstanceOfError(response)) {
            throw new Error((response as ErrorResponse).error);
        }

        return response as Institution;
    }
}
