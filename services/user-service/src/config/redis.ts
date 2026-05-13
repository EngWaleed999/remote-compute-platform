/**
 * Redis Client Singleton
 * Uses ioredis for connection pooling, automatic reconnection, and pipelining.
 *
 * Strategy: Cache-Aside (Lazy Loading)
 * - On read: check Redis first → if miss → query DB → write to Redis
 * - On write: update DB first → invalidate Redis key
 *
 * Used for:
 * - tokenVersion caching (avoids 1 DB query per authenticated request)
 * - CSRF token storage (optional, future)
 *
 * Key naming convention: `user-service:<domain>:<id>`
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

// ═══════════════════════════════════════════════════
// Token Version Cache
// ═══════════════════════════════════════════════════

const TOKEN_VERSION_PREFIX = 'user-service:token-version:';
/** TTL for cached tokenVersion (5 minutes) */
const TOKEN_VERSION_TTL = 300;

/**
 * Get the cached tokenVersion for a user.
 * Returns null on cache miss — caller should fall back to DB.
 */
export async function getCachedTokenVersion(
  userId: string
): Promise<number | null> {
  try {
    const value = await redis.get(`${TOKEN_VERSION_PREFIX}${userId}`);
    return value !== null ? parseInt(value, 10) : null;
  } catch {
    // Redis failure should never block auth — fallback to DB
    return null;
  }
}

/**
 * Set the tokenVersion in Redis cache.
 * Called after DB read (cache-aside population) or after version bump.
 */
export async function setCachedTokenVersion(
  userId: string,
  version: number
): Promise<void> {
  try {
    await redis.set(
      `${TOKEN_VERSION_PREFIX}${userId}`,
      version.toString(),
      'EX',
      TOKEN_VERSION_TTL
    );
  } catch {
    // Non-critical — next request will cache-miss and read from DB
  }
}

/**
 * Invalidate the cached tokenVersion.
 * Called on: password change, account delete, account restore, forced logout.
 */
export async function invalidateCachedTokenVersion(
  userId: string
): Promise<void> {
  try {
    await redis.del(`${TOKEN_VERSION_PREFIX}${userId}`);
  } catch {
    // Non-critical — worst case the old version is served for up to TTL
  }
}

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
