import { DataTypes, Model } from "sequelize";
import seq from "./index";

export default class Country extends Model {
    id: string;

    countryCode: string;

    currencyCode: string;

    name: string;

    readonly createdAt: Date;

    readonly updatedAt: Date;

    readonly deletedAt?: Date;
}

Country.init({
    id: {
        type:         DataTypes.UUID,
        primaryKey:   true,
        allowNull:    false,
        defaultValue: DataTypes.UUIDV4,
    },
    countryCode: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    currencyCode: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    name: {
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
    sequelize:   seq,
    tableName:   "countries",
    timestamps:  true,
    paranoid:    true,
    underscored: true,
});
