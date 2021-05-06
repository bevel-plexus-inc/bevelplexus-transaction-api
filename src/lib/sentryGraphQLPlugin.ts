import * as Sentry from "@sentry/node";
import { GraphQLRequestContext } from "apollo-server-plugin-base";

export default {
    requestDidStart(requestContext: GraphQLRequestContext<any>): {didEncounterErrors(ctx: any): void} {
        return {
            didEncounterErrors(ctx: any): void {
                if (!ctx.operation) {
                    return;
                }

                // eslint-disable-next-line no-restricted-syntax
                for (const err of ctx.errors) {
                    Sentry.withScope(scope => {
                        let errorLevel = Sentry.Severity.Error;

                        if (err.extensions && err.extensions.code && (err.extensions.code === "BAD_USER_INPUT"
                            || err.extensions.code === "GRAPHQL_VALIDATION_FAILED"
                            || err.extensions.code === "UNAUTHENTICATED"
                        )) {
                            errorLevel = Sentry.Severity.Debug;
                        }

                        scope.setLevel(errorLevel);
                        scope.setTag("level", errorLevel);
                        scope.setTag("kind", ctx.operation.operation);
                        scope.setExtra("query", ctx.request.query);
                        scope.setExtra("variables", ctx.request.variables);

                        if (err.path) {
                            scope.addBreadcrumb({
                                category: "query-path",
                                message:  err.path.join(" > "),
                                level:    Sentry.Severity.Debug,
                            });
                        }

                        const transactionId = ctx.request.http.headers.get("x-transaction-id");
                        if (transactionId) {
                            scope.setTransactionName(transactionId);
                        }

                        Sentry.captureException(err);
                    });
                }
            },
        };
    },

};
