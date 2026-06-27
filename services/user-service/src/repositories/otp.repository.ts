import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { redis } from '../config/redis.js';
import { otpKeys } from '../keys/otp.keys.js';
import { OTP_TTL, OTP_COOLDOWN } from '../constants/otp.constanst.js';

// Setup Lua Scripts
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const verifyOtpScript = fs.readFileSync(path.join(__dirname, 'lua', 'verify_otp.lua'), 'utf-8');
/**
 * fun redis.defineCommand :
 * 1 - read Lua file onec when server is running 
 * 2 - sending to redis and it's stored in its own cache 
 * 3 - it provides us with function verifyOtpAtomic that we use as if it were a basic command in redis 
 */
redis.defineCommand('verifyOtpAtomic', {
  numberOfKeys: 3,
  lua: verifyOtpScript,
});

class OtpRepository {

  // ═══════════════════════════════════════════════════
  // 1️⃣  Verification (the OTP value)
  // ═══════════════════════════════════════════════════

  /**
   * Atomic OTP Verification using Lua Script.
   * Returns: [statusCode, data]
   *   [ 1, 0]         => Success
   *   [-1, attempts]  => Locked Out
   *   [-2, attempts]  => Expired
   *   [-3, newCount]  => Hit Max Attempts Now
   *   [ 0, newCount]  => Wrong OTP
   */
  async verifyOtpAtomic(
    userId: string,
    enteredHash: string,
    maxAttempts: number
  ): Promise<[number, number]> {
    const keys = [
      otpKeys.verification(userId),
      otpKeys.attempts(userId),
      otpKeys.cooldown(userId),
    ];
    
    // Call the custom Lua command
    return (redis as any).verifyOtpAtomic(
      keys[0], keys[1], keys[2],
      enteredHash,
      maxAttempts,
      OTP_TTL
    );
  }

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
    await redis.expire(key, OTP_TTL);
    return count;
  }

  async getAttempts(userId: string): Promise<number> {
    const key = otpKeys.attempts(userId);
    const value = await redis.get(key);
    return value ? parseInt(value, 10) : 0;
  }

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
  // 5️⃣  Email Change Tracking (abuse prevention)
  // ═══════════════════════════════════════════════════

  async incrementEmailChanges(userId: string): Promise<number> {
    const key = otpKeys.emailChanges(userId);
    const count = await redis.incr(key);

    // 24-hour rolling window — resets after a day of inactivity
    await redis.expire(key, 86400);

    return count;
  }

  async getEmailChanges(userId: string): Promise<number> {
    const key = otpKeys.emailChanges(userId);
    const value = await redis.get(key);
    return value ? parseInt(value, 10) : 0;
  }
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
