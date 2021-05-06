import { Injectable } from "@graphql-modules/di";
import { isInstanceOfError } from "@lib/instanceChecker";
import sentryHttpLogger from "@lib/sentryHttpLogger";
import Country from "@models/country";
import Institution from "@models/institution";
import InstitutionBankInfo from "@models/institutionBankInfo";
import Transaction from "@models/transaction";
import TransferFee from "@models/transferFee";
import BankInfo from "@shared/bankInfo";
import { notificationEmailRequest, notificationSMSRequest } from "@shared/messaging";
import { initiateMoneyTransfer } from "@shared/quidaxService";
import Recipient from "@shared/recipient";
import {
    EmailType, ErrorResponse, ReceiveType, TransactionStatus, TransactionType,
} from "@shared/types";
import User from "@shared/user";
import {
    getBankInfo, getRecipient, getRecipients, getUser,
} from "@shared/userService";
import crypto from "crypto";
import moment from "moment";
import { Op } from "sequelize";
import underscore from "underscore";
import FxRate from "../fx/types";
import { TransactionArgs, TransactionUpdateArgs } from "./input";
import { TransactionList, TransactionUserAnalytics } from "./types";

@Injectable()
export default class TransactionProvider {
    checkEnvParams(): void {
        const { BEVEL_USER_SERVICE, BEVEL_USER_API_KEY } = process.env;
        if (!BEVEL_USER_API_KEY || !BEVEL_USER_SERVICE) {
            throw Error("Internal Server Error: environment setup");
        }
    }

    async getUser(userId: string): Promise<User | ErrorResponse> {
        try {
            const user = await getUser(userId);
            if (!user) {
                return {
                    message:    "Invalid transaction data",
                    identifier: userId,
                    error:      "User does not exist",
                };
            }

            return user;
        } catch (e) {
            sentryHttpLogger(e, {
                method:      "GraphQL",
                originalUrl: process.env.BEVEL_USER_SERVICE || "",
                body:        { userId },
            });

            return {
                message:    "User service failed",
                identifier: userId,
                error:      "We can't get the user details right now",
            };
        }
    }

    async getTransactionCountByUser(userId: string): Promise<number> {
        return Transaction.count({ where: { userId } });
    }

    async getRecipient(recipientId: string): Promise<Recipient | ErrorResponse> {
        try {
            const recipient = await getRecipient(recipientId);
            if (!recipient) {
                return {
                    message:    "Invalid transaction data",
                    identifier: recipientId,
                    error:      "Recipient does not exist",
                };
            }

            return recipient;
        } catch (e) {
            sentryHttpLogger(e, {
                method:      "GraphQL",
                originalUrl: process.env.BEVEL_USER_SERVICE || "",
                body:        { recipientId },
            });

            return {
                message:    "Recipient service failed",
                identifier: recipientId,
                error:      "We can't get recipient information right now",
            };
        }
    }

    async getBankInfo(bankInfoId: string): Promise<BankInfo | ErrorResponse> {
        try {
            const bankInfo = await getBankInfo(bankInfoId);
            if (!bankInfo) {
                return {
                    message:    "Invalid transaction data",
                    identifier: bankInfoId,
                    error:      "Bank Information for this recipient not found",
                };
            }

            return bankInfo;
        } catch (e) {
            sentryHttpLogger(e, {
                method:      "GraphQL",
                originalUrl: process.env.BEVEL_USER_SERVICE || "",
                body:        { bankInfoId },
            });

            return {
                message:    "Bank information service failed",
                identifier: bankInfoId,
                error:      "We can't get bank information right now",
            };
        }
    }

    async getTransactionAggregates(userId: string): Promise<{ daily: number, month: number }> {
        const TODAY_START = new Date().setHours(0, 0, 0, 0);
        const NOW = new Date();
        const MONTH_START = new Date().setDate(1);
        const MONTH_END = new Date().setDate(0);
        const daily = await Transaction.sum("conversionReference", {
            where: {
                userId,
                createdAt: {
                    [Op.gt]: TODAY_START,
                    [Op.lt]: NOW,
                },
            },
        });

        const month = await Transaction.sum("conversionReference", {
            where: {
                userId,
                createdAt: {
                    [Op.gte]: MONTH_START,
                    [Op.lte]: MONTH_END,
                },
            },
        });

        return { daily, month };
    }

