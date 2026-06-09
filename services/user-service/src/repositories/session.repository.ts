/**
 * Session Repository
 * Database access layer for UserSession and LoginHistory operations.
 * Handles session CRUD, revocation, token family tracking, and reuse detection.
 *
 * Security changes (production upgrade):
 * - Refresh tokens stored as SHA-256 hashes (not plaintext)
 * - Token family tracking via familyId for refresh token rotation
 * - Reuse detection: findRevokedByRefreshTokenHash() for stolen token detection
 * - Access tokens no longer stored in DB (stateless JWTs)
 */
import { UserSession, LoginHistory, Prisma } from '@prisma/client-user';
import { prisma } from '../config/prisma.js';

class SessionRepository {
  constructor(private db = prisma) { }

  // ═══════════════════════════════════════════════════
  // Session CRUD
  // ═══════════════════════════════════════════════════

  /**
   * Create a new session with a hashed refresh token.
   * The familyId groups related sessions for rotation tracking.
   */
  async create(data: {
    userId: string;
    refreshTokenHash: string;
    familyId: string;
    expiresAt: Date;
    ipAddress?: string;
    userAgent?: string;
    deviceType?: string;
  }): Promise<UserSession> {
    return this.db.userSession.create({ data });
  }

  /**
   * Find a VALID (not revoked, not expired) session by its hashed refresh token.
   * Used during normal refresh flow.
   */
  async findValidByRefreshTokenHash(
    refreshTokenHash: string
  ): Promise<UserSession | null> {
    return this.db.userSession.findFirst({
      where: {
        refreshTokenHash,
        isValid: true,
        expiresAt: { gt: new Date() },
      },
    });
  }

  /**
   * Find ANY session (including revoked) by its hashed refresh token.
   * Used for reuse detection — if a revoked token is presented,
   * it indicates potential token theft.
   */
  async findAnyByRefreshTokenHash(
    refreshTokenHash: string
  ): Promise<UserSession | null> {
    return this.db.userSession.findFirst({
      where: { refreshTokenHash },
    });
  }

  /**
   * Find a specific session by its ID.
   * Used for targeted session revocation (logout with sessionId).
   */
  async findById(id: string): Promise<UserSession | null> {
    return this.db.userSession.findUnique({ where: { id } });
  }

  // ═══════════════════════════════════════════════════
  // Session Revocation
  // ═══════════════════════════════════════════════════

  /**
   * Revoke a specific session by setting isValid to false.
   * Records the revocation timestamp and reason for audit trail.
   */
  async revokeSession(id: string, reason: string): Promise<UserSession> {
    return this.db.userSession.update({
      where: { id },
      data: {
        isValid: false,
        revokedAt: new Date(),
        revokedReason: reason,
      },
    });
  }

  /**
   * Revoke all active sessions for a user.
   * Used during: password change, account deletion, forced re-authentication.
   */
  async revokeAllUserSessions(
    userId: string,
    reason = 'ALL_SESSIONS_REVOKED'
  ): Promise<void> {
    await this.db.userSession.updateMany({
      where: { userId, isValid: true },
      data: {
        isValid: false,
        revokedAt: new Date(),
        revokedReason: reason,
      },
    });
  }

  /**
   * Revoke all sessions in a token family.
   * Triggered when refresh token reuse is detected — indicates token theft.
   * Revokes the entire rotation chain to force re-authentication.
   */
  async revokeSessionFamily(
    familyId: string,
    reason = 'REFRESH_TOKEN_REUSE_DETECTED'
  ): Promise<void> {
    await this.db.userSession.updateMany({
      where: { familyId, isValid: true },
      data: {
        isValid: false,
        revokedAt: new Date(),
        revokedReason: reason,
      },
    });
  }

  // ═══════════════════════════════════════════════════
  // Login History
  // ═══════════════════════════════════════════════════

  /**
   * Record a login attempt (success or failure) in the login history.
   */
  async createLoginHistory(data: {
    userId: string;
    success: boolean;
    method: string;
    ipAddress: string;
    userAgent?: string;
    deviceType?: string;
    failureReason?: string;
  }): Promise<LoginHistory> {
    return this.db.loginHistory.create({ data });
  }
}

/** Singleton instance */
export const sessionRepository = new SessionRepository();
