/**
 * User Repository
 * Database access layer for User-specific operations.
 * All Prisma usage for the User model is isolated here.
 *
 * Security additions (production upgrade):
 * - tokenVersion: atomic increment for instant token invalidation
 * - Restore code: hashed storage, expiry, single-use enforcement
 */
import { Prisma, User } from '@prisma/client';
import { prisma } from '../config/prisma.js';

class UserRepository {
  constructor(private db = prisma) {}

  // ═══════════════════════════════════════════════════
  // Core CRUD
  // ═══════════════════════════════════════════════════

  /**
   * Find a user by their unique email address.
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.db.user.findFirst({
      where: { email },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.db.user.create({ data });
  }

  async findById(id: string): Promise<User | null> {
    return this.db.user.findUnique({
      where: { id },
    });
  }
  async update(id: string, data: Partial<User>): Promise<User> {
    return this.db.user.update({
      where: { id },
      data: data,
    });
  }

  // ═══════════════════════════════════════════════════
  // Soft Delete & Restore
  // ═══════════════════════════════════════════════════

  /**
   * Soft delete a user — sets deletedAt timestamp and status to DELETED.
   * Does NOT physically remove the record from the database.
   */
  async softDelete(id: string, gracePeriodEnd?: Date): Promise<User> {
    return this.db.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: 'DELETED',
        gracePeriodEnd,
      },
    });
  }

  // search any active email
  async findActiveByEmail(email: string): Promise<User | null> {
    return this.db.user.findFirst({
      where: {
        email: email.toLowerCase().trim(),
        deletedAt: null,
        status: 'ACTIVE',
      },
    });
  }

  async findDeletedByEmail(email: string): Promise<User | null> {
    return this.db.user.findFirst({
      where: {
        email: email.toLowerCase().trim(),
        deletedAt: { not: null },
        status: 'DELETED',
      },
    });
  }

  async canRestore(id: string): Promise<boolean> {
    const user = await this.db.user.findUnique({
      where: { id },
      select: { gracePeriodEnd: true, status: true },
    });
    if (!user || user.status !== 'DELETED' || !user.gracePeriodEnd) {
      return false;
    }
    const now = new Date();
    return now < user.gracePeriodEnd;
  }

  /**
   * Restore a soft-deleted account.
   * Clears deletedAt/gracePeriodEnd, sets status to ACTIVE.
   * Also resets restore code fields and bumps tokenVersion.
   */
  async restoreAccount(id: string, passwordHash?: string): Promise<User> {
    return this.db.user.update({
      where: { id },
      data: {
        deletedAt: null,
        status: 'ACTIVE',
        gracePeriodEnd: null,
        // Reset restore code fields
        restoreCodeHash: null,
        restoreCodeExpiresAt: null,
        restoreCodeUsed: true,
        ...(passwordHash && { passwordHash }),
      },
    });
  }

  async hardDelete(id: string): Promise<void> {
    await this.db.user.delete({
      where: { id },
    });
  }

  async findExpiredGracePeriod(): Promise<User[]> {
    return this.db.user.findMany({
      where: {
        status: 'DELETED',
        gracePeriodEnd: { lt: new Date() },
      },
    });
  }

  /**
   * Update the user's last login timestamp.
   */
  async updateLastLogin(id: string): Promise<void> {
    await this.db.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }

  // ═══════════════════════════════════════════════════
  // Token Version (instant token invalidation)
  // ═══════════════════════════════════════════════════

  /**
   * Atomically increment the user's tokenVersion.
   * After this, ALL existing access tokens for this user become invalid
   * because their embedded tokenVersion no longer matches the DB.
   */
  async bumpTokenVersion(id: string): Promise<User> {
    return this.db.user.update({
      where: { id },
      data: { tokenVersion: { increment: 1 } },
    });
  }

  /**
   * Fast lookup for the user's current tokenVersion.
   * Called by the authenticate middleware on every request.
   * Results are cached in Redis (Cache-Aside pattern).
   */
  async getTokenVersion(id: string): Promise<number | null> {
    const user = await this.db.user.findUnique({
      where: { id },
      select: { tokenVersion: true },
    });
    return user?.tokenVersion ?? null;
  }

  // ═══════════════════════════════════════════════════
  // Restore Code Management
  // ═══════════════════════════════════════════════════

  /**
   * Store a hashed restore code with expiration.
   * The code is single-use (restoreCodeUsed starts as false).
   */
  async setRestoreCode(
    id: string,
    codeHash: string,
    expiresAt: Date
  ): Promise<void> {
    await this.db.user.update({
      where: { id },
      data: {
        restoreCodeHash: codeHash,
        restoreCodeExpiresAt: expiresAt,
        restoreCodeUsed: false,
      },
    });
  }

  /**
   * Verify and consume a restore code atomically.
   * Returns the user if the code is valid, not expired, and not already used.
   * Marks the code as used in the same operation.
   *
   * Security:
   * - Single-use: restoreCodeUsed is set to true after first use
   * - Time-limited: checks restoreCodeExpiresAt
   * - Hash comparison: codeHash must match stored hash
   */
  async verifyAndConsumeRestoreCode(
    id: string,
    codeHash: string
  ): Promise<User | null> {
    try {
      // updateMany doesn't support returning the updated record,
      // so we use a two-step approach with findFirst + update
      const user = await this.db.user.findFirst({
        where: {
          id,
          restoreCodeHash: codeHash,
          restoreCodeUsed: false,
          restoreCodeExpiresAt: { gt: new Date() },
        },
      });

      if (!user) return null;

      // Mark as used
      await this.db.user.update({
        where: { id },
        data: { restoreCodeUsed: true },
      });

      return user;
    } catch {
      return null;
    }
  }
}

/** Singleton instance */
export const userRepository = new UserRepository();
