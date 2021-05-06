import { GraphQLModule } from "@graphql-modules/core";
import { authorizationChecker } from "@lib/authentication";
// tslint:disable-next-line:no-import-side-effect
import "reflect-metadata";
import { buildSchemaSync } from "type-graphql";
import ConfigProvider from "./provider";
import ConfigResolver from "./resolver";

const configModule: GraphQLModule = new GraphQLModule({
    providers:    [ConfigProvider, ConfigResolver],
    extraSchemas: [
        buildSchemaSync({
            authChecker: authorizationChecker,
            resolvers:   [ConfigResolver],
            // tslint:disable-next-line:ban-ts-ignore
            // @ts-ignore
            container:   ({ context }): Injector<Session> => configModule.injector.getSessionInjector(context),
        }),
    ],
});

export default configModule;
