import { isInstanceOfError } from "@lib/instanceChecker";
import Institution from "@models/institution";
import InstitutionBankInfo from "@models/institutionBankInfo";
import FxRateResponse from "@modules/fx/types";
import InstitutionProvider from "@modules/institution/provider";
import BankInfo from "@shared/bankInfo";
import errorCodes from "@shared/errorCode";
import Recipient from "@shared/recipient";
import { ErrorResponse, GenericRole, TransactionType } from "@shared/types";
import User from "@shared/user";
import { UserInputError } from "apollo-server-express";
import {
    Arg, Authorized, Ctx, Mutation, Query, Resolver,
} from "type-graphql";
import ConfigProvider from "../config/provider";
import FxProvider from "../fx/provider";
import LevelConfigProvider from "../levelConfig/provider";
import { TransactionArgs, TransactionUpdateArgs } from "./input";
import TransactionProvider from "./provider";
import {
    Transaction, TransactionAnalytics, TransactionList, TransactionUserAnalytics,
} from "./types";

@Resolver(of => Transaction)
export default class TransactionResolver {
    // eslint-disable-next-line no-empty-function
    constructor(
        private readonly transactionProvider: TransactionProvider,
        private readonly fxProvider: FxProvider,
        private readonly levelConfigProvider: LevelConfigProvider,
        private readonly configProvider: ConfigProvider,
        private readonly institutionProvider: InstitutionProvider,
    ) {}

    @Authorized()
    @Query(returns => Transaction, { nullable: true })
    async getTransaction(@Arg("transactionId") transactionId: string)
        : Promise<Transaction | null> {
        const response = await this.transactionProvider.getTransaction(transactionId);
        if (isInstanceOfError(response)) {
            throw new Error((response as ErrorResponse).error);
        }

        return response as Transaction;
    }

    @Authorized(GenericRole.Admin)
    @Query(returns => TransactionList)
    async getAllTransaction(
        @Arg("limit", { nullable: true }) limit?: number,
        @Arg("offset", { nullable: true }) offset?: number,
    ): Promise<TransactionList> {
        const response = await this.transactionProvider.getAllTransaction(limit, offset);
        if (isInstanceOfError(response)) {
            throw new Error((response as ErrorResponse).error);
        }

        return response as TransactionList;
    }

    @Authorized(GenericRole.Admin)
    @Query(returns => [Transaction])
    async getAllTransactionByType(
        @Arg("transactionType", returns => TransactionType) transactionType: TransactionType,
    ): Promise<Array<Transaction>> {
        return this.transactionProvider.getAllTransactionByType(transactionType);
    }

    @Authorized(GenericRole.Admin)
    @Query(returns => TransactionAnalytics)
    async getTransactionAnalytics(): Promise<TransactionAnalytics> {
        return this.transactionProvider.getTransactionAnalytics();
    }

    @Authorized(GenericRole.Admin)
    @Query(returns => TransactionAnalytics)
    async getTransactionAmountAnalytics(): Promise<TransactionAnalytics> {
        return this.transactionProvider.getTransactionAmountAnalytics();
    }

    @Authorized()
    @Query(returns => TransactionList)
    async getTransactionByUser(
        @Ctx() ctx: { user: { id: string } },
        @Arg("limit", { nullable: true }) limit?: number,
        @Arg("offset", { nullable: true }) offset?: number,
    ): Promise<TransactionList> {
        const response = await this.transactionProvider.getTransactionByUser(ctx.user.id, limit, offset);
        if (isInstanceOfError(response)) {
            throw new Error((response as ErrorResponse).error);
        }

        return response as TransactionList;
    }

    @Authorized()
    @Query(returns => TransactionUserAnalytics)
    async getTransactionAnalyticsByUser(
        @Ctx() ctx: { user: { id: string, countryId: string } },
    ): Promise<TransactionUserAnalytics> {
        const response = await this.transactionProvider.getTransactionAnalyticsByUser(ctx.user.id, ctx.user.countryId);
        if (isInstanceOfError(response)) {
            throw new Error((response as ErrorResponse).error);
        }

        return response as TransactionUserAnalytics;
    }

    // @Authorized()
    // @Query(returns => TransactionList)
    // async getTransactionByUserIds(
    //     @Arg("userIds", returns => [String!]!) userIds: Array<string>,
    // ): Promise<TransactionList> {
    //     const response = await this.transactionProvider.getTransactionByUserIds(userIds);
    //     if (isInstanceOfError(response)) {
    //         throw new Error((response as ErrorResponse).error);
    //     }
    //
    //     return response as TransactionList;
    // }

