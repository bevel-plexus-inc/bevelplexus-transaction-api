import { GraphQLModule } from "@graphql-modules/core";
import { authorizationChecker } from "@lib/authentication";
import InstitutionProvider from "@modules/institution/provider";
// tslint:disable-next-line:no-import-side-effect
import "reflect-metadata";
import { buildSchemaSync } from "type-graphql";
import ConfigProvider from "../config/provider";
import FxProvider from "../fx/provider";
import LevelConfigProvider from "../levelConfig/provider";
import TransactionProvider from "./provider";
import TransactionResolver from "./resolver";

const transactionModule: GraphQLModule = new GraphQLModule({
    providers: [
        TransactionProvider, TransactionResolver, FxProvider, LevelConfigProvider, ConfigProvider, InstitutionProvider,
    ],
    extraSchemas: [
        buildSchemaSync({
            authChecker: authorizationChecker,
            resolvers:   [TransactionResolver],
            // tslint:disable-next-line:ban-ts-ignore
            // @ts-ignore
            container:   ({ context }): Injector<Session> => transactionModule.injector.getSessionInjector(context),
        }),
    ],
});

export default transactionModule;
