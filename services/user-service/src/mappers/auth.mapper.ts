/**
 * Auth Mapper
 * Builds the AuthResponse DTO from tokens and a Prisma User.
 * Combines the user mapper output with JWT tokens.
 */
import { User } from '@prisma/client';
import type { AuthResponseDto } from '../dto/auth.dto.js';
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
