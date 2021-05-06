import { Injectable } from "@graphql-modules/di";
import Country from "@models/country";
import PaymentChannel from "@models/paymentChannel";
import PaymentProperty from "@models/paymentProperties";
import { PaymentChannelList } from "@modules/paymentChannel/types";
import { ErrorResponse, PaymentType } from "@shared/types";
import PaymentChannelArg, { PaymentPropertyArg } from "./input";

@Injectable()
export default class PaymentChannelProvider {
    async createPaymentChannel(paymentChannelArg: PaymentChannelArg): Promise<PaymentChannel> {
        const country = await Country.findByPk(paymentChannelArg.countryId);
        if (!country) {
            throw new Error("Attached country does not exist");
        }

        const paymentChannel = await PaymentChannel.create(paymentChannelArg, {
            include: [
                {
                    model: Country,
                    as:    "country",
                },
                {
                    model: PaymentProperty,
                    as:    "paymentProperties",
                },
            ],
        });
        paymentChannel.country = country;

        return paymentChannel;
    }

    async createPaymentProperty(paymentPropertyArg: PaymentPropertyArg): Promise<PaymentProperty> {
        return PaymentProperty.create(paymentPropertyArg);
    }

    async getPaymentChannel(paymentChannelId: string): Promise<PaymentChannel | null> {
        return PaymentChannel.findByPk(paymentChannelId, {
            include: [
                {
                    model: Country,
                    as:    "country",
                },
                {
                    model: PaymentProperty,
                    as:    "paymentProperties",
                },
            ],
        });
    }

    async getPaymentProperty(paymentPropertyId: string): Promise<PaymentProperty | null> {
        return PaymentProperty.findByPk(paymentPropertyId);
    }

    async getPaymentPropertiesByChannel(paymentChannelId: string): Promise<Array<PaymentProperty>> {
        return PaymentProperty.findAll({
            where:   { paymentChannelId },
            include: [
                {
                    model: Country,
                    as:    "country",
                },
                {
                    model: PaymentProperty,
                    as:    "paymentProperties",
                },
            ],
            order: [["createdAt", "DESC"]],
        });
    }

    async getAllPaymentChannel(limit?: number, offset?: number): Promise<PaymentChannelList> {
        const paymentChannels = await PaymentChannel.findAll({
            include: [
                {
                    model: Country,
                    as:    "country",
                },
                {
                    model: PaymentProperty,
                    as:    "paymentProperties",
                },
            ],
            limit,
            offset,
            order: [["createdAt", "DESC"]],
        });
        const total = await PaymentChannel.count();

        return {
            total,
            paymentChannels,
        };
    }

    async getPaymentChannelByPaymentType(paymentType: PaymentType): Promise<Array<PaymentChannel>> {
        return PaymentChannel.findAll({
            where:   { paymentType },
            include: [
                {
                    model: Country,
                    as:    "country",
                },
                {
                    model: PaymentProperty,
                    as:    "paymentProperties",
                },
            ],
            order: [["createdAt", "DESC"]],
        });
    }

    async getPaymentChannelByCountryAndPaymentType(paymentType: PaymentType, countryId: string)
        : Promise<Array<PaymentChannel>> {
        return PaymentChannel.findAll({
            where: {
                paymentType,
                countryId,
            },
            include: [
                {
                    model: Country,
                    as:    "country",
                },
                {
                    model: PaymentProperty,
                    as:    "paymentProperties",
                },
            ],
            order: [["createdAt", "DESC"]],
        });
    }

    async getPaymentChannelByCountryId(countryId: string): Promise<Array<PaymentChannel>> {
        return PaymentChannel.findAll({
            where:   { countryId },
            include: [
                {
                    model: Country,
                    as:    "country",
                },
                {
                    model: PaymentProperty,
                    as:    "paymentProperties",
                },
            ],
            order: [["createdAt", "DESC"]],
        });
    }

    async deletePaymentChannel(paymentChannelId: string): Promise<PaymentChannel | ErrorResponse> {
        const paymentChannel = await this.getPaymentChannel(paymentChannelId);
        if (!paymentChannel) {
            return {
                message:    "Record not found",
                identifier: paymentChannelId,
                error:      "Payment Channel found",
            };
        }

        await paymentChannel.destroy();

        return paymentChannel;
    }

    async deletePaymentProperty(paymentPropertyId: string): Promise<PaymentProperty | ErrorResponse> {
        const paymentChannel = await this.getPaymentProperty(paymentPropertyId);
        if (!paymentChannel) {
            return {
                message:    "Record not found",
                identifier: paymentPropertyId,
                error:      "Payment Property found",
            };
        }

        await paymentChannel.destroy();

        return paymentChannel;
    }
}
