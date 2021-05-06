import { isInstanceOfError } from "@lib/instanceChecker";
import { ErrorResponse, GenericRole } from "@shared/types";
import { UserInputError } from "apollo-server-express";
import {
    Arg, Authorized, Mutation, Query, Resolver,
} from "type-graphql";
import { InstitutionBankInfoArgs } from "./input";
import InstitutionBankInfoProvider from "./provider";
import InstitutionBankInfo from "./types";

@Resolver(of => InstitutionBankInfo)
export default class InstitutionBankInfoResolver {
    // eslint-disable-next-line no-empty-function
    constructor(private readonly institutionBankInfoProvider: InstitutionBankInfoProvider) {}

    @Authorized()
    @Query(returns => [InstitutionBankInfo])
    async institutionBankInfoByRecipient(@Arg("recipientId") recipientId: string): Promise<Array<InstitutionBankInfo>> {
        return this.institutionBankInfoProvider.getInstitutionBankInfoByRecipient(recipientId);
    }

    @Authorized()
    @Query(returns => InstitutionBankInfo, { nullable: true })
    async institutionBankInfo(@Arg("id") id: string): Promise<InstitutionBankInfo | null> {
        return this.institutionBankInfoProvider.getInstitutionBankInfo(id);
    }

    @Authorized(GenericRole.Admin)
    @Mutation(returns => InstitutionBankInfo)
    async addInstitutionBankInfo(
        @Arg("institutionBankInfoArgs", returns => InstitutionBankInfoArgs) institutionBankInfoArgs
            : InstitutionBankInfoArgs,
    ):
        Promise<InstitutionBankInfo> {
        const response = await this.institutionBankInfoProvider.createInstitutionBankInfo(institutionBankInfoArgs);
        if (isInstanceOfError(response)) {
            throw new UserInputError((response as ErrorResponse).error);
        }

        return response as InstitutionBankInfo;
    }

    @Authorized(GenericRole.Admin)
    @Mutation(returns => InstitutionBankInfo)
    async updateInstitutionBankInfo(
        @Arg("institutionBankInfoId") institutionBankInfoId: string,
        @Arg("institutionBankInfoArgs", returns => InstitutionBankInfoArgs) institutionBankInfoArgs
            : InstitutionBankInfoArgs,
    ): Promise<InstitutionBankInfo> {
        const response = await this.institutionBankInfoProvider.updateInstitutionBankInfo(
            institutionBankInfoId,
            institutionBankInfoArgs,
        );
        if (isInstanceOfError(response)) {
            throw new UserInputError((response as ErrorResponse).error);
        }

        return response as InstitutionBankInfo;
    }

    @Authorized(GenericRole.Admin)
    @Mutation(returns => InstitutionBankInfo)
    async deactivateInstitutionBankInfo(@Arg("institutionBankInfoId") institutionBankInfoId: string)
        : Promise<InstitutionBankInfo> {
        const response = await this.institutionBankInfoProvider.deactivateInstitutionBankInfo(institutionBankInfoId);
        if (isInstanceOfError(response)) {
            throw new UserInputError((response as ErrorResponse).error);
        }

        return response as InstitutionBankInfo;
    }

    @Authorized(GenericRole.Admin)
    @Mutation(returns => InstitutionBankInfo)
    async activateInstitutionBankInfo(@Arg("institutionBankInfoId") institutionBankInfoId: string)
        : Promise<InstitutionBankInfo> {
        const response = await this.institutionBankInfoProvider.activateInstitutionBankInfo(institutionBankInfoId);
        if (isInstanceOfError(response)) {
            throw new UserInputError((response as ErrorResponse).error);
        }

        return response as InstitutionBankInfo;
    }
}
