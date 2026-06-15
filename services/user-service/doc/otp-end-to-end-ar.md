# توثيق: بناء نظام التحقق من البريد الإلكتروني (OTP) من البداية للنهاية

> **التاريخ:** 2026-06-15
> **الهدف:** بناء دورة كاملة للتحقق من الـ OTP تشمل (Service, Controller, Routes, DB Schema).

---

## ١. المشكلة السابقة والسبب في التغيير

في الكود القديم، كنا نقوم بإنشاء الـ OTP وتخزينه والتحقق منه وإرساله عبر الإيميل **في نفس اللحظة** داخل دالة الـ `register`. 

**ليه هذا غلط؟**
لأن المستخدم يحتاج وقت ليفتح إيميله ويقرأ الكود. لو حاولنا التحقق من الكود في نفس لحظة التسجيل، الكود حيفشل لأنه لسه ما تم إدخاله من قبل المستخدم، زائد إن الـ Request راح يفضل معلق (Blocked) لحد ما الإيميل يتبعت.

---

## ٢. التغييرات اللي سويناها (The E2E Implementation)

### 1. طبقة الـ Database (Prisma Schema)
- أضفنا `EMAIL_VERIFIED` لجدول الـ `UserAction` في قاعدة البيانات.
- **السبب:** حتى نقدر نسجل في الـ Audit Log إن المستخدم هذا أكد حسابه بنجاح لأغراض المراقبة والأمان.

### 2. طبقة الـ Service (`auth.service.ts`)
- **حذفنا** سطر التحقق الخاطئ من دالة `register`، وصارت הדالة فقط: "تنشئ الـ OTP > تخزنه في Redis > ترسله للإيميل".
- **أنشأنا دالة جديدة:** `verifyEmail(dto, meta)`
  - تستقبل الـ `userId` والـ `enteredOtp`.
  - تتصل بـ `otpService.verifiyOTP` لتتأكد من صحة الكود.
  - إذا كان صحيح، تقوم بتحديث قاعدة البيانات (`emailVerified: true`).
  - تسجل العملية في الـ `AuditService`.

### 3. طبقة الـ Controller (`auth.controller.ts`)
- أنشأنا دالة `verifyEmail` في الـ Controller.
- مهمتها استقبال الـ Request من المستخدم (body)، استخراج الـ Data، وتمريرها للـ Service، ثم إرجاع رسالة نجاح `200 OK`.

### 4. طبقة التوجيه (`auth.routes.ts` & `auth.dto.ts`)
- أنشأنا Route جديد: `POST /auth/verify-email`.
- أضفنا `verifyEmailSchema` باستخدام `Zod` علشان نعمل Validation للبيانات قبل ما توصل للـ Controller (نتأكد إن الـ OTP طوله 6 أرقام والـ UserID عبارة عن UUID صحيح).

---

## ٣. المقايضات (Trade-offs) اللي لازم تعرفها

| القرار المعماري | الميزة (Pros) | العيب (Cons) / المقايضة |
| --- | --- | --- |
| **التخزين في Redis وليس DB** | أسرع جداً، والـ OTP ينتهي تلقائياً بفضل الـ TTL (300 ثانية). | لو Redis مسح البيانات بالخطأ، المستخدم لازم يطلب OTP جديد (مقبول جداً). |
| **Sync Email Sending** | كود بسيط، ومباشر. تضمن إن الإيميل انبعث قبل ما ترد للـ Client. | **مشكلة:** يضيف وقت انتظار (Latency) للـ API. لو الـ Email Provider تأخر، المستخدم حيشوف شاشة تحمل لفترة طويلة. |

---

## ٤. ليه لازم تعرف هذا الكلام؟ (استعداداً للـ Background Jobs)

حالياً، دالة الـ `register` تعمل بشكل **Synchronous (متزامن)**:
```typescript
const otp = otpService.generateOTP();
await otpService.storeOTP(user.id, otp);
await emailService.sendEmailVerifiy(dto.email, otp); // المشكلة هنا!
return response;
```
أنت طلبت أننا ننتقل لمشاكل متقدمة (Race condition, Idempotency) ثم إلى **Background Jobs**.

### ليه الـ Background Jobs مهمة هنا؟
- إرسال الإيميل قد يأخذ 1-3 ثواني.
- لا يجب أن نُجبر المستخدم على الانتظار هذه الثواني ليحصل على استجابة الـ `201 Created`.
- الحل القادم سيكون **Asynchronous (غير متزامن)** باستخدام طوابير (Message Queues مثل RabbitMQ أو BullMQ):

**الشكل المستقبلي (Event-Driven):**
```typescript
const otp = otpService.generateOTP();
await otpService.storeOTP(user.id, otp);

// بدل إرسال الإيميل مباشرة، نرسل الحدث للـ Queue
await messageQueue.publish('USER_REGISTERED', { email: dto.email, otp });

return response; // استجابة سريعة جداً للمستخدم (milliseconds)
```
في الخلفية (Background Job)، هناك Worker مستقل راح يستلم الحدث ويرسل الإيميل براحته بدون ما يؤثر على سرعة استجابة الـ API، ولو فشل إرسال الإيميل يقدر يعمل Retry بدون ما يخرب تجربة المستخدم!

---
**الخلاصة:**
تم بناء مسار `verifyEmail` بالكامل وهو جاهز الآن لتقوم باختباره يدوياً عبر Postman أو أي أداة مشابهة. بعد نجاح الاختبار، سنكون مستعدين لدخول عالم الـ Queues والـ Idempotency!
