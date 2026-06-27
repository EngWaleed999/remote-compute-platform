import { QueueName, EmailJobName, SendOtpEmailPayload } from '../job.types.js';
import { logger } from '../../config/logger.js';
import { createBaseQueue } from '../../config/base.queue.config.js';

/**
 * Instantiate the Email Queue using the Generic Factory.
 * This guarantees it has the correct default retry & retention policies.
 */
export const emailQueue = createBaseQueue<SendOtpEmailPayload>(QueueName.EMAIL);

/**
 * Producer Function: Adds a "SEND_OTP" job to the queue.
 */
export async function addSendOtpJob(payload: SendOtpEmailPayload): Promise<void> {
  try {
    await emailQueue.add(EmailJobName.SEND_OTP, payload, {
      // Idempotency Key: Prevents duplicate emails if added concurrently
      jobId: `otp-${payload.to}-${payload.otp}`
    });
    logger.info({ message: 'Send OTP job added to queue', email: payload.to });
  } catch (error: any) {
    logger.error({
      message: 'Failed to add Send OTP job to queue',
      error: error.message,
    });
    // Depending on business requirements, you might want to throw here 
    // or handle it gracefully.
    throw error;
  }
}
