# 🔴 Project Handoff — Remote Compute Platform

> **Purpose:** This document gives a new agent everything needed to understand the project and fix the critical infinite redirect loop bug.

---

## 1. Project Overview

**Name:** Remote Compute Platform (NovaCPU)  
**Architecture:** Microservices  
**Monorepo Path:** `/home/waleed/workSpace/remote-compute-platform`

| Component | Path | Stack |
|-----------|------|-------|
| **Frontend** | `apps/web-client/` | React 19, TypeScript, Vite, Tailwind CSS v4, Zustand, TanStack Query, React Router 7, Framer Motion, Axios |
| **Backend** | `services/user-service/` | Node.js, Express, TypeScript, Prisma (PostgreSQL), Redis (ioredis), JWT, bcryptjs |
| **Shared** | `packages/` | Shared utils (AppError class, logger, etc.) |

**Auth Strategy:** HttpOnly cookie-based JWT authentication with CSRF (Double Submit Cookie pattern).

---

## 2. The Critical Bug: Infinite Redirect Loop

### Symptoms
- App makes ~1900 requests in 30 seconds on load
- Browser crashes into backend's rate limit (429)
- Network tab shows aggressive retries involving `router.tsx` and `auth-store.ts`
- Happens when **backend is offline** OR when **user has no session**

### The Death Chain (How It Happens)

```
1. App mounts → AuthHydration runs
2. AuthHydration calls GET /api/v1/users/me (through Axios with interceptors)
3. Backend returns 401 (no cookies) or network error (backend offline)
4. Axios response interceptor catches the error:
   - Tries POST /auth/refresh → also fails
   - On refresh failure: calls window.location.href = '/auth/session-expired'
   - OR calls router.navigate('/auth/session-expired')
5. This triggers a page reload or re-render
6. App re-mounts → AuthHydration runs AGAIN → GOTO step 2
7. ∞ INFINITE LOOP
```

---

## 3. Root Causes Identified (5 Bugs)

### Bug 1: Backend — CSRF applied to GET /users/me
**File:** `services/user-service/src/routes/user.routes.ts`

```typescript
// CURRENT (BROKEN):
router.use(authenticate);
router.use(csrfProtection);  // ← Applied to ALL methods including GET!

// GET /users/me requires CSRF token, but during hydration
// the browser has NO csrfToken cookie yet → 403 Forbidden
```

**Fix:** Move `csrfProtection` from `router.use()` to per-route on PATCH/DELETE only.

---

### Bug 2: Frontend — Hydration uses Axios instance WITH interceptors
**File:** `apps/web-client/src/App.tsx` + `apps/web-client/src/services/user-service.ts`

```typescript
// App.tsx calls:
const user = await userApi.getMe();

// user-service.ts does:
getMe: () => api.get('/users/me').then(r => r.data)
// 'api' is the Axios instance WITH response interceptors!
```

When `getMe()` returns 401, the interceptor tries to refresh tokens, refresh fails, and the interceptor redirects — causing the loop.

**Fix:** Create a separate `bareApi` Axios instance with NO interceptors, use it ONLY for hydration.

---

### Bug 3: Frontend — Interceptor redirects on refresh failure
**File:** `apps/web-client/src/lib/api-client.ts`

```typescript
// In the response interceptor, on refresh failure:
window.location.href = '/auth/session-expired';  // ← FULL PAGE RELOAD!
// or:
router.navigate('/auth/session-expired', { replace: true });
```

Any redirect here (whether page reload or client-side nav) can trigger re-hydration → loop.

**Fix:** The interceptor should NEVER redirect. It should ONLY call `clearAuth()`. Let `ProtectedRoute` handle all navigation.

---

### Bug 4: Frontend — Auth store race condition
**File:** `apps/web-client/src/store/auth-store.ts`

```typescript
setUser: (user) => set({ user, isAuthenticated: true }),
// isHydrated is NOT set here! It's set separately by setHydrated()
// This creates a window where isAuthenticated=true but isHydrated=false
```

**Fix:** `setUser` should atomically set `{ user, isAuthenticated: true, isHydrated: true }`.

---

### Bug 5: Frontend — useUser() runs without auth check
**File:** `apps/web-client/src/hooks/use-user.ts`

```typescript
export function useUser() {
  return useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: async () => {
      const user = await userApi.getMe(); // ← Runs even when not authenticated!
      ...
    },
    // NO 'enabled' guard!
  });
}
```

