/**
 * Auth Routes
 * Defines endpoints for authentication: register, login, refresh, logout, restore.
 * Matches the OpenAPI spec paths: /auth/*
 *
 * Security layers:
 * - Rate limiting per sensitivity level
 * - CSRF protection on state-changing endpoints
 * - Zod validation on all inputs
 * - authenticate middleware for protected routes
 *
 * Rate limiting applied per sensitivity level:
 * - login/register: authLimiter (10 req/15min) — brute force protection
 * - restore/confirm: sensitiveLimiter (5 req/15min) — recovery abuse protection
 * - refresh/logout: standardLimiter (30 req/15min)
 */
import { Router, type Router as RouterType } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import { csrfProtection } from '../middlewares/csrf.js';
import { validate } from '../middlewares/validate.js';
import {
  authLimiter,
  sensitiveLimiter,
  standardLimiter,
} from '../middlewares/rate-limit.js';
import {
  registerSchema,
  loginSchema,
  restoreRequestSchema,
  confirmRestoreSchema,
} from '../dto/auth.dto.js';

const router: RouterType = Router();

// POST /auth/register — public (no auth, no CSRF — first interaction)
router.post(
  '/register',
  authLimiter,
  validate(registerSchema, 'body'),
  authController.register.bind(authController)
);

// POST /auth/login — public (no auth, no CSRF — first interaction)
router.post(
  '/login',
  authLimiter,
  validate(loginSchema, 'body'),
  authController.login.bind(authController)
);

// POST /auth/refresh — public (uses refresh token from cookie, CSRF protected)
router.post(
  '/refresh',
  standardLimiter,
  csrfProtection,
  authController.refresh.bind(authController)
);

// POST /auth/logout — requires authentication + CSRF
router.post(
  '/logout',
  standardLimiter,
  csrfProtection,
  authenticate,
  authController.logout.bind(authController)
);

// POST /auth/restore/request — public (account recovery, no CSRF — first interaction)
router.post(
  '/restore/request',
  sensitiveLimiter,
  validate(restoreRequestSchema, 'body'),
  authController.requestRestore.bind(authController)
);

// POST /auth/restore/confirm — public (account recovery, no CSRF — uses code verification)
router.post(
  '/restore/confirm',
  sensitiveLimiter,
  validate(confirmRestoreSchema, 'body'),
  authController.confirmRestore.bind(authController)
);

export { router as authRoutes };
