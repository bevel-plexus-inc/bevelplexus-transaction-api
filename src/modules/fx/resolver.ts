import { isInstanceOfError } from "@lib/instanceChecker";
import { ErrorResponse } from "@shared/types";
import {
    Arg, Authorized, Query, Resolver,
} from "type-graphql";
import FxRateArgs from "./input";
import FxProvider from "./provider";
import Fx from "./types";

@Resolver(of => Fx)
export default class FxResolver {
    // eslint-disable-next-line no-empty-function
    constructor(private readonly fxProvider: FxProvider) {}

    @Authorized()
    @Query(returns => Fx)
    async getFxRate(@Arg("input", returns => FxRateArgs) input: FxRateArgs): Promise<Fx> {
        const response = await this.fxProvider.getFxRate(input);
        if (isInstanceOfError(response)) {
            throw new Error((response as ErrorResponse).error);
        }

        return response as Fx;
    }
}
