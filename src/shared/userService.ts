import BankInfo from "@shared/bankInfo";
import Recipient from "@shared/recipient";
import User from "@shared/user";
import { gql, GraphQLClient } from "graphql-request";

export async function getRecipient(recipientId: string): Promise<Recipient | null> {
    const query = gql`
            query recipient($recipientId: String!) {
                recipient(id: $recipientId) {
                    id
                    userId
                    name
                    email
                    phoneNumber
                    location
                    createdAt
                    updatedAt
                    deletedAt
                }
            }
        `;

    const graphQLClient = new GraphQLClient(process.env.BEVEL_USER_SERVICE!, { headers: { apiKey: process.env.BEVEL_USER_API_KEY! } });
    const response = await graphQLClient.request(query, { recipientId });

    return response.recipient;
}

export async function getRecipients(recipientIds: Array<string>): Promise<Array<Recipient> | null> {
    const query = gql`
            query getRecipientsByIds($recipientIds: [String!]!) {
                getRecipientsByIds(recipientIds: $recipientIds) {
                    id
                    userId
                    name
                    email
                    phoneNumber
                    location
                    createdAt
                    updatedAt
                    deletedAt
                }
            }
        `;

    const graphQLClient = new GraphQLClient(process.env.BEVEL_USER_SERVICE!, { headers: { apiKey: process.env.BEVEL_USER_API_KEY! } });
    const response = await graphQLClient.request(query, { recipientIds });

    return response.getRecipientsByIds;
}

export async function getUser(userId: string): Promise<User | null> {
    const query = gql`
            query userByAdmin($userId: String!) {
                userByAdmin(id: $userId) {
                    id
                    firstName
                    lastName
                    email
                    phoneNumber
                    userType
                    createdAt
                    updatedAt
                    deletedAt
                    userVerification {
                        level
                        isEmailVerified
                        isPhoneNumberVerified
                        isUtilityBillVerified
                    }
                    regularAccountDetail {
                        city
                        address
                        countryId
                        postalCode
                    }
                    studentAccountDetail {
                        countryId
                        institutionId
                    }
                    userKyc {
                        isVerified
                    }
                }
            }
        `;

    const graphQLClient = new GraphQLClient(process.env.BEVEL_USER_SERVICE!, { headers: { apiKey: process.env.BEVEL_USER_API_KEY! } });
    const response = await graphQLClient.request(query, { userId });

    return response.userByAdmin;
}

export async function getBankInfo(bankInfoId: string): Promise<BankInfo | null> {
    const query = gql`
            query bankInfo($bankInfoId: String!) {
                bankInfo(id: $bankInfoId) {
                    id
                    recipientId
                    bank
                    accountNumber
                    bankCode
                }
            }
        `;

    const graphQLClient = new GraphQLClient(process.env.BEVEL_USER_SERVICE!, { headers: { apiKey: process.env.BEVEL_USER_API_KEY! } });
    const response = await graphQLClient.request(query, { bankInfoId });

    return response.bankInfo;
}
