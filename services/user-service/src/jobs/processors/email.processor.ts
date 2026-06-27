import { Job } from 'bullmq';
import { EmailJobName, SendOtpEmailPayload } from '../job.types.js';
import { emailService } from '../../services/email.service.js';
import { logger } from '../../config/logger.js';

/**
 * The Processor Function.
 * SINGLE RESPONSIBILITY: Takes a BullMQ job, extracts data, and executes logic.
 * By keeping this separate from the Worker setup, we can easily write Unit Tests for it!
 */
export async function emailProcessor(job: Job): Promise<void> {
  logger.info({ message: 'Processing email job', jobId: job.id, name: job.name });

  switch (job.name) {
    case EmailJobName.SEND_OTP: {
      const data = job.data as SendOtpEmailPayload;
      // Pass the extracted data to the actual service that knows how to send emails
      await emailService.sendEmailVerifiy(data.to, data.otp);
      break;
    }

    default:
      logger.warn({ message: `Unknown job name: ${job.name}` });
      throw new Error(`Unknown job name: ${job.name}`);
  }

  logger.info({ message: 'Email job processed successfully', jobId: job.id });
}
