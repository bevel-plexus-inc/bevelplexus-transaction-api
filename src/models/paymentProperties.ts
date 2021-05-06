import { DataTypes, Model } from "sequelize";
import seq from "./index";

export default class PaymentProperty extends Model {
    id: string;

    label: string;

    value: string;

    paymentChannelId: string;

    readonly createdAt: Date;

    readonly updatedAt: Date;
}

PaymentProperty.init({
    id: {
        type:         DataTypes.UUID,
        primaryKey:   true,
        allowNull:    false,
        defaultValue: DataTypes.UUIDV4,
    },
    paymentChannelId: {
        type:       DataTypes.UUID,
        allowNull:  false,
        references: {
            model: "payment_channels",
            key:   "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },
    label: {
        allowNull: false,
        type:      DataTypes.STRING,
    },
    value: {
        allowNull: false,
        type:      DataTypes.STRING,
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
    tableName:   "payment_properties",
    timestamps:  true,
    underscored: true,
});
