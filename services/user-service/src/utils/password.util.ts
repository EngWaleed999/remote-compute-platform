/**
 * Password Utility
 * Handles secure password hashing and comparison using bcryptjs.
 * NEVER stores or logs plain-text passwords.
 */
import bcrypt from 'bcryptjs';

/** Number of salt rounds for bcrypt — 12 provides strong security without excessive latency */
const SALT_ROUNDS = 12;

/**
 * Hash a plain-text password using bcrypt.
 * @param plain - The plain-text password to hash
 * @returns The bcrypt hash string
 */
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

/**
 * Compare a plain-text password against a bcrypt hash.
 * @param plain - The plain-text password to verify
 * @param hash - The stored bcrypt hash
 * @returns True if the password matches the hash
 */
export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
