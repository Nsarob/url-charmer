// migrate.js
import { Sequelize } from "sequelize";
import { Umzug, SequelizeStorage } from "umzug";
import { dbCredentialsFactory } from "../CredentialsManager";
// import fs from "fs";
import path from "path";

async function runMigrations() {
  try {
    // Fetch database credentials
    const credentials = await dbCredentialsFactory().getDBCredentials();

    // Read SSL certificate
    // const caCert = fs.readFileSync(
    //   path.resolve(__dirname, "..", "certs", "US-East-1-Bundle.pem")
    // );

    const migrationsPath = path.resolve(__dirname, "../../migrations/*.js");
    console.log(migrationsPath);

    // Initialize Sequelize with SSL options
    const sequelize = new Sequelize(
      credentials.database,
      credentials.username,
      credentials.password,
      {
        host: credentials.host,
        port: credentials.port,
        dialect: credentials.dialect,
        // TODO: Uncomment this when we are in production
        // dialectOptions: {
        //   ssl: {
        //     require: false,
        //     ca: caCert.toString(),
        //   },
        // },
      }
    );

    // Initialize Umzug
    const umzug = new Umzug({
      migrations: {
        glob: migrationsPath,
        resolve: ({ name, path, context }) => {
          // adjust the migration parameters Umzug will
          // pass to migration methods, this is done because
          // Sequilize-CLI generates migrations that require
          // two parameters be passed to the up and down methods
          // but by default Umzug will only pass the first
          const migration = require(path || "");
          return {
            name,
            up: async () => migration.up(context, Sequelize),
            down: async () => migration.down(context, Sequelize),
          };
        },
      },
      context: sequelize.getQueryInterface(),
      storage: new SequelizeStorage({ sequelize }),
      logger: console,
    });

    // Run pending migrations
    await umzug.up();
    console.log("Migrations completed successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

runMigrations();