    async createTransaction(
        userId: string, sendingValue: number, args: TransactionArgs, fx: FxRate,
        user: User,
        recipient: Recipient | Institution,
        bankInfo: BankInfo | InstitutionBankInfo,
    ): Promise<Transaction | ErrorResponse> {
        if (args.transactionType === TransactionType.Individual) {
            if ((recipient as Recipient).userId !== user.id) {
                return {
                    message:    "Invalid transaction data",
                    identifier: args.recipientId || "",
                    error:      "Recipient does not belongs to user creating this transaction",
                };
            }

            if ((bankInfo as BankInfo).recipientId !== recipient.id) {
                return {
                    message:    "Invalid transaction data",
                    identifier: args.recipientId || "",
                    error:      "Bank Information supplied doesn't belongs to the user",
                };
            }
        } else if (user.studentAccountDetail && user.studentAccountDetail.institutionId !== recipient.id) {
            return {
                message:    "Invalid transaction data",
                identifier: args.recipientId || "",
                error:      "You can only send money to the institution on your profile",
            };
        }

        const referenceNumber = crypto.randomBytes(16).toString("hex");
        const transaction = await Transaction.create({
            userId:              user.id,
            recipientId:         recipient.id,
            bankInfoId:          bankInfo.id,
            rate:                fx.rate,
            fee:                 fx.fee,
            baseAmount:          fx.baseAmount,
            actualAmount:        fx.actualAmount,
            sendCurrency:        fx.sendCurrency,
            destinationCurrency: fx.destinationCurrency,
            convertedAmount:     fx.convertedAmount,
            status:              TransactionStatus.AwaitingUserPayment,
            transactionType:     args.transactionType,
            receiveType:         args.receiveType,
            reference:           referenceNumber,
            conversionReference: sendingValue,
            accountNumber:       bankInfo.accountNumber,
        });
        if (args.transactionType === TransactionType.Individual) {
            transaction.recipient = recipient as Recipient;
        } else {
            transaction.institution = recipient as Institution;
        }
        transaction.bankInfo = bankInfo;
        transaction.user = user;

        notificationEmailRequest({
            emailType:  EmailType.TransactionConfirmation,
            parameters: {
                otp:       `${fx.convertedAmount}`,
                receivers: [{
                    name:      user.firstName,
                    firstName: user.firstName,
                    lastName:  user.lastName,
                    email:     user.email,
                }],
            },
        });
        notificationSMSRequest({
            phoneNumber: user.phoneNumber,
            // eslint-disable-next-line max-len
            body:        `Your transfer to ${recipient.name} is ${TransactionStatus.AwaitingUserPayment}\n${recipient.name} will receive ${fx.convertedAmount}`,
        });

        return transaction;
    }

    async getTransactionAnalytics(): Promise<{ monthCount: number, weekCount: number, dayCount: number }> {
        // eslint-disable-next-line max-len
        const monthCount = await Transaction.count({ where: { createdAt: { [Op.gte]: moment().startOf("month").toDate() } } });
        // eslint-disable-next-line max-len
        const weekCount = await Transaction.count({ where: { createdAt: { [Op.gte]: moment().startOf("week").toDate() } } });
        // eslint-disable-next-line max-len
        const dayCount = await Transaction.count({ where: { createdAt: { [Op.gte]: moment().startOf("day").toDate() } } });

        return {
            monthCount,
            weekCount,
            dayCount,
        };
    }

    async getTransactionAmountAnalytics(): Promise<{ monthCount: number, weekCount: number, dayCount: number }> {
        const monthCount = await Transaction.sum(
            "baseAmount",
            { where: { createdAt: { [Op.gte]: moment().startOf("month").toDate() } } },
        );
        const weekCount = await Transaction.sum(
            "baseAmount",
            { where: { createdAt: { [Op.gte]: moment().startOf("week").toDate() } } },
        );
        const dayCount = await Transaction.sum(
            "baseAmount",
            { where: { createdAt: { [Op.gte]: moment().startOf("day").toDate() } } },
        );

        return {
            monthCount,
            weekCount,
            dayCount,
        };
    }

