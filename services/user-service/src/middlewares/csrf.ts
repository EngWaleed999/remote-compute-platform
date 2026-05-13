/**
 * CSRF Protection Middleware
 * Implements the Double Submit Cookie pattern.
 *
 * How it works:
 * 1. Server sets a CSRF token in a non-HttpOnly cookie (readable by JS)
 * 2. Frontend reads the cookie and sends it in X-CSRF-Token header
 * 3. This middleware compares the header value against the cookie value
 * 4. If they don't match → reject the request
 *
 * Why this works:
 * - An attacker on a different origin cannot read our cookies (SameSite=strict)
 * - An attacker cannot set the X-CSRF-Token header via a cross-origin form/link
 * - Only JavaScript running on our origin can read the cookie and set the header
 *
 * Applied to: all state-changing requests (POST, PUT, PATCH, DELETE)
 * Skipped for: GET, HEAD, OPTIONS (safe methods)
 */
import { Request, Response, NextFunction } from 'express';
import { AppError } from '@repo/shared-utils';

/** HTTP methods that are considered safe and don't need CSRF protection */
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/**
 * Middleware that validates CSRF tokens on state-changing requests.
 * Must be placed AFTER cookie-parser middleware.
 */
export function csrfProtection(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  // Skip safe methods
  if (SAFE_METHODS.has(req.method)) {
    return next();
  }

  const csrfHeader = req.headers['x-csrf-token'] as string | undefined;
  const csrfCookie = req.cookies?.csrfToken as string | undefined;

  // Both must be present and match
  if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
    throw new AppError('CSRF validation failed', {
      statusCode: 403,
      code: 'CSRF_VALIDATION_FAILED',
    });
  }

  next();
}
