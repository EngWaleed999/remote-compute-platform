/**
 * User Service
 * Business logic for user profile management.
 * Handles: getMe, updateMe, deleteMe.
 *
 * Security additions:
 * - deleteMe now bumps tokenVersion to invalidate all access tokens
 * - deleteMe now creates audit log entry
 * - deleteMe invalidates Redis cache
 */
import { AppError } from '@repo/shared-utils';
import { userRepository } from '../repositories/user.repository.js';
import { sessionRepository } from '../repositories/session.repository.js';
import { auditService } from './audit.service.js';
import { toUserResponse } from '../mappers/user.mapper.js';
import type {
  UserResponseDto,
  UpdateProfileRequestDto,
} from '../dto/user.dto.js';
import { logger } from '../config/logger.js';
import { invalidateCachedTokenVersion } from '../cache/strategies/token-version.cache.js';

class UserServiceClass {
  /**
   * Get the authenticated user's profile.
   * @throws AppError(404) if user not found (shouldn't happen for valid tokens)
   */
  async getMe(userId: string): Promise<UserResponseDto> {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found', {
        statusCode: 404,
        code: 'USER_NOT_FOUND',
      });
    }

    // Check if account is soft-deleted
    if (user.deletedAt) {
      throw new AppError('Account has been deleted', {
        statusCode: 410,
        code: 'ACCOUNT_DELETED',
      });
    }

    return toUserResponse(user);
  }

  /**
   * Update the authenticated user's profile.
   * Only allows updating fields defined in the OpenAPI PATCH /users/me schema.
   */
  async updateMe(
    userId: string,
    dto: UpdateProfileRequestDto
  ): Promise<UserResponseDto> {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found', {
        statusCode: 404,
        code: 'USER_NOT_FOUND',
      });
    }

    // Build update data — only include fields that were provided
    const updateData: Record<string, unknown> = {};
    if (dto.name !== undefined) {
      updateData.name = dto.name;
    }

    // Skip DB call if nothing to update
    if (Object.keys(updateData).length === 0) {
      return toUserResponse(user);
    }

    const updatedUser = await userRepository.update(userId, updateData);

    logger.info({ message: 'User profile updated', userId });

    return toUserResponse(updatedUser);
  }

  /**
   * Soft-delete the authenticated user's account.
   * - Sets deletedAt + status to DELETED
   * - Bumps tokenVersion → all existing access tokens become invalid
   * - Revokes all active sessions (forces logout everywhere)
   * - Invalidates Redis cache
   * - Creates audit log entry
   */
  async deleteMe(userId: string, ipAddress?: string): Promise<void> {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found', {
        statusCode: 404,
        code: 'USER_NOT_FOUND',
      });
    }

    // Soft delete the user — set 30-day grace period for potential restoration
    const gracePeriodEnd = new Date();
    gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 30);
    await userRepository.softDelete(userId, gracePeriodEnd);

    // Bump tokenVersion → immediately invalidates all access tokens
    const bumpedUser = await userRepository.bumpTokenVersion(userId);
    await invalidateCachedTokenVersion(userId, bumpedUser.tokenVersion);

    // Revoke all sessions — user is logged out everywhere
    await sessionRepository.revokeAllUserSessions(userId, 'ACCOUNT_DELETED');

    // Audit log
    auditService.log({
      userId,
      action: 'ACCOUNT_DELETED',
      description: 'Account soft-deleted with 30-day grace period',
      ipAddress,
    });

    logger.info({ message: 'User account deleted (soft)', userId });
  }
}

/** Singleton instance */
export const userService = new UserServiceClass();
