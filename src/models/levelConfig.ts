import { DataTypes, Model } from "sequelize";
import seq from "./index";

export default class LevelConfig extends Model {
    id: string;

    level: number;

    dailyLimit: number;

    monthlyLimit: number;

    readonly createdAt: Date;

    readonly updatedAt: Date;
}

LevelConfig.init({
    id: {
        type:         DataTypes.UUID,
        primaryKey:   true,
        allowNull:    false,
        defaultValue: DataTypes.UUIDV4,
    },
    level: {
        type:      DataTypes.INTEGER,
        allowNull: false,
    },
    dailyLimit: {
        type:      DataTypes.INTEGER,
        allowNull: false,
    },
    monthlyLimit: {
        type:      DataTypes.INTEGER,
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
    tableName:   "level_configs",
    timestamps:  true,
    underscored: true,
});
