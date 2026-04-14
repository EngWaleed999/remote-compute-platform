/**
 * Auth Controller
 * Thin HTTP layer — handles request/response only.
 * All business logic is delegated to authService.
 *
 * Each handler:
 * 1. Extracts validated data from req (already validated by middleware)
 * 2. Extracts request metadata (IP, user-agent)
 * 3. Calls the appropriate service method
 * 4. Returns the appropriate HTTP response
 */
import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';
import type {
  RegisterRequestDto,
  LoginRequestDto,
  RefreshRequestDto,
  RequestMeta,
} from '../dto/auth.dto.js';
import { AppError } from '@repo/shared-utils';

/**
 * Extract request metadata for login history tracking.
 */
function extractMeta(req: Request): RequestMeta {
  return {
    ipAddress: req.ip || req.socket.remoteAddress || 'unknown',
    userAgent: req.headers['user-agent'],
    deviceType: undefined, // Can be derived from user-agent parsing later
  };
}

class AuthControllerClass {
  /**
   * POST /auth/register
   * Creates a new user account and returns tokens.
   */
  async register(req: Request,res: Response,next: NextFunction): Promise<void> {
    try {
      const dto = req.body as RegisterRequestDto;
      const meta = extractMeta(req);
      const result = await authService.register(dto, meta);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/login
   * Authenticates a user and returns tokens.
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as LoginRequestDto;
      const meta = extractMeta(req);
      const result = await authService.login(dto, meta);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/refresh
   * Exchanges a refresh token for new access + refresh tokens.
   */
  async refresh(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dto = req.body as RefreshRequestDto;
      const result = await authService.refresh(dto);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/logout
   * Invalidates the current session.
   * Requires authentication (Bearer token).
   */
  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Extract access token from Authorization header
      const authHeader = req.headers.authorization;
      const token = authHeader?.split(' ')[1];

      if (!token) {
            return next(new AppError("يجب تسجيل الدخول اولا", { statusCode: 401 }));

      }
      
      await authService.logout(token);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthControllerClass();