If any component uses `useUser()` when not authenticated, it triggers `getMe()` → 401 → interceptor → refresh → fail → redirect → loop.

**Fix:** Add `enabled: isAuthenticated` to prevent running when not logged in.

---

## 4. Complete File Map (Auth Flow Chain)

### Backend Files

| File | Purpose | Issue? |
|------|---------|--------|
| `services/user-service/src/app.ts` | Express setup, CORS, middleware order | ✅ OK |
| `services/user-service/src/routes/user.routes.ts` | User route definitions | 🔴 Bug 1: CSRF on GET |
| `services/user-service/src/routes/auth.routes.ts` | Auth route definitions | ✅ OK |
| `services/user-service/src/middlewares/authenticate.ts` | JWT verification + tokenVersion check via Redis | ✅ OK |
| `services/user-service/src/middlewares/csrf.ts` | Double Submit Cookie validation | ✅ OK (logic is fine, just wrong placement) |
| `services/user-service/src/middlewares/rate-limit.ts` | Rate limiting (global: 100/15min) | ⚠️ Symptom (loop hits the limit) |
| `services/user-service/src/middlewares/error-handler.ts` | Centralized error response | ✅ OK (returns JSON, no redirects) |
| `services/user-service/src/controllers/user.controller.ts` | GET/PATCH/DELETE /users/me | ✅ OK |
| `services/user-service/src/controllers/auth.controller.ts` | register/login/refresh/logout/restore | ✅ OK |
| `services/user-service/src/services/auth.service.ts` | Auth business logic (702 lines) | ✅ OK |
| `services/user-service/src/utils/cookie.util.ts` | Cookie set/clear helpers | ✅ OK |

### Frontend Files

| File | Purpose | Issue? |
|------|---------|--------|
| `apps/web-client/src/App.tsx` | Auth hydration + providers | 🔴 Bug 2: Uses interceptor-equipped Axios |
| `apps/web-client/src/lib/api-client.ts` | Axios instance + interceptors | 🔴 Bug 3: Redirects on refresh failure |
| `apps/web-client/src/store/auth-store.ts` | Zustand auth state | 🔴 Bug 4: setUser doesn't set isHydrated |
| `apps/web-client/src/hooks/use-user.ts` | TanStack Query for GET /users/me | 🔴 Bug 5: No `enabled` guard |
| `apps/web-client/src/hooks/use-auth.ts` | Mutations: login, register, logout, restore | ✅ OK |
| `apps/web-client/src/components/route-guard.tsx` | ProtectedRoute + PublicRoute | ✅ OK (logic is correct) |
| `apps/web-client/src/router.tsx` | Route config + guards | ✅ OK (/session-expired has no guard) |
| `apps/web-client/src/services/user-service.ts` | API calls for user endpoints | ✅ OK (but used by buggy hydration) |
| `apps/web-client/src/services/auth-service.ts` | API calls for auth endpoints | ✅ OK |
| `apps/web-client/vite.config.ts` | Vite config with proxy /api → localhost:3001 | ✅ OK |

---

## 5. Exact Fix Instructions (6 Changes)

### Fix 1: Backend — `services/user-service/src/routes/user.routes.ts`

**Remove** `router.use(csrfProtection)` and apply CSRF per-route:

```typescript
const router = Router();
router.use(authenticate);  // All routes need auth

// GET — NO CSRF (safe method, used for hydration)
router.get('/me', userController.getMe.bind(userController));

// PATCH — CSRF required (state-changing)
router.patch('/me', csrfProtection, validate(updateProfileSchema, 'body'), userController.updateMe.bind(userController));

// DELETE — CSRF required (state-changing)
router.delete('/me', csrfProtection, userController.deleteMe.bind(userController));
```

---

### Fix 2: Frontend — `apps/web-client/src/lib/api-client.ts`

Add a **bare Axios instance** (no interceptors) for hydration:

```typescript
// Bare instance — NO interceptors, used ONLY for hydration
export const bareApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
});
```

In the response interceptor, **remove ALL redirect logic**:

```typescript
} catch (refreshError) {
  processQueue(refreshError);
  // ONLY clear state — NO redirect, NO window.location, NO router.navigate
  const { useAuthStore } = await import('@/store/auth-store');
  useAuthStore.getState().clearAuth();
  return Promise.reject(refreshError);
}
```

