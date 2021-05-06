import { Injectable } from "@graphql-modules/di";
import Account from "@models/account";
import Config from "@models/config";
// import { createAccount } from "@shared/quidaxService";
import { ErrorResponse } from "@shared/types";
import AccountArgs from "./input";
import AccountType from "./types";

@Injectable()
export default class AccountProvider {
    async getAccount(accountId: string): Promise<Account | null> {
        return Account.findByPk(accountId);
    }

    async getAccountByUser(userId: string): Promise<AccountType> {
        const account = await Account.findOne({ where: { userId } });
        if (account) {
            return account;
        }

        const defaultAccount = await Config.findAll({
            limit: 1,
            order: [["createdAt", "DESC"]],
            raw:   true,
        });

        if (!defaultAccount.length) {
            throw new Error("Internal Server Error: default account");
        }
        const defaultDetails = defaultAccount[0];

        return {
            id:                defaultDetails.id,
            userId:            "userId",
            email:             "email",
            quidaxId:          "quidaxId",
            quidaxSn:          "quidaxSn",
            quidaxDisplayName: defaultDetails.defaultAccountName,
            firstName:         "firstName",
            lastName:          "lastName",
            createdAt:         defaultDetails.createdAt,
            updatedAt:         defaultDetails.updatedAt,
            accountNumber:     defaultDetails.defaultAccountNumber,
        };
    }

    async createAccount(arg: AccountArgs): Promise<Account | ErrorResponse> {
        const account = this.getAccountByUser(arg.userId);

        if (!account) {
            return {
                message:    "Account details already exists",
                identifier: arg.userId,
                error:      "Account details already exists",
            };
        }

        // const quidaxResponse = await createAccount({
        //     firstName: arg.firstName,
        //     lastName:  arg.lastName,
        //     email:     arg.email,
        // });
        //
        // return Account.create({
        //     ...arg,
        //     accountNumber: quidaxResponse.sn,
        //     quidaxId:      quidaxResponse.id,
        //     quidaxSn:      quidaxResponse.sn,
        // });

        // TODO: Implement creation of account number of quidax
        return Account.create({
            ...arg,
            accountNumber: "1234567890",
            quidaxId:      "1234567890",
            quidaxSn:      "1234567890",
        });
    }
}
