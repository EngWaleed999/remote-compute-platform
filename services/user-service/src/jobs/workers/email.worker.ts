import { Worker, WorkerOptions } from 'bullmq';
import { connection } from '../connection.js';
import { QueueName } from '../job.types.js';
import { emailProcessor } from '../processors/email.processor.js';
import { logger } from '../../config/logger.js';

// Worker configuration
const workerOptions: WorkerOptions = {
  connection,
  concurrency: 5, // Local concurrency: Process up to 5 emails in parallel per Node.js instance
  limiter: {
    max: 10,       // Global Rate Limiting (in open source, it works well if you have 1 worker pod, or you divide the limit across pods)
    duration: 1000 // Only process 10 jobs per 1 second (1000ms)
  }
};

/**
 * Instantiate the Email Worker.
 * This acts as the "Consumer" — it pulls jobs from Redis and runs the processor.
 */
export const emailWorker = new Worker(
  QueueName.EMAIL,
  emailProcessor,
  workerOptions
);

import { queueJobTotal, queueJobDuration } from '../../config/metrics.js';

// Worker Event Listeners
emailWorker.on('completed', (job) => {
  logger.debug({ message: `Worker: Job ${job.id} has completed!` });
  
  // Record Metrics: Success Count & Duration
  queueJobTotal.labels(job.queueName, 'success').inc();
  if (job.finishedOn && job.processedOn) {
    const durationSeconds = (job.finishedOn - job.processedOn) / 1000;
    queueJobDuration.labels(job.queueName, 'success').observe(durationSeconds);
  }
});

emailWorker.on('failed', (job, err) => {
  logger.error({ 
    message: `Worker: Job ${job?.id} has failed with error`, 
    error: err.message 
  });

  // Record Metrics: Failure Count & Duration
  if (job) {
    queueJobTotal.labels(job.queueName, 'failed').inc();
    if (job.finishedOn && job.processedOn) {
      const durationSeconds = (job.finishedOn - job.processedOn) / 1000;
      queueJobDuration.labels(job.queueName, 'failed').observe(durationSeconds);
    }
  }
});

emailWorker.on('error', (err) => {
  // Emitted for unexpected internal errors (like Redis connection loss)
  logger.error({ 
    message: 'Worker: BullMQ internal error', 
    error: err.message 
  });
});
