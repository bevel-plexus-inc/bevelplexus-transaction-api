const uuid = require("uuid").v4;

module.exports = {
    up: queryInterface => queryInterface.bulkInsert("configs", [
        {
            default_account_number: "123456789",
            default_account_name:   "Default",
            id:                     uuid(),
            created_at:             new Date(),
            updated_at:             new Date(),
        },
    ]),

    down: queryInterface => queryInterface.bulkDelete("configs", null, {}),
};
