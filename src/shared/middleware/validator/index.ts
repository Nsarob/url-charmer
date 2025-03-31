/*
filename: validator.ts
description: This file contains the middleware for validating the request data
author: damour nsanzimfura
*/

import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from "zod";


type ValidateRequestMiddleware<T extends AnyZodObject> = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void>;


/**
 * Middleware to validate request data against a given Zod schema.
 * @template T - A Zod schema object type
 * @param {T} schema - The Zod schema to validate against
 * @returns {ValidateRequestMiddleware<T>} Middleware function to validate request
 */
export const validate = <T extends AnyZodObject>(
    schema: T
): ValidateRequestMiddleware<T> => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Parse and validate request data using the provided schema
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            // Proceed to the next middleware if validation is successful
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                // Respond with a 400 status code and validation errors if validation fails
                res.status(400).json({
                    status: "fail",
                    errors: error.errors,
                });
                return;
            }
            // Pass unexpected errors to the next error handling middleware
            next(error);
        }
    };
};

export default validate;