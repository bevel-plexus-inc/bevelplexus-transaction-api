import Config from "@models/config";
import ConfigModule from "@modules/config";
import { execute } from "graphql";
import gql from "graphql-tag";
// tslint:disable-next-line:no-import-side-effect
import "reflect-metadata";
import TransferFee from "../models/transferFee";
import { mockConfig, mockTransferDelayed, mockTransferSameDay } from "./mockData";

describe("Testing ConfigModule Errors and Empty State", () => {
    it("Should return error when supplied input is wrong", async () => {
        const { schema } = ConfigModule;

        const result = await execute({
            schema,
            contextValue: { user: true },
            document:     gql`
                mutation createConfig($defaultAccountNumber: String!, $defaultAccountName: String!) {
                    createConfig(defaultAccountNumber: $defaultAccountNumber, defaultAccountName: $defaultAccountName) {
                        defaultAccountNumber
                        defaultAccountName
                    }
                }
            `,
            variableValues: { defaultAccountNumber: mockConfig.defaultAccountNumber },
        });

        expect(result.errors).toBeTruthy();
    });

    it("Should create config and return required data", async () => {
        const { schema } = ConfigModule;

        const result = await execute({
            schema,
            contextValue: { user: true },
            document:     gql`
                mutation createConfig($defaultAccountNumber: String!, $defaultAccountName: String!) {
                    createConfig(defaultAccountNumber: $defaultAccountNumber, defaultAccountName: $defaultAccountName) {
                        defaultAccountNumber
                        defaultAccountName
                    }
                }
            `,
            variableValues: {
                defaultAccountNumber: mockConfig.defaultAccountNumber,
                defaultAccountName:   mockConfig.defaultAccountName,
            },
        });

        expect(result.errors).toBeFalsy();
        expect(result.data!.createConfig).toBeTruthy();
        expect(result.data!.createConfig.defaultAccountNumber).toBe(mockConfig.defaultAccountNumber);
        expect(result.data!.createConfig.defaultAccountName).toBe(mockConfig.defaultAccountName);
    });
});

describe("Testing ConfigModule Filled State", () => {
    let config: Config;
    beforeAll(async () => {
        config = await Config.create(mockConfig);
    });

    afterAll(async () => {
        await config.destroy({ force: true });
    });

    it("Should return matched config when fetched by config id", async () => {
        const { schema } = ConfigModule;

        const result = await execute({
            schema,
            contextValue: { user: true },
            document:     gql`
                query getConfig($configId: String!) {
                    getConfig(configId: $configId) {
                        defaultAccountName
                        defaultAccountNumber
                    }
                }
            `,
            variableValues: { configId: config.getDataValue("id") },
        });

        expect(result.errors).toBeFalsy();
        expect(result.data!.getConfig).toBeTruthy();
        expect(result.data!.getConfig.defaultAccountName).toBe(mockConfig.defaultAccountName);
        expect(result.data!.getConfig.defaultAccountNumber).toBe(mockConfig.defaultAccountNumber);
    });

    it("Should return matched config when fetched by user Id", async () => {
        const { schema } = ConfigModule;

        const result = await execute({
            schema,
            contextValue: { user: true },
            document:     gql`
                query getAllConfig {
                    getAllConfig {
                        defaultAccountName
                        defaultAccountNumber
                    }
                }
            `,
            variableValues: { userId: config.getDataValue("userId") },
        });

        expect(result.errors).toBeFalsy();
        expect(result.data!.getAllConfig).toBeTruthy();
        expect(result.data!.getAllConfig.length).toBeGreaterThanOrEqual(1);
    });
});

