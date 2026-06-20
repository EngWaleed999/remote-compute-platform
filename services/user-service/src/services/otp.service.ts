/**
 * OTP Service
 * ───────────
 * Workflow orchestrator for OTP operations.
 *
 * SINGLE RESPONSIBILITY:
 *   - This file owns the BUSINESS LOGIC and FLOW (what happens, in what order).
 *   - It does NOT touch Redis directly — that's otp.repository.ts.
 *   - It does NOT send emails directly — that's email.service.ts.
 *   - It does NOT validate users — the caller (auth.service) does that.
 *
 * Architecture:
 *   auth.service (caller)
 *     → otp.service (workflow: generate → hash → store → cooldown → email)
 *       → otp.repository (Redis: SET, GET, DEL, INCR)
 *       → email.service (SMTP: send)
 */

import crypto from 'crypto';
import { otpRepository } from '../repositories/otp.repository.js';
import { emailService } from './email.service.js';
import { hashToken } from '../utils/token.util.js';
import { OTP_LENGTH, OTP_MAX_ATTEMPTS } from '../constants/otp.constanst.js';
import { logger } from '../config/logger.js';
import { AppError } from '@repo/shared-utils';

class OtpService {

  // ═══════════════════════════════════════════════════
  // 1️⃣  Request OTP (generate + send)
  // ═══════════════════════════════════════════════════

  /**
   * Full "request OTP" workflow.
   *
   * Flow:
   *   1. Check cooldown        → reject if too soon
   *   2. Generate OTP          → 6-digit random number
   *   3. Hash OTP              → SHA-256 before storage
   *   4. Store OTP in Redis    → hashed value with TTL
   *   5. Reset attempts        → fresh attempts for new OTP
   *   6. Set cooldown          → prevent resend spam
   *   7. Send email            → deliver plaintext OTP to user
   *
   * WHY does this method receive `email` AND `userId`?
   * ──────────────────────────────────────────────────
   * - `userId` → Redis keys are per-user (otp:verification:{userId})
   * - `email`  → email.service needs the recipient address
   * The caller (auth.service) already has both from the DB lookup
   * it did to validate the user exists and emailVerified === false.
   *
   * WHY doesn't this method validate the user?
   * ───────────────────────────────────────────
   * User validation (exists? emailVerified?) requires a DB query.
   * That's auth.service's job — it owns the user lifecycle.
   * OTP service is a pure utility: "give me a userId + email,
   * I'll handle the OTP flow."
   */
  async requestOtp(userId: string, email: string): Promise<void> {

    // 1. Check cooldown — reject early if user is rate-limited
    const onCooldown = await otpRepository.hasCooldown(userId);
    if (onCooldown) {
      const remainingSeconds = await otpRepository.getCooldownTTL(userId);
      throw new AppError(
        `Please wait ${remainingSeconds} seconds before requesting a new code`,
        {
          statusCode: 429,
          code: 'OTP_COOLDOWN_ACTIVE',
        }
      );
    }

    // 2. Generate OTP — cryptographically secure random digits
    const otp = this.generateOtp();

    // 3. Hash OTP — never store plaintext in Redis
    const otpHash = hashToken(otp);

    // 4. Store hashed OTP in Redis with TTL
    await otpRepository.setOtp(userId, otpHash);

    // 5. Reset failed attempts — new OTP = fresh attempts
    await otpRepository.deleteAttempts(userId);

    // 6. Set cooldown — BEFORE email to prevent spam even if email fails
    await otpRepository.setCooldown(userId);

    // 7. Send email with plaintext OTP
    await emailService.sendEmailVerifiy(email, otp);

    logger.info({
      message: 'OTP requested successfully',
      userId,
    });
  }

  // ═══════════════════════════════════════════════════
  // 2️⃣  Verify OTP
  // ═══════════════════════════════════════════════════

