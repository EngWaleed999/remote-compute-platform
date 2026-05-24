/**
 * Rate Limiting Middleware
 * Configurable rate limiters for different endpoint sensitivity levels.
 *
 * Strategy (best practice):
 * - Global: generous fallback for all routes
 * - Auth (login/register): strict — prevents brute force & credential stuffing
 * - Sensitive (restore/confirm): very strict — prevents abuse of recovery flow
 * - Standard (refresh/logout): moderate
 *
 * Key by IP address. In production behind a reverse proxy,
 * ensure `app.set('trust proxy', 1)` is configured so req.ip is correct.
 */
import rateLimit, { type Options } from 'express-rate-limit';

/**
 * Create a rate limiter with sensible defaults.
 * Overrides can be passed for per-route customization.
 */
function createLimiter(overrides: Partial<Options> = {}) {
  return rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes default window
    standardHeaders: 'draft-7', // Return rate limit info in `RateLimit-*` headers (IETF draft)
    legacyHeaders: false, // Disable `X-RateLimit-*` headers (deprecated)
    message: {
      error: 'Too many requests',
      message: 'Please try again later',
    },
    ...overrides,
  });
}

// ═══════════════════════════════════════════════════
// Rate Limit Tiers
// ═══════════════════════════════════════════════════

/**
 * Global rate limit — generous fallback for all routes.
 * 100 requests per 15 minutes per IP.
 */
export const globalLimiter = createLimiter({
  limit: 100,
  message: {
    error: 'Too many requests',
    message: 'Global rate limit exceeded. Please try again later.',
  },
});

/**
 * Auth rate limit — strict for login & register.
 * 10 attempts per 15 minutes per IP.
 * Prevents brute force attacks and credential stuffing.
 */
export const authLimiter = createLimiter({
  limit: 20,
  message: {
    error: 'Too many authentication attempts',
    message: 'Please try again after 15 minutes.',
  },
});

/**
 * Sensitive rate limit — very strict for account recovery.
 * 5 attempts per 15 minutes per IP.
 * Prevents abuse of the restore flow (email enumeration, code brute force).
 */
export const sensitiveLimiter = createLimiter({
  limit: 5,
  message: {
    error: 'Too many recovery attempts',
    message: 'Please try again after 15 minutes.',
  },
});

/**
 * Standard rate limit — moderate for authenticated operations.
 * 30 requests per 15 minutes per IP.
 */
export const standardLimiter = createLimiter({
  limit: 30,
  message: {
    error: 'Too many requests',
    message: 'Please slow down and try again shortly.',
  },
});
