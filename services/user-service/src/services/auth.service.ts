/**
 * Auth Service
 * Core authentication business logic — production-grade security.
 *
 * Security features:
 * - tokenVersion embedded in JWTs for instant invalidation
 * - Refresh token rotation with SHA-256 hashed storage
 * - Token family tracking for reuse detection (stolen token protection)
 * - Restore code: hashed, time-limited (10 min), single-use
 * - Full audit trail for all security-critical events
 * - Redis cache invalidation on token version bumps
 *
 * Architecture: controller → service → repository → database
 * This service orchestrates across: userRepository, sessionRepository, auditService
 */
import { userRepository } from '../repositories/user.repository.js';
import { sessionRepository } from '../repositories/session.repository.js';
import { auditService } from './audit.service.js';
import { hashPassword, comparePassword } from '../utils/password.util.js';
import { hashToken, generateRestoreCode, generateCsrfToken } from '../utils/token.util.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getRefreshTokenExpiryDate,
  type JwtPayload,
} from '../utils/jwt.util.js';
import {
  toAuthResponse,
  toRestoreRequestResponse,
  toConfirmRestoreResponse,
} from '../mappers/auth.mapper.js';
import type {
  RegisterRequestDto,
  LoginRequestDto,
  RefreshRequestDto,
  AuthResponseDto,
  RefreshResponseDto,
  RestoreRequestDto,
  RestoreResponseDto,
  ConfirmRequestDto,
  ConfirmResponseDto,
  RequestMeta,
} from '../dto/auth.dto.js';
import { logger } from '../config/logger.js';
import { AppError } from '@repo/shared-utils';
import {
  invalidateCachedTokenVersion,
} from '../config/redis.js';
import crypto from 'crypto';

/** Grace period for restore verification code (minutes) */

const RESTORE_CODE_EXPIRY_MINUTES = 10;

/** Internal result type returned to controller (includes tokens + CSRF for cookies) */
export interface AuthResult {
  /** Response body to send as JSON */
  body: AuthResponseDto;
  /** Raw access token for cookie */
  accessToken: string;
  /** Raw refresh token for cookie */
  refreshToken: string;
  /** CSRF token for cookie */
  csrfToken: string;
}

export interface RefreshResult {
  body: RefreshResponseDto;
  accessToken: string;
  refreshToken: string;
  csrfToken: string;
}

export interface ConfirmResult {
  body: ConfirmResponseDto;
  accessToken: string;
  refreshToken: string;
  csrfToken: string;
}

class AuthServiceClass {
  /**
   * Register a new user account.
   *
   * Flow:
   * 1. Check email uniqueness
   * 2. Hash password (NEVER store plain text)
   * 3. Create user in DB
   * 4. Generate JWT tokens with tokenVersion
   * 5. Hash refresh token + create session with familyId
   * 6. Log login history + audit event
   * 7. Return tokens + CSRF token
   */
  async register(
    dto: RegisterRequestDto,
    meta: RequestMeta
  ): Promise<AuthResult> {
    // 1. Check if email already taken
    const existingUser = await userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new AppError('Email already registered', {
        statusCode: 409,
        code: 'EMAIL_ALREADY_EXISTS',
      });
    }

    // 2. Hash password securely
    const passwordHash = await hashPassword(dto.password);

    // 3. Create user 
    const user = await userRepository.create({
      email: dto.email,
      passwordHash,
      name: dto.name,
    });

    // 4. Generate JWT tokens with tokenVersion
    const payload: JwtPayload = {
      userId: user.id,
      role: user.role,
      email: user.email,
      tokenVersion: user.tokenVersion,
    };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // 5. Hash refresh token + create session with family tracking
    const refreshTokenHash = hashToken(refreshToken);
    const familyId = crypto.randomUUID();

    await sessionRepository.create({
      userId: user.id,
      refreshTokenHash,
      familyId,
      expiresAt: getRefreshTokenExpiryDate(),
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      deviceType: meta.deviceType,
    });

    // 6. Record login history + audit
    await sessionRepository.createLoginHistory({
      userId: user.id,
      success: true,
      method: 'registered',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      deviceType: meta.deviceType,
    });

