module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.changeColumn("payment_properties", "payment_channel_id", {
        type:      Sequelize.UUID,
        allowNull: false,
        references: {
            model: "payment_channels",
            key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    }),

    down: queryInterface => queryInterface.changeColumn("payment_properties", "payment_channel_id", {
        type:      Sequelize.UUID,
        allowNull: false,
        references: {
            model: "payment_channels",
            key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "NO ACTION",
    }),
};
