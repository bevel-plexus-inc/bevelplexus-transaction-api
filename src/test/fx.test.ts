import FxModule from "@modules/fx";
import { execute } from "graphql";
import gql from "graphql-tag";
// tslint:disable-next-line:no-import-side-effect
import "reflect-metadata";
import { mockFx } from "./mockData";

describe("Testing FxModule", () => {
    it("Should return error when supplied input is wrong", async () => {
        const { schema } = FxModule;

        const result = await execute({
            schema,
            contextValue: { user: true },
            document:     gql`
                query getFxRate($input: FxRateArgs!) {
                    getFxRate(input: $input) {
                        sendCurrency
                        destinationCurrency
                        baseAmount
                        convertedAmount
                        rate
                        fee
                        actualAmount
                        receiveType
                    }
                }
            `,
            variableValues: { input: { ...mockFx, sendCurrency: undefined } },
        });

        expect(result.errors).toBeTruthy();
    });

    it("Should create config and return required data", async () => {
        const { schema } = FxModule;
        const result = await execute({
            schema,
            contextValue: { user: true },
            document:     gql`
                query getFxRate($input: FxRateArgs!) {
                    getFxRate(input: $input) {
                        sendCurrency
                        destinationCurrency
                        baseAmount
                        convertedAmount
                        rate
                        fee
                        actualAmount
                        receiveType
                    }
                }
            `,
            variableValues: { input: mockFx },
        });

        expect(result.errors).toBeFalsy();
        expect(result.data!.getFxRate).toBeTruthy();
        expect(result.data!.getFxRate.sendCurrency).toBe(mockFx.sendCurrency);
        expect(result.data!.getFxRate.destinationCurrency).toBe(mockFx.destinationCurrency);
        expect(result.data!.getFxRate.baseAmount).toBe(mockFx.baseAmount);
        expect(result.data!.getFxRate.receiveType).toBe(mockFx.receiveType);
    });
});
