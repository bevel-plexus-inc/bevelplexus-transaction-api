module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable("transactions", {
        id: {
            type:          Sequelize.UUID,
            primaryKey:    true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4
        },
        user_id: {
            type:      Sequelize.STRING,
            allowNull: false,
        },
        recipient_id: {
            type:      Sequelize.STRING,
            allowNull: false,
        },
        bank_info_id: {
            type:      Sequelize.STRING,
            allowNull: false,
        },
        reference: {
            type:      Sequelize.STRING,
            allowNull: false,
        },
        rate: {
            type:      Sequelize.FLOAT,
            allowNull: false,
        },
        fee: {
            type:      Sequelize.FLOAT,
            allowNull: false,
        },
        base_amount: {
            type:      Sequelize.FLOAT,
            allowNull: false,
        },
        actual_amount: {
            type:      Sequelize.FLOAT,
            allowNull: false,
        },
        converted_amount: {
            type:      Sequelize.FLOAT,
            allowNull: false,
        },
        send_currency: {
            type:      Sequelize.STRING,
            allowNull: false,
        },
        destination_currency: {
            type:      Sequelize.STRING,
            allowNull: false,
        },
        status: {
            type:      Sequelize.STRING,
            allowNull: false,
        },
        transaction_type: {
            type:      Sequelize.STRING,
            allowNull: false,
        },
        receive_type: {
            type:      Sequelize.STRING,
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
        deleted_at: {
            allowNull:    true,
            type:         Sequelize.DATE
        },
    }),

    down: queryInterface => queryInterface.dropTable("transactions"),
};
