import { mockBankInfo, mockRecipient, mockUser } from "../../test/mockData";
import BankInfo from "../bankInfo";
import Recipient from "../recipient";
import User from "../user";

export function getRecipient(recipientId: string): Recipient {
    return mockRecipient;
}

export function getUser(userId: string): User {
    return mockUser;
}

export async function getBankInfo(bankInfoId: string): Promise<BankInfo | null> {
    return mockBankInfo;
}
