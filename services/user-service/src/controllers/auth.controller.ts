/**
 * Auth Controller
 * Thin HTTP layer — handles request/response only.
 * All business logic is delegated to authService.
 *
 * Cookie-based auth:
 * - Tokens are set as HttpOnly cookies (not returned in JSON body)
 * - CSRF token set as non-HttpOnly cookie (readable by frontend)
 * - Logout clears all auth cookies
 *
 * Each handler:
 * 1. Extracts validated data from req (already validated by middleware)
 * 2. Extracts request metadata (IP, user-agent)
 * 3. Calls the appropriate service method
 * 4. Sets cookies + returns the appropriate HTTP response
 */
import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';
import type {
  RegisterRequestDto,
  LoginRequestDto,
  RefreshRequestDto,
  RestoreRequestDto,
  ConfirmRequestDto,
  RequestMeta,
  VerifyEmailRequestDto,
  ResendOtpRequestDto,
} from '../dto/auth.dto.js';
import { setAuthCookies, clearAuthCookies } from '../utils/cookie.util.js';
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
   * Creates a new user account.
   * Sets auth cookies + returns user data in JSON body.
   */
  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dto = req.body as RegisterRequestDto;
      const meta = extractMeta(req);
      const result = await authService.register(dto, meta);

      // Set HttpOnly cookies for tokens + CSRF cookie
      setAuthCookies(
        res,
        result.accessToken,
        result.refreshToken,
        result.csrfToken
      );

      res.status(201).json(result.body);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/verify-email
   * Verifies the user's email using the OTP they received.
   */
  async verifyEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dto = req.body as VerifyEmailRequestDto;
      const meta = extractMeta(req);
      const result = await authService.verifyEmail(dto, meta);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/resend-otp
   * Resends a new OTP for email verification.
   * Respects cooldown — returns 429 if called too soon.
   */
  async resendOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dto = req.body as ResendOtpRequestDto;
      const meta = extractMeta(req);
      const result = await authService.resendOtp(dto.userId, meta);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/login
   * Authenticates a user.
   * Sets auth cookies + returns user data in JSON body.
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as LoginRequestDto;
      const meta = extractMeta(req);
      const result = await authService.login(dto, meta);

      setAuthCookies(
        res,
        result.accessToken,
        result.refreshToken,
        result.csrfToken
      );

      res.status(200).json(result.body);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/restore/request
   * Requests account restoration — validates grace period and generates verification code.
   */
  async requestRestore(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dto = req.body as RestoreRequestDto;
      const meta = extractMeta(req);
      const result = await authService.requestRestore(dto, meta);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/restore/confirm
   * Confirms account restoration with new password.
   * Sets auth cookies + returns user data in JSON body.
   */
  async confirmRestore(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dto = req.body as ConfirmRequestDto;
      const meta = extractMeta(req);
      const result = await authService.confirmRestore(dto, meta);

      setAuthCookies(
        res,
        result.accessToken,
        result.refreshToken,
        result.csrfToken
      );

      res.status(200).json(result.body);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/refresh
   * Exchanges a refresh token for new access + refresh tokens.
   * Reads the old refresh token from the HttpOnly cookie.
   * Sets new auth cookies.
   */
  async refresh(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Read refresh token from cookie
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        return next(
          new AppError('Refresh token required', { statusCode: 401 })
        );
      }

      const dto: RefreshRequestDto = { refreshToken };
      const meta = extractMeta(req);
      const result = await authService.refresh(dto, meta);

      setAuthCookies(
        res,
        result.accessToken,
        result.refreshToken,
        result.csrfToken
      );

      res.status(200).json(result.body);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/logout
   * Revokes the specified session (or all sessions if no sessionId).
   * Clears all auth cookies.
   * Requires authentication.
   */
  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        return next(
          new AppError('Authentication required', { statusCode: 401 })
        );
      }

      const sessionId = req.body?.sessionId as string | undefined;
      const meta = extractMeta(req);

      await authService.logout(req.user.userId, meta, sessionId);

      // Clear all auth cookies
      clearAuthCookies(res);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
  /**
   * GET /auth/verify
   * Lightweight endpoint for API Gateway to verify authentication tokens.
   * Returns 200 if the token is valid, otherwise middleware handles 401.
   */
  async verify(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // The `authenticate` middleware has already validated the token.
      // We simply return 200 OK.
      res.status(200).json({ valid: true, userId: req.user?.userId });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthControllerClass();
