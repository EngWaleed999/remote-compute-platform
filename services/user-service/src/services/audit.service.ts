/**
 * Audit Service
 * Cross-cutting concern for logging security-critical authentication events.
 *
 * Design decisions:
 * - Fire-and-forget: audit logging NEVER blocks the main request flow
 * - Failure-safe: if audit logging fails, it's logged to Winston but doesn't throw
 * - The service acts as a facade over the audit repository
 *
 * Events tracked:
 * - LOGIN_SUCCESS / LOGIN_FAILURE
 * - USER_REGISTERED
 * - TOKEN_REFRESHED / REFRESH_TOKEN_REUSE
 * - USER_LOGOUT
 * - RESTORE_REQUESTED / ACCOUNT_RESTORED
 * - ACCOUNT_DELETED
 * - ALL_SESSIONS_REVOKED / TOKEN_VERSION_BUMPED
 */
import { UserAction } from '@prisma/client';
import {
  auditRepository,
  type CreateAuditLogInput,
} from '../repositories/audit.repository.js';
import { logger } from '../config/logger.js';
import type { Prisma } from '@prisma/client';

/** Simplified input for the audit service (metadata is optional JSON) */
export interface AuditEvent {
  userId: string;
  action: UserAction;
  description?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

class AuditServiceClass {
  /**
   * Log a security-critical event.
   * Fire-and-forget — never throws, never blocks.
   */
  async log(event: AuditEvent): Promise<void> {
    try {
      const data: CreateAuditLogInput = {
        userId: event.userId,
        action: event.action,
        description: event.description,
        ipAddress: event.ipAddress,
        userAgent: event.userAgent,
        // Store flexible metadata in the newValues JSON column
        newValues: event.metadata
          ? (event.metadata as Prisma.InputJsonValue)
          : undefined,
      };

      await auditRepository.create(data);
    } catch (error) {
      // NEVER throw from audit logging — log the failure and move on
      logger.error({
        message: 'Failed to write audit log',
        event: event.action,
        userId: event.userId,
        error: (error as Error).message,
      });
    }
  }
}

/** Singleton instance */
export const auditService = new AuditServiceClass();
