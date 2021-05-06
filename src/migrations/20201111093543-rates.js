module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable("transfer_fees", {
        id: {
            type:          Sequelize.UUID,
            primaryKey:    true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4
        },
        send_currency: {
            type:      Sequelize.STRING,
            allowNull: false,
        },
        destination_currency: {
            type:      Sequelize.STRING,
            allowNull: false,
        },
        product: {
            type:      Sequelize.STRING,
            allowNull: false,
        },
        fee: {
            type:      Sequelize.FLOAT,
            allowNull: false,
        },
        rate: {
            type:      Sequelize.FLOAT,
            allowNull: false,
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

    down: queryInterface => queryInterface.dropTable("transfer_fees"),
};
