/**
 * Route Aggregator
 * Combines all route modules under their base paths.
 */
import { Router, type Router as RouterType } from 'express';
import { authRoutes } from './auth.routes.js';
import { userRoutes } from './user.routes.js';

const router: RouterType = Router();

// Mount auth routes under /auth
router.use('/auth', authRoutes);

// Mount user routes under /users
router.use('/users', userRoutes);

export { router as appRoutes };