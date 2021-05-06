import { GraphQLModule } from "@graphql-modules/core";
import { authorizationChecker } from "@lib/authentication";
// tslint:disable-next-line:no-import-side-effect
import "reflect-metadata";
import { buildSchemaSync } from "type-graphql";
import AccountProvider from "./provider";
import AccountResolver from "./resolver";

const accountModule: GraphQLModule = new GraphQLModule({
    providers:    [AccountProvider, AccountResolver],
    extraSchemas: [
        buildSchemaSync({
            authChecker: authorizationChecker,
            resolvers:   [AccountResolver],
            // tslint:disable-next-line:ban-ts-ignore
            // @ts-ignore
            container:   ({ context }): Injector<Session> => accountModule.injector.getSessionInjector(context),
        }),
    ],
});

export default accountModule;
