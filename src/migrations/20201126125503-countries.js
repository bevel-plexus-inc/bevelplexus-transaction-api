module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable("countries", {
        id: {
            type:          Sequelize.UUID,
            primaryKey:    true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4
        },
        currency_code: {
            type:      Sequelize.STRING,
            allowNull: false,
        },
        country_code: {
            type:      Sequelize.STRING,
            allowNull: false,
        },
        name: {
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

    down: queryInterface => queryInterface.dropTable("countries"),
};
