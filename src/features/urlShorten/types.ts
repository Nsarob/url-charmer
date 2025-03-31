/*
 types.ts
 description: This file contains the types for the users
 author: damour nsanzimfura<blaiseniyonkuru12@gmail.com>
*/

import { z } from 'zod';

export const shortenURLSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    url: z.string().url("A valid URL is required"),
    shortened_url: z.string().optional(),
    short_code: z.string().optional(),
  })
});


// Infer types from schemas
export type ShortenURLBodyInput = z.infer<typeof shortenURLSchema>;