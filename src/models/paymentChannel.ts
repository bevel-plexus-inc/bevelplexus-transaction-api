import { PaymentType } from "@shared/types";
import { DataTypes, Model } from "sequelize";
import Country from "./country";
import seq from "./index";
import PaymentProperty from "./paymentProperties";

export default class PaymentChannel extends Model {
    id: string;

    paymentType: PaymentType;

    countryId: string;

    header: string;

    readonly createdAt: Date;

    readonly updatedAt: Date;

    country: Country;

    paymentProperties: Array<PaymentProperty>;
}

PaymentChannel.init({
    id: {
        type:         DataTypes.UUID,
        primaryKey:   true,
        allowNull:    false,
        defaultValue: DataTypes.UUIDV4,
    },
    countryId: {
        type:       DataTypes.UUID,
        allowNull:  false,
        references: {
            model: "countries",
            key:   "id",
        },
        onUpdate: "CASCADE",
        onDelete: "NO ACTION",
    },
    header: {
        allowNull: false,
        type:      DataTypes.STRING,
    },
    paymentType: {
        allowNull: false,
        type:      DataTypes.ENUM("Bank", "ETransfer"),
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
    tableName:   "payment_channels",
    timestamps:  true,
    underscored: true,
});

Country.hasMany(PaymentChannel, { as: "paymentChannels", foreignKey: "countryId" });
PaymentChannel.belongsTo(Country, { as: "country", foreignKey: "countryId" });
PaymentChannel.hasMany(PaymentProperty, { as: "paymentProperties" });
PaymentProperty.belongsTo(PaymentChannel, { as: "paymentChannel", foreignKey: "paymentChannelId" });
