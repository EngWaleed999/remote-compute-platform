# هندسة تحويل إرسال الإيميلات إلى Background Job (Queue & Worker)

إن تحويل عملية إرسال الإيميلات من (Synchronous) إلى (Asynchronous Background Job) هو الخطوة التي تنقل مشروعك من "تطبيق عادي" إلى "نظام مؤسسي (Enterprise-Grade System)". 

سأقوم بتشريح المعمارية وتفصيلها لك تماماً كما تُبنى في الشركات الكبرى (مثل Uber و Netflix)، مع التركيز الصارم على مبدأ الـ **SRP (Single Responsibility Principle)**.

---

## 1. لماذا هذا التحويل ضروري؟ (المشكلة الحالية)
في الوضع الحالي (Synchronous):
- المستخدم يطلب OTP -> السيرفر يتصل بمزود الإيميل (مثل AWS SES أو SendGrid) -> السيرفر ينتظر الرد (يأخذ من 500ms إلى 2 ثانية) -> السيرفر يرد على المستخدم.
- **المخاطر:** 
  1. إذا تعطل مزود الإيميل، السيرفر الخاص بك سيتعطل أو يتأخر جداً في الرد على المستخدم.
  2. هدر موارد السيرفر (Threads) في انتظار استجابة الشبكة (I/O Blocking).
  3. لا يوجد نظام "إعادة محاولة" (Retry Mechanism) آلي في حال فشل الإرسال بسبب مشكلة مؤقتة في الشبكة.

---

## 2. المخطط التفصيلي للتدفق (Detailed Data Flow)

المخطط الذي ذكرته في سؤالك كان نواة صحيحة، وإليك تفصيله المعماري الكامل:

```text
[1. Client/User] 
      │ (POST /auth/request-otp)
      ▼
[2. Auth Service] ──(Validates user, checks limits)──► [3. OTP Service]
                                                              │ (Generates OTP, Hashes it)
                                                              │ (Stores in Redis)
                                                              ▼
                                                 [4. Queue Producer (Publisher)]
                                                              │ (Pushes Job Payload: {email, otp, template})
                                                              ▼
[5. API Response] ◄──(Returns 200 OK immediately)◄── [Message Broker (Redis/RabbitMQ)]
(Time taken: < 50ms)                                          │
                                                              │ (Job stays in Queue)
                                                              ▼
                                                   [6. Background Worker (Consumer)]
                                                              │ (Pulls the Job from Queue)
                                                              ▼
                                                       [7. Email Service]
                                                              │ (Compiles Template + OTP)
                                                              ▼
                                                 [8. 3rd Party Provider (SMTP/SES)]
                                                              │
                    ┌─────────────────────────────────────────┴─────────────────────────────────────────┐
                    ▼                                                                                   ▼
             [9. SUCCESS]                                                                          [10. FAILURE]
    (Job marked as 'Completed')                                                    (Worker applies Exponential Backoff Retry)
    (Audit Log updated)                                                            (If retries exhausted -> Move to Dead Letter Queue DLQ)
```

---

## 3. تفصيل الأدوار حسب مبدأ SRP (Single Responsibility Principle)

لكي يكون الكود قابلاً للصيانة (Maintainable) والتوسع (Scalable)، يجب أن يكون لكل ملف وظيفة واحدة محددة:

### أ. `otp.service.ts` (المنسق المنطقي)
- وظيفته: توليد الكود، تشفيره، تخزينه في Redis.
- التغيير الجديد: لم يعد يستدعي `emailService`! أصبح يستدعي `emailQueue.addJob()`. لا يهمّه كيف سيُرسل الإيميل، هو فقط يرمي المهمة في الصندوق ويمضي.

### ب. `queue.producer.ts` (صندوق البريد)
- وظيفته: استلام البيانات (Payload) وتغليفها في "مهمة" (Job) وإرسالها إلى الـ Message Broker (مثل BullMQ المعتمد على Redis).