    auditService.log({
      userId: user.id,
      action: 'USER_REGISTERED',
      description: 'New user account created',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    logger.info({
      message: 'User registered successfully',
      userId: user.id,
    });

    // 7. Return response with tokens for cookies
    const csrfToken = generateCsrfToken();
    return {
      body: toAuthResponse(user, accessToken, refreshToken),
      accessToken,
      refreshToken,
      csrfToken,
    };
  }

  /**
   * Login an existing user.
   *
   * Security:
   * - Uses identical error for wrong email/password (prevents user enumeration)
   * - Includes current tokenVersion in JWT payload
   * - Hashes refresh token before DB storage
   * - Full audit trail for success/failure
   */
  async login(
    dto: LoginRequestDto,
    meta: RequestMeta
  ): Promise<AuthResult> {
    // 1. Find user — DO NOT reveal whether email exists
    const user = await userRepository.findActiveByEmail(dto.email);
    if (!user) {
      // Check if account is soft-deleted — provide actionable feedback
      const deletedUser = await userRepository.findDeletedByEmail(dto.email);

      if (deletedUser) {
        const canRestore = await userRepository.canRestore(deletedUser.id);
        if (canRestore) {
          throw new AppError(
            'Account deleted. You can restore it within 30 days.',
            {
              statusCode: 403,
              code: 'ACCOUNT_DELETED_RESTORABLE',
            }
          );
        } else {
          throw new AppError(
            'Account permanently deleted. Create a new account.',
            {
              statusCode: 410,
              code: 'ACCOUNT_PERMANENTLY_DELETED',
            }
          );
        }
      }

      // Generic error — prevent user enumeration
      throw new AppError('Invalid email or password', {
        statusCode: 401,
        code: 'INVALID_CREDENTIALS',
      });
    }

    // 2. Verify password
    const isPasswordValid = await comparePassword(
      dto.password,
      user.passwordHash
    );
    if (!isPasswordValid) {
      // Record failed login attempt
      await sessionRepository.createLoginHistory({
        userId: user.id,
        success: false,
        method: 'failed login password',
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        deviceType: meta.deviceType,
        failureReason: 'INVALID_PASSWORD',
      });

      auditService.log({
        userId: user.id,
        action: 'LOGIN_FAILURE',
        description: 'Invalid password',
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
      });

      throw new AppError('Invalid email or password', {
        statusCode: 401,
        code: 'INVALID_CREDENTIALS',
      });
    }

    // 3. Check account status
    if (user.status !== 'ACTIVE') {
      await sessionRepository.createLoginHistory({
        userId: user.id,
        success: false,
        method: 'Account not active',
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        failureReason: `ACCOUNT_${user.status}`,
      });

      auditService.log({
        userId: user.id,
        action: 'LOGIN_FAILURE',
        description: `Account status: ${user.status}`,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
      });

      throw new AppError(`Account is ${user.status.toLowerCase()}`, {
        statusCode: 403,
        code: 'ACCOUNT_NOT_ACTIVE',
      });
    }

    // 4. Generate tokens with current tokenVersion
    const payload: JwtPayload = {
      userId: user.id,
      role: user.role,
      email: user.email,
      tokenVersion: user.tokenVersion,
    };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // 5. Hash refresh token + create session with family tracking
    const refreshTokenHash = hashToken(refreshToken);
    const familyId = crypto.randomUUID();

    await sessionRepository.create({
      userId: user.id,
      refreshTokenHash,
      familyId,
      expiresAt: getRefreshTokenExpiryDate(),
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      deviceType: meta.deviceType,
    });

    // 6. Update last login
    await userRepository.updateLastLogin(user.id);

    // 7. Record successful login + audit
    await sessionRepository.createLoginHistory({
      userId: user.id,
      success: true,
      method: 'successful login',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      deviceType: meta.deviceType,
    });

    auditService.log({
      userId: user.id,
      action: 'LOGIN_SUCCESS',
      description: 'User logged in successfully',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    logger.info({ message: 'User logged in', userId: user.id });

    const csrfToken = generateCsrfToken();
    return {
      body: toAuthResponse(user, accessToken, refreshToken),
      accessToken,
      refreshToken,
      csrfToken,
    };
  }

  /**
   * Request account restoration.
   *
   * Security (hardened):
   * - Code generated using crypto.randomBytes (not Math.random)
   * - Code is hashed (SHA-256) before storing in DB
   * - Code expires in 10 minutes
   * - Code is single-use (restoreCodeUsed flag)
   */
  async requestRestore(
    dto: RestoreRequestDto,
    meta: RequestMeta
  ): Promise<RestoreResponseDto> {
    // 1. Find deleted account
    const user = await userRepository.findDeletedByEmail(dto.email);
    if (!user) {
      throw new AppError('No deleted account found with this email', {
        statusCode: 404,
        code: 'ACCOUNT_NOT_FOUND',
      });
    }

    // 2. Validate grace period
    const canRestore = await userRepository.canRestore(user.id);
    if (!canRestore) {
      throw new AppError('Grace period expired. Account cannot be restored.', {
        statusCode: 410,
        code: 'ACCOUNT_PERMANENTLY_DELETED',
      });
    }

    // 3. Generate secure verification code
    const code = generateRestoreCode();
    const codeHash = hashToken(code);
    const expiresAt = new Date(
      Date.now() + RESTORE_CODE_EXPIRY_MINUTES * 60 * 1000
    );

    // 4. Store hashed code in DB
    await userRepository.setRestoreCode(user.id, codeHash, expiresAt);

    // 5. Audit log
    auditService.log({
      userId: user.id,
      action: 'RESTORE_REQUESTED',
      description: 'Account restore code generated',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    logger.info({
      message: 'Account restore requested',
      userId: user.id,
    });

    // 6. Return mapped response (devCode only in non-production)
    return toRestoreRequestResponse(code, RESTORE_CODE_EXPIRY_MINUTES);
  }

  /**
   * Confirm account restoration.
   *
   * Security (hardened):
   * - Verifies restore code hash matches stored hash
   * - Enforces code expiry (10 minutes)
   * - Enforces single-use (code cannot be reused)
   * - Bumps tokenVersion to invalidate all old tokens
   * - Revokes all existing sessions
   * - Creates a fresh session with new token family
   */
  async confirmRestore(
    dto: ConfirmRequestDto,
    meta: RequestMeta
  ): Promise<ConfirmResult> {
    // 1. Find deleted account
    const user = await userRepository.findDeletedByEmail(dto.email);
    if (!user) {
      throw new AppError('Account not found or not eligible for restoration', {
        statusCode: 404,
        code: 'ACCOUNT_NOT_FOUND',
      });
    }

    // 2. Validate grace period (defense in depth)
    const canRestore = await userRepository.canRestore(user.id);
    if (!canRestore) {
      throw new AppError('Grace period expired. Account cannot be restored.', {
        statusCode: 410,
        code: 'ACCOUNT_PERMANENTLY_DELETED',
      });
    }

    // 3. Verify restore code (hashed comparison + expiry + single-use)
    const codeHash = hashToken(dto.code ?? '');
    const verified = await userRepository.verifyAndConsumeRestoreCode(
      user.id,
      codeHash
    );
    if (!verified) {
      throw new AppError('Invalid or expired restore code', {
        statusCode: 400,
        code: 'INVALID_RESTORE_CODE',
      });
    }

    // 4. Hash new password
    const passwordHash = await hashPassword(dto.newPassword);

    // 5. Restore account + reset restore fields
    const restoredUser = await userRepository.restoreAccount(
      user.id,
      passwordHash
    );

    // 6. Bump tokenVersion → invalidates ALL old access tokens
    const updatedUser = await userRepository.bumpTokenVersion(restoredUser.id);
    await invalidateCachedTokenVersion(restoredUser.id);

    // 7. Revoke all old sessions
    await sessionRepository.revokeAllUserSessions(
      restoredUser.id,
      'ACCOUNT_RESTORED'
    );

    // 8. Generate fresh tokens with new tokenVersion
    const payload: JwtPayload = {
      userId: updatedUser.id,
      role: updatedUser.role,
      email: updatedUser.email,
      tokenVersion: updatedUser.tokenVersion,
    };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // 9. Create new session with fresh family
    const refreshTokenHash = hashToken(refreshToken);
    const familyId = crypto.randomUUID();

    await sessionRepository.create({
      userId: updatedUser.id,
      refreshTokenHash,
      familyId,
      expiresAt: getRefreshTokenExpiryDate(),
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      deviceType: meta.deviceType,
    });

    // 10. Record login history + audit
    await sessionRepository.createLoginHistory({
      userId: updatedUser.id,
      success: true,
      method: 'account_restored',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      deviceType: meta.deviceType,
    });

    auditService.log({
      userId: updatedUser.id,
      action: 'ACCOUNT_RESTORED',
      description: 'Account restored and new session created',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    logger.info({
      message: 'Account restored successfully',
      userId: updatedUser.id,
    });

    const csrfToken = generateCsrfToken();
    return {
      body: toConfirmRestoreResponse(updatedUser, accessToken, refreshToken),
      accessToken,
      refreshToken,
      csrfToken,
    };
  }

  /**
   * Refresh access and refresh tokens using secure token rotation.
   *
   * Security:
   * 1. Hash incoming refresh token and look up valid session
   * 2. If NOT found → check for revoked session (reuse detection)
   * 3. If REUSE DETECTED → revoke entire token family + audit
   * 4. If valid → revoke old session, generate new pair, same familyId
   */
  async refresh(
    dto: RefreshRequestDto,
    meta: RequestMeta
  ): Promise<RefreshResult> {
    // 1. Verify JWT signature
    const decoded = verifyRefreshToken(dto.refreshToken);

    // 2. Hash incoming token and look up valid session
    const incomingHash = hashToken(dto.refreshToken);
    const validSession =
      await sessionRepository.findValidByRefreshTokenHash(incomingHash);

    if (!validSession) {
      // 3. REUSE DETECTION: check if this hash belongs to a revoked session
      const revokedSession =
        await sessionRepository.findAnyByRefreshTokenHash(incomingHash);

      if (revokedSession && !revokedSession.isValid) {
        // 🚨 TOKEN REUSE DETECTED — potential token theft
        // Revoke the entire token family
        if (revokedSession.familyId) {
          await sessionRepository.revokeSessionFamily(revokedSession.familyId);
        }
        // Also revoke all user sessions as a safety measure
        await sessionRepository.revokeAllUserSessions(
          revokedSession.userId,
          'REFRESH_TOKEN_REUSE_DETECTED'
        );
        // Bump token version to invalidate all existing access tokens
        await userRepository.bumpTokenVersion(revokedSession.userId);
        await invalidateCachedTokenVersion(revokedSession.userId);

        // Audit: HIGH SEVERITY event
        auditService.log({
          userId: revokedSession.userId,
          action: 'REFRESH_TOKEN_REUSE',
          description:
            'Revoked refresh token reused — potential token theft. All sessions revoked.',
          ipAddress: meta.ipAddress,
          userAgent: meta.userAgent,
          metadata: {
            revokedSessionId: revokedSession.id,
            familyId: revokedSession.familyId,
          },
        });

        auditService.log({
          userId: revokedSession.userId,
          action: 'ALL_SESSIONS_REVOKED',
          description:
            'All sessions revoked due to refresh token reuse detection',
          ipAddress: meta.ipAddress,
          userAgent: meta.userAgent,
        });

        logger.warn({
          message: '🚨 Refresh token reuse detected — all sessions revoked',
          userId: revokedSession.userId,
          sessionId: revokedSession.id,
        });

        throw new AppError(
          'Security breach detected. All sessions revoked. Please re-authenticate.',
          {
            statusCode: 401,
            code: 'REFRESH_TOKEN_REUSE',
          }
        );
      }

      // Token not found at all
      throw new AppError('Invalid or expired refresh token', {
        statusCode: 401,
        code: 'INVALID_REFRESH_TOKEN',
      });
    }

    // 4. Happy path: revoke old session (token rotation)
    await sessionRepository.revokeSession(validSession.id, 'TOKEN_ROTATED');

    // 5. Get current tokenVersion for new access token
    const currentUser = await userRepository.findById(decoded.userId);
    if (!currentUser || currentUser.status !== 'ACTIVE') {
      throw new AppError('User account is no longer active', {
        statusCode: 401,
        code: 'ACCOUNT_NOT_ACTIVE',
      });
    }

    // 6. Generate new tokens with current tokenVersion
    const payload: JwtPayload = {
      userId: currentUser.id,
      role: currentUser.role,
      email: currentUser.email,
      tokenVersion: currentUser.tokenVersion,
    };
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    // 7. Create new session with same familyId (rotation chain)
    const newRefreshTokenHash = hashToken(newRefreshToken);
    await sessionRepository.create({
      userId: decoded.userId,
      refreshTokenHash: newRefreshTokenHash,
      familyId: validSession.familyId ?? crypto.randomUUID(),
      expiresAt: getRefreshTokenExpiryDate(),
      ipAddress: meta.ipAddress ?? validSession.ipAddress ?? undefined,
      userAgent: meta.userAgent ?? validSession.userAgent ?? undefined,
      deviceType: validSession.deviceType ?? undefined,
    });

    // 8. Audit
    auditService.log({
      userId: decoded.userId,
      action: 'TOKEN_REFRESHED',
      description: 'Tokens refreshed via rotation',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    logger.info({ message: 'Tokens refreshed', userId: decoded.userId });

    const csrfToken = generateCsrfToken();
    return {
      body: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      csrfToken,
    };
  }

  /**
   * Logout — revoke a specific session or all sessions.
   *
   * Strategy: Accept optional sessionId to revoke a specific session.
   * If no sessionId provided, revoke ALL sessions for the user.
   */
  async logout(
    userId: string,
    meta: RequestMeta,
    sessionId?: string
  ): Promise<void> {
    if (sessionId) {
      // Revoke specific session — verify it belongs to the user
      const session = await sessionRepository.findById(sessionId);
      if (session && session.userId === userId && session.isValid) {
        await sessionRepository.revokeSession(session.id, 'USER_LOGOUT');
        logger.info({
          message: 'User logged out (specific session)',
          userId,
          sessionId,
        });
      }
    } else {
      // Revoke all sessions for the user
      await sessionRepository.revokeAllUserSessions(userId, 'USER_LOGOUT');
      logger.info({
        message: 'User logged out (all sessions)',
        userId,
      });
    }

    auditService.log({
      userId,
      action: 'USER_LOGOUT',
      description: sessionId
        ? `Session ${sessionId} revoked`
        : 'All sessions revoked',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });
  }
}

/** Singleton instance */
export const authService = new AuthServiceClass();
