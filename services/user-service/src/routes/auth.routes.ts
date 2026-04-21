/**
 * Auth Routes
 * Defines endpoints for authentication: register, login, refresh, logout.
 * Matches the OpenAPI spec paths: /auth/register, /auth/login, /auth/refresh, /auth/logout
 */
import { Router, type Router as RouterType } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import { validate } from '../middlewares/validate.js';
import {
  registerSchema,
  loginSchema,
  refreshSchema,
  restoreAccountSchema,
} from '../dto/auth.dto.js';

const router: RouterType = Router();

// POST /auth/register — public (no auth required)
router.post(
  '/register',
  validate(registerSchema, 'body'),
  authController.register.bind(authController)
);

// POST /auth/login — public (no auth required)
router.post(
  '/login',
  validate(loginSchema, 'body'),
  authController.login.bind(authController)
);

// POST /auth/refresh — public (uses refresh token in body, not Bearer header)
router.post(
  '/refresh',
  validate(refreshSchema, 'body'),
  authController.refresh.bind(authController)
);

// POST /auth/logout — requires authentication
router.post(
  '/logout',
  authenticate,
  authController.logout.bind(authController)
);

router.post(
  '/restore/request',
  validate(restoreAccountSchema, 'body'),
  authController.requestRestore
);
router.post(
  '/restore/confirm',

  authController.confirmRestore
);
export { router as authRoutes };
