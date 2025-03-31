import dotenv from 'dotenv';

dotenv.config({ path: `../../.env.${process.env.NODE_ENV}` });


export const {
  // google
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  CALLBACKURL,
} = {...process.env } as { [key: string]: string };
