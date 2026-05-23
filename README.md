# Remote Compute Booking Platform

## Compute As A Service

### Idea

#### The Real Problem

كثير من المستخدمين لديهم أجهزة ضعيفة ويحتاجون أجهزة قوية لكي:

- Rendering للفيديو
- AI تدريب نماذج
- تشغيل ألعاب ثقيلة
- build لمشاريع برمجية كبيرة
- تحليل بيانات

شراء جهاز قوي مكلف وقد يستخدم فقط ساعات قليلة أسبوعياً.

#### Solution

منصة تسمح للمستخدمين أن يحجزوا جهازاً قوياً عن بعد بالساعة.

---

## Users

1.  يختار نوع الجهاز
2.  يحجزه بالساعة
3.  يتصل عبر Remote Desktop
4.  ينفذ العمل
5.  يدفع حسب الوقت

---

## Types of Machines

- **GPU Machines:** (AI / Rendering)
- **Gaming Machines**
- **Developer Machines**
- **Data Processing Machines**

---

## Example Use

A Node.js developer wants to build a big project or run Docker workloads on a poor device.

بدلاً من شراء جهاز بـ 3000$، يستأجر جهازاً لمدة 3 ساعات.

---

## ميزات قوية تضيفها

- **Auto Shutdown**
- **SnapShot للبيئة**
- **Upload/Download for files**
- **Monitoring للوقت والاستهلاك**
- **Queue If Machines is busy**

---

## Phase 1: The Discover Phase

### 1. Target/Problem Statement

Many developers, designers, and gamers own low-performance machines but occasionally require high-performance hardware (GPU / high CPU) for short tasks such as rendering, AI training, or large builds. Purchasing such machines is expensive and inefficient for short-term usage.

The platform allows users to rent high-performance machines on demand and pay only for the time used.

### User Personas

#### Customers

- **Goals:**
  - Finish heavy tasks quickly.
  - Avoid buying expensive hardware.
- **Pain Points:**
  - Weak local machines.
  - Cloud providers are complicated.
  - GPU instances are expensive.
- **Behavior:**
  - Short usage sessions (1–5 hours).
  - High demand for GPU machines.

#### Machines Owner / Businesses

- **Goals:**
  - Monetize idle machines.
  - Maximize utilization.
- **Pain Points:**
  - Machines sitting idle.
  - Difficult to manage bookings manually.

#### Admins

- **Goals:**
  - Platform stability.
  - Prevent fraud.
  - Ensure machine availability.

### 2. What is the real problem that this project is solving?

- **The Problem:**
  Users need temporary high-performance computing but cannot justify buying expensive hardware.

- **Solution:**
  Remote machine booking platform.

### 3. من المستخدمين وكم عددهم وما سلوكهم؟

نفترض أرقاماً تقريبية:

- **المستخدمون (Customers):** 10K - 50K
- **المستخدمون المتزامنين (Concurrent users):**
  - 500 concurrent users
  - 1000 booking requests

> This is very important for system design.

### User Flow

- **Customers:**
  `User enter -> Browse Machines -> Filter Specs -> Book machine -> Pay -> Start Remote session`

- **Machines Owner / Businesses:**
  `Add Machines -> Manage Machines -> Availability -> View Booking`

- **Admins:**
  `Monitor All the system`

### 4. Value Proposition

- **Customer:**
  - Simpler than cloud providers.
  - Pay-per-hour model.
  - Instant access to machines.
  - No setup required.
  - Your data is protected

- **Machines Owner / Businesses:**
  - إدارة حجوزات مركزية.
  - تقليل الأخطاء.
  - زيادة الإيرادات.
  - الاستفادة من مواصفات الأجهزة عن طريق الحجز.

- **المنصة:**
  - عمولة على كل حجز.

### 1. Constraints

ما القيود؟

- Machines availability
- Network latency
- Session security
- File transfer limits

### 2. Risks

ما المخاطر؟

- Machine abuse
- Crypto mining
- Illegal activities
- Double booking

### 3. Edge Cases

- User disconnects during session
- Payment fails
- Machine crashes
- Booking expires

### 5. Success Metrics (KPIs)

- **Platform success metrics:**
  - Booking success rate > 95%
  - Machine utilization rate > 70%
  - Average booking time < 2 minutes
  - System uptime > 99.9%

---

### 6. What are the failure scenarios?

أين يمكن أن يتعطل النظام؟

- **أهم السيناريوهات:**
  1.  **Double Booking:**
      - مستخدمان يحجزان نفس الجهاز في نفس اللحظة.
      - **النتيجة:** تضارب في الحجز، تجربة مستخدم سيئة.
      - **الحل لاحقاً:**
        - Database transactions
        - Row locking
        - Distributed lock

  2.  **Payment Success but Booking Fail?**
      - الدفع نجح ولكن الحجز لم يتم تسجيله.
      - **النتيجة:** خسارة ثقة المستخدم، مشاكل مالية.
      - **الحل:**
        - Transactional workflow
        - Payment confirmation logic

  3.  **Machine Goes Offline:**
      - الجهاز يتوقف فجأة.
      - **النتيجة:** جلسة المستخدم تتوقف.
      - **الحل:**
        - Machine health Monitoring
        - Automatic refund or relocation

  4.  **Session Crash:**
      - اتصال remote session ينقطع.
      - **الحل:**
        - Session reconnect
        - Session recovery

  5.  **Owner Deletes Machine During Booking:**
      - مالك الجهاز يحذفه أثناء وجود الحجز.
      - **الحل:**
        - Prevent deletion if active booking exists.

---

### 7. What are the critical operations?

هذه العمليات لو فشلت، النظام يتضرر.

- **أهم العمليات:**
  1.  Machine Search
  2.  Machine booking
  3.  Payment Processing
  4.  Session Start
  5.  Session termination
  6.  Machine availability update

- **أكثر عملية حساسة في النظام:**
  **Booking Operation**، لأنها تتضمن:
  - Availability check
  - Reservation
  - Payment

---

### 8. What needs to be fast?

ليس كل شيء يحتاج سرعة عالية.

- **الأشياء التي يجب أن تكون سريعة:**
  1.  Machine Search
  2.  Availability check
  3.  Session Start

- **الأشياء التي لا تحتاج لسرعة عالية:**
  1.  Reports
  2.  Analytics
  3.  Usage history

---

### 9. What needs to be consistent?

**Consistency** تعني أن البيانات يجب أن تكون صحيحة دائماً.

1.  **Machine availability:**
    لا يمكن أن يكون الجهاز `available` و `booked` في نفس الوقت.

2.  **Booking Records:**
    لا يمكن أن يكون الحجز `confirmed` بدون `paid`.

3.  **Session Ownership:**
    لا يمكن أن يدخل جهاز شخص آخر.

---

### 10. What can fail safely?

هذه العمليات إذا فشلت لا تؤثر على النظام الأساسي:

1.  Email Notifications
2.  Analytics
3.  Recommendation system

---

### 11. What should be asynchronous?

العمليات التي يجب ألا تعطل المستخدم:

1.  Email Sending after booked
2.  Usage analytics (تسجيل استخدام الأجهزة)
3.  Machine Monitoring (فحص حالة الأجهزة)
4.  Billing reports (حساب الأرباح اليومية)
5.  Session logs (تسجيل ما حدث أثناء الجلسة)

> هذه العمليات يجب تنفيذها عبر:
>
> - Queue system
> - Background workers
