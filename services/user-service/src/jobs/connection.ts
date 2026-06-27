import IORedis from 'ioredis';
import { env } from '../config/env.js';

/**
 * BullMQ requires dedicated Redis connections because Workers 
 * use blocking commands (like BRPOPLPUSH) which pause the connection.
 * Sharing the app's main Redis instance can block the whole server!
 * So, we export a connection configuration here.
 */
export const connection = new IORedis.default(env.REDIS_URL, {
  maxRetriesPerRequest: null, // BullMQ requires this to be null!
});
