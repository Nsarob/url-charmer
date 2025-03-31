import {
  DB_NAME,
  DB_PASSWORD,
  DB_USERNAME,
  DB_HOST,
  DB_PORT,
} from "../../../config/database";
import { DBConfiguration } from "../connection.schema";

class DBCredentials {
  getDBCredentials(): DBConfiguration | Promise<DBConfiguration> {
    throw new Error("Method not implemented.");
  }
}

class LocalCredentials extends DBCredentials {
  getDBCredentials(): DBConfiguration {
    return {
      database: DB_NAME,
      username: DB_USERNAME,
      password: DB_PASSWORD,
      host: DB_HOST,
      port: parseInt(DB_PORT),
      dialect: "postgres",
    };
  }
}

export const dbCredentialsFactory = (): DBCredentials => {
  return new LocalCredentials();
};
