module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.addColumn("countries", "deleted_at", {
        allowNull:    true,
        type:         Sequelize.DATE,
    }),

    down: queryInterface => queryInterface.removeColumn("countries", "deleted_at"),
};