    async getTransaction(transactionId: string): Promise<Transaction | ErrorResponse> {
        const transaction = await Transaction.findByPk(transactionId, { raw: true });
        if (!transaction) {
            return {
                message:    "Invalid transaction data",
                identifier: transactionId,
                error:      "transaction does not exist",
            };
        }

        try {
            const user = await getUser(transaction.userId);
            if (!user) {
                return {
                    message:    "Invalid transaction data",
                    identifier: transaction.userId,
                    error:      "user does not exist",
                };
            }
            transaction.user = user;

            if (transaction.transactionType === TransactionType.Individual) {
                const recipient = await getRecipient(transaction.recipientId);
                if (!recipient) {
                    return {
                        message:    "Invalid transaction data",
                        identifier: transaction.recipientId,
                        error:      "recipient does not exist",
                    };
                }

                const bankInfo = await getBankInfo(transaction.bankInfoId);
                if (!bankInfo) {
                    return {
                        message:    "Invalid transaction data",
                        identifier: transaction.recipientId,
                        error:      "bank information does not exist",
                    };
                }

                transaction.recipient = recipient;
                transaction.bankInfo = bankInfo;
            } else {
                const institution = await Institution.findByPk(
                    transaction.recipientId,
                    {
                        include: [
                            {
                                model: Country,
                                as:    "country",
                            },
                            {
                                model: InstitutionBankInfo,
                                as:    "institutionBankInfo",
                            },
                        ],
                    },
                );
                if (!institution) {
                    return {
                        message:    "Invalid transaction data",
                        identifier: transaction.recipientId,
                        error:      "institution does not exist",
                    };
                }

                transaction.institution = institution;
                transaction.bankInfo = institution.institutionBankInfo!;
            }

            return transaction;
        } catch (e) {
            sentryHttpLogger(e, {
                method:      "GraphQL",
                originalUrl: process.env.BEVEL_USER_SERVICE || "",
                body:        transaction.recipientId,
            });

            return {
                message:    "Invalid transaction data",
                identifier: transaction.recipientId,
                error:      "error getting transaction",
            };
        }
    }

    async getAllTransaction(limit?: number, offset?: number): Promise<TransactionList | ErrorResponse> {
        const transactions = await Transaction.findAll({
            raw:   true,
            limit,
            offset,
            order: [["createdAt", "DESC"]],
        });
        const transactionTotal = await Transaction.count();

        if (!transactions.length) {
            return {
                transactions: [],
                total:        transactionTotal,
            };
        }
        const individualTransactions = [];
        const tuitionTransactions = [];

        // eslint-disable-next-line no-restricted-syntax
        for (const transaction of transactions) {
            if (transaction.transactionType === TransactionType.Individual) {
                individualTransactions.push(transaction);
            } else {
                tuitionTransactions.push(transaction);
            }
        }

        const transactionIndividualData = await this.getTransactionWithRecipient(individualTransactions);
        if (isInstanceOfError(transactionIndividualData)) {
            return transactionIndividualData as unknown as ErrorResponse;
        }

        const transactionInstitutionData = await this.getTransactionWithInstitution(tuitionTransactions);
        if (isInstanceOfError(transactionInstitutionData)) {
            return transactionInstitutionData as unknown as ErrorResponse;
        }

        return {
            transactions: (transactionIndividualData as Array<Transaction>).concat(
                (transactionInstitutionData as Array<Transaction>),
            ),
            total: transactionTotal,
        };
    }

    async getTransactionByUserIds(userIds: Array<string>): Promise<TransactionList | ErrorResponse> {
        const transactions = await Transaction.findAll({
            where: { userId: userIds },
            group: "userId",
        });
        const transactionTotal = await Transaction.count({
            where: { userId: userIds },
            group: "userId",
        });

        if (!transactions.length) {
            return {
                transactions: [],
                // tslint:disable-next-line:ban-ts-ignore
                // @ts-ignore
                total:        transactionTotal,
            };
        }

        const individualTransactions = [];
        const tuitionTransactions = [];

        // eslint-disable-next-line no-restricted-syntax
        for (const transaction of transactions) {
            if (transaction.transactionType === TransactionType.Individual) {
                individualTransactions.push(transaction);
            } else if (transaction.transactionType === TransactionType.Tuition) {
                tuitionTransactions.push(transaction);
            }
        }

        const transactionIndividualData = await this.getTransactionWithRecipient(individualTransactions);
        if (isInstanceOfError(transactionIndividualData)) {
            return transactionIndividualData as unknown as ErrorResponse;
        }

        const transactionInstitutionData = await this.getTransactionWithInstitution(tuitionTransactions);
        if (isInstanceOfError(transactionInstitutionData)) {
            return transactionInstitutionData as unknown as ErrorResponse;
        }

        return {
            transactions: (transactionIndividualData as Array<Transaction>).concat(
                (transactionInstitutionData as Array<Transaction>),
            ),
            // tslint:disable-next-line:ban-ts-ignore
            // @ts-ignore
            total: transactionTotal,
        };
    }

