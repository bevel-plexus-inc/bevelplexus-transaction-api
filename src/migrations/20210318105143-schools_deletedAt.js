module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.addColumn("institutions", "deleted_at", {
        allowNull:    true,
        type:         Sequelize.DATE,
    }),

    down: queryInterface => queryInterface.removeColumn("institutions", "deleted_at"),
};
