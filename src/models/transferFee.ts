import { ReceiveType } from "@shared/types";
import { DataTypes, Model } from "sequelize";
import seq from "./index";

export default class TransferFee extends Model {
    id: string;

    sendCurrency: string;

    destinationCurrency: string;

    product: ReceiveType;

    fee: number;

    rate: number;

    readonly createdAt: Date;

    readonly updatedAt: Date;
}

TransferFee.init({
    id: {
        type:         DataTypes.UUID,
        primaryKey:   true,
        allowNull:    false,
        defaultValue: DataTypes.UUIDV4,
    },
    sendCurrency: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    destinationCurrency: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    product: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    fee: {
        type:      DataTypes.FLOAT,
        allowNull: false,
    },
    rate: {
        type:      DataTypes.FLOAT,
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
}, {
    sequelize:   seq,
    tableName:   "transfer_fees",
    timestamps:  true,
    underscored: true,
});
