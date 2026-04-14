/**
 * Auth Service
 * Core authentication business logic.
 * Orchestrates: user creation, password verification, JWT token management, session lifecycle.
 *
 * Responsibilities:
 * - Register new users (hash password, create session, generate tokens)
 * - Login existing users (verify credentials, create session)
 * - Refresh tokens (rotating refresh tokens — old session revoked, new one created)
 * - Logout (revoke current session)
 */
import { userRepository } from '../repositories/user.repository.js';
import { sessionRepository } from '../repositories/session.repository.js';
import { hashPassword, comparePassword } from '../utils/password.util.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getRefreshTokenExpiryDate,
  type JwtPayload,
} from '../utils/jwt.util.js';
import { toAuthResponse } from '../mappers/auth.mapper.js';
import type {
  RegisterRequestDto,
  LoginRequestDto,
  RefreshRequestDto,
  AuthResponseDto,
  RefreshResponseDto,
  RequestMeta,
} from '../dto/auth.dto.js';
import { logger } from '../config/logger.js';
import { AppError } from '@repo/shared-utils';

class AuthServiceClass {
  /**
   * Register a new user account.
   *
   * Flow:
   * 1. Check email uniqueness
   * 2. Hash password (NEVER store plain text)
   * 3. Create user in DB
   * 4. Generate JWT token pair
   * 5. Create session record
   * 6. Log successful registration in login history
   * 7. Return AuthResponse (tokens + user)
   */
  async register(
    dto: RegisterRequestDto,
    meta: RequestMeta
  ): Promise<AuthResponseDto> {
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

    // 4. Generate JWT tokens
    const payload: JwtPayload = {
      userId: user.id,
      role: user.role,
      email: user.email,
    };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // 5. Create session
    await sessionRepository.create({
      userId: user.id,
      token: accessToken,
      refreshToken,
      expiresAt: getRefreshTokenExpiryDate(),
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      deviceType: meta.deviceType,
    });

    // 6. Record login history
    await sessionRepository.createLoginHistory({
      userId: user.id,
      success: true,
      method: 'password',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      deviceType: meta.deviceType,
    });

    logger.info({ message: 'User registered successfully', userId: user.id });

    // 7. Return response via mapper (strips sensitive fields)
    return toAuthResponse(user, accessToken, refreshToken);
  }

  /**
   * Login an existing user.
   *
   * Flow:
   * 1. Find user by email
   * 2. Verify password
   * 3. Check account status (must be ACTIVE)
   * 4. Generate JWT tokens + create session
   * 5. Update last login timestamp
   * 6. Log login attempt
   *
   * Security: uses identical error message for wrong email/password
   * to prevent user enumeration attacks.
   */
  async login(
    dto: LoginRequestDto,
    meta: RequestMeta
  ): Promise<AuthResponseDto> {
    // 1. Find user — DO NOT reveal whether email exists
    const user = await userRepository.findByEmail(dto.email);
    if (!user) {
      // Record failed attempt if we can identify a userId (we can't here)
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
        method: 'password',
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        deviceType: meta.deviceType,
        failureReason: 'INVALID_PASSWORD',
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
        method: 'password',
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        failureReason: `ACCOUNT_${user.status}`,
      });

      throw new AppError(`Account is ${user.status.toLowerCase()}`, {
        statusCode: 403,
        code: 'ACCOUNT_NOT_ACTIVE',
      });
    }

    // 4. Generate tokens + create session
    const payload: JwtPayload = {
      userId: user.id,
      role: user.role,
      email: user.email,
    };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await sessionRepository.create({
      userId: user.id,
      token: accessToken,
      refreshToken,
      expiresAt: getRefreshTokenExpiryDate(),
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      deviceType: meta.deviceType,
    });

    // 5. Update last login
    await userRepository.updateLastLogin(user.id);

    // 6. Record successful login
    await sessionRepository.createLoginHistory({
      userId: user.id,
      success: true,
      method: 'password',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      deviceType: meta.deviceType,
    });

    logger.info({ message: 'User logged in', userId: user.id });

    return toAuthResponse(user, accessToken, refreshToken);
  }

  /**
   * Refresh access and refresh tokens using token rotation.
   *
   * Flow:
   * 1. Verify refresh token signature
   * 2. Find valid session by refresh token
   * 3. Revoke old session (rotation — prevents token reuse)
   * 4. Generate new token pair
   * 5. Create new session
   *
   * Security: if a revoked refresh token is reused, it could indicate
   * token theft. The old session is already invalidated.
   */
  async refresh(dto: RefreshRequestDto): Promise<RefreshResponseDto> {
    // 1. Verify token signature
    const decoded = verifyRefreshToken(dto.refreshToken);

    // 2. Find valid session
    const session = await sessionRepository.findByRefreshToken(
      dto.refreshToken
    );
    if (!session) {
      throw new AppError('Invalid or expired refresh token', {
        statusCode: 401,
        code: 'INVALID_REFRESH_TOKEN',
      });
    }

    // 3. Revoke old session (token rotation)
    await sessionRepository.revokeSession(session.id, 'TOKEN_ROTATED');

    // 4. Generate new tokens
    const payload: JwtPayload = {
      userId: decoded.userId,
      role: decoded.role,
      email: decoded.email,
    };
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    // 5. Create new session
    await sessionRepository.create({
      userId: decoded.userId,
      token: newAccessToken,
      refreshToken: newRefreshToken,
      expiresAt: getRefreshTokenExpiryDate(),
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      deviceType: session.deviceType,
    });

    logger.info({ message: 'Tokens refreshed', userId: decoded.userId });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Logout — revoke the current session.
   * Finds the session by access token and invalidates it.
   */
  async logout(accessToken: string): Promise<void> {
    const session = await sessionRepository.findByToken(accessToken);
    if (session) {
      await sessionRepository.revokeSession(session.id, 'USER_LOGOUT');
      logger.info({ message: 'User logged out', sessionId: session.id });
    }
    // If session not found, silently succeed (idempotent logout)
  }
}

/** Singleton instance */
export const authService = new AuthServiceClass();
