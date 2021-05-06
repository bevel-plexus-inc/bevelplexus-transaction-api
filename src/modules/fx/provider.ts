import { Injectable } from "@graphql-modules/di";
import TransferFee from "@models/transferFee";
import { ErrorResponse, ReceiveType } from "@shared/types";
import FxRateArgs from "./input";
import FxRateResponse from "./types";

@Injectable()
export default class FxProvider {
    async getRate(sendCurrency: string, destinationCurrency: string, receiveType: ReceiveType):
        Promise<TransferFee | null> {
        return TransferFee.findOne({
            where: {
                sendCurrency,
                destinationCurrency,
                product: receiveType,
            },
            raw: true,
        });
    }

    async getFxRate(input: FxRateArgs): Promise<FxRateResponse | ErrorResponse> {
        const transferFee = await TransferFee.findOne({
            where: {
                sendCurrency:        input.sendCurrency,
                destinationCurrency: input.destinationCurrency,
                product:             input.receiveType,
            },
            raw: true,
        });
        if (!transferFee) {
            return {
                error:      "Exchange rate not found for this corridor",
                message:    "Exchange rate not found for this corridor",
                identifier: `${input.sendCurrency}-${input.destinationCurrency}: ${input.receiveType}`,
            };
        }

        const actualAmount = input.baseAmount - transferFee.fee;
        const convertedAmount = actualAmount * transferFee.rate;

        return {
            baseAmount:          input.baseAmount,
            sendCurrency:        transferFee.sendCurrency,
            destinationCurrency: transferFee.destinationCurrency,
            receiveType:         transferFee.product,
            convertedAmount,
            rate:                transferFee.rate,
            actualAmount,
            fee:                 transferFee.fee,
        };
    }

    // The destination will always be dollars but expect it to be passed in as the logic might change in the future
    async checkMinimum(sendCurrency: string, destinationCurrency: string, receiveType: ReceiveType, amount: number):
        Promise<boolean> {
        const transferFee = await this.getRate(sendCurrency, destinationCurrency, receiveType);
        if (!transferFee) {
            return false;
        }

        const sendingValue = amount * transferFee.rate;

        return sendingValue >= 500;
    }
}
