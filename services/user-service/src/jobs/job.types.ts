export enum QueueName {
  EMAIL = 'email-queue',
}

export enum EmailJobName {
  SEND_OTP = 'send-otp-email',
}

export interface SendOtpEmailPayload {
  to: string;
  otp: string;
}
