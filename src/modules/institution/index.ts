import { GraphQLModule } from "@graphql-modules/core";
import { authorizationChecker } from "@lib/authentication";
// tslint:disable-next-line:no-import-side-effect
import "reflect-metadata";
import { buildSchemaSync } from "type-graphql";
import CountryResolver from "../country/provider";
import InstitutionProvider from "./provider";
import InstitutionResolver from "./resolver";

const institutionModule: GraphQLModule = new GraphQLModule({
    providers:    [InstitutionProvider, InstitutionResolver, CountryResolver],
    extraSchemas: [
        buildSchemaSync({
            authChecker: authorizationChecker,
            resolvers:   [InstitutionResolver],
            // tslint:disable-next-line:ban-ts-ignore
            // @ts-ignore
            container:   ({ context }): Injector<Session> => institutionModule.injector.getSessionInjector(context),
        }),
    ],
});

export default institutionModule;