describe("Testing TransferRate Errors and Empty State", () => {
    afterAll(async () => {
        await TransferFee.truncate();
    });

    it("Should return error when supplied input is wrong", async () => {
        const { schema } = ConfigModule;

        const result = await execute({
            schema,
            contextValue: { user: true },
            document:     gql`
                mutation createTransferFee($createTransferFeeArg: TransferFeeArgs!) {
                    createTransferFee(createTransferFeeArg: $createTransferFeeArg) {
                        sendCurrency
                        destinationCurrency
                        fee
                        product
                    }
                }
            `,
            variableValues: {
                createTransferFeeArg: {
                    ...mockTransferDelayed,
                    fee: undefined,
                },
            },
        });

        expect(result.errors).toBeTruthy();
    });

    it("Should create transfer fee and return required data", async () => {
        const { schema } = ConfigModule;

        const result = await execute({
            schema,
            contextValue: { user: true },
            document:     gql`
                mutation createTransferFee($createTransferFeeArg: TransferFeeArgs!) {
                    createTransferFee(createTransferFeeArg: $createTransferFeeArg) {
                        sendCurrency
                        destinationCurrency
                        fee
                        product
                    }
                }
            `,
            variableValues: { createTransferFeeArg: mockTransferSameDay },
        });

        expect(result.errors).toBeFalsy();
        expect(result.data!.createTransferFee).toBeTruthy();
        expect(result.data!.createTransferFee.sendCurrency).toBe(mockTransferSameDay.sendCurrency);
        expect(result.data!.createTransferFee.destinationCurrency).toBe(mockTransferSameDay.destinationCurrency);
        expect(result.data!.createTransferFee.fee).toBe(mockTransferSameDay.fee);
        expect(result.data!.createTransferFee.product).toBe(mockTransferSameDay.product);
    });
});

describe("Testing TransferRate Filled State", () => {
    let transferFee: TransferFee;
    beforeAll(async () => {
        transferFee = await TransferFee.create(mockTransferDelayed);
    });

    afterAll(async () => {
        await transferFee.destroy({ force: true });
    });

    it("Should return matched transferFee when fetched by transferFee id", async () => {
        const { schema } = ConfigModule;

        const result = await execute({
            schema,
            contextValue: { user: true },
            document:     gql`
                query getTransferFee($transferFeeId: String!) {
                    getTransferFee(transferFeeId: $transferFeeId) {
                        sendCurrency
                        destinationCurrency
                        fee
                        product
                    }
                }
            `,
            variableValues: { transferFeeId: transferFee.getDataValue("id") },
        });

        expect(result.errors).toBeFalsy();
        expect(result.data!.getTransferFee).toBeTruthy();
        expect(result.data!.getTransferFee.sendCurrency).toBe(transferFee.getDataValue("sendCurrency"));
        expect(result.data!.getTransferFee.destinationCurrency).toBe(transferFee.getDataValue("destinationCurrency"));
        expect(result.data!.getTransferFee.fee).toBe(transferFee.getDataValue("fee"));
        expect(result.data!.getTransferFee.product).toBe(transferFee.getDataValue("product"));
    });

    it("Should return matched transferFee when update by transferFee id", async () => {
        const { schema } = ConfigModule;

        const result = await execute({
            schema,
            contextValue: { user: true },
            document:     gql`
                mutation updateTransferFee($transferFeeId: String!, $updateTransferFeeArg: TransferFeeArgs!) {
                    updateTransferFee(transferFeeId: $transferFeeId, updateTransferFeeArg: $updateTransferFeeArg) {
                        sendCurrency
                        destinationCurrency
                        fee
                        product
                    }
                }
            `,
            variableValues: {
                transferFeeId:        transferFee.getDataValue("id"),
                updateTransferFeeArg: mockTransferSameDay,
            },
        });

        expect(result.errors).toBeFalsy();
        expect(result.data!.updateTransferFee).toBeTruthy();
        expect(result.data!.updateTransferFee.sendCurrency).toBe(mockTransferSameDay.sendCurrency);
        expect(result.data!.updateTransferFee.destinationCurrency).toBe(mockTransferSameDay.destinationCurrency);
        expect(result.data!.updateTransferFee.fee).toBe(mockTransferSameDay.fee);
        expect(result.data!.updateTransferFee.product).toBe(mockTransferSameDay.product);
    });
});
