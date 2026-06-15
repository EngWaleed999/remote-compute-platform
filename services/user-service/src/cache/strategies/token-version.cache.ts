
import { CacheService } from '../cache.service.js';
import { logger } from '../../config/logger.js';

// ───────────────────────────────────────────────
// Configuration
// ───────────────────────────────────────────────

/**
 * WHY 60 seconds instead of the original 300 seconds?
 * ────────────────────────────────────────────────────
 * TRADE-OFF: freshness vs. DB load
 *
 * Old TTL (300s / 5 min):
 *   ✅ Fewer DB queries (cache hit rate ~99% per active user)
 *   ❌ If invalidation fails (Redis down), revoked tokens stay valid for 5 min
 *       → attacker has 5 minutes to explore and damage sensitive data
 *
 * New TTL (60s / 1 min):
 *   ✅ Worst-case stale window drops from 5 min → 1 min (80% reduction)
 *   ✅ Still covers the typical "burst of requests" pattern
 *      (user clicks around for 30-60s, then pauses — cache covers the burst)
 *   ❌ ~5× more DB queries per active user per hour
 *       → For 1000 concurrent users: ~1000 extra queries/min
 *       → Postgres handles this easily (simple indexed lookup by PK)
 *
 * This is Defense-in-Depth (Solution C from the review):
 *   - PRIMARY defense: write-through invalidation (see invalidateCachedTokenVersion)
 *   - SECONDARY defense: even if write-through fails, stale data dies in 60s
 *
 * If your DB is under heavy load, you can increase this to 120s as a compromise.
 */
const TOKEN_VERSION_TTL = 60;

const cache = new CacheService({
    prefix: 'user-service:token-version:',
    ttl: TOKEN_VERSION_TTL,
    maxRetries: 3,
});

export async function getCachedTokenVersion(
    userId: string
): Promise<number | null> {
    const value = await cache.get(userId);
    return value !== null ? parseInt(value, 10) : null;
}


export async function setCachedTokenVersion(
    userId: string,
    version: number
): Promise<void> {
    await cache.set(userId, version.toString());
}

export async function invalidateCachedTokenVersion(
    userId: string,
    newVersion?: number
): Promise<void> {
    if (newVersion !== undefined) {
        // Write-through: update cache with the correct new version.
        // Even if this SET fails, CacheService.set logs a warning,
        // and the 60s TTL ensures stale data dies quickly.
        await cache.set(userId, newVersion.toString());
    } else {
        // Fallback: delete with retry (via CacheService.del).
        // CacheService retries 3× with backoff and logs at ERROR level.
        const deleted = await cache.del(userId);

        if (!deleted) {
            // All retries exhausted. Log the security implications.
            // The stale entry will auto-expire when TTL (60s) runs out.
            logger.error({
                message:
                    'Token version cache invalidation failed after all retries — ' +
                    'stale token may remain valid for up to TTL expiry',
                userId,
                ttlSeconds: TOKEN_VERSION_TTL,
            });
        }
    }
}
