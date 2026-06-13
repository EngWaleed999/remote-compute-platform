import crypto from 'crypto'
import { redis } from '../config/redis.js';
import { fa } from 'zod/v4/locales';
class OtpService {

    generateOTP(): string {
        const otp = crypto.randomInt(100000, 999999)
        return otp.toString()
    }
    async storeOTP(userId: string, opt: string): Promise<void> {
        const key = `otp:verification:${userId}`;
        await redis.set(key, opt, 'EX', 300)


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