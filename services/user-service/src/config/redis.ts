/**
 * Redis Client Singleton
 * ──────────────────────
 * Uses ioredis for connection pooling, automatic reconnection, and pipelining.
 *
 * SINGLE RESPONSIBILITY: This file manages the Redis CONNECTION only.
 * It does NOT contain any domain-specific cache logic.
 *
 * Domain-specific caching is handled by strategy files:
 *   - cache/strategies/token-version.cache.ts  (tokenVersion)
 *   - cache/strategies/otp.cache.ts            (future)
 *
 * All strategies use the generic CacheService (cache/cache.service.ts),
 * which imports the `redis` client exported from this file.
 *
 * Key naming convention: `<service>:<domain>:<id>`
 * Example: `user-service:token-version:abc-123`
 */
import IORedis from 'ioredis';
import { env } from './env.js';
import { logger } from './logger.js';

const redis = new IORedis.default(env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryStrategy(times: number) {
    const delay = Math.min(times * 200, 3000);
    return delay;
  },
  lazyConnect: true,
});

redis.on('connect', () => {
  logger.info({ message: 'Redis connected' });
});

redis.on('error', (err: Error) => {
  logger.error({ message: 'Redis connection error', error: err.message });
});

/**
 * Connect to Redis. Call during app startup.
 */
export async function connectRedis(): Promise<void> {
  try {
    await redis.connect();
  } catch (err) {
    logger.error({
      message: 'Failed to connect to Redis',
      error: (err as Error).message,
    });
    // Don't crash the app — Redis is a performance layer, not critical path
    // The authenticate middleware falls back to DB when Redis is unavailable
  }
}

/**
 * Disconnect Redis gracefully. Call during app shutdown.
 */
export async function disconnectRedis(): Promise<void> {
  await redis.quit();
}

export { redis };
