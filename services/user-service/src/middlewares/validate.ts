/**
 * Zod Validation Middleware
 * Generic middleware factory that validates request data against a Zod schema.
 * Replaces req[source] with the parsed (cleaned) data on success.
 */
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { logger } from '../config/logger.js';

type ValidationSource = 'body' | 'query' | 'params';

/**
 * Creates a middleware that validates the specified request source against a Zod schema.
 * @param schema - The Zod schema to validate against
 * @param source - Which part of the request to validate (body, query, or params)
 *
 * @example
 * router.post('/register', validate(registerSchema, 'body'), controller.register);
 */

export const validate = (
  schema: ZodSchema,
  source: ValidationSource = 'body'
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: result.error.errors.map((e) => ({
          field: e.path.join('.'), //['body','email'] => 'body.email'
          message: e.message,
        })),
      });
    }

    req[source] = result.data;
    next();
  };
};
