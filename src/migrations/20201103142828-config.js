module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable("configs", {
        id: {
            type:          Sequelize.UUID,
            primaryKey:    true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4
        },
        default_account_number: {
            type:      Sequelize.STRING,
            allowNull: false,
        },
        default_account_name: {
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
    }),

    down: queryInterface => queryInterface.dropTable("configs"),
};
