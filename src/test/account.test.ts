import Account from "@models/account";
import AccountModule from "@modules/account";
import { execute } from "graphql";
import gql from "graphql-tag";
// tslint:disable-next-line:no-import-side-effect
import "reflect-metadata";
import { mockAccount, mockAccountResponse } from "./mockData";

describe("Testing AccountModule Errors and Empty State", () => {
    it("Should return error when supplied input is wrong", async () => {
        const { schema } = AccountModule;

        const result = await execute({
            schema,
            contextValue: { user: true },
            document:     gql`
                mutation createAccount($accountArgs: AccountArgs!) {
                    createAccount(accountArgs: $accountArgs) {
                        firstName
                        lastName
                        accountNumber
                    }
                }
            `,
            variableValues: { accountArgs: { ...mockAccount, lastName: undefined } },
        });

        expect(result.errors).toBeTruthy();
    });

    it("Should create account and return required data", async () => {
        const { schema } = AccountModule;

        const result = await execute({
            schema,
            contextValue: { user: true },
            document:     gql`
                mutation createAccount($accountArgs: AccountArgs!) {
                    createAccount(accountArgs: $accountArgs) {
                        firstName
                        lastName
                        email
                        accountNumber
                        userId
                    }
                }
            `,
            variableValues: { accountArgs: mockAccount },
        });

        expect(result.errors).toBeFalsy();
        expect(result.data!.createAccount).toBeTruthy();
        expect(result.data!.createAccount.firstName).toBe(mockAccount.firstName);
        expect(result.data!.createAccount.lastName).toBe(mockAccount.lastName);
        expect(result.data!.createAccount.email).toBe(mockAccount.email);
        expect(result.data!.createAccount.userId).toBe(mockAccount.userId);
        expect(result.data!.createAccount.accountNumber).toBeTruthy();
    });
});

describe("Testing AccountModule Filled State", () => {
    let account: Account;
    beforeAll(async () => {
        account = await Account.create({ ...mockAccountResponse });
    });

    afterAll(async () => {
        await account.destroy({ force: true });
    });

    it("Should return matched account when fetched by account id", async () => {
        const { schema } = AccountModule;

        const result = await execute({
            schema,
            contextValue: { user: true },
            document:     gql`
                query getAccountDetails($accountId: String!) {
                    getAccountDetails(accountId: $accountId) {
                        firstName
                        lastName
                        email
                        accountNumber
                        userId
                    }
                }
            `,
            variableValues: { accountId: account.getDataValue("id") },
        });

        expect(result.errors).toBeFalsy();
        expect(result.data!.getAccountDetails).toBeTruthy();
        expect(result.data!.getAccountDetails.firstName).toBe(mockAccount.firstName);
        expect(result.data!.getAccountDetails.lastName).toBe(mockAccount.lastName);
        expect(result.data!.getAccountDetails.email).toBe(mockAccount.email);
        expect(result.data!.getAccountDetails.userId).toBe(mockAccount.userId);
        expect(result.data!.getAccountDetails.accountNumber).toBeTruthy();
    });

    it("Should return matched account when fetched by user Id", async () => {
        const { schema } = AccountModule;

        const result = await execute({
            schema,
            contextValue: { user: true },
            document:     gql`
                query getAccountDetailsByUser($userId: String!) {
                    getAccountDetailsByUser(userId: $userId) {
                        firstName
                        lastName
                        email
                        accountNumber
                        userId
                    }
                }
            `,
            variableValues: { userId: account.getDataValue("userId") },
        });

        expect(result.errors).toBeFalsy();
        expect(result.data!.getAccountDetailsByUser).toBeTruthy();
        expect(result.data!.getAccountDetailsByUser.firstName).toBe(mockAccount.firstName);
        expect(result.data!.getAccountDetailsByUser.lastName).toBe(mockAccount.lastName);
        expect(result.data!.getAccountDetailsByUser.email).toBe(mockAccount.email);
        expect(result.data!.getAccountDetailsByUser.userId).toBe(mockAccount.userId);
        expect(result.data!.getAccountDetailsByUser.accountNumber).toBeTruthy();
    });
});
