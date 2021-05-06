module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.addColumn("configs", "minimum_send_amount", {
        allowNull:    false,
        type:         Sequelize.FLOAT,
        defaultValue: 500,
    }),

    down: queryInterface => queryInterface.removeColumn("configs", "minimum_send_amount"),
};
