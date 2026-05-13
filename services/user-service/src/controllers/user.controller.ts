/**
 * User Controller
 * Thin HTTP layer for user profile operations.
 * All business logic is delegated to userService.
 *
 * All routes require authentication — req.user is populated by authenticate middleware.
 */
import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service.js';
import type { UpdateProfileRequestDto } from '../dto/user.dto.js';
import { AppError } from '@repo/shared-utils';
import { clearAuthCookies } from '../utils/cookie.util.js';

class UserControllerClass {
  /**
   * GET /users/me
   * Returns the authenticated user's profile.
   */
  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new AppError('Authentication required', { statusCode: 401 });
      const result = await userService.getMe(userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /users/me
   * Updates the authenticated user's profile.
   */
  async updateMe(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const dto = req.body as UpdateProfileRequestDto;
      const result = await userService.updateMe(userId, dto);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /users/me
   * Soft-deletes the authenticated user's account.
   * Clears all auth cookies after deletion.
   */
  async deleteMe(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
      await userService.deleteMe(userId, ipAddress);

      // Clear auth cookies — user is now logged out
      clearAuthCookies(res);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserControllerClass();
