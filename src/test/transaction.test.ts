import Transaction from "@models/transaction";
import TransactionModule from "@modules/transaction";
import { execute } from "graphql";
import gql from "graphql-tag";
// tslint:disable-next-line:no-import-side-effect
import "reflect-metadata";
import { mockTransactionData, mockTransactionDataResponse, mockTransactionRawData } from "./mockData";

jest.mock("../shared/userService");
jest.mock("../shared/messaging");

describe("Testing TransactionModule Mutations", () => {
    it("Should return error when supplied input is wrong", async () => {
        const { schema } = TransactionModule;

        const result = await execute({
            schema,
            contextValue: { user: true },
            document:     gql`
                mutation createTransaction($args: TransactionArgs!) {
                    createTransaction(args: $args) {
                        recipientId
                        userId
                        bankInfoId
                        rate
                        fee
                        baseAmount
                        actualAmount
                        sendCurrency
                        destinationCurrency
                        convertedAmount
                        status
                        transactionType
                        receiveType
                    }
                }
            `,
            variableValues: { transactionArgs: { ...mockTransactionData, userId: undefined } },
        });

        expect(result.errors).toBeTruthy();
    });

    it("Should create transaction and return required data", async () => {
        const { schema } = TransactionModule;

        const result = await execute({
            schema,
            contextValue: { user: true },
            document:     gql`
                mutation createTransaction($args: TransactionArgs!) {
                    createTransaction(args: $args) {
                        recipientId
                        userId
                        bankInfoId
                        rate
                        fee
                        baseAmount
                        actualAmount
                        sendCurrency
                        destinationCurrency
                        convertedAmount
                        status
                        transactionType
                        receiveType
                    }
                }
            `,
            variableValues: { args: mockTransactionData },
        });

        expect(result.errors).toBeFalsy();
        expect(result.data!.createTransaction).toBeTruthy();
        expect(result.data!.createTransaction.recipientId).toBe(mockTransactionDataResponse.recipientId);
        expect(result.data!.createTransaction.bankInfoId).toBe(mockTransactionDataResponse.bankInfoId);
        expect(result.data!.createTransaction.destinationCurrency)
            .toBe(mockTransactionDataResponse.destinationCurrency);
        expect(result.data!.createTransaction.sendCurrency).toBe(mockTransactionDataResponse.sendCurrency);
        expect(result.data!.createTransaction.baseAmount).toBe(mockTransactionDataResponse.baseAmount);
        expect(result.data!.createTransaction.userId).toBe(mockTransactionDataResponse.userId);
    });
});

describe("Testing TransactionModule Filled State", () => {
    let transaction: Transaction;
    beforeAll(async () => {
        transaction = await Transaction.create({ ...mockTransactionRawData });
    });

    afterAll(async () => {
        await transaction.destroy({ force: true });
    });

    it("Should return matched transaction when fetched by transaction id", async () => {
        const { schema } = TransactionModule;

        const result = await execute({
            schema,
            contextValue: { user: true },
            document:     gql`
                query getTransaction($transactionId: String!) {
                    getTransaction(transactionId: $transactionId) {
                        recipientId
                        userId
                        bankInfoId
                        rate
                        fee
                        baseAmount
                        actualAmount
                        sendCurrency
                        destinationCurrency
                        convertedAmount
                        status
                        transactionType
                        receiveType
                    }
                }
            `,
            variableValues: { transactionId: transaction.getDataValue("id") },
        });

        expect(result.errors).toBeFalsy();
        expect(result.data!.getTransaction).toBeTruthy();
        expect(result.data!.getTransaction.recipientId).toBe(transaction.getDataValue("recipientId"));
        expect(result.data!.getTransaction.bankInfoId).toBe(transaction.getDataValue("bankInfoId"));
        expect(result.data!.getTransaction.destinationCurrency)
            .toBe(transaction.getDataValue("destinationCurrency"));
        expect(result.data!.getTransaction.sendCurrency).toBe(transaction.getDataValue("sendCurrency"));
        expect(result.data!.getTransaction.baseAmount).toBe(transaction.getDataValue("baseAmount"));
        expect(result.data!.getTransaction.userId).toBe(transaction.getDataValue("userId"));
    });

    it("Should return matched transaction when updated", async () => {
        const { schema } = TransactionModule;

        const result = await execute({
            schema,
            contextValue: { user: true },
            document:     gql`
                query updateTransaction($args: TransactionUpdateArgs!) {
                    updateTransaction(args: $args) {
                        status
                        reference
                    }
                }
            `,
            variableValues: {
                args: {
                    status:        "Done",
                    reference:     "reference",
                    transactionId: transaction.getDataValue("id"),
                },
            },
        });

        expect(result.errors).toBeFalsy();
        // expect(result.data!.updateTransaction).toBeTruthy();
        // expect(result.data!.updateTransaction.status).toBe("Done");
        // expect(result.data!.updateTransaction.reference).toBe("reference");
    });

    it("Should return the right data when all data is fetched", async () => {
        const { schema } = TransactionModule;

        const result = await execute({
            schema,
            contextValue: { user: true },
            document:     gql`
                query {
                    getAllTransaction {
                        firstName
                        lastName
                        email
                        transactionNumber
                        userId
                    }
                }
            `,
        });

        expect(result.errors).toBeFalsy();
        expect(result.data!.getAllTransaction).toBeTruthy();
        expect(result.data!.getAllTransaction.length).toBeGreaterThanOrEqual(1);
    });
});
