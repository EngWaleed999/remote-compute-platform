/**
 * JWT Utility
 * Handles token generation and verification for access and refresh tokens.
 * Uses separate secrets for access vs refresh to prevent token misuse.
 */
import jwt, { type SignOptions } from 'jsonwebtoken';
import { AppError } from '@repo/shared-utils';
import { env } from '../config/env.js';

/**
 * JWT Payload — the claims embedded in every token.
 * Kept minimal to limit token size and exposure.
 */
export interface JwtPayload {
  userId: string;
  role: string;
  email: string;
  tokenVersion: number;
}

/**
 * Generate a short-lived access token (default: 15 minutes).
 * Used for authenticating API requests.
 */
export function generateAccessToken(payload: JwtPayload): string {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as any,
  };
  return jwt.sign(payload, env.JWT_SECRET, options);
}

/**
 * Generate a long-lived refresh token (default: 7 days).
 * Used to obtain new access tokens without re-authentication.
 */
export function generateRefreshToken(payload: JwtPayload): string {
  const options: SignOptions = {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
  };
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, options);
}

/**
 * Verify and decode an access token.
 * @throws AppError(401) if token is invalid or expired
 */
export function verifyAccessToken(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    throw new AppError('Invalid or expired access token', {
      statusCode: 401,
      code: 'INVALID_ACCESS_TOKEN',
    });
  }
}

/**
 * Verify and decode a refresh token.
 * @throws AppError(401) if token is invalid or expired
 */
export function verifyRefreshToken(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    throw new AppError('Invalid or expired refresh token', {
      statusCode: 401,
      code: 'INVALID_REFRESH_TOKEN',
    });
  }
}

/**
 * Calculate the expiry date for a refresh token session.
 * Parses duration strings like '7d', '24h', '30m'.
 */
export function getRefreshTokenExpiryDate(): Date {
  const duration = env.JWT_REFRESH_EXPIRES_IN;
  const match = duration.match(/^(\d+)([smhd])$/);

  if (!match) {
    // Default to 7 days if format is unrecognized
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return new Date(Date.now() + value * multipliers[unit]);
}
