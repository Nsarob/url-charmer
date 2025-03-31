import dotenv from 'dotenv';

dotenv.config({ path: `.env` });

export const {
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_HOST_LIVE,
  DB_PORT,
  DB_NAME,
  DB_DIALECT,
  POOL_MAX,
  POOL_IDLE,
} = {...process.env } as { [key: string]: string };
