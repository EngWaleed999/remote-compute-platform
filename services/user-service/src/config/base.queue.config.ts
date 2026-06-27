
import { Queue, QueueOptions } from 'bullmq';
import { connection } from '../jobs/connection.js';

/**
 * Generic Queue Factory
 * Ensures all queues across the microservice share the exact same
 * strict retry and retention policies without code duplication.
 */
export function createBaseQueue<PayloadType = any>(
    queueName: string,
    customOptions?: Omit<QueueOptions, 'connection'>
): Queue<PayloadType> {
    const mergedDefaultJobOptions = {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: { age: 3600, count: 1000 },
        removeOnFail: { age: 24 * 3600, count: 5000 },
        ...(customOptions?.defaultJobOptions || {}), // Deep merge defaults
    };

    return new Queue<PayloadType>(queueName, {
        connection,
        ...customOptions,
        defaultJobOptions: mergedDefaultJobOptions,
    });
}