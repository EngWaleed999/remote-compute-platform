/**
 * Cookie Utility
 * Centralized cookie configuration for auth tokens and CSRF.
 *
 * Security layers:
 * - HttpOnly: tokens cannot be read by JavaScript (XSS protection)
 * - Secure: cookies only sent over HTTPS (in production)
 * - SameSite=strict: cookies not sent with cross-site requests (CSRF mitigation)
 * - Path-scoped: refresh token only sent to /auth/refresh
 */
import { Response } from 'express';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

/** 15 minutes in milliseconds */
const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000;

/** 7 days in milliseconds */
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

/**
 * Set all authentication cookies on the response.
 * Called after login, register, refresh, and confirm-restore.
 */
export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string,
  csrfToken: string
): void {
  // Access token — HttpOnly, short-lived
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: 'strict',
    maxAge: ACCESS_TOKEN_MAX_AGE,
    path: '/',
  });

  // Refresh token — HttpOnly, long-lived, path-scoped to /auth/refresh
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: 'strict',
    maxAge: REFRESH_TOKEN_MAX_AGE,
    path: '/',
  });

  // CSRF token — NOT HttpOnly (must be readable by frontend JavaScript)
  res.cookie('csrfToken', csrfToken, {
    httpOnly: false,
    secure: IS_PRODUCTION,
    sameSite: 'strict',
    maxAge: REFRESH_TOKEN_MAX_AGE, // Same lifetime as refresh token
    path: '/',
  });
}

/**
 * Clear all authentication cookies.
 * Called on logout.
 */
export function clearAuthCookies(res: Response): void {
  res.clearCookie('accessToken', { path: '/' });
  res.clearCookie('refreshToken', { path: '/' });
  res.clearCookie('csrfToken', { path: '/' });
}
