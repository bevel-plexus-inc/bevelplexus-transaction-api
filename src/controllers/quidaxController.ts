import sentryHttpLogger from "@lib/sentryHttpLogger";
import TransactionProvider from "@modules/transaction/provider";
import * as Sentry from "@sentry/node";
import { TransactionStatus } from "@shared/types";
import { autobind } from "core-decorators";
import { Request, Response } from "express";
import { INTERNAL_SERVER_ERROR, OK } from "http-status-codes";

enum QuidaxEvents {
    WithdrawalSuccessful = "withdraw.successful",
    WithdrawalCancelled = "withdraw.cancelled",
    WithdrawalRejected = "withdraw.rejected",
}

function getStatus(event: QuidaxEvents): TransactionStatus | null {
    const eventToStatus = {
        [QuidaxEvents.WithdrawalSuccessful]: TransactionStatus.TransferCompleted,
        [QuidaxEvents.WithdrawalCancelled]:  TransactionStatus.FundTransferCancelled,
        [QuidaxEvents.WithdrawalRejected]:   TransactionStatus.FundTransferFailed,
    };

    return eventToStatus[event] || null;
}

export default class QuidaxController {
    @autobind
    async eventListener(req: Request, res: Response): Promise<Response> {
        try {
            const { account_number: accountNumber } = req.body.data.recipient.details;
            const quidaxId = req.body.data.id;
            const transactionProvider = new TransactionProvider();
            const status = getStatus(req.body.event);
            if (!status) {
                throw new Error("Event not for bevel plexus");
            }
            await transactionProvider.updateTransactionQuidax(accountNumber, quidaxId, status);

            return res.status(OK).json({ success: true });
        } catch (e) {
            sentryHttpLogger(e, req);

            return res.status(INTERNAL_SERVER_ERROR).json({ success: false });
        }
    }
}
