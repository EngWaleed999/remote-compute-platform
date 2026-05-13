/**
 * Auth Mapper
 * Builds response DTOs from internal data.
 * Combines the user mapper output with JWT tokens.
 *
 * Mapping directions:
 * - Prisma User + tokens → AuthResponseDto
 * - code + expiresAt → RestoreResponseDto
 * - Prisma User + tokens → ConfirmResponseDto (AuthResponse + message)
 */
import { User } from '@prisma/client';
import type {
  AuthResponseDto,
  RestoreResponseDto,
  ConfirmResponseDto,
} from '../dto/auth.dto.js';
import { toUserResponse } from './user.mapper.js';

/**
 * Build a complete AuthResponse from user data and JWT tokens.
 * Uses the user mapper to strip sensitive fields.
 */
export function toAuthResponse(
  user: User,
  accessToken: string,
  refreshToken: string
): AuthResponseDto {
  return {
    accessToken,
    refreshToken,
    user: toUserResponse(user),
  };
}

/**
 * Build the restore-request response.
 * Maps internal code/expiry → OpenAPI RestoreResponseDto shape.
 * devCode is only included in non-production environments.
 */
export function toRestoreRequestResponse(
  code: string,
  expiresInMinutes: number
): RestoreResponseDto {
  const isDev = process.env.NODE_ENV !== 'production';
  return {
    message: 'Restore code sent to your email',
    expiresIn: `${expiresInMinutes}m`,
    ...(isDev && { devCode: code }),
  };
}

/**
 * Build the confirm-restore response.
 * AuthResponse + success message, as defined in OpenAPI (allOf).
 */
export function toConfirmRestoreResponse(
  user: User,
  accessToken: string,
  refreshToken: string
): ConfirmResponseDto {
  return {
    accessToken,
    refreshToken,
    user: toUserResponse(user),
    message: 'Account restored successfully',
  };
}
