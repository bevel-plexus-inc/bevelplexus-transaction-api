module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable("level_configs", {
        id: {
            type:          Sequelize.UUID,
            primaryKey:    true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4
        },
        level: {
            type:      Sequelize.INTEGER,
            allowNull: false,
        },
        daily_limit: {
            type:      Sequelize.INTEGER,
            allowNull: false,
        },
        monthly_limit: {
            type:      Sequelize.INTEGER,
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

    down: queryInterface => queryInterface.dropTable("level_configs"),
};