  /**
   * Verify the OTP entered by the user.
   *
   * Flow:
   *   1. Check if locked out     → reject if max attempts reached
   *   2. Get stored OTP hash     → reject if expired / not found
   *   3. Hash entered OTP        → compare hashes (not plaintext)
   *   4. On mismatch             → increment attempts, check lockout
   *   5. On match                → delete all OTP keys (consumed)
   *
   * Returns true on success, throws AppError on failure.
   *
   * WHY throw instead of returning false?
   * ─────────────────────────────────────
   * The caller (auth.service) needs different error codes for:
   *   - Expired OTP         → "Request a new code"
   *   - Wrong OTP           → "Invalid code, X attempts remaining"
   *   - Locked out          → "Too many attempts, request a new code"
   * Returning a boolean loses this context. Throwing lets us
   * attach the right HTTP status + error code for each case.
   */
  async verifyOtp(userId: string, enteredOtp: string): Promise<true> {

    // 1. Check lockout — are they already blocked?
    const currentAttempts = await otpRepository.getAttempts(userId);
    if (currentAttempts >= OTP_MAX_ATTEMPTS) {
      // Delete the OTP — force them to request a new one
      await otpRepository.deleteOtp(userId);

      throw new AppError(
        'Too many failed attempts. Please request a new verification code',
        {
          statusCode: 429,
          code: 'OTP_MAX_ATTEMPTS_EXCEEDED',
        }
      );
    }

    // 2. Get stored OTP hash from Redis
    const storedHash = await otpRepository.getOtp(userId);
    if (!storedHash) {
      throw new AppError(
        'Verification code has expired. Please request a new one',
        {
          statusCode: 400,
          code: 'OTP_EXPIRED',
        }
      );
    }

    // 3. Hash the entered OTP and compare
    const enteredHash = hashToken(enteredOtp);

    if (enteredHash !== storedHash) {
      // 4. Wrong OTP — increment attempts
      const newCount = await otpRepository.incrementAttempts(userId);
      const remaining = OTP_MAX_ATTEMPTS - newCount;

      // If this attempt just hit the limit, delete the OTP
      if (newCount >= OTP_MAX_ATTEMPTS) {
        await otpRepository.deleteOtp(userId);

        throw new AppError(
          'Too many failed attempts. Please request a new verification code',
          {
            statusCode: 429,
            code: 'OTP_MAX_ATTEMPTS_EXCEEDED',
          }
        );
      }

      throw new AppError(
        `Invalid verification code. ${remaining} attempt(s) remaining`,
        {
          statusCode: 400,
          code: 'OTP_INVALID',
        }
      );
    }

    // 5. Match — clean up all OTP data (verification + attempts + cooldown)
    await otpRepository.deleteAll(userId);

    logger.info({
      message: 'OTP verified successfully',
      userId,
    });

    return true;
  }

  // ═══════════════════════════════════════════════════
  // 3️⃣  Internal Helpers
  // ═══════════════════════════════════════════════════

  /**
   * Generate a cryptographically secure OTP of OTP_LENGTH digits.
   *
   * WHY crypto.randomInt instead of Math.random?
   * ─────────────────────────────────────────────
   * Math.random() uses a PRNG seeded from a weak source — predictable
   * if the attacker knows the seed. crypto.randomInt() uses the OS
   * entropy pool (e.g., /dev/urandom) — cryptographically secure.
   *
   * WHY compute min/max from OTP_LENGTH instead of hardcoding 100000–999999?
   * ────────────────────────────────────────────────────────────────────────
   * If we ever change OTP_LENGTH in constants (e.g., 8 digits for
   * higher security), this function adapts automatically.
   */
  private generateOtp(): string {
    const min = Math.pow(10, OTP_LENGTH - 1);       // 100000
    const max = Math.pow(10, OTP_LENGTH) - 1;       // 999999
    const otp = crypto.randomInt(min, max + 1);     // +1 because randomInt upper bound is exclusive
    return otp.toString();
  }
}

/** Singleton instance */
export const otpService = new OtpService();