/**
 * Authorization Middleware
 * Role-based access control guard.
 * Must be used AFTER authenticate middleware (requires req.user).
 */
import { Request, Response, NextFunction } from 'express';
import { AppError } from '@repo/shared-utils';

/**
 * Factory that creates a middleware checking if the authenticated user
 * has one of the allowed roles.
 *
 * @param allowedRoles - Roles permitted to access the route (e.g., 'ADMIN', 'OWNER')
 *
 * @example
 * router.delete('/users/:id', authenticate, authorize('ADMIN', 'OWNER'), controller.delete);
 */
export function authorize(...allowedRoles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError('Authentication required before authorization', {
        statusCode: 401,
        code: 'UNAUTHORIZED',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError('Insufficient permissions', {
        statusCode: 403,
        code: 'FORBIDDEN',
      });
    }

    next();
  };
}
