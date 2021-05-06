module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable("accounts", {
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
        quidax_id: {
            type:      Sequelize.STRING,
            allowNull: false,
        },
        quidax_sn: {
            type:      Sequelize.STRING,
            allowNull: false,
        },
        quidax_reference: {
            type:      Sequelize.STRING,
            allowNull: true,
        },
        quidax_display_name: {
            type:      Sequelize.STRING,
            allowNull: true,
        },
        first_name: {
            type:      Sequelize.STRING,
            allowNull: false,
        },
        last_name: {
            type:      Sequelize.STRING,
            allowNull: false,
        },
        email: {
            type:      Sequelize.STRING,
            allowNull: false,
        },
        account_number: {
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

    down: queryInterface => queryInterface.dropTable("accounts"),
};
