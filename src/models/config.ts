import { DataTypes, Model } from "sequelize";
import seq from "./index";

export default class Config extends Model {
    id: string;

    defaultAccountNumber: string;

    defaultAccountName: string;

    minimumSendAmount: number;

    readonly createdAt: Date;

    readonly updatedAt: Date;
}

Config.init({
    id: {
        type:         DataTypes.UUID,
        primaryKey:   true,
        allowNull:    false,
        defaultValue: DataTypes.UUIDV4,
    },
    defaultAccountNumber: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    defaultAccountName: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    minimumSendAmount: {
        type:         DataTypes.FLOAT,
        allowNull:    false,
        defaultValue: 500,
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
    tableName:   "configs",
    timestamps:  true,
    underscored: true,
});
