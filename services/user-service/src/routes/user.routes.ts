  /**
   * User Routes
   * Defines endpoints for user profile management.
   * Matches the OpenAPI spec paths: /users/me (GET, PATCH, DELETE)
   *
   * All routes require authentication + CSRF protection on state-changing methods.
   */
  import { Router, type Router as RouterType } from 'express';
  import { userController } from '../controllers/user.controller.js';
  import { authenticate } from '../middlewares/authenticate.js';
  import { csrfProtection } from '../middlewares/csrf.js';
  import { validate } from '../middlewares/validate.js';
  import { updateProfileSchema } from '../dto/user.dto.js';

  const router: RouterType = Router();

  // All user routes require authentication
  router.use(authenticate); 

  // GET /users/me — get own profile
  router.get(
    '/me',
    userController.getMe.bind(userController),
  );

  // PATCH /users/me — update own profile
  router.patch(
    '/me',
    csrfProtection,
    validate(updateProfileSchema, 'body'),
    userController.updateMe.bind(userController),
  );

  // DELETE /users/me — soft-delete own account
  router.delete(
    '/me',
    csrfProtection,
    userController.deleteMe.bind(userController),
  );

  export { router as userRoutes };
