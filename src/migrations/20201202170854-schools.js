module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable("institutions", {
        id: {
            type:          Sequelize.UUID,
            primaryKey:    true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4
        },
        name: {
            type:      Sequelize.STRING,
            allowNull: false,
        },
        city: {
            type:      Sequelize.STRING,
            allowNull: false,
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

    down: queryInterface => queryInterface.dropTable("institutions"),
};
