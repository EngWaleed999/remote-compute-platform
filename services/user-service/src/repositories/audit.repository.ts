/**
 * Audit Repository
 * Database access layer for UserAuditLog operations.
 * Uses the existing UserAuditLog Prisma model.
 *
 * All audit persistence is isolated here — the audit service
 * delegates to this repository for DB writes.
 */
import { UserAuditLog, UserAction, Prisma } from '@prisma/client-user';
import { prisma } from '../config/prisma.js';

/** Input shape for creating an audit log entry */
export interface CreateAuditLogInput {
  userId: string;
  action: UserAction;
  description?: string;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  oldValues?: Prisma.InputJsonValue;
  newValues?: Prisma.InputJsonValue;
}

class AuditRepository {
  constructor(private db = prisma) {}

  /**
   * Create a single audit log entry.
   */
  async create(data: CreateAuditLogInput): Promise<UserAuditLog> {
    return this.db.userAuditLog.create({ data });
  }

  /**
   * Find audit logs for a specific user with pagination.
   * Ordered by most recent first.
   */
  async findByUserId(
    userId: string,
    options: { take?: number; skip?: number } = {}
  ): Promise<UserAuditLog[]> {
    return this.db.userAuditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: options.take ?? 50,
      skip: options.skip ?? 0,
    });
  }

  /**
   * Find audit logs by action type (e.g., all REFRESH_TOKEN_REUSE events).
   * Useful for security investigations.
   */
  async findByAction(
    action: UserAction,
    options: { take?: number; skip?: number } = {}
  ): Promise<UserAuditLog[]> {
    return this.db.userAuditLog.findMany({
      where: { action },
      orderBy: { createdAt: 'desc' },
      take: options.take ?? 50,
      skip: options.skip ?? 0,
    });
  }
}

/** Singleton instance */
export const auditRepository = new AuditRepository();
