import nodemailer from 'nodemailer'
import { logger } from '../config/logger.js';
import { AppError } from '@repo/shared-utils';
import { emailTamplate } from '../utils/tamplate_email.js';



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
            html: emailTamplate(otp), // دمج الـ otp ديناميكياً داخل قالب الـ HTML
        };
        try {
            this.transporter.sendMail(mailOptions)
            logger.info({ message: "Send Verification successfully" })

        } catch (error: any) {
            console.log("========================================")
            console.error("Nodemailer Detailed Error", {
                code: error.code,
                response: error.response,
                Command: error.command,
                message: error.message
            })
            console.log("========================================")
            logger.error({
                message: "failed to send Verification ",
                ErrorMessage: error.message,
                code: error.code, response: error.response,
                Command: error.command,
            })
            throw new AppError("Could not send verification email. Pleas try adin later", {
                statusCode: 500,
                code: 'EMAIL_SEND_FAILED'
            });

        }
    }
}

export const emailService = new EmailService()
