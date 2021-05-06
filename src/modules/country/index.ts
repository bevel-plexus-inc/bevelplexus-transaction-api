import { GraphQLModule } from "@graphql-modules/core";
import { authorizationChecker } from "@lib/authentication";
// tslint:disable-next-line:no-import-side-effect
import "reflect-metadata";
import { buildSchemaSync } from "type-graphql";
import CountryProvider from "./provider";
import CountryResolver from "./resolver";

const countryModule: GraphQLModule = new GraphQLModule({
    providers:    [CountryProvider, CountryResolver, ],
    extraSchemas: [
        buildSchemaSync({
            authChecker: authorizationChecker,
            resolvers:   [CountryResolver],
            // tslint:disable-next-line:ban-ts-ignore
            // @ts-ignore
            container:   ({ context }): Injector<Session> => countryModule.injector.getSessionInjector(context),
        }),
    ],
});

export default countryModule;
