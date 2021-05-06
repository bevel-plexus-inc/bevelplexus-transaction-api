import { isInstanceOfError } from "@lib/instanceChecker";
import { ErrorResponse, GenericRole } from "@shared/types";
import {
    Arg, Authorized, Mutation, Query, Resolver,
} from "type-graphql";
import AccountArgs from "./input";
import AccountProvider from "./provider";
import Account from "./types";

@Resolver(of => Account)
export default class AccountResolver {
    // eslint-disable-next-line no-empty-function
    constructor(private readonly accountProvider: AccountProvider) {}

    @Authorized(GenericRole.Admin)
    @Query(returns => Account, { nullable: true })
    async getAccountDetails(@Arg("accountId") accountId: string): Promise<Account | null> {
        return this.accountProvider.getAccount(accountId);
    }

    @Authorized(GenericRole.Admin)
    @Query(returns => Account)
    async getAccountDetailsByUser(@Arg("userId") userId: string): Promise<Account> {
        return this.accountProvider.getAccountByUser(userId);
    }

    @Authorized(GenericRole.Admin)
    @Mutation(returns => Account)
    async createAccount(@Arg("accountArgs", returns => AccountArgs) accountArgs: AccountArgs)
        : Promise<Account | ErrorResponse> {
        const response = await this.accountProvider.createAccount(accountArgs);
        if (isInstanceOfError(response)) {
            throw new Error((response as ErrorResponse).error);
        }

        return response as Account;
    }
}
