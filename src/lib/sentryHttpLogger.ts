import * as Sentry from "@sentry/node";

interface Request {
    method: string;
    body: any;
    originalUrl: string;
    headers?: any;
}

export default function sentryHttpLogger(err: Error, req: Request, level?: Sentry.Severity): void {
    Sentry.withScope(scope => {
        scope.setTag("kind", req.method);
        scope.setLevel(level || Sentry.Severity.Error);
        scope.setExtra("body", req.body);
        scope.setExtra("name", err.name);
        scope.setExtra("origin", req.originalUrl);

        const transactionId = req.headers ? req.headers["x-transaction-id"] : null;
        if (transactionId) {
            scope.setTransactionName(transactionId as string);
        }

        Sentry.captureException(err);
    });
}
