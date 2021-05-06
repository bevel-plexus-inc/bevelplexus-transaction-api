module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable("payment_properties", {
        id: {
            type:          Sequelize.UUID,
            primaryKey:    true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4
        },
        payment_channel_id: {
            type:      Sequelize.UUID,
            allowNull: false,
            references: {
                model: "payment_channels",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "NO ACTION",
        },
        label: {
            allowNull:    false,
            type:         Sequelize.STRING,
        },
        value: {
            allowNull:    false,
            type:         Sequelize.STRING,
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

    down: queryInterface => queryInterface.dropTable("payment_properties"),
};
