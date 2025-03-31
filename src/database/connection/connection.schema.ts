import { z } from "zod";

// Define a schema to validate the configuration
const configSchema = z.object({
  username: z.string().min(1, "Username is required."),
  password: z.string().min(1, "Password is required."),
  database: z.string().min(1, "Database name is required."),
  host: z.string().min(1, "Host is required."),
  port: z.number().min(1, "Port is required."),
  dialect: z.enum(["postgres", "mysql", "sqlite", "mariadb", "mssql"], {
    errorMap: () => ({
      message:
        "Invalid dialect. Must be one of: postgres, mysql, sqlite, mariadb, mssql.",
    }),
  }).optional(),
  logging: z.boolean().optional(), // Optional logging flag
  poolMax: z.number().optional(),
  poolIdle: z.number().optional(),
  retry: z.number().optional(),
});

export type DBConfiguration = z.infer<typeof configSchema>;