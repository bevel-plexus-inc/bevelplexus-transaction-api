module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.addColumn("payment_channels", "header", {
        allowNull:    false,
        type:         Sequelize.STRING,
        defaultValue: "ss",
    }),

    down: queryInterface => queryInterface.removeColumn("payment_channels", "header"),
};
