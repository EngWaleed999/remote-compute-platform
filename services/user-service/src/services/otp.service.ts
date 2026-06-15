import crypto from 'crypto'
import { redis } from '../config/redis.js';
class OtpService {

    generateOTP(): string {
        const otp = crypto.randomInt(100000, 999999)
        return otp.toString()
    }
    async storeOTP(userId: string, otp: string): Promise<void> {
        const key = `otp:verification:${userId}`;
        await redis.set(key, otp, 'EX', 300)


    }
    async verifiyOTP(userId: string, enteredOpt: string): Promise<boolean> {
        const key = `otp:verification:${userId}`;
        const storeOtp = await redis.get(key)
        if (!storeOtp) {
            return false
        }
        if (enteredOpt === storeOtp) {
            await redis.del(key)
            return true
        }
        return false
    }

}

export const otpService = new OtpService()