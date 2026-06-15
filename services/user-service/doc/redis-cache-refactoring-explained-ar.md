# إعادة هيكلة طبقة الكاش (Redis Cache Layer) — شرح كامل

> **الملف الأصلي:** `services/user-service/src/config/redis.ts`
> **التاريخ:** 2026-06-15
> **المبدأ المطبق:** Single Responsibility Principle (SRP) — الحرف "S" من SOLID

---

## جدول المحتويات

1. [المشكلة الأصلية — ليه احتجنا نغير؟](#١--المشكلة-الأصلية)
2. [الحل — الهيكلة الجديدة](#٢--الحل--الهيكلة-الجديدة)
3. [شرح كل ملف وليه موجود](#٣--شرح-كل-ملف-وليه-موجود)
4. [الأنماط المستخدمة (Design Patterns)](#٤--الأنماط-المستخدمة)
5. [الإصلاح الأمني — Write-Through Invalidation](#٥--الإصلاح-الأمني)
6. [المقايضات (Trade-offs)](#٦--المقايضات-trade-offs)
7. [أسئلة مقابلات متوقعة وإجاباتها](#٧--أسئلة-مقابلات-متوقعة)

---

## ١ — المشكلة الأصلية

### الملف القديم `redis.ts` كان يعمل شغلتين مختلفتين:

```
redis.ts (قبل)
├── إدارة الاتصال بـ Redis    ← مسؤولية #1
│   ├── إنشاء الـ client
│   ├── connect / disconnect
│   └── event handlers (connect, error)
│
└── منطق كاش الـ tokenVersion  ← مسؤولية #2
    ├── getCachedTokenVersion()
    ├── setCachedTokenVersion()
    ├── invalidateCachedTokenVersion()
    ├── TOKEN_VERSION_PREFIX
    └── TOKEN_VERSION_TTL
```

### ليه هذا مشكلة؟

**مبدأ SRP يقول:** كل ملف/كلاس يجب أن يكون له سبب واحد فقط للتغيير.

الملف القديم عنده **سببين** للتغيير:
1. لو غيرنا طريقة الاتصال بـ Redis (مثلاً: Redis Cluster بدل Standalone)
2. لو غيرنا منطق كاش الـ tokenVersion (مثلاً: غيرنا الـ TTL)

**المشكلة العملية:** بكرا لو احتجت تخزّن OTP codes في الكاش، وين تحطها؟

- **الخيار السيء:** تضيف functions جديدة في `redis.ts` ← الملف يكبر ويصير "God File" فيه كل شي
- **الخيار الأسوأ:** تنسخ الكود في ملف جديد ← Code Duplication (تكرار الكود)
- **الخيار الصحيح:** تعمل نظام طبقات (Layered Architecture) كل طبقة لها مسؤولية واحدة

### مشاكل أمنية كانت موجودة

**1. الـ catch blocks كانت صامتة (Silent Failures):**
```typescript
// الكود القديم — لو Redis وقع، ما حد يدري!
catch {
  // Non-critical — next request will cache-miss and read from DB
}
```
لا لوقات (logs)، لا تنبيهات (alerts)، ولا أي visibility للفريق.

**2. ثغرة أمنية في `invalidateCachedTokenVersion`:**
لو الأدمن حظر مستخدم و Redis كان واقع:
- الـ DB فيها الـ tokenVersion الجديد ✅
- الكاش فيه الـ tokenVersion القديم ❌
- كل request يجي من المستخدم المحظور يقرأ من الكاش ← يلاقي القيمة القديمة ← يفكر إن التوكن صالح
- المستخدم يبقى داخل النظام لمدة 5 دقائق (الـ TTL القديم)

---

## ٢ — الحل — الهيكلة الجديدة

```
src/
├── config/
│   └── redis.ts                         ← مسؤولية واحدة: الاتصال فقط
│
├── cache/
│   ├── cache.service.ts                 ← مسؤولية واحدة: عمليات الكاش العامة
│   └── strategies/
│       └── token-version.cache.ts       ← مسؤولية واحدة: منطق tokenVersion
```

**كل ملف عنده سبب واحد فقط للتغيير:**

| الملف | يتغير لمّا... | لا يتغير لمّا... |
|---|---|---|
| `redis.ts` | نغير طريقة الاتصال (Cluster, Sentinel) | نضيف domain جديد للكاش |
| `cache.service.ts` | نغير سلوك الـ retry أو الـ logging | نغير TTL الـ tokenVersion |
| `token-version.cache.ts` | نغير TTL أو طريقة invalidation | نضيف OTP caching |

**لو بكرا احتجنا OTP:**
```
cache/strategies/
├── token-version.cache.ts   ← موجود
└── otp.cache.ts              ← نضيف ملف جديد، ما نلمس أي ملف قديم!
```

هذا يسمى **Open/Closed Principle** (الحرف "O" من SOLID):
> مفتوح للإضافة، مغلق للتعديل.

---

## ٣ — شرح كل ملف وليه موجود

### الملف الأول: `config/redis.ts` — طبقة الاتصال

```typescript
// هذا الملف يعمل شي واحد فقط: يتصل بـ Redis ويعطيك الـ client
const redis = new IORedis.default(env.REDIS_URL, { ... });

export async function connectRedis(): Promise<void> { ... }
export async function disconnectRedis(): Promise<void> { ... }
export { redis };  // ← يصدّر الـ client للطبقات الأعلى
```

**ليه فصلناه؟**
- الـ Redis client هو **infrastructure** (بنية تحتية)
- ما يعرف شي عن الـ business logic (ما يعرف شو tokenVersion)
- لو غيرت من ioredis إلى مكتبة ثانية، تغير هذا الملف بس

**سؤال مقابلة:** "ليه ما حطيت الـ connection في CacheService نفسها؟"
**الجواب:** لأن CacheService ممكن يكون عندنا منها أكثر من instance (واحد للـ tokenVersion، واحد للـ OTP)، لكن كلهم يستخدمون **نفس** الاتصال. لو كل instance يعمل اتصال خاص، نهدر موارد بدون فائدة.

---

### الملف الثاني: `cache/cache.service.ts` — الطبقة العامة

```typescript
export class CacheService {
  constructor(options: CacheServiceOptions) { ... }

  async get(id: string): Promise<string | null> { ... }   // ← لوقات + graceful degradation
  async set(id: string, value: string): Promise<void> { ... }  // ← لوقات + TTL تلقائي
  async del(id: string): Promise<boolean> { ... }  // ← retry + backoff + لوقات
}
```

**ليه كلاس وليس functions؟**

الـ functions القديمة كانت تشتغل لأن عندنا domain واحد بس (tokenVersion). لكن كل domain يحتاج إعدادات مختلفة:

| الإعداد | tokenVersion | OTP (مستقبلاً) | Rate Limit (مستقبلاً) |
|---|---|---|---|
| Prefix | `user-service:token-version:` | `user-service:otp:` | `user-service:rate:` |
| TTL | 60 ثانية | 300 ثانية | 900 ثانية |
| Retry | 3 محاولات | 2 محاولات | 1 محاولة |

لو استخدمنا functions، لازم نمرر الإعدادات في كل استدعاء:
```typescript
// مزعج ومعرّض للخطأ
await cacheGet('user-service:token-version:', 60, 3, userId);
```

الكلاس يربط الإعدادات بالسلوك في مكان واحد:
```typescript
// نظيف — الإعدادات محفوظة في الـ instance
const cache = new CacheService({ prefix: '...', ttl: 60 });
await cache.get(userId);
```

**ليه `del()` فيها retry و `get()`/`set()` ما فيهم؟**

هذا سؤال مقابلة مهم جداً. الجواب:

| العملية | لو فشلت | الخطورة | Retry؟ |
|---|---|---|---|
| `get` | الـ caller يروح للـ DB | ذاتية الإصلاح (self-healing) | ❌ لا |
| `set` | الـ request الجاي يعمل cache-miss ويعيد SET | ذاتية الإصلاح | ❌ لا |
| `del` | **البيانات القديمة تبقى حية لمدة الـ TTL كامل** | خطر أمني! | ✅ نعم |

**ليه `del()` ترجع `boolean` بدل ما ترمي error؟**
لأن القرار "هل فشل الحذف يعتبر كارثة؟" يعتمد على الـ **domain**:
- tokenVersion ← كارثة أمنية ← الـ domain layer يقدر يرمي error
- rate limit counter ← مش مهم ← الـ domain layer يتجاهل

الـ CacheService ما يعرف أي domain يستخدمه، فيرجع `boolean` ويخلي الـ domain يقرر.

---

### الملف الثالث: `cache/strategies/token-version.cache.ts` — طبقة الـ Domain

```typescript
const cache = new CacheService({
  prefix: 'user-service:token-version:',
  ttl: 60,        // كان 300
  maxRetries: 3,
});

export async function getCachedTokenVersion(userId): Promise<number | null> { ... }
export async function setCachedTokenVersion(userId, version): Promise<void> { ... }
export async function invalidateCachedTokenVersion(userId, newVersion?): Promise<void> { ... }
```

**ليه ملف مستقل وليس جزء من CacheService؟**

الـ CacheService يتعامل مع **strings** (لأن Redis يخزن strings).
لكن الـ tokenVersion هو **number** في الـ DB وفي الـ JWT.

هذا الملف هو **طبقة الترجمة** (Translation Layer):
```
الـ Caller يرسل: number (مثلاً 5)
    ↓
token-version.cache.ts يحوّل: "5" (string)
    ↓
CacheService يخزّن: "5" في Redis
```

```
CacheService يقرأ: "5" من Redis
    ↓
token-version.cache.ts يحوّل: 5 (number)
    ↓
الـ Caller يستقبل: number
```

لو ما كان عندنا هذه الطبقة، كل caller لازم يعمل `parseInt()` بنفسه. وهذا تكرار كود + مصدر أخطاء.

**ليه standalone functions وليس class؟**

لأن هذا الملف **ما عنده state خاص فيه** — الـ `cache` instance (من CacheService) هو اللي يحمل الـ state. الكلاس هنا يكون مجرد wrapper فارغ:
```typescript
// هذا زائد عن الحاجة (unnecessary ceremony)
const cache = new TokenVersionCache();
cache.getCachedTokenVersion(userId);

// هذا أنظف
getCachedTokenVersion(userId);
```

الـ module نفسه (الملف) يعمل كـ Singleton boundary — الـ `cache` معرّف على مستوى الـ module ويتشارك بين كل الـ callers.

---

## ٤ — الأنماط المستخدمة (Design Patterns)

### 4.1 — Cache-Aside (Lazy Loading)

```
                    ┌──────────────┐
                    │   Caller     │
                    │ (middleware) │
                    └──────┬───────┘
                           │
                    1. cache.get(userId)
                           │
                    ┌──────▼───────┐
                    │    Redis     │
                    └──────┬───────┘
                           │
               ┌───────────┴───────────┐
               │                       │
          Cache HIT ✅            Cache MISS ❌
          return value            │
                           2. db.getTokenVersion(userId)
                                  │
                           ┌──────▼───────┐
                           │  PostgreSQL   │
                           └──────┬───────┘
                                  │
                           3. cache.set(userId, value)
                                  │
                           return value
```

**ليه Cache-Aside وليس Cache-Through؟**

| النمط | من يدير الكاش؟ | التحكم |
|---|---|---|
| **Cache-Aside** | الـ Application (أنت) | كامل — أنت تقرر متى تقرأ/تكتب |
| **Cache-Through** | الـ Cache layer نفسها | محدود — الكاش يقرر كل شي |

اخترنا Cache-Aside لأن:
1. **تحكم كامل:** الـ authenticate middleware يقرر بنفسه "لو الكاش فاضي، أروح للـ DB"
2. **مرونة:** لو فيه حالات ما نبي فيها كاش (مثلاً admin endpoints)، ما نستخدمه
3. **بساطة:** ما نحتاج ORM plugin أو infrastructure معقدة

**وين الكود حقها؟**
في `authenticate.ts` (السطور 53-69):
```typescript
// 1. حاول تقرأ من الكاش
let dbTokenVersion = await getCachedTokenVersion(payload.userId);

if (dbTokenVersion === null) {
  // 2. Cache miss → روح للـ DB
  dbTokenVersion = await userRepository.getTokenVersion(payload.userId);

  // 3. عبّي الكاش للـ request الجاي
  await setCachedTokenVersion(payload.userId, dbTokenVersion);
}
```

> [!IMPORTANT]
> منطق الـ Cache-Aside موجود في الـ **caller** وليس في طبقة الكاش. هذا مقصود — طبقة الكاش تعرف بس `get`/`set`/`del`، ما تعرف شي عن الـ Database.

---

### 4.2 — Write-Through Invalidation

هذا الإصلاح الأمني الأهم. الفرق بين الطريقة القديمة والجديدة:

**الطريقة القديمة — Delete (حذف):**
```
DB:    tokenVersion = 6 (الجديد) ✅
Cache: DEL → إذا نجح: الكاش فاضي → الـ request الجاي يروح للـ DB
              إذا فشل: الكاش فيه 5 (القديم) → التوكن القديم يمر! ❌
```

**الطريقة الجديدة — Write-Through (كتابة مباشرة):**
```
DB:    tokenVersion = 6 (الجديد) ✅
Cache: SET 6 → إذا نجح: الكاش فيه 6 (الجديد) → التوكن القديم مرفوض ✅
                إذا فشل: retry 3 مرات → لو كلها فشلت: الـ TTL 60 ثانية حماية ثانوية
```

**ليه SET أحسن من DEL؟**

| | DELETE | WRITE-THROUGH (SET) |
|---|---|---|
| نجاح | الكاش فاضي ← cache miss ← DB query | الكاش فيه القيمة الجديدة ← لا DB query |
| فشل | **القيمة القديمة تبقى** ← ثغرة أمنية | **القيمة القديمة تبقى** ← ثغرة أمنية |
| بعد النجاح | 100 request = 100 DB query (thundering herd) | 100 request = 0 DB query |

النتيجة: Write-Through أفضل في حالة النجاح (لا DB queries إضافية) وفي حالة الفشل يتصرفون نفس الشي.

**التطبيق في الكود:**
```typescript
// قبل — حذف (delete)
await invalidateCachedTokenVersion(userId);

// بعد — كتابة مباشرة (write-through)
const bumpedUser = await userRepository.bumpTokenVersion(userId);
await invalidateCachedTokenVersion(userId, bumpedUser.tokenVersion);
//                                         ^^^^^^^^^^^^^^^^^^^^^^^^
//                                         نمرر الـ version الجديد
```

---

### 4.3 — Strategy Pattern

كل domain (tokenVersion, OTP, rate limit) له ملف مستقل في `strategies/`.
كلهم يستخدمون نفس الـ `CacheService` لكن بإعدادات مختلفة.

```
CacheService (العام)
    │
    ├── token-version.cache.ts  { prefix: 'token-version:', ttl: 60  }
    ├── otp.cache.ts            { prefix: 'otp:',           ttl: 300 }  (مستقبلاً)
    └── rate-limit.cache.ts     { prefix: 'rate:',          ttl: 900 }  (مستقبلاً)
```

**الفائدة:** لو بكرا احتجت OTP caching، تعمل ملف جديد **بدون ما تلمس أي ملف قديم**.

---

## ٥ — الإصلاح الأمني

### المشكلة الأمنية كانت:

```
1. الأدمن يحظر مستخدم
2. النظام يرفع tokenVersion في الـ DB (من 5 إلى 6)
3. النظام يحاول يحذف الكاش ← Redis واقع ← DEL فشل ← catch يبلع الخطأ
4. الكاش فيه tokenVersion = 5 (القديم)
5. كل request من المستخدم المحظور:
   - يقرأ من Redis ← يلاقي 5
   - يقارن مع JWT ← JWT فيه 5
   - 5 === 5 ← يمر! ← المستخدم لسا داخل النظام!
6. المستخدم عنده 5 دقائق يتصفح ويخرب بيانات حساسة
```

### الحل — 3 طبقات دفاعية (Defense in Depth):

```
الطبقة 1: Write-Through
    ↓ لو فشل
الطبقة 2: Retry 3× مع Backoff
    ↓ لو كل المحاولات فشلت
الطبقة 3: TTL = 60 ثانية (بدل 300)
    ↓
أسوأ حالة: المستخدم يبقى 60 ثانية بدل 5 دقائق
```

| الطبقة | ماذا تفعل | لو فشلت |
|---|---|---|
| Write-Through | تكتب القيمة الجديدة في الكاش | تنتقل للطبقة 2 |
| Retry (3×) | تعيد المحاولة مع تأخير متزايد | تنتقل للطبقة 3 |
| TTL = 60s | القيمة القديمة تنتهي تلقائياً | 60 ثانية أسوأ حالة |

---

## ٦ — المقايضات (Trade-offs)

### 6.1 — TTL: 60 ثانية vs 300 ثانية

| | TTL = 300s (قبل) | TTL = 60s (بعد) |
|---|---|---|
| DB queries/ساعة/مستخدم | ~12 | ~60 |
| نافذة الخطر الأمني | 5 دقائق | 1 دقيقة |
| Cache hit rate | ~99% | ~95% |
| حمل على Postgres | منخفض جداً | منخفض (PK lookup) |

**القرار:** الأمان أهم من توفير بضع DB queries. والـ query هي `SELECT tokenVersion FROM users WHERE id = ?` — مجرد lookup بالـ primary key، Postgres يعملها في أقل من 1ms.

### 6.2 — Class vs Functions للـ CacheService

| | Class | Functions |
|---|---|---|
| إعدادات مختلفة لكل domain | ✅ كل instance بإعداداته | ❌ لازم تمرر الإعدادات كل مرة |
| بساطة | ❌ أعقد قليلاً | ✅ أبسط |
| قابلية الاختبار (Testing) | ✅ تقدر تعمل mock للـ class | ✅ تقدر تعمل mock للـ functions |
| State management | ✅ واضح — في الـ instance | ❌ غير واضح — في closures |

**القرار:** Class أفضل لأننا نحتاج instances متعددة بإعدادات مختلفة.

### 6.3 — Retry على DEL فقط vs على كل العمليات

| | Retry على الكل | Retry على DEL فقط |
|---|---|---|
| أمان | ✅ أعلى | ✅ كافي |
| Performance | ❌ كل عملية فاشلة تضيف latency | ✅ فقط العمليات الحرجة |
| تعقيد | ❌ أعقد | ✅ أبسط |
| Self-healing | GET/SET تصلح نفسها بدون retry | DEL ما تصلح نفسها — لازم retry |

**القرار:** Retry على DEL فقط — لأن GET و SET ذاتية الإصلاح، الـ retry عليهم يضيف latency بدون فائدة أمنية.

---

## ٧ — أسئلة مقابلات متوقعة

### س1: "شو الفرق بين Cache-Aside و Write-Through و Write-Behind؟"

| النمط | القراءة | الكتابة | متى تستخدمه |
|---|---|---|---|
| **Cache-Aside** | التطبيق يقرأ من الكاش أولاً، لو miss يروح للـ DB ويعبّي الكاش | التطبيق يكتب في الـ DB أولاً، ثم يحذف/يحدّث الكاش | لمّا تبي تحكم كامل |
| **Write-Through** | من الكاش | التطبيق يكتب في الكاش، والكاش يكتب في الـ DB | لمّا تبي consistency عالي |
| **Write-Behind** | من الكاش | التطبيق يكتب في الكاش، والكاش يكتب في الـ DB **لاحقاً** (async) | لمّا تبي performance عالي |

> **ملاحظة:** في مشروعنا نستخدم **Cache-Aside للقراءة** + **Write-Through للإبطال (invalidation)**. هذا خليط ذكي — القراءة مرنة والإبطال آمن.

---

### س2: "لو Redis وقع نهائياً، شو يصير للنظام؟"

**الجواب:**
النظام **ما يوقف**. هذا تصميم مقصود يسمى **Graceful Degradation**:

1. `getCachedTokenVersion()` → يرجع `null` ← الـ middleware يروح للـ DB مباشرة
2. `setCachedTokenVersion()` → يفشل بصمت ← الـ request الجاي يروح للـ DB برضو
3. `invalidateCachedTokenVersion()` → يعيد المحاولة 3 مرات ← يسجل ERROR ← الـ TTL ينتهي بعد 60 ثانية

**النتيجة:** كل authenticated request يروح للـ DB مباشرة (زي ما كان قبل ما نضيف Redis). الأداء يقل لكن النظام يشتغل.

---

### س3: "ليه استخدمت SRP هنا؟ شو الفائدة العملية؟"

**الجواب:**
```
قبل SRP:
  "أبي أضيف OTP caching"
  → أفتح redis.ts (ملف فيه connection + tokenVersion)
  → أضيف OTP functions
  → الملف يكبر ← يصير صعب القراءة والصيانة
  → لو عدّلت شي بالغلط، أأثر على tokenVersion!

بعد SRP:
  "أبي أضيف OTP caching"
  → أعمل ملف جديد: otp.cache.ts
  → ما ألمس أي ملف قديم
  → مستحيل أأثر على tokenVersion بالغلط
```

**القاعدة الذهبية:** "إذا تقدر تضيف feature جديد بدون ما تعدّل كود قديم، تصميمك صحيح."

---

### س4: "ليه ما استخدمت Dependency Injection للـ Redis client؟"

**الجواب:**
في مشروع صغير/متوسط، الـ module system حق Node.js **هو** الـ DI container:

```typescript
// cache.service.ts
import { redis } from '../config/redis.js';  // ← Module-level import = Singleton
```

كل ملف يعمل `import { redis }` يحصل على **نفس الـ instance** — هذا Singleton بدون مكتبة DI.

**متى تحتاج DI حقيقي (مثل InversifyJS)؟**
- لمّا عندك أكثر من Redis connection (مثلاً: primary + replica)
- لمّا تحتاج تبدّل الـ Redis client في الـ tests بـ mock
- لمّا المشروع يكبر ويصير عندك عشرات الـ services

في مشروعنا الحالي، الـ module imports كافية وأبسط.

---

### س5: "ليه رجّعت `boolean` من `del()` بدل ما ترمي Error؟"

**الجواب:**
لأن الـ CacheService **عام** (generic) — ما يعرف شو الـ domain اللي يستخدمه.

- لو الـ domain هو tokenVersion (أمني) → فشل الحذف = **كارثة** ← الـ domain layer يقرر يرمي error
- لو الـ domain هو rate limit counter → فشل الحذف = **مش مهم** ← الـ domain layer يتجاهل

القرار "هل هذا الفشل خطير؟" هو **business decision** (قرار تجاري) — يعود للـ domain، مش للـ infrastructure.

```typescript
// في token-version.cache.ts — القرار عند الـ domain
const deleted = await cache.del(userId);
if (!deleted) {
  logger.error({ message: 'CRITICAL: stale token may persist', userId });
  // الـ domain يقدر يرمي error هنا لو يبي
}
```

---

### س6: "شو يعني Defense in Depth ولو طبّقته؟"

**الجواب:**
مبدأ أمني يقول: "لا تعتمد على طبقة حماية واحدة. حط طبقات متعددة بحيث لو فشلت واحدة، الباقي يحميك."

في مشروعنا:
```
الطبقة 1: Write-Through    → يكتب القيمة الصحيحة مباشرة
الطبقة 2: Retry 3×         → يعيد المحاولة لو فشلت الكتابة
الطبقة 3: TTL = 60s        → حتى لو كل شي فشل، البيانات القديمة تموت بعد دقيقة
الطبقة 4: ERROR Logging    → الفريق يتنبّه ويتدخل يدوياً
```

لو اعتمدنا على طبقة واحدة (مثلاً DEL بدون retry بدون TTL قصير)، فشل واحد = ثغرة أمنية 5 دقائق.

---

### س7: "ليه اخترت Linear Backoff بدل Exponential Backoff؟"

**الجواب:**

| | Linear (attempt × base) | Exponential (2^attempt × base) |
|---|---|---|
| 3 محاولات مع base=200ms | 200, 400, 600 = **1.2s** | 200, 400, 800 = **1.4s** |
| البساطة | ✅ أبسط | ❌ أعقد قليلاً |
| فعالية | ✅ كافية لـ 3 محاولات | ✅ أفضل لـ 10+ محاولات |

مع **3 محاولات فقط**، الفرق بين Linear و Exponential هو 200ms — لا يستاهل التعقيد الإضافي.

Exponential Backoff يصير مهم لمّا عندك **عشرات المحاولات** (مثلاً: reconnection strategy) — هناك الفرق يكون كبير ويمنع overload.

---

### س8: "شو الـ Thundering Herd Problem وكيف حللتها؟"

**الجواب:**
لمّا تحذف key من الكاش، وفي نفس اللحظة 100 request يجون:

```
DELETE key "token-version:user-123"
    ↓
Request 1: cache miss → DB query
Request 2: cache miss → DB query
Request 3: cache miss → DB query
...
Request 100: cache miss → DB query
= 100 DB queries في نفس اللحظة! (Thundering Herd)
```

**حلنا (Write-Through):**
```
SET key "token-version:user-123" = 6
    ↓
Request 1: cache hit → return 6 ✅
Request 2: cache hit → return 6 ✅
...
Request 100: cache hit → return 6 ✅
= 0 DB queries
```

Write-Through يحل الـ Thundering Herd لأن الكاش **دائماً فيه قيمة** — ما يصير cache miss أبداً.
