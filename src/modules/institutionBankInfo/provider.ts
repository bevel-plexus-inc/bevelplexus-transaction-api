import { Injectable } from "@graphql-modules/di";
import { ErrorResponse } from "@shared/types";
import InstitutionBankInfo from "../../models/institutionBankInfo";
import { InstitutionBankInfoArgs, InstitutionBankInfoUpdateArgs } from "./input";

@Injectable()
export default class InstitutionBankInfoProvider {
    async getInstitutionBankInfoByRecipient(recipientId: string): Promise<Array<InstitutionBankInfo>> {
        return InstitutionBankInfo.findAll({
            where: { recipientId },
            order: [["createdAt", "DESC"]],
        });
    }

    async getInstitutionBankInfo(id: string): Promise<InstitutionBankInfo | null> {
        return InstitutionBankInfo.findByPk(id);
    }

    async createInstitutionBankInfo(bankInfoArgs: InstitutionBankInfoArgs)
        : Promise<InstitutionBankInfo | ErrorResponse> {
        return InstitutionBankInfo.create({
            bank:              bankInfoArgs.bank,
            bankCode:          bankInfoArgs.bankCode,
            accountNumber:     bankInfoArgs.accountNumber,
            institutionId:     bankInfoArgs.institutionId,
            transitOrSortCode: bankInfoArgs.transitOrSortCode,
        });
    }

    async updateInstitutionBankInfo(institutionBankInfoId: string, bankInfoArgs: InstitutionBankInfoUpdateArgs)
        : Promise<InstitutionBankInfo | ErrorResponse> {
        const bankInfo = await this.getInstitutionBankInfo(institutionBankInfoId);
        if (!bankInfo) {
            return {
                message:    "record not found",
                identifier: institutionBankInfoId,
                error:      "The institution bank information does not exist",
            };
        }

        bankInfo.bank = bankInfoArgs.bank;
        bankInfo.bankCode = bankInfoArgs.bankCode;
        bankInfo.accountNumber = bankInfoArgs.accountNumber;
        bankInfo.transitOrSortCode = bankInfoArgs.transitOrSortCode;
        await bankInfo.save();

        return bankInfo;
    }

    async deactivateInstitutionBankInfo(institutionBankInfoId: string): Promise<InstitutionBankInfo | ErrorResponse> {
        const bankInfo = await this.getInstitutionBankInfo(institutionBankInfoId);
        if (!bankInfo) {
            return {
                message:    "record not found",
                identifier: institutionBankInfoId,
                error:      "The institution bank information does not exist",
            };
        }

        await bankInfo.destroy();

        return bankInfo;
    }

    async activateInstitutionBankInfo(institutionBankInfoId: string): Promise<InstitutionBankInfo | ErrorResponse> {
        const bankInfo = await this.getInstitutionBankInfo(institutionBankInfoId);
        if (!bankInfo) {
            return {
                message:    "record not found",
                identifier: institutionBankInfoId,
                error:      "The institution bank information does not exist",
            };
        }

        await bankInfo.restore();

        return bankInfo;
    }
}
