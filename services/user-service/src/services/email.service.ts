import nodemailer from 'nodemailer'
import { logger } from '../config/logger.js';
import { auditService } from './audit.service.js';
import { userRepository } from '../repositories/user.repository.js';
import { AppError } from '@repo/shared-utils';
import { response } from 'express';
import { Command } from 'ioredis';



class EmailService {
    private transporter: nodemailer.Transporter
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            }
        })
    }

    async sendEmailVerifiy(email: string, otp: string): Promise<void> {

        const mailOptions = {
            from: process.env.EMAIL_FROM, // اسم المرسل وبريده (مثلاً: NovaCPU Team)
            to: email,                   // المتغير القادم من الدالة
            subject: 'Verify Your Email - NovaCPU', // عنوان الرسالة
            html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #333; text-align: center;">Welcome to NovaCPU</h2>
          <p>Thank you for signing up. Please use the following One-Time Password (OTP) to verify your email address:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #007bff; background: #f0f4f8; padding: 10px 20px; border-radius: 4px;">
              ${otp}
            </span>
          </div>
          <p style="font-size: 13px; color: #666;">This code is valid for 15 minutes. Please do not share this code with anyone.</p>
        </div>
      `, // دمج الـ otp ديناميكياً داخل قالب الـ HTML
        };
        try {

            await this.transporter.sendMail(mailOptions)

            logger.error({ message: "Send Verification successfully to", email })
        } catch (error: any) {
            console.log("========================================")
            console.error("Nodemailer Detailed Error", {
                code: error.code,
                response: error.response,
                Command: error.command,
                message: error.message
            })
            console.log("========================================")
            logger.info({ message: "failed to send Verification ", email })
            throw new AppError("Could not send verification email. Pleas try adin later", {
                statusCode: 500,
                code: 'EMAIL_SEND_FAILED'
            });

        }
    }
}

export const emailService = new EmailService()
