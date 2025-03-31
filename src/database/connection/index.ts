import { DBConfiguration } from "./connection.schema";
import { DatabaseConnectionFactory } from "./databaseFactory";

// Create and initialize connection
const placeholderCredentials: DBConfiguration = {
  database: "postgres",
  username: "postgres",
  password: "postgres",
  host: "localhost",
  port: 5432,
  dialect: "postgres",
};
const connection = new DatabaseConnectionFactory(
  placeholderCredentials
).createConnection();

DatabaseConnectionFactory.testConnection(connection);

export default connection;
