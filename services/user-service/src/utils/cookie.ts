/**
 * Cookie Utilities
 * - Secure auth cookies (httpOnly, sameSite, etc.)
 * - CSRF protection cookie
 * - Best practices for production
 */

import type { Response, Request } from 'express';
import { generateCsrfToken } from './token.util.js';

// ─── Configuration ───

const COOKIE_CONFIG = {
  accessToken: {
    name: 'access_token',
    maxAge: 15 * 60 * 1000, // 15 minutes
    httpOnly: true, // javascript can't read it (secure from XSS)
    secure: process.env.NODE_ENV === 'production', // true in production (only HTTPS)
    sameSite: 'strict' as const, // send only from client (frontEnd) in same site or Extrenal  sites (secure from csrf)
  },
  refreshToken: {
    name: 'refresh_token',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
  },
  csrf: {
    name: 'csrf_token',
    maxAge: 15 * 60 * 1000, // 15 minutes
    httpOnly: false, // ← MUST be accessible by JS
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
  },
};

// ─── Set Auth Cookies ───

// user login -> save token in cookie -> ervy request automatcilly sending
export function setAuthCookies(
  res: Response,
  tokens: { accessToken: string; refreshToken: string }
): void {
  res.cookie(COOKIE_CONFIG.accessToken.name, tokens.accessToken, {
    httpOnly: COOKIE_CONFIG.accessToken.httpOnly,
    secure: COOKIE_CONFIG.accessToken.secure,
    sameSite: COOKIE_CONFIG.accessToken.sameSite,
    maxAge: COOKIE_CONFIG.accessToken.maxAge,
    path: '/',
  });

  res.cookie(COOKIE_CONFIG.refreshToken.name, tokens.refreshToken, {
    httpOnly: COOKIE_CONFIG.refreshToken.httpOnly,
    secure: COOKIE_CONFIG.refreshToken.secure,
    sameSite: COOKIE_CONFIG.refreshToken.sameSite,
    maxAge: COOKIE_CONFIG.refreshToken.maxAge,
    path: '/auth/refresh', // ← Refresh endpoint only
  });
}

// ─── Clear Auth Cookies (Logout) ───

// user logout -> delete cookies -> can't reach to any cookies secure

export function clearAuthCookies(res: Response): void {
  res.clearCookie(COOKIE_CONFIG.accessToken.name, { path: '/' });
  res.clearCookie(COOKIE_CONFIG.refreshToken.name, { path: '/auth/refresh' });
  res.clearCookie(COOKIE_CONFIG.csrf.name, { path: '/' });
}

// ─── Set CSRF Cookie ───

// secure form CSRF

export function setCsrfCookie(res: Response): void {
  const csrfToken = generateCsrfToken();
  res.cookie(COOKIE_CONFIG.csrf.name, csrfToken, {
    httpOnly: COOKIE_CONFIG.csrf.httpOnly, // ← false, accessible by JS
    secure: COOKIE_CONFIG.csrf.secure,
    sameSite: COOKIE_CONFIG.csrf.sameSite,
    maxAge: COOKIE_CONFIG.csrf.maxAge,
    path: '/',
  });
}

// ─── Get CSRF Token from Cookie (for validation) ───

export function getCsrfToken(req: Request): string | undefined {
  return req.cookies?.[COOKIE_CONFIG.csrf.name];
}
