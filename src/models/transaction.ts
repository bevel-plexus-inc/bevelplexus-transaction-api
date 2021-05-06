import Institution from "@models/institution";
import BankInfo from "@shared/bankInfo";
import Recipient from "@shared/recipient";
import { ReceiveType, TransactionStatus, TransactionType } from "@shared/types";
import User from "@shared/user";
import { DataTypes, Model } from "sequelize";
import seq from "./index";

export default class Transaction extends Model {
    id: string;

    userId: string;

    recipientId: string;

    bankInfoId: string;

    reference: string;

    rate: number;

    fee: number;

    baseAmount: number;

    actualAmount: number;

    convertedAmount: number;

    conversionReference: number;

    quidaxId?: string;

    accountNumber: string;

    sendCurrency: string;

    destinationCurrency: string;

    status: TransactionStatus;

    transactionType: TransactionType;

    receiveType: ReceiveType;

    readonly createdAt: Date;

    readonly updatedAt: Date;

    readonly deletedAt: Date;

    recipient?: Recipient;

    bankInfo: BankInfo;

    institution?: Institution;

    user: User;
}

Transaction.init({
    id: {
        type:         DataTypes.UUID,
        primaryKey:   true,
        allowNull:    false,
        defaultValue: DataTypes.UUIDV4,
    },
    userId: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    recipientId: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    bankInfoId: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    reference: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    conversionReference: {
        type:      DataTypes.FLOAT,
        allowNull: false,
    },
    accountNumber: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    quidaxId: {
        type:      DataTypes.STRING,
        allowNull: true,
    },
    rate: {
        type:      DataTypes.FLOAT,
        allowNull: false,
    },
    fee: {
        type:      DataTypes.FLOAT,
        allowNull: false,
    },
    baseAmount: {
        type:      DataTypes.FLOAT,
        allowNull: false,
    },
    actualAmount: {
        type:      DataTypes.FLOAT,
        allowNull: false,
    },
    convertedAmount: {
        type:      DataTypes.FLOAT,
        allowNull: false,
    },
    sendCurrency: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    destinationCurrency: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    transactionType: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    receiveType: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        allowNull:    false,
        type:         DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        allowNull:    false,
        type:         DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    deletedAt: {
        allowNull: true,
        type:      DataTypes.DATE,
    },
}, {
    paranoid:    true,
    sequelize:   seq,
    tableName:   "transactions",
    timestamps:  true,
    underscored: true,
});
