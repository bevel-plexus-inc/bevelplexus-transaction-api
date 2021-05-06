import { GraphQLModule } from "@graphql-modules/core";
import { authResolver } from "@lib/authentication";
import accountModule from "./account";
import configModule from "./config";
import countryModule from "./country";
import fxModule from "./fx";
import institutionModule from "./institution";
import institutionBankInfoModule from "./institutionBankInfo";
import levelConfigModule from "./levelConfig";
import paymentChannelModule from "./paymentChannel";
import transactionModule from "./transaction";

const rootModule = new GraphQLModule({
    imports: [
        transactionModule,
        fxModule,
        accountModule,
        countryModule,
        paymentChannelModule,
        configModule,
        institutionModule,
        levelConfigModule,
        institutionBankInfoModule,
    ],
    context: authResolver,
});

export default rootModule;
