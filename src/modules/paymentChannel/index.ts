import { GraphQLModule } from "@graphql-modules/core";
import { authorizationChecker } from "@lib/authentication";
// tslint:disable-next-line:no-import-side-effect
import "reflect-metadata";
import { buildSchemaSync } from "type-graphql";
import CountryResolver from "../country/provider";
import PaymentChannelProvider from "./provider";
import PaymentChannelResolver from "./resolver";

const paymentChannelModule: GraphQLModule = new GraphQLModule({
    providers:    [PaymentChannelProvider, PaymentChannelResolver, CountryResolver],
    extraSchemas: [
        buildSchemaSync({
            authChecker: authorizationChecker,
            resolvers:   [PaymentChannelResolver],
            // tslint:disable-next-line:ban-ts-ignore
            // @ts-ignore
            container:   ({ context }): Injector<Session> => paymentChannelModule.injector.getSessionInjector(context),
        }),
    ],
});

export default paymentChannelModule;
