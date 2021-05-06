import Seq from "sequelize";

const {
    DEV_DATABASE_NAME, DEV_DATABASE_USER, DEV_DATABASE_PASSWORD,
    DEV_DATABASE_HOST, TEST_DATABASE_NAME, TEST_DATABASE_USER, TEST_DATABASE_PASSWORD,
    TEST_DATABASE_HOST, PROD_DATABASE_NAME, PROD_DATABASE_USER, PROD_DATABASE_PASSWORD,
    PROD_DATABASE_HOST, NODE_ENV,
} = process.env;

const devSequelize = new Seq.Sequelize(DEV_DATABASE_NAME!, DEV_DATABASE_USER!, DEV_DATABASE_PASSWORD, {
    dialect: "mariadb",
    host:    DEV_DATABASE_HOST,
    logging: false,
    pool:    {
        acquire: 30000,
        idle:    10000,
        max:     5,
        min:     0,
    },
    dialectOptions: { timezone: "Etc/GMT+1" },
});

const prodSequelize = new Seq.Sequelize(PROD_DATABASE_NAME!, PROD_DATABASE_USER!, PROD_DATABASE_PASSWORD, {
    dialect: "mariadb",
    host:    PROD_DATABASE_HOST,
    logging: false,
    pool:    {
        acquire: 30000,
        idle:    10000,
        max:     5,
        min:     0,
    },
    dialectOptions: { timezone: "Etc/GMT+1" },
});

const testSequelize = new Seq.Sequelize(TEST_DATABASE_NAME!, TEST_DATABASE_USER!, TEST_DATABASE_PASSWORD, {
    dialect: "mariadb",
    host:    TEST_DATABASE_HOST,
    logging: false,
    pool:    {
        acquire: 30000,
        idle:    10000,
        max:     5,
        min:     0,
    },
    dialectOptions: { timezone: "Etc/GMT+1" },
});

interface PrefixType {
    [key: string]: any;
}

const prefix: PrefixType = {
    development: devSequelize,
    production:  prodSequelize,
    test:        testSequelize,
};

const nodeEnv = NODE_ENV || "development";
export default prefix[nodeEnv];
