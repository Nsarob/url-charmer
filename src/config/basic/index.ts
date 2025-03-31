import dotenv from 'dotenv';

dotenv.config({ path: `.env` });

export const {
  SESSION_SECRET,
  FRONTEND_URL,
  NODE_ENV,
  APP_PORT,
  JWT_SECRET,
} = {...process.env } as { [key: string]: string };
