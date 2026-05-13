/**
 * Token & Cryptographic Utility
 * Provides hashing and secure random generation for:
 * - Refresh tokens (SHA-256 hash before DB storage)
 * - Restore verification codes (6-char alphanumeric)
 * - CSRF tokens (32-byte hex string)
 *
 * Uses Node.js built-in `crypto` module — no external dependencies.
 */
import crypto from 'crypto';

/**
 * Hash a token string using SHA-256.
 * Used for refresh tokens and restore codes before storing in DB.
 *
 * Why SHA-256 (not bcrypt)?
 * - Refresh tokens are high-entropy random strings (not user-chosen passwords)
 * - SHA-256 is fast (μs) and deterministic — needed for DB lookups
 * - bcrypt is designed for low-entropy passwords — overkill here
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Generate a cryptographically secure 6-character alphanumeric restore code.
 * Uses crypto.randomBytes for true randomness (not Math.random).
 *
 * Entropy: 6 chars from [A-Z0-9] = 36^6 ≈ 2.18 billion combinations
 */
export function generateRestoreCode(): string {
  const bytes = crypto.randomBytes(4); // 32 bits
  const num = bytes.readUInt32BE(0);
  // Convert to base-36 (0-9 + A-Z), take last 6 chars, uppercase
  return num.toString(36).toUpperCase().slice(-6).padStart(6, '0');
}

/**
 * Generate a cryptographically secure CSRF token.
 * 32 bytes → 64 hex characters.
 *
 * Used with the Double Submit Cookie pattern:
 * - Server sets this in a non-HttpOnly cookie
 * - Client reads it and sends it back in X-CSRF-Token header
 * - Server compares header vs cookie on state-changing requests
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex');
}
