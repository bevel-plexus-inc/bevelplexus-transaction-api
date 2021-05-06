import { ReceiveType, TransactionType } from "../shared/types";

export const mockAccount = {
    userId:    "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b",
    email:     "mock@mock.com",
    firstName: "firstName",
    lastName:  "lastName",
};

export const mockAccountResponse = {
    userId:        "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b",
    email:         "mock@mock.com",
    firstName:     "firstName",
    lastName:      "lastName",
    accountNumber: "1234567890",
    quidaxId:      "1234567890",
    quidaxSn:      "1234567890",
};

export const mockConfig = {
    defaultAccountNumber: "1234567890",
    defaultAccountName:   "1234567890",
};

export const mockTransferSameDay = {
    sendCurrency:        "NGN",
    destinationCurrency: "USD",
    fee:                 56,
    rate:                356,
    product:             ReceiveType.SameDay,
};

export const mockTransferDelayed = {
    sendCurrency:        "NGN",
    destinationCurrency: "CAD",
    fee:                 23,
    rate:                235,
    product:             ReceiveType.Delayed,
};

export const mockFx = {
    sendCurrency:        "NGN",
    destinationCurrency: "USD",
    baseAmount:          200.5,
    receiveType:         ReceiveType.SameDay,
};

export const mockUser = {
    id:          "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b",
    firstName:   "firstName",
    lastName:    "lastName",
    email:       "email@email.com",
    phoneNumber: "phoneNumber",
    userType:    "Regular",
    createdAt:   new Date(),
    updatedAt:   new Date(),
};

export const mockRecipient = {
    id:          "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b",
    userId:      "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b",
    name:        "name",
    email:       "email@email.com",
    phoneNumber: "phoneNumber",
    location:    "Nigeria",
    createdAt:   new Date(),
    updatedAt:   new Date(),
};

export const mockBankInfo = {
    id:            "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b",
    recipientId:   "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b",
    bank:          "bank",
    accountNumber: "accountNumber",
};

export const mockTransactionData = {
    bankInfoId:          "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b",
    recipientId:         "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b",
    userId:              "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b",
    sendCurrency:        "NGN",
    destinationCurrency: "USD",
    baseAmount:          200.5,
    receiveType:         ReceiveType.SameDay,
    transactionType:     TransactionType.Individual,
};

export const mockTransactionRawData = {
    bankInfoId:          "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b",
    recipientId:         "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b",
    userId:              "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b",
    sendCurrency:        "NGN",
    destinationCurrency: "USD",
    baseAmount:          200.5,
    receiveType:         ReceiveType.SameDay,
    transactionType:     TransactionType.Individual,
    fee:                 34,
    actualAmount:        200,
    convertedAmount:     3000,
    rate:                20,
    status:              "In Progress",
};

export const mockTransactionDataResponse = {
    bankInfoId:          "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b",
    recipientId:         "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b",
    userId:              "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b",
    bank:                "bank",
    accountNumber:       "accountNumber",
    sendCurrency:        "NGN",
    destinationCurrency: "USD",
    baseAmount:          200.5,
    receiveType:         ReceiveType.SameDay,
    transactionType:     TransactionType.Individual,
};