    @Authorized()
    @Query(returns => [Transaction])
    async getTransactionByRecipientIds(
        @Arg("recipientIds", returns => [String!]!) recipientIds: Array<string>,
    ): Promise<Array<Transaction>> {
        return this.transactionProvider.getTransactionByRecipientIds(recipientIds);
    }

    // tslint:disable-next-line:cyclomatic-complexity
    @Authorized()
    @Mutation(returns => Transaction)
    async createTransaction(
        @Arg("args", returns => TransactionArgs) args: TransactionArgs,
        @Ctx() ctx: { user: { id: string } },
    ): Promise<Transaction> {
        const transferFee = await this.fxProvider.getRate(args.sendCurrency, "cad", args.receiveType);
        if (!transferFee) {
            throw new UserInputError("Transfer corridor not found", { errorCode: errorCodes.CorridorNotFound });
        }

        const sendingValue = args.baseAmount * transferFee.rate;

        this.transactionProvider.checkEnvParams();
        const user: User | ErrorResponse = await this.transactionProvider.getUser(ctx.user.id);
        if (isInstanceOfError(user)) {
            throw new UserInputError((user as ErrorResponse).error, { errorCode: errorCodes.UserNotFound });
        }
        let recipient: Recipient | Institution | ErrorResponse | null;
        let bankInfo: BankInfo | InstitutionBankInfo | ErrorResponse;

        if (args.transactionType === TransactionType.Individual) {
            const isUserVerified = this.isUserVerified(user as User);
            const userCount = await this.transactionProvider.getTransactionCountByUser((user as User).id);
            if (!isUserVerified && userCount >= 1) {
                throw new UserInputError(
                    "You can only send once without account verification",
                    { errorCode: errorCodes.UserNotVerifiedCanOnlySendOnce },
                );
            }
            const config = await this.configProvider.getConfig();
            if (!config) {
                throw new UserInputError(
                    "Internal Server Error: configuration setup",
                    { errorCode: errorCodes.ConfigNotSetup },
                );
            }

            if (sendingValue < config.getDataValue("minimumSendAmount")) {
                throw new UserInputError(
                    "Transfer does not meet minimum send limit",
                    { errorCode: errorCodes.LowerThanMinimumSendAmount },
                );
            }

            const userLevel = (user as User).userVerification?.level;
            if (!userLevel) {
                throw new UserInputError(
                    "User verification information missing",
                    { errorCode: errorCodes.UserMissingVerificationData },
                );
            }

            const levelConfig = await this.levelConfigProvider.getLevelConfigByLevel(userLevel);
            if (!levelConfig) {
                throw new UserInputError(
                    "Internal Server Error: level configuration",
                    { errorCode: errorCodes.LevelConfigNotSetup },
                );
            }

            const userTransactionAggregates = await this.transactionProvider.getTransactionAggregates(ctx.user.id);

            if (userTransactionAggregates.daily > levelConfig.dailyLimit) {
                throw new UserInputError(
                    "User daily limit reached",
                    { errorCode: errorCodes.UserDailyLimitReached },
                );
            }
            if (userTransactionAggregates.daily + sendingValue > levelConfig.dailyLimit) {
                throw new UserInputError(
                    "The amount is more than the daily limit",
                    { errorCode: errorCodes.SendAmountWithUserDailyLimitReached },
                );
            }
            if (userTransactionAggregates.month > levelConfig.monthlyLimit) {
                throw new UserInputError(
                    "User monthly limit reached",
                    { errorCode: errorCodes.UserMonthlyLimitReached },
                );
            }
            if (userTransactionAggregates.month + sendingValue > levelConfig.monthlyLimit) {
                throw new UserInputError(
                    "The amount is more than the monthly limit",
                    { errorCode: errorCodes.SendAmountWithUserMonthlyLimitReached },
                );
            }

            if (!args.recipientId) {
                throw new UserInputError(
                    "Recipient must be attached to this transaction",
                    { errorCode: errorCodes.WrongIncomingDataRecipientIdNotPresent },
                );
            }
            recipient = await this.transactionProvider.getRecipient(args.recipientId);
            if (isInstanceOfError(recipient)) {
                throw new UserInputError(
                    (recipient as ErrorResponse).error,
                    { errorCode: errorCodes.RecipientNotFound },
                );
            }

            if (!args.bankInfoId) {
                throw new UserInputError(
                    "Transaction data missing bank information",
                    { errorCode: errorCodes.WrongIncomingDataBankInfoIdNotPresent },
                );
            }
            bankInfo = await this.transactionProvider.getBankInfo(args.bankInfoId);
            if (isInstanceOfError(bankInfo)) {
                throw new UserInputError(
                    (bankInfo as ErrorResponse).error,
                    { errorCode: errorCodes.BankInfoNotFound },
                );
            }
        } else {
            if (!(user as User).studentAccountDetail) {
                throw new UserInputError(
                    "Account not setup as a student",
                    { errorCode: errorCodes.UserIsNotAStudent },
                );
            }
            recipient = await this.institutionProvider.getInstitution(
                (user as User).studentAccountDetail!.institutionId,
            );
            if (!recipient) {
                throw new UserInputError(
                    "Institution not found",
                    { errorCode: errorCodes.InstitutionNotFound },
                );
            }

            if (!recipient.institutionBankInfo) {
                throw new UserInputError(
                    "Institution does not have bank information attached",
                    { errorCode: errorCodes.InstitutionDoesNotHaveBankInfo },
                );
            }

            bankInfo = recipient.institutionBankInfo;
        }

        const fx = await this.fxProvider.getFxRate({
            sendCurrency:        args.sendCurrency,
            destinationCurrency: args.destinationCurrency,
            baseAmount:          args.baseAmount,
            receiveType:         args.receiveType,
        });
        if (isInstanceOfError(fx)) {
            throw new UserInputError(
                (fx as ErrorResponse).error,
                { errorCode: errorCodes.FXRateNotSetupForCorridor },
            );
        }

        const response = await this.transactionProvider.createTransaction(
            ctx.user.id,
            sendingValue,
            args,
            fx as FxRateResponse,
            user as User,
            recipient as (Recipient | Institution),
            bankInfo as (BankInfo | InstitutionBankInfo),
        );
        if (isInstanceOfError(response)) {
            throw new UserInputError(
                (response as ErrorResponse).error,
                { errorCode: errorCodes.CreateTransactionError },
            );
        }

        return response as Transaction;
    }