    async getTransactionAnalyticsByUser(userId: string, countryId: string)
        : Promise<TransactionUserAnalytics | ErrorResponse> {
        const country = await Country.findByPk(countryId, { raw: true });
        if (!country) {
            return {
                message:    "Invalid countryId",
                identifier: JSON.stringify({ countryId }),
                error:      "There is an error getting user country",
            };
        }

        const [totalSameDay, totalDelayed] = await Promise.all([
            Transaction.sum("conversionReference", {
                where: {
                    userId,
                    receiveType: ReceiveType.SameDay,
                },
            }),
            Transaction.sum("conversionReference", {
                where: {
                    userId,
                    receiveType: ReceiveType.Delayed,
                },
            }),
        ]);
        const [fxRateSameDay, fxRateDelayed] = await Promise.all([
            TransferFee.findOne({
                where: {
                    destinationCurrency: "CAD",
                    sendCurrency:        country.currencyCode,
                    product:             ReceiveType.SameDay,
                },
                raw: true,
            }),
            TransferFee.findOne({
                where: {
                    destinationCurrency: "CAD",
                    sendCurrency:        country.currencyCode,
                    product:             ReceiveType.Delayed,
                },
                raw: true,
            }),
        ]);

        if (!fxRateSameDay || !fxRateDelayed) {
            return {
                message:    "Invalid currency code",
                identifier: JSON.stringify({ fxRateSameDay, fxRateDelayed }),
                error:      `There is an error getting user total transaction: ${country.currencyCode}`,
            };
        }

        const convertedAmount = (totalSameDay * fxRateSameDay.rate) + (totalDelayed * fxRateDelayed.rate);

        return {
            totalTransactionsAmount: convertedAmount,
            baseCurrencyCode:        country.currencyCode,
        };
    }

    async getTransactionByUser(userId: string, limit?: number, offset?: number):
        Promise<TransactionList | ErrorResponse> {
        const transactions = await Transaction.findAll({
            where: { userId },
            raw:   true,
            limit,
            offset,
            order: [["createdAt", "DESC"]],
        });
        const transactionTotal = await Transaction.count({ where: { userId } });

        if (!transactions.length) {
            return {
                transactions: [],
                total:        transactionTotal,
            };
        }

        const individualTransactions = [];
        const tuitionTransactions = [];

        // eslint-disable-next-line no-restricted-syntax
        for (const transaction of transactions) {
            if (transaction.transactionType === TransactionType.Individual) {
                individualTransactions.push(transaction);
            } else {
                tuitionTransactions.push(transaction);
            }
        }

        const transactionIndividualData = await this.getTransactionWithRecipient(individualTransactions);
        if (isInstanceOfError(transactionIndividualData)) {
            return transactionIndividualData as unknown as ErrorResponse;
        }

        const transactionInstitutionData = await this.getTransactionWithInstitution(tuitionTransactions);
        if (isInstanceOfError(transactionInstitutionData)) {
            return transactionInstitutionData as unknown as ErrorResponse;
        }

        return {
            transactions: (transactionIndividualData as Array<Transaction>).concat(
                (transactionInstitutionData as Array<Transaction>),
            ),
            total: transactionTotal,
        };
    }

    async getTransactionWithRecipient(transactions: Array<Transaction>): Promise<Array<Transaction> | ErrorResponse> {
        if (!transactions.length) {
            return transactions;
        }

        const { BEVEL_USER_SERVICE, BEVEL_USER_API_KEY } = process.env;
        if (!BEVEL_USER_API_KEY || !BEVEL_USER_SERVICE) {
            return {
                message:    "Missing environmental parameters",
                identifier: "BEVEL_USER_API_KEY || BEVEL_USER_SERVICE",
                error:      "Internal server error: environment setup",
            };
        }

        const recipientIds = underscore.pluck(transactions, "recipientId");
        const recipients: Array<Recipient> | null = await getRecipients(recipientIds);
        if (!recipients || !recipients.length) {
            return {
                message:    "Invalid transaction data",
                identifier: "",
                error:      "recipient with of these transaction does not exist",
            };
        }

        return transactions.map(transaction => ({
            ...transaction,
            recipient: recipients.find(recipient => recipient.id === transaction.recipientId),
        })) as unknown as Array<Transaction>;
    }

