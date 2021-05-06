module.exports = {
    up: (queryInterface, Sequelize) => Promise.all([
        queryInterface.addColumn("transactions", "conversion_reference", {
            allowNull:    false,
            type:      Sequelize.FLOAT,
        }),
        queryInterface.addColumn("transactions", "account_number", {
            allowNull:    false,
            type:      Sequelize.STRING,
        }),
        queryInterface.addColumn("transactions", "quidax_id", {
            allowNull:    true,
            type:      Sequelize.STRING,
        }),
    ]),

    down: queryInterface => Promise.all([
        queryInterface.removeColumn("transactions", "conversion_reference"),
        queryInterface.removeColumn("transactions", "account_number"),
        queryInterface.removeColumn("transactions", "quidax_id"),
    ])
};
