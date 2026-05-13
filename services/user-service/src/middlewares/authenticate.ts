/**
 * Authentication Middleware
 * Reads the JWT access token from the HttpOnly cookie (not Authorization header).
 * Validates JWT signature + tokenVersion against DB (with Redis cache).
 *
 * Token version check strategy: Cache-Aside (Lazy Loading) via Redis
 * - Check Redis first → if miss → query DB → populate Redis
 * - On tokenVersion bump (password change, delete, restore) → Redis invalidated
 *
 * Performance impact:
 * - With Redis: ~1ms (Redis GET) per authenticated request
 * - Without Redis (cache miss or Redis down): ~5-15ms (Postgres query)
 * - Before this change: 0ms (no version check — but tokens were unrevocable)
 */
import { Request, Response, NextFunction } from 'express';
import { AppError } from '@repo/shared-utils';
import { verifyAccessToken } from '../utils/jwt.util.js';
import { userRepository } from '../repositories/user.repository.js';
import {
  getCachedTokenVersion,
  setCachedTokenVersion,
} from '../config/redis.js';

/**
 * Middleware that enforces authentication on protected routes.
 * Reads access token from HttpOnly cookie (set by login/register/refresh).
 *
 * Validation steps:
 * 1. Extract token from cookie
 * 2. Verify JWT signature + expiry
 * 3. Check tokenVersion against DB/Redis (instant revocation support)
 * 4. Attach payload to req.user
 */
export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // 1. Read access token from HttpOnly cookie
    const token = req.cookies?.accessToken;

    if (!token) {
      throw new AppError('Authentication required', {
        statusCode: 401,
        code: 'MISSING_TOKEN',
      });
    }

    // 2. Verify JWT signature + decode payload
    const payload = verifyAccessToken(token);

    // 3. TokenVersion validation (Cache-Aside via Redis)
    let dbTokenVersion = await getCachedTokenVersion(payload.userId);

    if (dbTokenVersion === null) {
      // Cache miss → query DB → populate cache
      dbTokenVersion = await userRepository.getTokenVersion(payload.userId);

      if (dbTokenVersion === null) {
        throw new AppError('User not found', {
          statusCode: 401,
          code: 'USER_NOT_FOUND',
        });
      }

      // Populate Redis cache for next request
      await setCachedTokenVersion(payload.userId, dbTokenVersion);
    }

    // Compare token's version with current DB version
    if (payload.tokenVersion !== dbTokenVersion) {
      throw new AppError('Token has been revoked', {
        statusCode: 401,
        code: 'TOKEN_VERSION_MISMATCH',
      });
    }

    // 4. Attach user payload to request
    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
}
