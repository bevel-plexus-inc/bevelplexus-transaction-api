import { isInstanceOfError } from "@lib/instanceChecker";
import { ErrorResponse, GenericRole, PaymentType } from "@shared/types";
import {
    Arg, Authorized, Mutation, Query, Resolver,
} from "type-graphql";
import CountryProvider from "../country/provider";
import PaymentChannelArg, { PaymentPropertyArg } from "./input";
import PaymentChannelProvider from "./provider";
import PaymentChannel, { PaymentChannelList, PaymentProperty } from "./types";

@Resolver(of => PaymentChannel)
export default class PaymentChannelResolver {
    // eslint-disable-next-line no-empty-function
    constructor(
        private readonly paymentChannelProvider: PaymentChannelProvider,
        private readonly countryProvider: CountryProvider,
    ) {}

    @Authorized()
    @Query(returns => PaymentChannel, { nullable: true })
    async getPaymentChannel(@Arg("paymentChannelId") paymentChannelId: string): Promise<PaymentChannel | null> {
        return this.paymentChannelProvider.getPaymentChannel(paymentChannelId);
    }

    @Authorized()
    @Query(returns => [PaymentProperty])
    async getPaymentPropertiesByChannel(
        @Arg("paymentChannelId") paymentChannelId: string,
    ): Promise<Array<PaymentProperty>> {
        return this.paymentChannelProvider.getPaymentPropertiesByChannel(paymentChannelId);
    }

    @Authorized()
    @Query(returns => PaymentProperty, { nullable: true })
    async getPaymentProperty(
        @Arg("paymentPropertyId") paymentPropertyId: string,
    ): Promise<PaymentProperty | null> {
        return this.paymentChannelProvider.getPaymentProperty(paymentPropertyId);
    }

    @Authorized()
    @Query(returns => [PaymentChannel])
    async getPaymentChannelByCountryId(@Arg("countryId") countryId: string): Promise<Array<PaymentChannel>> {
        return this.paymentChannelProvider.getPaymentChannelByCountryId(countryId);
    }

    @Authorized()
    @Query(returns => [PaymentChannel])
    async getPaymentChannelByPaymentType(@Arg("paymentType") paymentType: PaymentType): Promise<Array<PaymentChannel>> {
        return this.paymentChannelProvider.getPaymentChannelByPaymentType(paymentType);
    }

    @Authorized()
    @Query(returns => [PaymentChannel])
    async getPaymentChannelByCountryIdV2(
        @Arg("paymentType") paymentType: PaymentType,
        @Arg("countryId") countryId: string,
    ): Promise<Array<PaymentChannel>> {
        return this.paymentChannelProvider.getPaymentChannelByCountryAndPaymentType(paymentType, countryId);
    }

    @Authorized()
    @Query(returns => PaymentChannelList)
    async getAllPaymentChannel(
        @Arg("limit", { nullable: true }) limit?: number,
        @Arg("offset", { nullable: true }) offset?: number,
    ): Promise<PaymentChannelList> {
        return this.paymentChannelProvider.getAllPaymentChannel(limit, offset);
    }

    @Authorized(GenericRole.Admin)
    @Mutation(returns => PaymentChannel)
    async createPaymentChannel(
        @Arg("paymentChannelArg", returns => PaymentChannelArg) paymentChannelArg: PaymentChannelArg,
    ): Promise<PaymentChannel> {
        const country = await this.countryProvider.getCountry(paymentChannelArg.countryId);
        if (!country) {
            throw new Error("Country does not exist");
        }

        return this.paymentChannelProvider.createPaymentChannel(paymentChannelArg);
    }

    @Authorized(GenericRole.Admin)
    @Mutation(returns => PaymentProperty)
    async createPaymentProperty(
        @Arg("paymentPropertyArg", returns => PaymentPropertyArg) paymentPropertyArg: PaymentPropertyArg,
    ): Promise<PaymentProperty> {
        const paymentChanel = await this.paymentChannelProvider.getPaymentChannel(paymentPropertyArg.paymentChannelId);
        if (!paymentChanel) {
            throw new Error("Payment Channel does not exist");
        }

        return this.paymentChannelProvider.createPaymentProperty(paymentPropertyArg);
    }

    @Authorized(GenericRole.Admin)
    @Mutation(returns => PaymentChannel)
    async deletePaymentChannel(@Arg("paymentChannelId") paymentChannelId: string): Promise<PaymentChannel> {
        const response = await this.paymentChannelProvider.deletePaymentChannel(paymentChannelId);
        if (isInstanceOfError(response)) {
            throw new Error((response as ErrorResponse).error);
        }

        return response as PaymentChannel;
    }

    @Authorized(GenericRole.Admin)
    @Mutation(returns => PaymentProperty)
    async deletePaymentProperty(@Arg("paymentPropertyId") paymentPropertyId: string): Promise<PaymentProperty> {
        const response = await this.paymentChannelProvider.deletePaymentProperty(paymentPropertyId);
        if (isInstanceOfError(response)) {
            throw new Error((response as ErrorResponse).error);
        }

        return response as PaymentProperty;
    }
}
