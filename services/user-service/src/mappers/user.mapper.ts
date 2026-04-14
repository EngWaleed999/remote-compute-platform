/**
 * User Mapper
 * Transforms Prisma User model → public UserResponseDto.
 * Strips sensitive fields (passwordHash, twoFactorSecret, etc.)
 * to match the OpenAPI User schema: { id, email, name, createdAt }.
 */
import { User } from '@prisma/client';
import type { UserResponseDto } from '../dto/user.dto.js';

/**
 * Map a full Prisma User to the public-facing UserResponseDto.
 * NEVER exposes: passwordHash, twoFactorSecret, stripeCustomerId, etc.
 */
export function toUserResponse(user: User): UserResponseDto {
  return {
    id: user.id,
    email: user.email,
    name: user.name ?? undefined,
    createdAt: user.createdAt.toISOString(),
  };
}
