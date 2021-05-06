import { Injectable } from "@graphql-modules/di";
import Config from "@models/config";
import TransferFee from "@models/transferFee";
import { ErrorResponse } from "@shared/types";
import { Op } from "sequelize";
import { v4 as uuid } from "uuid";
import TransferFeeArgs from "./input";

@Injectable()
export default class ConfigProvider {
    async createConfig(
        defaultAccountNumber: string, defaultAccountName: string, minimumSendAmount: number,
    ): Promise<Config> {
        return Config.create({
            defaultAccountNumber,
            defaultAccountName,
            minimumSendAmount,
        });
    }

    async getConfig(): Promise<Config | null> {
        return Config.findOne({ where: { id: { [Op.not]: null } } });
    }

    async getAllConfig(): Promise<Array<Config>> {
        return Config.findAll({ order: [["createdAt", "DESC"]] });
    }

    async updateConfig(defaultAccountNumber: string, defaultAccountName: string, minimumSendAmount: number)
        : Promise<Config | ErrorResponse> {
        const config = await this.getConfig();
        if (!config) {
            return {
                error:      "Config not found",
                identifier: "",
                message:    "Config not found",
            };
        }

        config.defaultAccountName = defaultAccountName;
        config.defaultAccountNumber = defaultAccountNumber;
        config.minimumSendAmount = minimumSendAmount;
        await config.save();

        return config;
    }

    async getTransferFee(transferFeeId: string): Promise<TransferFee | null> {
        return TransferFee.findByPk(transferFeeId);
    }

    async getAllTransferFee(): Promise<Array<TransferFee>> {
        return TransferFee.findAll({ order: [["createdAt", "DESC"]] });
    }

    async createTransferFee(createTransferFeeArg: TransferFeeArgs): Promise<TransferFee | ErrorResponse> {
        const existingRate = await TransferFee.findOne({
            where: {
                sendCurrency:        createTransferFeeArg.sendCurrency.toUpperCase(),
                destinationCurrency: createTransferFeeArg.destinationCurrency.toUpperCase(),
                product:             createTransferFeeArg.product,
            },
        });
        if (existingRate) {
            return {
                // eslint-disable-next-line max-len
                error:      `A transferFee with this corridor: ${createTransferFeeArg.sendCurrency.toUpperCase()}-${createTransferFeeArg.destinationCurrency.toUpperCase()} already exist, please update instead`,
                // eslint-disable-next-line max-len
                identifier: `${createTransferFeeArg.sendCurrency.toUpperCase()}-${createTransferFeeArg.destinationCurrency.toUpperCase()}`,
                // eslint-disable-next-line max-len
                message:    `A transferFee with this corridor: ${createTransferFeeArg.sendCurrency.toUpperCase()}-${createTransferFeeArg.destinationCurrency.toUpperCase()} already exist, please update instead`,
            };
        }

        return TransferFee.create(createTransferFeeArg);
    }

    async createMultipleTransferFees(multipleTransferFeeArg: Array<TransferFeeArgs>): Promise<Array<TransferFee>> {
        const data = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const transferFee of multipleTransferFeeArg) {
            data.push({
                ...transferFee,
                id:        uuid(),
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        return TransferFee.bulkCreate(data);
    }

    async updateTransferFees(transferFeeId: string, updateTransferFeeArg: TransferFeeArgs)
        : Promise<TransferFee | ErrorResponse> {
        const transferFee = await this.getTransferFee(transferFeeId);
        if (!transferFee) {
            return {
                error:      "Transaction fee not found",
                identifier: transferFeeId,
                message:    "Transaction fee not found",
            };
        }

        transferFee.destinationCurrency = updateTransferFeeArg.destinationCurrency;
        transferFee.sendCurrency = updateTransferFeeArg.sendCurrency;
        transferFee.fee = updateTransferFeeArg.fee;
        transferFee.rate = updateTransferFeeArg.rate;
        transferFee.product = updateTransferFeeArg.product;
        await transferFee.save();

        return transferFee;
    }

    async deleteTransferFee(transferFeeId: string)
        : Promise<TransferFee | ErrorResponse> {
        const transferFee = await this.getTransferFee(transferFeeId);
        if (!transferFee) {
            return {
                error:      "Transaction fee not found",
                identifier: transferFeeId,
                message:    "Transaction fee not found",
            };
        }

        await transferFee.destroy();

        return transferFee;
    }
}
