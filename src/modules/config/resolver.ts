import { isInstanceOfError } from "@lib/instanceChecker";
import { ErrorResponse, GenericRole } from "@shared/types";
import {
    Arg, Authorized, Mutation, Query, Resolver,
} from "type-graphql";
import TransferFeeArgs from "./input";
import ConfigProvider from "./provider";
import { Config, TransferFee } from "./types";

@Resolver(of => Config)
export default class ConfigResolver {
    // eslint-disable-next-line no-empty-function
    constructor(private readonly configProvider: ConfigProvider) {}

    @Authorized(GenericRole.Admin)
    @Query(returns => Config, { nullable: true })
    async getConfig()
        : Promise<Config | null> {
        return this.configProvider.getConfig();
    }

    @Authorized(GenericRole.Admin)
    @Query(returns => [Config])
    async getAllConfig(): Promise<Array<Config>> {
        return this.configProvider.getAllConfig();
    }

    @Authorized(GenericRole.Admin)
    @Mutation(returns => Config)
    async createConfig(
        @Arg("defaultAccountNumber") defaultAccountNumber: string,
        @Arg("defaultAccountName") defaultAccountName: string,
        @Arg("minimumSendAmount") minimumSendAmount: number,
    ): Promise<Config> {
        return this.configProvider.createConfig(defaultAccountNumber, defaultAccountName, minimumSendAmount);
    }

    @Authorized(GenericRole.Admin)
    @Mutation(returns => Config)
    async updateConfig(
        @Arg("defaultAccountNumber") defaultAccountNumber: string,
        @Arg("defaultAccountName") defaultAccountName: string,
        @Arg("minimumSendAmount") minimumSendAmount: number,
    ): Promise<Config> {
        const response = await this.configProvider.updateConfig(
            defaultAccountNumber, defaultAccountName, minimumSendAmount,
        );
        if (isInstanceOfError(response)) {
            throw new Error((response as ErrorResponse).error);
        }

        return response as Config;
    }

    @Authorized(GenericRole.Admin)
    @Mutation(returns => TransferFee)
    async createTransferFee(
        @Arg("createTransferFeeArg", returns => TransferFeeArgs) createTransferFeeArg: TransferFeeArgs,
    ): Promise<TransferFee> {
        const response = await this.configProvider.createTransferFee(createTransferFeeArg);
        if (isInstanceOfError(response)) {
            throw new Error((response as ErrorResponse).error);
        }

        return response as TransferFee;
    }

    @Authorized(GenericRole.Admin)
    @Mutation(returns => TransferFee)
    async createMultipleTransferFee(
        @Arg("multipleTransferFeeArg", returns => [TransferFeeArgs]) multipleTransferFeeArg: Array<TransferFeeArgs>,
    ): Promise<Array<TransferFee>> {
        return this.configProvider.createMultipleTransferFees(multipleTransferFeeArg);
    }

    @Authorized(GenericRole.Admin)
    @Mutation(returns => TransferFee)
    async updateTransferFee(
        @Arg("transferFeeId") transferFeeId: string,
        @Arg("updateTransferFeeArg", returns => TransferFeeArgs) updateTransferFeeArg: TransferFeeArgs,
    ): Promise<TransferFee> {
        const response = await this.configProvider.updateTransferFees(transferFeeId, updateTransferFeeArg);
        if (isInstanceOfError(response)) {
            throw new Error((response as ErrorResponse).error);
        }

        return response as TransferFee;
    }

    @Authorized(GenericRole.Admin)
    @Query(returns => TransferFee, { nullable: true })
    async getTransferFee(@Arg("transferFeeId") transferFeeId: string): Promise<TransferFee | null> {
        return this.configProvider.getTransferFee(transferFeeId);
    }

    @Authorized(GenericRole.Admin)
    @Mutation(returns => TransferFee)
    async deleteTransferFee(@Arg("transferFeeId") transferFeeId: string): Promise<TransferFee> {
        const response = await this.configProvider.deleteTransferFee(transferFeeId);
        if (isInstanceOfError(response)) {
            throw new Error((response as ErrorResponse).error);
        }

        return response as TransferFee;
    }

    @Authorized(GenericRole.Admin)
    @Query(returns => [TransferFee])
    async getAllTransferFee(): Promise<Array<TransferFee>> {
        return this.configProvider.getAllTransferFee();
    }
}
