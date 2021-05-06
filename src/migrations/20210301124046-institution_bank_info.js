module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable("institution_bank_infos", {
        id: {
            type:          Sequelize.UUID,
            primaryKey:    true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4
        },
        institution_id: {
            type:      Sequelize.UUID,
            allowNull: false,
            references: {
                model: "institutions",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        bank: {
            type:      Sequelize.STRING,
            allowNull: false,
        },
        account_number: {
            type:      Sequelize.STRING,
            allowNull: false,
        },
        bank_code: {
            type:      Sequelize.STRING,
            allowNull: false,
        },
        transit_or_sort_code: {
            type:      Sequelize.STRING,
            allowNull: true,
        },
        created_at: {
            allowNull:    false,
            type:         Sequelize.DATE,
            defaultValue: Sequelize.NOW,
        },
        updated_at: {
            allowNull:    false,
            type:         Sequelize.DATE,
            defaultValue: Sequelize.NOW,
        },
        deleted_at: {
            allowNull:    true,
            type:         Sequelize.DATE
        },
    }),

    down: queryInterface => queryInterface.dropTable("institution_bank_infos"),
};
