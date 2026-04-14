/**
 * Authentication Middleware
 * Verifies the JWT access token from the Authorization header.
 * Attaches the decoded user payload to req.user for downstream use.
 */
import { Request, Response, NextFunction } from 'express';
import { AppError } from '@repo/shared-utils';
import { verifyAccessToken } from '../utils/jwt.util.js';

/**
 * Middleware that enforces authentication on protected routes.
 * Expects: Authorization: Bearer <access_token>
 *
 * On success: populates req.user with { userId, role, email }
 * On failure: throws 401 UNAUTHORIZED
 */
export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Authentication required', {
      statusCode: 401,
      code: 'MISSING_TOKEN',
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    throw new AppError('Authentication required', {
      statusCode: 401,
      code: 'MISSING_TOKEN',
    });
  }

  // verifyAccessToken throws AppError(401) on invalid/expired tokens
  const payload = verifyAccessToken(token);
  req.user = payload;

  next();
}