    async getTransactionWithInstitution(transactions: Array<Transaction>): Promise<Array<Transaction> | ErrorResponse> {
        if (!transactions.length) {
            return transactions;
        }

        const recipientIds = underscore.pluck(transactions, "recipientId");
        const institutions: Array<Institution> | null = await Institution.findAll({
            where:   { id: recipientIds },
            include: [
                {
                    model: Country,
                    as:    "country",
                },
                {
                    model: InstitutionBankInfo,
                    as:    "institutionBankInfo",
                },
            ],
            order: [["createdAt", "DESC"]],
        });
        if (!institutions.length && institutions.length !== transactions.length) {
            return {
                message:    "Invalid transaction data",
                identifier: `${JSON.stringify({ ids: recipientIds })}`,
                error:      "Some institution with transaction data does not exist",
            };
        }
        const formattedTransactions = transactions.map(transaction => {
            // eslint-disable-next-line max-len
            const institution = institutions.find(institute => institute.getDataValue("id") === transaction.recipientId);

            return {
                ...transaction,
                institution,
                bankInfo: institution ? institution.institutionBankInfo : undefined,
            };
        });

        return formattedTransactions as unknown as Array<Transaction>;
    }

    async getTransactionByRecipientIds(recipientIds: Array<string>): Promise<Array<Transaction>> {
        return Transaction.findAll({
            where: { recipientId: recipientIds },
            group: "recipientId",
        });
    }

    async getAllTransactionByType(transactionType: TransactionType): Promise<Array<Transaction>> {
        return Transaction.findAll({
            where: { transactionType },
            order: [["createdAt", "DESC"]],
        });
    }

    async getTransactionOnly(transactionId: string, raw?: boolean): Promise<Transaction | null> {
        return Transaction.findByPk(transactionId, { raw });
    }

    async updateTransaction(
        arg: TransactionUpdateArgs, user: User, recipient: Recipient, bankInfo: BankInfo,
    ): Promise<Transaction | ErrorResponse> {
        const transaction = await this.getTransactionOnly(arg.transactionId);
        if (!transaction) {
            return {
                message:    "Transaction not found",
                identifier: "",
                error:      "transaction not found",
            };
        }

        transaction.status = arg.status;
        await transaction.save();

        notificationEmailRequest({
            emailType:  EmailType.TransactionConfirmation,
            parameters: {
                otp:       `Your Transfer to ${recipient.name} has a new status ${arg.status}`,
                receivers: [{
                    name:      user.firstName,
                    firstName: user.firstName,
                    lastName:  user.lastName,
                    email:     user.email,
                }],
            },
        });

        notificationSMSRequest({
            phoneNumber: user.phoneNumber,
            // eslint-disable-next-line max-len
            body:        `Your Transfer to ${recipient.name} has a new status ${arg.status}`,
        });

        if (arg.status === TransactionStatus.UserPaymentReceived
            && transaction.getDataValue("destinationCurrency").toLowerCase() === "ngn"
        ) {
            const transferArg = {
                currencyCode: transaction.getDataValue("destinationCurrency"),
                amount:       transaction.getDataValue("convertedAmount"),
                bankAccount:  bankInfo.accountNumber,
                bankCode:     bankInfo.bankCode,
                note:         "Bevel transaction to naira account",
                narration:    `${user.firstName} ${user.lastName} transfer to ${recipient.name}`,
            };

            try {
                const quidaxId = await initiateMoneyTransfer(transferArg);
                transaction.status = TransactionStatus.FundInTransit;
                transaction.quidaxId = quidaxId;
                await transaction.save();

                notificationEmailRequest({
                    emailType:  EmailType.TransactionConfirmation,
                    parameters: {
                        // eslint-disable-next-line max-len
                        otp:       `Your Transfer to ${recipient.name} has a new status: ${TransactionStatus.FundInTransit}`,
                        receivers: [{
                            name:      user.firstName,
                            firstName: user.firstName,
                            lastName:  user.lastName,
                            email:     user.email,
                        }],
                    },
                });

                notificationSMSRequest({
                    phoneNumber: user.phoneNumber,
                    // eslint-disable-next-line max-len
                    body:        `Your Transfer to ${recipient.name} has a new status: ${TransactionStatus.FundInTransit}`,
                });
            } catch (e) {
                sentryHttpLogger(e, {
                    method:      "GraphQL",
                    originalUrl: process.env.QUIDAX_URL || "",
                    body:        {
                        ...transferArg,
                        message: JSON.stringify(e.response?.data),
                    },
                });
                transaction.status = TransactionStatus.FundTransferFailed;
                await transaction.save();
            }
        }

        return transaction;
    }

    async updateTransactionQuidax(accountNumber: string, quidaxId: string, status: TransactionStatus): Promise<void> {
        const transaction = await Transaction.findOne({
            where: {
                accountNumber,
                quidaxId,
                status: TransactionStatus.UserPaymentReceived,
            },
        });
        if (!transaction) {
            throw new Error("Transaction not found");
        }

        transaction.status = status;
        await transaction.save();
    }
// tslint:disable-next-line:max-file-line-count
}
