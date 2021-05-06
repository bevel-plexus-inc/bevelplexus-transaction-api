import { DataTypes, Model } from "sequelize";
import seq from "./index";

export default class Account extends Model {
    id: string;

    accountNumber: string;

    userId: string;

    email: string;

    quidaxId: string;

    quidaxSn: string;

    quidaxReference?: string;

    quidaxDisplayName?: string;

    firstName: string;

    lastName: string;

    readonly createdAt: Date;

    readonly updatedAt: Date;

    readonly deletedAt: Date;
}

Account.init({
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
    quidaxId: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    quidaxSn: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    quidaxReference: {
        type:      DataTypes.STRING,
        allowNull: true,
    },
    quidaxDisplayName: {
        type:      DataTypes.STRING,
        allowNull: true,
    },
    firstName: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    accountNumber: {
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
    tableName:   "accounts",
    timestamps:  true,
    underscored: true,
});
