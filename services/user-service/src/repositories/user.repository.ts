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
    return this.db.user.findUnique({
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
    return this.db.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: 'DELETED',
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
