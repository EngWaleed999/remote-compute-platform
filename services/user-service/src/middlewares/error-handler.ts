/**
 * Centralized Error Handler Middleware
 * Catches all errors in the Express pipeline and returns structured JSON responses.
 * - AppError: returns the specified statusCode, code, and message
 * - Unknown errors: returns 500 with a generic message (no leak of internals)
 */
import { Request, Response, NextFunction } from 'express';
import { AppError } from '@repo/shared-utils';
import { logger } from '../config/logger.js';

/**
 * Express error-handling middleware (must have 4 parameters).
 * Place this LAST in the middleware chain.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Handle known operational errors
  if (err instanceof AppError) {
    logger.warn({
      message: err.message,
      code: err.code,
      statusCode: err.statusCode,
      stack: err.stack,
    });

    // Check if validation details are embedded in the name field
    let details: unknown = undefined;
    try {
      if (err.name && err.name !== 'AppError') {
        details = JSON.parse(err.name);
      }
    } catch {
      // name wasn't JSON — ignore
    }

    res.status(err.statusCode).json({
      error: err.code,
      message: err.message,
      ...(details ? { details } : {}),
    });
    return;
  }

  // Handle unknown / unexpected errors
  logger.error({
    message: err.message || 'Unexpected error',
    stack: err.stack,
  });

  res.status(500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred',
  });
}
