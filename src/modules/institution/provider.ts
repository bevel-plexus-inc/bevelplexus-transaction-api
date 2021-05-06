import { Injectable } from "@graphql-modules/di";
import sentryHttpLogger from "@lib/sentryHttpLogger";
import Country from "@models/country";
import sequelize from "@models/index";
import Institution from "@models/institution";
import InstitutionBankInfo from "@models/institutionBankInfo";
import { InstitutionList } from "@modules/institution/types";
import { ErrorResponse } from "@shared/types";
import InstitutionArg from "./input";

@Injectable()
export default class InstitutionProvider {
    async createInstitution(institutionArg: InstitutionArg): Promise<Institution> {
        const country = await Country.findByPk(institutionArg.countryId, { paranoid: false });
        if (!country) {
            throw new Error("Attached country does not exist");
        }

        const sequelizeTransaction = await sequelize.transaction();

        try {
            const institution = await Institution.create({
                city:      institutionArg.city,
                name:      institutionArg.name,
                countryId: institutionArg.countryId,
            }, {
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
            });
            const instituteBankInfo = await InstitutionBankInfo.create({
                bank:              institutionArg.bank,
                bankCode:          institutionArg.bankCode,
                accountNumber:     institutionArg.accountNumber,
                transitOrSortCode: institutionArg.transitOrSortCode,
                institutionId:     institution.getDataValue("id"),
            });

            await sequelizeTransaction.commit();

            institution.country = country;
            institution.institutionBankInfo = instituteBankInfo;

            return institution;
        } catch (e) {
            await sequelizeTransaction.rollback();
            sentryHttpLogger(e, {
                method:      "GraphQL",
                originalUrl: process.env.BEVEL_USER_SERVICE || "",
                body:        institutionArg,
            });
        }

        throw new Error("There is a problem creating institution");
    }

    async updateInstitution(institutionArg: InstitutionArg, institutionId: string): Promise<Institution> {
        const country = await Country.findByPk(institutionArg.countryId, { paranoid: false });
        if (!country) {
            throw new Error("Attached country does not exist");
        }

        const institution = await this.getInstitution(institutionId);
        if (!institution) {
            throw new Error("Institution does not exist");
        }

        const sequelizeTransaction = await sequelize.transaction();

        try {
            institution.city = institutionArg.city;
            institution.name = institutionArg.name;
            institution.countryId = institutionArg.countryId;
            await institution.save();

            if (institution.institutionBankInfo) {
                institution.institutionBankInfo.accountNumber = institutionArg.accountNumber;
                institution.institutionBankInfo.bank = institutionArg.bank;
                institution.institutionBankInfo.bankCode = institutionArg.bankCode;
                institution.institutionBankInfo.transitOrSortCode = institutionArg.transitOrSortCode;
                await institution.institutionBankInfo.save();
            } else {
                institution.institutionBankInfo = await InstitutionBankInfo.create({
                    bank:              institutionArg.bank,
                    bankCode:          institutionArg.bankCode,
                    accountNumber:     institutionArg.accountNumber,
                    transitOrSortCode: institutionArg.transitOrSortCode,
                    institutionId:     institution.getDataValue("id"),
                });
            }

            await sequelizeTransaction.commit();

            institution.country = country;

            return institution;
        } catch (e) {
            await sequelizeTransaction.rollback();
            sentryHttpLogger(e, {
                method:      "GraphQL",
                originalUrl: process.env.BEVEL_USER_SERVICE || "",
                body:        institutionArg,
            });
        }

        throw new Error("There is a problem updating institution");
    }

    async getInstitution(institutionId: string): Promise<Institution | null> {
        return Institution.findByPk(institutionId, {
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
            paranoid: false,
        });
    }

    async getAllInstitution(): Promise<Array<Institution>> {
        return Institution.findAll({
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
    }

    async getAllInstitutionV2(limit?: number, offset?: number): Promise<InstitutionList> {
        const institutions = await Institution.findAll({
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
            limit,
            offset,
            paranoid: false,
            order:    [["createdAt", "DESC"]],
        });
        const total = await Institution.count();

        return {
            total,
            institutions,
        };
    }

    async getInstitutionByCountry(countryId: string): Promise<Array<Institution>> {
        return Institution.findAll({
            where:   { countryId },
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
    }

    async deactivateInstitution(institutionId: string): Promise<Institution | ErrorResponse> {
        const institution = await this.getInstitution(institutionId);
        if (!institution) {
            return {
                message:    "Institution not found",
                identifier: institutionId,
                error:      "Institution not found",
            };
        }

        await institution.destroy();

        return institution;
    }

    async activateInstitution(institutionId: string): Promise<Institution | ErrorResponse> {
        const institution = await this.getInstitution(institutionId);
        if (!institution) {
            return {
                message:    "Institution not found",
                identifier: institutionId,
                error:      "Institution not found",
            };
        }

        await institution.restore();

        return institution;
    }
}
