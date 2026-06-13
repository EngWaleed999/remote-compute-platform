# Redis Cache Layer — Code Review, Security Analysis & Refactoring Plan

> **File under review:** `services/user-service/src/config/redis.ts`
> **Date:** 2026-06-13
> **Author:** AI Code Review

---

## Table of Contents

1. [Issue #1 — Silent Catch Blocks (Missing Logs)](#issue-1--silent-catch-blocks-missing-logs)
2. [Issue #2 — Critical Security Flaw in `invalidateCachedTokenVersion`](#issue-2--critical-security-flaw-in-invalidatecachedtokenversion)
3. [Issue #3 — Existing Bug on Line 19](#issue-3--existing-bug-on-line-19)
4. [Refactoring Plan — Generic Cache Service (SOLID "S")](#refactoring-plan--generic-cache-service-solid-s)

---

## Issue #1 — Silent Catch Blocks (Missing Logs)

### Problem

Two functions catch errors and silently return without any logging:

```typescript
// setCachedTokenVersion — line 78-80
catch {
  // Non-critical — next request will cache-miss and read from DB
}

// invalidateCachedTokenVersion — line 92-94
catch {
  // Non-critical — worst case the old version is served for up to TTL
}
```

> [!WARNING]
> If Redis goes down, the team will have **zero visibility**. No alerts will fire, no dashboards will show errors, and no one will know that every authenticated request is falling back to a direct database query. Under high traffic, this silent fallback could overload Postgres and cascade into a full outage.

Additionally, `getCachedTokenVersion` (line 56-60) has a logger call but references an undefined variable `err`:

```typescript
catch {
  logger.warn({ message: '...', error: (err as Error).message })
  //                                    ^^^ 'err' is not defined — this will throw a ReferenceError!
  return null;
}
```

### Fix

Add structured logging with appropriate severity levels to every catch block:

| Function | Log Level | Why |
|---|---|---|
| `getCachedTokenVersion` | `warn` | Every miss = 1 extra DB query. Pattern of warns = Redis is down |
| `setCachedTokenVersion` | `warn` | Cache won't be populated → next request also hits DB |
| `invalidateCachedTokenVersion` | `error` | **Security-critical** — stale token stays alive (see Issue #2) |

```typescript
// getCachedTokenVersion — fix the undefined 'err' variable
catch (err) {  // ← must capture the error variable
  logger.warn({
    message: 'Redis GET failed — falling back to DB',
    userId,
    error: (err as Error).message,
  });
  return null;
}

// setCachedTokenVersion
catch (err) {
  logger.warn({
    message: 'Redis SET failed — cache not populated',
    userId,
    error: (err as Error).message,
  });
}

// invalidateCachedTokenVersion
catch (err) {
  logger.error({
    message: 'CRITICAL: Redis DEL failed — stale token may remain cached',
    userId,
    error: (err as Error).message,
  });
  // + additional mitigation — see Issue #2
}
```

---

## Issue #2 — Critical Security Flaw in `invalidateCachedTokenVersion`

### The Scenario

1. Admin wants to block a user (or user changes password, or refresh token reuse is detected)
2. System bumps `tokenVersion` in the database ✅
3. System calls `invalidateCachedTokenVersion(userId)` to delete the Redis key
4. **Redis is down** (network issue, crash, timeout) → `DEL` fails → **catch silently swallows**
5. The **old** `tokenVersion` remains in Redis with up to **5 minutes TTL**
6. Every authenticated request for this user hits Redis → gets the **old** cached version → **matches the old access token** → user stays authenticated
7. The attacker/blocked user has up to **5 minutes** to explore and potentially destroy sensitive data

> [!CAUTION]
> This is not a theoretical edge case. Redis failures happen. Network partitions happen. And when they do, your security-critical invalidation **silently does nothing**. The user remains authenticated with a revoked token for up to 5 minutes.

### Who is affected?

This function is called from 3 critical security operations:

| Caller | File | Scenario |
|---|---|---|
| `resetPassword` / `restoreAccount` | `auth.service.ts:466` | Password change / account restore → old tokens should die immediately |
| Refresh token reuse detection | `auth.service.ts:571` | Token theft detected → **all sessions** should die immediately |
| `deleteAccount` | `user.service.ts:109` | Account deleted → user should be logged out immediately |

### Proposed Solutions

Here are **4 solutions**, ordered from simplest to most robust:

---

#### Solution A — Retry with Exponential Backoff (Simple)

**Idea:** If `DEL` fails, retry 2-3 times with increasing delays before giving up.

```typescript
async function invalidateCachedTokenVersion(userId: string): Promise<void> {
  const key = `${TOKEN_VERSION_PREFIX}${userId}`;
  const MAX_RETRIES = 3;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await redis.del(key);
      return; // Success
    } catch (err) {
      logger.error({
        message: `Redis DEL failed (attempt ${attempt}/${MAX_RETRIES})`,
        userId,
        error: (err as Error).message,
      });
      if (attempt < MAX_RETRIES) {
        await new Promise(r => setTimeout(r, attempt * 200)); // 200ms, 400ms, 600ms
      }
    }
  }
  logger.error({
    message: 'CRITICAL: All Redis DEL retries exhausted — stale cache may persist',
    userId,
  });
}
```

| Pros | Cons |
|---|---|
| Simple to implement | If Redis is truly down, all retries fail and you still have the problem |
| Handles transient errors (network blip) | Adds latency to the critical path (up to ~1.2s) |
| No architectural changes needed | Doesn't help with sustained outages |

**Verdict:** ✅ Good for transient failures. ❌ Doesn't solve sustained Redis outage.

---

#### Solution B — SET with Short TTL Override (Recommended — Best Balance)

**Idea:** Instead of deleting the key, **overwrite it** with a value of `-1` (an impossible `tokenVersion`) and set a very short TTL (e.g., 5-10 seconds). This way, even if the old `DEL` fails, we can try `SET` instead. And if *both* fail, combine with retry.

But actually, the smarter approach: **When invalidation fails, force the `authenticate` middleware to bypass the cache for this user.** We can achieve this differently:

**Better Idea — Write-Through Invalidation:** Instead of deleting, **overwrite the cached value with the new `tokenVersion` from the DB**. This way:
- If `SET` succeeds → cache has the new version → old tokens are immediately rejected
- If `SET` fails → we still have the DB as source of truth, and we apply retry logic

```typescript
export async function invalidateCachedTokenVersion(
  userId: string,
  newVersion?: number // Pass the bumped version from the caller
): Promise<void> {
  const key = `${TOKEN_VERSION_PREFIX}${userId}`;

  try {
    if (newVersion !== undefined) {
      // Write-through: update cache with the new version
      await redis.set(key, newVersion.toString(), 'EX', TOKEN_VERSION_TTL);
    } else {
      // Fallback: delete the key
      await redis.del(key);
    }
  } catch (err) {
    logger.error({
      message: 'CRITICAL: Redis invalidation failed — stale token may remain cached',
      userId,
      error: (err as Error).message,
    });
    // Retry logic here...
  }
}
```

| Pros | Cons |
|---|---|
| Cache is immediately updated, not just deleted | Requires callers to pass `newVersion` |
| No "window" where cache has stale data (if SET succeeds) | Slightly more complex API |
| Avoids cache-miss storm after invalidation | Still needs retry for when Redis is fully down |

**Verdict:** ✅ Recommended. Eliminates the stale window AND avoids the thundering herd of cache misses after invalidation.

---

#### Solution C — Reduce TTL Aggressively (Quick Win)

**Idea:** Reduce `TOKEN_VERSION_TTL` from 300 seconds (5 min) to 30-60 seconds. The stale window shrinks from 5 minutes to under a minute.

```typescript
const TOKEN_VERSION_TTL = 30; // 30 seconds instead of 300
```

| Pros | Cons |
|---|---|
| One-line change | More DB queries (every 30s instead of every 5min per user) |
| Reduces attack window from 5min to 30s | Doesn't eliminate the problem, just shrinks it |
| Combine with Solution B for defense-in-depth | Under high traffic, could increase DB load noticeably |

**Verdict:** ✅ Great as a complementary measure with Solution B. ❌ Not sufficient alone.

---

#### Solution D — Throw the Error (Fail-Safe for Security-Critical Ops)

**Idea:** For security-critical operations (block user, token theft), **don't silently swallow the error**. Let it propagate up. The admin action fails, but at least the system doesn't pretend the user was blocked when they weren't.

```typescript
export async function invalidateCachedTokenVersion(
  userId: string
): Promise<void> {
  try {
    await redis.del(`${TOKEN_VERSION_PREFIX}${userId}`);
  } catch (err) {
    logger.error({
      message: 'CRITICAL: Failed to invalidate cached token',
      userId,
      error: (err as Error).message,
    });
    throw err; // Let the caller decide — maybe they retry, maybe they fail the operation
  }
}
```

The caller can then decide:

```typescript
// In auth.service.ts
try {
  await invalidateCachedTokenVersion(userId);
} catch {
  // Option 1: Retry the whole operation
  // Option 2: Return a 503 to admin "Action pending — retry"
  // Option 3: Queue the invalidation for later (see Solution E below)
}
```

| Pros | Cons |
|---|---|
| Fail-safe: system never lies about security state | Admin action fails — bad UX |
| Forces caller to handle the failure explicitly | Requires every caller to add error handling |
| Clear audit trail | Could block legitimate operations during Redis maintenance |

**Verdict:** ✅ The safest approach for high-security scenarios. Best combined with B.

---

### Recommended Combination

> [!IMPORTANT]
> Use **Solution B (Write-Through) + Solution C (Reduced TTL) + Solution A (Retry)** together:
>
> 1. **Write-through invalidation** — overwrite with new version instead of delete (eliminates stale window on success)
> 2. **Retry 3x with backoff** — handles transient Redis failures
> 3. **Reduce TTL to 60 seconds** — worst-case stale window drops from 5min to 1min
> 4. **Log at `error` level** — ops team gets alerted immediately
>
> For token-theft scenarios (`REFRESH_TOKEN_REUSE_DETECTED`), consider additionally throwing (Solution D) since this is a confirmed attack.

---

## Issue #3 — Existing Bug on Line 19

```typescript
import { error, error } from 'console'; // ← duplicate named import, will cause TypeScript error
```

This line imports `error` twice from `console` and doesn't appear to be used anywhere in the file. It should be removed entirely.

---

## Refactoring Plan — Generic Cache Service (SOLID "S")

### The Problem

The current `redis.ts` violates the **Single Responsibility Principle (SRP)**:

- It manages the **Redis connection** (connect, disconnect, event handlers)
- It contains **domain-specific business logic** for `tokenVersion` caching
- Key naming, TTL values, and serialization are all hardcoded

Tomorrow, if you need to cache OTP codes, rate-limit counters, or session metadata, you'd either:
- Add more functions to this already-coupled file (making it worse)
- Copy-paste the pattern into a new file (code duplication)

### Target Architecture

```
src/
├── config/
│   └── redis.ts               ← ONLY connection management (connect, disconnect, events)
│
├── cache/
│   ├── cache.service.ts        ← Generic cache service (get, set, del, with retry & logging)
│   └── strategies/
│       ├── token-version.cache.ts  ← TokenVersion-specific cache (uses CacheService)
│       └── otp.cache.ts            ← OTP-specific cache (future — uses CacheService)
```

### Step-by-Step Plan

#### Step 1 — Extract `CacheService` (Generic Layer)

Create a generic, reusable cache service that handles all the cross-cutting concerns:

```typescript
// src/cache/cache.service.ts

import { redis } from '../config/redis.js';
import { logger } from '../config/logger.js';

export interface CacheOptions {
  /** TTL in seconds */
  ttl: number;
  /** Key prefix for namespacing (e.g., 'user-service:token-version:') */
  prefix: string;
  /** Number of retry attempts on failure */
  maxRetries?: number;
}

export class CacheService {
  private readonly ttl: number;
  private readonly prefix: string;
  private readonly maxRetries: number;

  constructor(options: CacheOptions) {
    this.ttl = options.ttl;
    this.prefix = options.prefix;
    this.maxRetries = options.maxRetries ?? 3;
  }

  private buildKey(id: string): string {
    return `${this.prefix}${id}`;
  }

  async get(id: string): Promise<string | null> {
    try {
      return await redis.get(this.buildKey(id));
    } catch (err) {
      logger.warn({
        message: `Cache GET failed`,
        key: this.buildKey(id),
        error: (err as Error).message,
      });
      return null;
    }
  }

  async set(id: string, value: string): Promise<void> {
    try {
      await redis.set(this.buildKey(id), value, 'EX', this.ttl);
    } catch (err) {
      logger.warn({
        message: `Cache SET failed`,
        key: this.buildKey(id),
        error: (err as Error).message,
      });
    }
  }

  async del(id: string): Promise<void> {
    const key = this.buildKey(id);
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        await redis.del(key);
        return;
      } catch (err) {
        logger.error({
          message: `Cache DEL failed (attempt ${attempt}/${this.maxRetries})`,
          key,
          error: (err as Error).message,
        });
        if (attempt < this.maxRetries) {
          await new Promise(r => setTimeout(r, attempt * 200));
        }
      }
    }
  }
}
```

#### Step 2 — Create Domain-Specific Cache Strategy

```typescript
// src/cache/strategies/token-version.cache.ts

import { CacheService } from '../cache.service.js';

const TOKEN_VERSION_TTL = 60; // Reduced from 300s to 60s (Issue #2, Solution C)

const cache = new CacheService({
  ttl: TOKEN_VERSION_TTL,
  prefix: 'user-service:token-version:',
  maxRetries: 3,
});

export async function getCachedTokenVersion(userId: string): Promise<number | null> {
  const value = await cache.get(userId);
  return value !== null ? parseInt(value, 10) : null;
}

export async function setCachedTokenVersion(userId: string, version: number): Promise<void> {
  await cache.set(userId, version.toString());
}

export async function invalidateCachedTokenVersion(
  userId: string,
  newVersion?: number
): Promise<void> {
  if (newVersion !== undefined) {
    // Write-through: update cache with new version (Solution B)
    await cache.set(userId, newVersion.toString());
  } else {
    await cache.del(userId);
  }
}
```

#### Step 3 — Slim Down `redis.ts` to Connection Only

```typescript
// src/config/redis.ts — AFTER refactoring

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

export async function connectRedis(): Promise<void> {
  try {
    await redis.connect();
  } catch (err) {
    logger.error({
      message: 'Failed to connect to Redis',
      error: (err as Error).message,
    });
  }
}

export async function disconnectRedis(): Promise<void> {
  await redis.quit();
}

export { redis };
```

#### Step 4 — Update Imports in Consumers

All files importing from `'../config/redis.js'` need to update:

| File | Old Import | New Import |
|---|---|---|
| `authenticate.ts` | `from '../config/redis.js'` | `from '../cache/strategies/token-version.cache.js'` |
| `auth.service.ts` | `from '../config/redis.js'` | `from '../cache/strategies/token-version.cache.js'` |
| `user.service.ts` | `from '../config/redis.js'` | `from '../cache/strategies/token-version.cache.js'` |

#### Step 5 — Future: Add OTP Cache (Example)

```typescript
// src/cache/strategies/otp.cache.ts — Future use case

import { CacheService } from '../cache.service.js';

const OTP_TTL = 300; // 5 minutes

const cache = new CacheService({
  ttl: OTP_TTL,
  prefix: 'user-service:otp:',
  maxRetries: 2,
});

export async function storeOtp(userId: string, code: string): Promise<void> {
  await cache.set(userId, code);
}

export async function getOtp(userId: string): Promise<string | null> {
  return cache.get(userId);
}

export async function deleteOtp(userId: string): Promise<void> {
  await cache.del(userId);
}
```

### Summary of Changes

```
Before:
  config/redis.ts  ← Connection + Token Version logic (SRP violation)

After:
  config/redis.ts                       ← Connection only (Single Responsibility ✅)
  cache/cache.service.ts                ← Generic cache operations (Reusable ✅)
  cache/strategies/token-version.cache.ts ← Token version domain logic
  cache/strategies/otp.cache.ts          ← OTP domain logic (future)
```

### Benefits

| Before | After |
|---|---|
| Adding new cache = modifying `redis.ts` | Adding new cache = new file in `strategies/` |
| Retry, logging, key-building duplicated | Centralized in `CacheService` |
| TTL hardcoded in one file | Each strategy declares its own TTL |
| No separation of connection vs. business logic | Clean separation |
| Testing requires mocking Redis internals | `CacheService` can be mocked/injected |

---

## Action Items Checklist

- [ ] **Fix Bug:** Remove duplicate `import { error, error } from 'console'` on line 19
- [ ] **Fix Bug:** Add `err` parameter to catch block in `getCachedTokenVersion` (line 56)
- [ ] **Logging:** Add `logger.warn` to `setCachedTokenVersion` catch block
- [ ] **Logging:** Add `logger.error` to `invalidateCachedTokenVersion` catch block
- [ ] **Security:** Implement write-through invalidation (Solution B)
- [ ] **Security:** Add retry with backoff to invalidation (Solution A)
- [ ] **Security:** Reduce TTL from 300s to 60s (Solution C)
- [ ] **Refactor:** Extract `CacheService` generic class
- [ ] **Refactor:** Create `token-version.cache.ts` strategy
- [ ] **Refactor:** Slim down `redis.ts` to connection-only
- [ ] **Refactor:** Update all import paths in consumers
- [ ] **Test:** Verify auth flow works when Redis is down
- [ ] **Test:** Verify invalidation with new write-through approach
