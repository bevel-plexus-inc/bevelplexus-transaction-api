import { DataTypes, Model } from "sequelize";
import Country from "./country";
import seq from "./index";
import InstitutionBankInfo from "./institutionBankInfo";

export default class Institution extends Model {
    id: string;

    name: string;

    city: string;

    countryId: string;

    readonly createdAt: Date;

    readonly updatedAt: Date;

    readonly deletedAt?: Date;

    country: Country;

    institutionBankInfo?: InstitutionBankInfo;
}

Institution.init({
    id: {
        type:         DataTypes.UUID,
        primaryKey:   true,
        allowNull:    false,
        defaultValue: DataTypes.UUIDV4,
    },
    name: {
        type:      DataTypes.STRING,
        allowNull: false,
    },
    city: {
        type:      DataTypes.STRING,
        allowNull: false,
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
    tableName:   "institutions",
    timestamps:  true,
    underscored: true,
    paranoid:    true,
});

Country.hasMany(Institution, { as: "institutions" });
InstitutionBankInfo.belongsTo(Institution, { as: "institution" });
Institution.belongsTo(Country, { as: "country", foreignKey: "countryId" });
Institution.hasOne(InstitutionBankInfo, { as: "institutionBankInfo", foreignKey: "institutionId" });
