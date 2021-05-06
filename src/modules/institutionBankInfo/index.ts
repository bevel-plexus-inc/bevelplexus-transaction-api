import { GraphQLModule } from "@graphql-modules/core";
import { authorizationChecker } from "@lib/authentication";
// tslint:disable-next-line:no-import-side-effect
import "reflect-metadata";
import { buildSchemaSync } from "type-graphql";
import CountryResolver from "../country/provider";
import InstitutionBankInfoProvider from "./provider";
import InstitutionBankInfoResolver from "./resolver";

const institutionBankModule: GraphQLModule = new GraphQLModule({
    providers:    [InstitutionBankInfoProvider, InstitutionBankInfoResolver, CountryResolver],
    extraSchemas: [
        buildSchemaSync({
            authChecker: authorizationChecker,
            resolvers:   [InstitutionBankInfoResolver],
            // tslint:disable-next-line:ban-ts-ignore
            // @ts-ignore
            container:   ({ context }): Injector<Session> => institutionBankModule.injector.getSessionInjector(context),
        }),
    ],
});

export default institutionBankModule;
