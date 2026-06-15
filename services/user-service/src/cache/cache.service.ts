/**
 * Generic Cache Service
 * ─────────────────────
 * A reusable, domain-agnostic wrapper around Redis that centralizes
 * all cross-cutting cache concerns in one place:
 *
 *   - Key namespacing  → prevents collisions between domains
 *   - TTL management   → each instance declares its own expiry
 *   - Retry with backoff → critical deletes don't silently fail
 *   - Structured logging → ops visibility on every failure
 *   - Graceful degradation → cache errors never crash the app
 *
 * Design decisions documented inline — see "WHY:" comments.
 */
import { redis } from '../config/redis.js';
import { logger } from '../config/logger.js';

// ───────────────────────────────────────────────
// Configuration interface
// ───────────────────────────────────────────────


export interface CacheServiceOptions {
  /**
   * Key prefix for namespacing.
   * Convention: `<service>:<domain>:`
   * Example:    `user-service:token-version:`
   */
  prefix: string;

  /**
   * Time-to-live in seconds.
   */
  ttl: number;

  /**
   * Max retry attempts for DEL operations.
   */
  maxRetries?: number;

  /**
   * Base delay (ms) between retries. Actual delay = attempt * baseRetryDelay.
   * Defaults to 200ms → delays of 200ms, 400ms, 600ms for 3 attempts.
   */
  baseRetryDelay?: number;
}


export class CacheService {
  private readonly prefix: string;
  private readonly ttl: number;
  private readonly maxRetries: number;
  private readonly baseRetryDelay: number;

  constructor(options: CacheServiceOptions) {
    this.prefix = options.prefix;
    this.ttl = options.ttl;
    this.maxRetries = options.maxRetries ?? 3;
    this.baseRetryDelay = options.baseRetryDelay ?? 200;
  }

  private buildKey(id: string): string {
    return `${this.prefix}${id}`;
  }

  // ─────────────────── GET ───────────────────

  async get(id: string): Promise<string | null> {
    try {
      return await redis.get(this.buildKey(id));
    } catch (err) {
      logger.warn({
        message: 'Cache GET failed — caller should fallback to primary store',
        key: this.buildKey(id),
        error: (err as Error).message,
      });
      return null;
    }
  }

  // ─────────────────── SET ───────────────────

  async set(id: string, value: string): Promise<void> {
    try {
      await redis.set(this.buildKey(id), value, 'EX', this.ttl);
    } catch (err) {
      logger.warn({
        message: 'Cache SET failed — cache not populated',
        key: this.buildKey(id),
        error: (err as Error).message,
      });
    }
  }

  // ─────────────────── DEL ───────────────────

  async del(id: string): Promise<boolean> {
    const key = this.buildKey(id);

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        await redis.del(key);
        return true;
      } catch (err) {
        const isLastAttempt = attempt === this.maxRetries;

        logger.error({
          message: `Cache DEL failed (attempt ${attempt}/${this.maxRetries})`,
          key,
          error: (err as Error).message,
          final: isLastAttempt,
        });

        if (!isLastAttempt) {
          await this.sleep(attempt * this.baseRetryDelay);
        }
      }
    }

    logger.error({
      message: 'Cache DEL — all retries exhausted, stale data may persist until TTL expiry',
      key,
      ttl: this.ttl,
    });

    return false;
  }

  /**
   * WHY a separate sleep method?
   * ────────────────────────────
   * 1. Readability: `await this.sleep(ms)` is clearer than
   *    `await new Promise(r => setTimeout(r, ms))` inline.
   * 2. Testability: In unit tests, you can spy on / mock sleep()
   *    to make tests instant instead of waiting for real delays.
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