### ج. `email.worker.ts` (العامل المجتهد)
- وظيفته: الاستماع (Listening) الدائم للـ Queue. عندما يجد مهمة جديدة، يقوم بسحبها، ثم يرسلها إلى `emailService.ts`.
- يدير دورة حياة المهمة (نجاح، فشل، إعادة محاولة).

### د. `email.service.ts` (ساعي البريد)
- وظيفته: يتواصل فقط مع الـ API الخارجي (مثل SendGrid أو Nodemailer). يأخذ الإيميل والمحتوى وينفذ الإرسال الفعلي. لا يعرف شيئاً عن الـ OTP أو الـ Queue.

---

## 4. المكونات التقنية التي سنحتاجها (Tech Stack)

لتطبيق هذا المخطط باحترافية، سنحتاج إلى:

1. **Message Broker:** 
   بما أنك تستخدم **Redis** حالياً للـ OTP، فالأفضل تقنياً هو استخدام مكتبة **BullMQ** (وهي مكتبة قوية جداً مبنية فوق Redis وتدير الـ Queues والـ Workers باحترافية).
2. **Dead Letter Queue (DLQ):** 
   مكان تُرمى فيه المهام التي فشلت حتى بعد كل محاولات إعادة الإرسال (مثلاً إيميل خاطئ تماماً لا يمكن إرساله).
3. **Exponential Backoff Strategy:** 
   نظام ذكي لإعادة المحاولة. إذا فشل إرسال الإيميل، العامل يحاول بعد 5 ثوانٍ. إذا فشل، يحاول بعد 15 ثانية، ثم دقيقة، وهكذا (لتجنب إغراق السيرفر الخارجي بالطلبات المرفوضة).

---

## 5. هيكلة الملفات المقترحة (Folder Structure)

في الـ Microservice الخاصة بالمستخدمين (`user-service`)، ستكون الهيكلة هكذا:

```text
src/
 ├── services/
 │    ├── auth.service.ts       (التحقق العام)
 │    ├── otp.service.ts        (توليد الكود وتخزينه)
 │    └── email.service.ts      (الإرسال الفعلي عبر SMTP)
 │
 ├── queues/                    (🔥 مجلد جديد)
 │    ├── connection.ts         (اتصال BullMQ مع Redis)
 │    ├── email.queue.ts        (الـ Producer: يضيف المهام للطابور)
 │    └── constants.ts          (أسماء الـ Queues)
 │
 └── workers/                   (🔥 مجلد جديد)
      └── email.worker.ts       (الـ Consumer: يستمع للطابور وينفذ)
```

---

## 6. سيناريوهات (Edge Cases) يجب أخذها في الحسبان

عند بناء نظام Queues، يجب أن تحمي نفسك من هذه المشاكل:

1. **الـ Graceful Shutdown:** ماذا لو قمنا بإعادة تشغيل السيرفر (Restart) وهناك مهمة تُنفذ في هذه اللحظة؟ يجب برمجة الـ Worker لينهي عمله الحالي قبل أن ينطفئ السيرفر، أو يُرجع المهمة للطابور.
2. **الـ Idempotency في الـ Worker:** ماذا لو استلم الـ Worker نفس المهمة مرتين بسبب خلل في الشبكة؟ يجب التأكد أن المهمة تحتوي على `jobId` فريد حتى لا يُرسل الإيميل مرتين.
3. **تراكم الطابور (Queue Backpressure):** ماذا لو تم طلب 100,000 إيميل فجأة؟ BullMQ سيتعامل معها بلطف ويخزنها في Redis، والـ Worker سيسحب حسب قدرته (مثلاً 50 إيميل في الثانية) مما يحمي مزود الخدمة من الـ Rate Limit.

هذا هو المخطط المعماري الكامل (Architecture Blueprint). هل يبدو هذا التوجه منطقياً لك لكي نبدأ في كتابة الأكواد وتطبيقها خطوة بخطوة باستخدام مكتبة BullMQ؟
