/**
 * Session Repository
 * Extends BaseRepository for UserSession and LoginHistory database operations.
 * Handles session CRUD, revocation, and login attempt logging.
 */
import { UserSession, LoginHistory, User, Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';

class SessionRepository {
  constructor(private db = prisma) {}

  /**
   * Find a valid session by its refresh token.
   * Only returns sessions that are still valid and not expired.
   */
  async findByRefreshToken(refreshToken: string): Promise<UserSession | null> {
    return this.db.userSession.findFirst({
      where: {
        refreshToken,
        isValid: true,
        expiresAt: { gt: new Date() },
      },
    });
  }

  async create(
    data: Prisma.UserSessionUncheckedCreateInput
  ): Promise<UserSession> {
    return this.db.userSession.create({ data });
  }

  /**
   * Find a valid session by its access token.
   */
  async findByToken(token: string): Promise<UserSession | null> {
    return this.db.userSession.findFirst({
      where: {
        token,
        isValid: true,
      },
    });
  }

  /**
   * Revoke a specific session by setting isValid to false.
   * Records the revocation timestamp and reason.
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
   * Used during logout-all, password change, or account deletion.
   */
  async revokeAllUserSessions(userId: string): Promise<void> {
    await this.db.userSession.updateMany({
      where: { userId, isValid: true },
      data: {
        isValid: false,
        revokedAt: new Date(),
        revokedReason: 'ALL_SESSIONS_REVOKED',
      },
    });
  }

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
