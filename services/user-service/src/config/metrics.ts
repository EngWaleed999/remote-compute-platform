import client from 'prom-client';

// Create a Registry to register the metrics
export const register = new client.Registry();

// Add default metrics (CPU, RAM, Event Loop lag, etc.)
client.collectDefaultMetrics({ register });

// 1. Metric: Total Jobs Processed (Counter)
export const queueJobTotal = new client.Counter({
  name: 'queue_job_total',
  help: 'Total number of jobs processed by the queue',
  labelNames: ['queue_name', 'status'], // status can be 'success' or 'failed'
});
register.registerMetric(queueJobTotal);

// 2. Metric: Job Processing Duration (Histogram)
export const queueJobDuration = new client.Histogram({
  name: 'queue_job_duration_seconds',
  help: 'Duration of queue jobs in seconds',
  labelNames: ['queue_name', 'status'],
  buckets: [0.1, 0.5, 1, 2, 5, 10], // Buckets for response time in seconds
});
register.registerMetric(queueJobDuration);
