
import { redis } from '../config/redis.js';
import { otpKeys } from '../keys/otp.keys.js';
import { OTP_TTL, OTP_COOLDOWN } from '../constants/otp.constanst.js';

class OtpRepository {

  // ═══════════════════════════════════════════════════
  // 1️⃣  Verification (the OTP value)
  // ═══════════════════════════════════════════════════

  async setOtp(userId: string, otpHash: string): Promise<void> {
    const key = otpKeys.verification(userId);
    await redis.set(key, otpHash, 'EX', OTP_TTL);
  }


  async getOtp(userId: string): Promise<string | null> {
    const key = otpKeys.verification(userId);
    return redis.get(key);
  }


  async deleteOtp(userId: string): Promise<void> {
    const key = otpKeys.verification(userId);
    await redis.del(key);
  }

  // ═══════════════════════════════════════════════════
  // 2️⃣  Attempts (failed verification counter)
  // ═══════════════════════════════════════════════════

  async incrementAttempts(userId: string): Promise<number> {
    const key = otpKeys.attempts(userId);
    const count = await redis.incr(key);

    // Ensure TTL is set (critical on first INCR when key is new)
    await redis.expire(key, OTP_TTL);

    return count;
  }

  /**
   * Get the current failed attempt count.
   * Returns 0 if no attempts recorded (key doesn't exist).
   */
  async getAttempts(userId: string): Promise<number> {
    const key = otpKeys.attempts(userId);
    const value = await redis.get(key);
    return value ? parseInt(value, 10) : 0;
  }

  /**
   * Reset the attempt counter.
   * Called when a new OTP is generated (user gets fresh attempts).
   */
  async deleteAttempts(userId: string): Promise<void> {
    const key = otpKeys.attempts(userId);
    await redis.del(key);
  }

  // ═══════════════════════════════════════════════════
  // 3️⃣  Cooldown (resend throttle)
  // ═══════════════════════════════════════════════════


  async setCooldown(userId: string, durationInSeconds: number = OTP_COOLDOWN): Promise<void> {
    const key = otpKeys.cooldown(userId);
    await redis.set(key, '1', 'EX', durationInSeconds);
  }


  async hasCooldown(userId: string): Promise<boolean> {
    const key = otpKeys.cooldown(userId);
    const exists = await redis.exists(key);
    return exists === 1;
  }

  async getCooldownTTL(userId: string): Promise<number> {
    const key = otpKeys.cooldown(userId);
    return redis.ttl(key);
  }

  // ═══════════════════════════════════════════════════
  // 4️⃣  Resend Tracking (Dynamic Cooldown)
  // ═══════════════════════════════════════════════════

  async incrementResendCount(userId: string): Promise<number> {
    const key = otpKeys.resendCount(userId);
    const count = await redis.incr(key);
    
    // Set TTL to 24 hours (86400s) on every increment to maintain a rolling window
    await redis.expire(key, 86400);
    
    return count;
  }

  // ═══════════════════════════════════════════════════
  // 4️⃣  Cleanup (delete all OTP data for a user)
  // ═══════════════════════════════════════════════════

  async deleteAll(userId: string): Promise<void> {
    const keys = [
      otpKeys.verification(userId),
      otpKeys.attempts(userId),
      otpKeys.cooldown(userId),
    ];

    // DEL accepts multiple keys in a single call — one round-trip
    await redis.del(...keys);
  }
}

/** Singleton instance */
export const otpRepository = new OtpRepository();
