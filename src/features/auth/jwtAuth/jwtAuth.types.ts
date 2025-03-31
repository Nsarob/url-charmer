import { z } from 'zod';


export const loginSchema = z.object({
    body: z.object({
        username: z.string().min(1, "Username is required"),
        password: z.string().min(1, "Password is required"),
    })
});

export const registerSchema = z.object({
  body: z.object({
    username: z.string().min(1, "Username is required"),
    email: z.string().email("A valid email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  })
});


// Infer types from schemas
export type LoginBodyInput = z.infer<typeof loginSchema>;
export type RegisterBodyInput = z.infer<typeof registerSchema>;