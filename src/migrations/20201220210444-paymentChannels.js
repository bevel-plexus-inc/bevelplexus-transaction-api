module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable("payment_channels", {
        id: {
            type:          Sequelize.UUID,
            primaryKey:    true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4
        },
        country_id: {
            type:      Sequelize.UUID,
            allowNull: false,
            references: {
                model: "countries",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        payment_type: {
            allowNull:    false,
            type:         Sequelize.ENUM('Bank', 'ETransfer'),
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
    }),

    down: queryInterface => queryInterface.dropTable("payment_channels"),
};
