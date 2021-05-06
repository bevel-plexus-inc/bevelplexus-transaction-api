import axios from "axios";

interface TransferProps {
    currencyCode: string;
    amount: string;
    bankAccount: string;
    bankCode: string;
    note: string;
    narration: string;
}

interface CreateProps {
    email: string;
    firstName: string;
    lastName: string;
}

interface CreateResponse {
    id: string;
    sn: string;
    email: string;
    reference: string;
    firstName: string;
    lastName: string;
    displayName: string;
    createdAt: string;
    updatedAt: string;
}

export async function createAccount(data: CreateProps): Promise<CreateResponse> {
    if (!process.env.QUIDAX_URL && !process.env.QUIDAX_TOKEN) {
        throw new Error("Internal Server Error: account setup");
    }
    const url = `${process.env.QUIDAX_URL}/users`;
    const response = await axios.post(url, {
        email:      data.email,
        first_name: data.firstName,
        last_name:  data.lastName,
    }, { headers: { AUTHORIZATION: `Bearer ${process.env.QUIDAX_TOKEN}` } });

    return response.data;
}

export async function initiateMoneyTransfer(data: TransferProps): Promise<string> {
    if (!process.env.QUIDAX_URL && !process.env.QUIDAX_TOKEN) {
        throw new Error("Internal Server Error: account setup");
    }
    const url = `${process.env.QUIDAX_URL}/users/me/withdraws/`;
    const response = await axios.post(url, {
        currency:         data.currencyCode,
        amount:           data.amount,
        fund_uid:         data.bankAccount,
        fund_uid2:        data.bankCode,
        transaction_note: data.note,
        narration:        data.narration,
    }, { headers: { AUTHORIZATION: `Bearer ${process.env.QUIDAX_TOKEN}` } });

    return response.data.data.id;
}
