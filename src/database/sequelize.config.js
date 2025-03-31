// src/database/sequelize.config.js
require("ts-node/register");
const configs = require("../config/database");
const { dbCredentialsFactory } = require("./connection/CredentialsManager");

const getCredentials = async () => {
  const credentials = await dbCredentialsFactory().getDBCredentials();

  console.log("Production credentials", credentials);

  return {
    username: credentials.username,
    password: credentials.password,
    database: credentials.database,
    host: credentials.host,
    dialect: "postgres",
    port: credentials.port,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  };
};
console.log("Local configs", configs);

module.exports = async () => ({
  development: {
    username: configs.DB_USERNAME,
    password: String(configs.DB_PASSWORD),
    database: configs.DB_NAME,
    host: configs.DB_HOST,
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
  production: await getCredentials(),
});