---

### Fix 3: Frontend — `apps/web-client/src/App.tsx`

Use `bareApi` for hydration:

```typescript
import { bareApi } from '@/lib/api-client';

function AuthHydration({ children }) {
  const setUser = useAuthStore((s) => s.setUser);
  const setHydrated = useAuthStore((s) => s.setHydrated);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const hydrationStarted = useRef(false);

  useEffect(() => {
    if (isHydrated || hydrationStarted.current) return;
    hydrationStarted.current = true;

    async function hydrate() {
      try {
        const { data } = await bareApi.get('/users/me'); // ← bareApi, NO interceptors
        setUser(data);
      } catch {
        // Do NOTHING. No clearAuth, no redirect. State is already clean.
      } finally {
        setHydrated();
      }
    }
    hydrate();
  }, []);

  return <>{children}</>;
}
```

---

### Fix 4: Frontend — `apps/web-client/src/store/auth-store.ts`

Make `setUser` atomic:

```typescript
setUser: (user) => set({ user, isAuthenticated: true, isHydrated: true }),
```

---

### Fix 5: Frontend — `apps/web-client/src/hooks/use-user.ts`

Add `enabled` guard:

```typescript
export function useUser() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: async () => { ... },
    enabled: isAuthenticated,  // ← ONLY run when authenticated
    retry: false,
    staleTime: 2 * 60 * 1000,
  });
}
```

---

### Fix 6: Verify router.tsx

`/auth/session-expired` must have **NO auth guard**. It should look like:

```typescript
// Session expired — NO PublicRoute, NO ProtectedRoute wrapper
{
  element: <AuthLayout />,
  children: [
    { path: 'auth/session-expired', element: <SessionExpiredPage /> },
  ],
},
```

This is already correct in the current code, but the new agent should verify it.

---

## 6. The Correct Flow After Fix

```
App mounts
  ↓
AuthHydration: bareApi.get('/users/me') — NO interceptors
  ↓
┌─ Success (200) ──→ setUser(data) → { isAuthenticated: true, isHydrated: true }
└─ Failure (401/network) ──→ setHydrated() → { isAuthenticated: false, isHydrated: true }
  ↓
Router renders:
  ├─ ProtectedRoute: isHydrated? → isAuthenticated? → render or redirect to /login
  ├─ PublicRoute: isHydrated? → !isAuthenticated? → render or redirect to /dashboard
  └─ /session-expired: NO guard → always renders

User makes API call from dashboard:
  ↓
api.get('/some-endpoint') → 401
  ↓
Interceptor: try refresh → success? → retry original request
                         → failure? → clearAuth() (NO redirect)
  ↓
ProtectedRoute detects isAuthenticated=false → Navigate to /login
```

### Golden Rules:
1. **Hydration** uses `bareApi` (no interceptors)
2. **Interceptor** NEVER redirects — only clears auth state
3. **ProtectedRoute** is the ONLY thing that redirects
4. **GET endpoints** never require CSRF

---

## 7. How to Run the Project

```bash
# Terminal 1: Start Redis
docker run -d -p 6379:6379 redis

# Terminal 2: Start Backend
cd services/user-service
cp .env.example .env  # Configure DATABASE_URL, REDIS_URL, JWT secrets
npx prisma migrate dev
pnpm dev  # Runs on port 3001

# Terminal 3: Start Frontend
cd apps/web-client
pnpm dev  # Runs on port 5173, proxies /api → localhost:3001
```

---

## 8. Tech Stack Summary

### Backend
- Express.js, TypeScript, Prisma ORM, PostgreSQL
- Redis (ioredis) for tokenVersion caching
- JWT (access 15min + refresh 7d), bcryptjs (12 rounds)
- Zod validation, express-rate-limit
- Cookie-based auth (HttpOnly, Secure, SameSite=strict)
- CSRF: Double Submit Cookie pattern
- Audit trail (fire-and-forget logging)
- Token rotation with family tracking + reuse detection

### Frontend
- React 19, TypeScript, Vite
- Tailwind CSS v4, Framer Motion
- Zustand (auth + theme stores)
- TanStack Query (server state)
- React Router 7 (route guards)
- Axios (interceptors for CSRF injection + token refresh)
- i18n (English + Arabic with RTL support)
- Dark/Light mode with animated toggle