    isUserVerified(user: User): boolean {
        if (!user.userKyc) {
            return false;
        }

        const { isVerified } = user.userKyc;

        return isVerified;
    }

    @Authorized(GenericRole.Admin)
    @Mutation(returns => Transaction)
    async updateTransaction(@Arg("args", returns => TransactionUpdateArgs) args: TransactionUpdateArgs)
        : Promise<Transaction> {
        this.transactionProvider.checkEnvParams();
        const transaction: Transaction | null = await this.transactionProvider.getTransactionOnly(
            args.transactionId, true,
        );
        if (!transaction) {
            throw new Error("transaction not found");
        }

        const user: User | ErrorResponse = await this.transactionProvider.getUser(transaction.userId);
        if (isInstanceOfError(user)) {
            throw new Error((user as ErrorResponse).error);
        }

        let recipient: Recipient | Institution | ErrorResponse | null;
        let bankInfo: BankInfo | InstitutionBankInfo | ErrorResponse;

        if (transaction.transactionType === TransactionType.Individual) {
            recipient = await this.transactionProvider.getRecipient(
                transaction.recipientId,
            );
            if (isInstanceOfError(recipient)) {
                throw new Error((recipient as ErrorResponse).error);
            }

            bankInfo = await this.transactionProvider.getBankInfo(transaction.bankInfoId);
            if (isInstanceOfError(bankInfo)) {
                throw new Error((bankInfo as ErrorResponse).error);
            }
        } else {
            recipient = await this.institutionProvider.getInstitution(transaction.recipientId);
            if (!recipient) {
                throw new Error("Institution not found");
            }

            if (!recipient.institutionBankInfo) {
                throw new Error("Institution does not have bank information attached");
            }

            bankInfo = recipient.institutionBankInfo;
        }

        const response = await this.transactionProvider.updateTransaction(
            args, user as User, recipient as Recipient, bankInfo as BankInfo,
        );
        if (isInstanceOfError(response)) {
            throw new Error((response as ErrorResponse).error);
        }

        return response as Transaction;
    }
}
