import { describe, it, expect, vi, beforeEach } from 'vitest';
import { otpService } from '../../src/services/otp.service';
import { otpRepository } from '../../src/repositories/otp.repository';
import { emailService } from '../../src/services/email.service';
import { AppError } from '@repo/shared-utils';
import crypto from 'crypto';

// ═══════════════════════════════════════════════════
// 1️⃣ Mocks Setup
// ═══════════════════════════════════════════════════

vi.mock('../../src/repositories/otp.repository', () => ({
  otpRepository: {
    hasCooldown: vi.fn(),
    getCooldownTTL: vi.fn(),
    getAttempts: vi.fn(),
    deleteAttempts: vi.fn(),
    deleteOtp: vi.fn(),
    getOtp: vi.fn(),
    setOtp: vi.fn(),
    setCooldown: vi.fn(),
    incrementAttempts: vi.fn(),
    incrementResendCount: vi.fn(),
    deleteAll: vi.fn(),
    verifyOtpAtomic: vi.fn(),
  },
}));

vi.mock('../../src/services/email.service', () => ({
  emailService: {
    sendEmailVerifiy: vi.fn(),
  },
}));

// Helper to hash OTP same way token.util does
const hashToken = (token: string) => crypto.createHash('sha256').update(token).digest('hex');

// ═══════════════════════════════════════════════════
// 2️⃣ Tests
// ═══════════════════════════════════════════════════

describe('OtpService - requestOtp()', () => {
  const mockUserId = '123-uuid';
  const mockEmail = 'test@example.com';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('UNHAPPY: should reject if user is on cooldown', async () => {
    vi.mocked(otpRepository.hasCooldown).mockResolvedValue(true);
    vi.mocked(otpRepository.getCooldownTTL).mockResolvedValue(45);

    await expect(otpService.requestOtp(mockUserId, mockEmail)).rejects.toThrowError(AppError);
    expect(emailService.sendEmailVerifiy).not.toHaveBeenCalled();
  });

  it('UNHAPPY: should increase cooldown to 5 minutes after 3 resends', async () => {
    vi.mocked(otpRepository.hasCooldown).mockResolvedValue(false);
    vi.mocked(otpRepository.incrementResendCount).mockResolvedValue(3);

    const result = await otpService.requestOtp(mockUserId, mockEmail);

    expect(result.cooldown).toBe(300); // 5 minutes
    expect(otpRepository.setCooldown).toHaveBeenCalledWith(mockUserId, 300);
  });

  it('HAPPY: should successfully send OTP if all conditions are met', async () => {
    vi.mocked(otpRepository.hasCooldown).mockResolvedValue(false);
    vi.mocked(otpRepository.incrementResendCount).mockResolvedValue(1);

    const result = await otpService.requestOtp(mockUserId, mockEmail);

    expect(result.cooldown).toBe(60);
    expect(otpRepository.deleteAttempts).toHaveBeenCalledWith(mockUserId);
    expect(otpRepository.setOtp).toHaveBeenCalled();
    expect(emailService.sendEmailVerifiy).toHaveBeenCalled();
  });
});

describe('OtpService - verifyOtp() (Atomic)', () => {
  const mockUserId = '123-uuid';
  const validOtp = '123456';
  const invalidOtp = '000000';
  const validHash = hashToken(validOtp);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('UNHAPPY: should throw MAX_ATTEMPTS_EXCEEDED if already locked out', async () => {
    // Lua script returns [-1, 5] for locked out
    vi.mocked(otpRepository.verifyOtpAtomic).mockResolvedValue([-1, 5]);

    await expect(otpService.verifyOtp(mockUserId, validOtp)).rejects.toThrowError(/Too many failed attempts/);
  });

  it('UNHAPPY: should throw OTP_EXPIRED if OTP is not found in Redis', async () => {
    // Lua script returns [-2, 0] for expired
    vi.mocked(otpRepository.verifyOtpAtomic).mockResolvedValue([-2, 0]);

    await expect(otpService.verifyOtp(mockUserId, validOtp)).rejects.toThrowError(/expired/);
  });

  it('UNHAPPY: should throw OTP_INVALID if OTP is wrong', async () => {
    // Lua script returns [0, 1] for wrong OTP (1 attempt)
    vi.mocked(otpRepository.verifyOtpAtomic).mockResolvedValue([0, 1]);

    await expect(otpService.verifyOtp(mockUserId, invalidOtp)).rejects.toThrowError(/Invalid verification code/);
  });

  it('UNHAPPY: should throw MAX_ATTEMPTS_EXCEEDED if wrong OTP reaches MAX attempts', async () => {
    // Lua script returns [-3, 5] when it hits the limit exactly
    vi.mocked(otpRepository.verifyOtpAtomic).mockResolvedValue([-3, 5]);

    await expect(otpService.verifyOtp(mockUserId, invalidOtp)).rejects.toThrowError(/Too many failed attempts/);
  });

  it('HAPPY & IDEMPOTENCY: second successful verification should fail as expired', async () => {
    // First call success [1, 0], second call expired [-2, 0]
    vi.mocked(otpRepository.verifyOtpAtomic)
      .mockResolvedValueOnce([1, 0])
      .mockResolvedValueOnce([-2, 0]);

    // First call
    const result = await otpService.verifyOtp(mockUserId, validOtp);
    expect(result).toBe(true);

    // Second call immediately after
    await expect(otpService.verifyOtp(mockUserId, validOtp)).rejects.toThrowError(/expired/);
  });
});
