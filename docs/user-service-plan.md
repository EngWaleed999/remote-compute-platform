# خطة تطوير خدمة المستخدم (User Service Development Plan)

## 1. تحليل الوضع الحالي (Current State Analysis)
بعد فحص الـ `user-service`، هذا هو الوضع الحالي:
- **قاعدة البيانات (Database)**: مبنية باستخدام Prisma و PostgreSQL.
- **نموذج المستخدم (User Model)**: يحتوي بالفعل على حقل `emailVerified` (الافتراضي `false`)، ولكنه لا يُستخدم حالياً في عملية التسجيل (Registration).
- **المصادقة (Authentication)**: نظام قوي يدعم الـ Registration، Login، Refresh Tokens، والـ Session Management.
- **الأمان (Security)**: حماية متقدمة تشمل CSRF tokens، Hash للـ Refresh tokens، وتتبع الـ Token Families للحماية من السرقة.
- **استعادة الحساب (Account Restore)**: يعتمد على رمز استعادة (Restore Code) يتم تخزينه في الـ DB (`restoreCodeHash` و `restoreCodeExpiresAt`).

## 2. النواقص وما يجب التركيز عليه (What's Missing & Focus Areas)
في الوقت الحالي، النظام يفتقر إلى الآتي:
- **نظام التحقق من البريد الإلكتروني (Email Verification)** بعد عملية الـ Registration.
- **التكامل مع Redis** لتخزين رموز التحقق المؤقتة بآلية הـ TTL (Time To Live).
- **طابور المهام (Background Jobs / Message Queues)** لمعالجة الإيميلات بشكل غير متزامن (Asynchronous).

## 3. التركيز الأول: التحقق من البريد الإلكتروني (Focus: Email Verification)
نحتاج إلى بناء نظام التحقق من الإيميل أولاً للتأكد من صحة بيانات المستخدمين. 

### أ. الاختيار بين OTP و Token
- **الـ OTP (One-Time Password)**: عادةً مكون من 6 أرقام. ميزته أنه ممتاز لتطبيقات الموبايل (Mobile Apps) وأسهل في الإدخال اليدوي.
- **الـ Token (Magic Link)**: عبارة عن سلسلة نصية طويلة (UUID أو Crypto String). ميزته أنه يوفر تجربة مستخدم (UX) سلسة جداً بضغطة زر من الإيميل مباشرة.
> **توصية (Recommendation):** استخدام الـ OTP إذا كان هناك تطبيق موبايل، أو الـ Token إذا كان النظام يعتمد أساساً على الـ Web.

### ب. استخدام Redis مع الـ TTL
بدلاً من حفظ الـ OTP/Token في الـ DB كما حدث في الـ `restoreCode`، سنستخدم Redis:
- **السرعة والأداء (Performance)**: Redis يعتمد على الذاكرة (In-Memory) مما يجعله أسرع بكثير لتخزين البيانات المؤقتة.
- **الحذف التلقائي (Auto-Expiration)**: باستخدام خاصية الـ TTL، سيقوم Redis بحذف الـ OTP تلقائياً بعد انتهاء المدة (مثلاً 15 دقيقة) دون الحاجة لـ Clean-up Jobs في الـ DB.
- **شكل الـ Key**: سيكون شيء مثل `email-verification:{userId}` وقيمته هي الـ Hash الخاص بالـ OTP أو الـ Token.

### ج. مسار العمل (Workflow)
1. **أثناء الـ Register**: بعد إنشاء الـ User في الـ DB، نقوم بتوليد OTP/Token.
2. **التخزين في Redis**: نحفظ الرمز المولد في Redis مع تحديد الـ TTL (مثلاً 900 ثانية).
3. **إرسال الإيميل**: نرسل الرمز للمستخدم (حالياً بشكل مباشر Synchronous حتى ننتقل للخطوة المتقدمة).
4. **نقطة التحقق (Verify Endpoint)**: نقوم بإنشاء Endpoint يستقبل الـ OTP/Token، يقارنه بالموجود في Redis، وإذا كان صحيحاً، نعدل حقل `emailVerified` إلى `true` في الـ DB ونحذف الـ Key من Redis.

## 4. المواضيع المتقدمة: وظائف الخلفية (Advanced Topics: Background Jobs)
بعد التأكد من عمل الـ Email Verification بنجاح، يجب نقل عملية إرسال الإيميلات لتتم في الخلفية (Background) حتى لا نعطل الـ Main Thread الخاص بـ Node.js ونقلل الـ Response Time.

### الخطوات المخطط لها (Planned Steps):
- **إضافة Background Job System**: يمكن استخدام مكتبة مثل **BullMQ** (التي تعتمد على Redis أيضاً) أو **RabbitMQ**.
- **إنشاء Queue**: عمل طابور (Queue) مخصص للإيميلات (`email-queue`).
- **إنشاء Worker**: خدمة (أو جزء من الخدمة) تعمل في الخلفية تستمع للـ Queue وتقوم بإرسال الإيميلات عن طريق مزود خدمة مثل (AWS SES, SendGrid, Resend).
- **إعادة المحاولة (Retries)**: في حال فشل إرسال الإيميل، يمكن للـ Background Job أن يحاول الإرسال مرة أخرى (Retry Mechanism).
