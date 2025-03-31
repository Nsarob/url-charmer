import { Dialect, Sequelize } from "sequelize";
import { DBConfiguration } from "../connection.schema";
import { dbCredentialsFactory } from "../CredentialsManager";


/**
 * Database Connection Factory
*/
export class DatabaseConnectionFactory {
  private databaseName: string;
  private username: string;
  private password: string;
  private host: string;
  private port: number;
  private dialect: Dialect;
  private poolMax: number;
  private poolIdle: number;
  private retry: number;

  constructor(dbConfig: DBConfiguration) {
    this.databaseName = dbConfig.database;
    this.username = dbConfig.username;
    this.password = dbConfig.password;
    this.host = dbConfig.host;
    this.port = dbConfig.port;
    this.dialect = dbConfig.dialect ?? "postgres";
    this.poolMax = dbConfig.poolMax ?? 10;
    this.poolIdle = dbConfig.poolIdle ?? 10;
    this.retry = dbConfig.retry ?? 5;
  }

  createConnection() {
    return new Sequelize(this.databaseName, this.username, this.password, {
      host: this.host,
      dialect: this.dialect,
      port: this.port,
      logging: false,
      pool: {
        max: Number(this.poolMax) as unknown as number, // Maximum number of connection in pool
        min: 0,
        acquire: 30000, // Maximum time (in ms) to get a connection before throwing error
        idle: Number(this.poolIdle) as unknown as number, // Maximum idle time (in ms) before releasing a connection
      },
      retry: {
        match: [/Deadlock/i], // Retry only on deadlock error
        max: this.retry,
      },
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      hooks: {
        beforeConnect: async (config: any) => {
          const credentials = await dbCredentialsFactory().getDBCredentials();
          config.password = credentials.password;
          config.username = credentials.username;
          config.database = credentials.database;
          config.host = credentials.host;
          config.port = credentials.port.toString();
        },
      },
    });
  }

  static testConnection(connection: Sequelize) {
    return connection
      .authenticate()
      .then(() => {
        console.log("Connection has been established successfully.");
      })
      .catch((err: any) => {
        console.error("Unable to connect to the database:", err.message);
      });
  }
}
