import { EmailArgs } from "../types";

export function notificationEmailRequest(emailArgs: EmailArgs): void {
    // noop
}

export function notificationSMSRequest(smsArgs: { phoneNumber: string, body: string }): void {
    // noop
}
