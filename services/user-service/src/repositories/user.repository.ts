/**
 * User Repository
 * Extends BaseRepository for User-specific database operations.
 * All Prisma usage for the User model is isolated here.
 */
import { Prisma, User } from '@prisma/client';
import { prisma } from '../config/prisma.js';

class UserRepository {
  constructor(private db = prisma) {}

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

  /**
   * Soft delete a user — sets deletedAt timestamp and status to DELETED.
   * Does NOT physically remove the record from the database.
   */
  async softDelete(id: string): Promise<User> {
    const gracePeriodEnd = new Date();
    gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 30);
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

  // search any email (to restore)
  async findAnyEmail(email: string): Promise<User | null> {
    return this.db.user.findFirst({
      where: {
        email: email.toLowerCase().trim(),
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
  // Restore Account
  async restoreAccount(id: string, newPassword?: string): Promise<User> {
    return this.db.user.update({
      where: { id },
      data: {
        deletedAt: null,
        status: 'ACTIVE',
        gracePeriodEnd: null,
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
    return new Date() < user.gracePeriodEnd;
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
}

/** Singleton instance */
export const userRepository = new UserRepository();
