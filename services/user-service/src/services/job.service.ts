import { SendOtpEmailPayload } from '../jobs/job.types.js';
import { addSendOtpJob } from '../jobs/queues/email.queue.js';

/**
 * IJobService Interface
 * ─────────────────────
 * Defines the contract for background job operations.
 * If we ever switch from BullMQ to Kafka, SQS, or RabbitMQ,
 * we ONLY need to write a new class that implements this interface.
 * The business logic in `otp.service.ts` remains 100% untouched.
 */
export interface IJobService {
  enqueueSendOtpEmail(payload: SendOtpEmailPayload): Promise<void>;
  // enqueueWelcomeEmail(...): Promise<void>;
}

/**
 * BullMQ Implementation of the Job Service.
 */
class BullMQJobService implements IJobService {
  async enqueueSendOtpEmail(payload: SendOtpEmailPayload): Promise<void> {
    await addSendOtpJob(payload);
  }
}

// Export a singleton instance. 
// In a framework like NestJS, this would be injected via Dependency Injection (DI).
export const jobService: IJobService = new BullMQJobService();
