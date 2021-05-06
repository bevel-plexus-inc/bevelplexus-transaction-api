import { GraphQLModule } from "@graphql-modules/core";
import { authorizationChecker } from "@lib/authentication";
// tslint:disable-next-line:no-import-side-effect
import "reflect-metadata";
import { buildSchemaSync } from "type-graphql";
import LevelConfigProvider from "./provider";
import LevelConfigResolver from "./resolver";

const levelConfigModule: GraphQLModule = new GraphQLModule({
    providers:    [LevelConfigProvider, LevelConfigResolver],
    extraSchemas: [
        buildSchemaSync({
            authChecker: authorizationChecker,
            resolvers:   [LevelConfigResolver],
            // tslint:disable-next-line:ban-ts-ignore
            // @ts-ignore
            container:   ({ context }): Injector<Session> => levelConfigModule.injector.getSessionInjector(context),
        }),
    ],
});

export default levelConfigModule;
