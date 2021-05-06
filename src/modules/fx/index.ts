import { GraphQLModule } from "@graphql-modules/core";
import { authorizationChecker } from "@lib/authentication";
// tslint:disable-next-line:no-import-side-effect
import "reflect-metadata";
import { buildSchemaSync } from "type-graphql";
import FxProvider from "./provider";
import FxResolver from "./resolver";

const fxModule: GraphQLModule = new GraphQLModule({
    providers:    [FxProvider, FxResolver],
    extraSchemas: [
        buildSchemaSync({
            authChecker: authorizationChecker,
            resolvers:   [FxResolver],
            // tslint:disable-next-line:ban-ts-ignore
            // @ts-ignore
            container:   ({ context }): Injector<Session> => fxModule.injector.getSessionInjector(context),
        }),
    ],
});

export default fxModule;
