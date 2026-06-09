<div align="center">

# 🖥️ Remote Compute Platform

**A production-grade backend platform for discovering, booking, and remotely accessing compute machines.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-ESM-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-Cache--Aside-DC382D?style=flat-square&logo=redis&logoColor=white)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.x-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

**Status: 🚧 Active Development — User Service Complete**

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Current Progress](#current-progress)
- [Features](#features)
- [Architecture](#architecture)
- [Security](#security)
- [Tech Stack](#tech-stack)
- [API Overview](#api-overview)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Roadmap](#roadmap)
- [Development Notes](#development-notes)
- [License](#license)

---

## Overview

**Remote Compute Platform** is a cloud-style marketplace backend that enables users to discover, book, and remotely access GPU servers and compute machines — similar to platforms like Vast.ai or Lambda Labs.

The platform solves the problem of democratizing access to expensive compute resources. Machine owners register their hardware, users browse and book available machines by the hour, and the platform handles authentication, billing, session management, and remote access orchestration.

The project is built with a **microservices architecture**, where each domain (users, machines, bookings, payments) is an independently deployable service with its own database. This document reflects the **current state of the codebase** — only what has been implemented is documented here.

> ⚠️ This is a production-oriented project under active development. The **User Service** is fully implemented. All other services are in various stages of design and scaffolding.

---

## Current Progress

| Service | Status | Description |
|---|---|---|
| **User Service** | ✅ Complete | Authentication, session management, profile, account lifecycle |
| **API Gateway** | ✅ Complete | Nginx routing + centralized auth enforcement |
| **Machine Service** | 🚧 Schema designed, no application code yet | Machine registry, health monitoring, snapshots |
| **Booking Service** | 📋 API documented, not implemented | Reservations, availability checking |
| **Payment Service** | 📋 Planned | Stripe integration, billing |
| **Notification Service** | 📋 Planned | Email, in-app alerts |
| **Admin Service** | 📋 Planned | Admin dashboard backend |
| **Session Service** | 📋 Planned | VNC/remote access session management |

---

## Features

The following features are **implemented and working** in the current codebase:

### Authentication & Identity
- ✅ User registration with Zod-validated input
- ✅ User login with identical error messages for both invalid email and password (prevents user enumeration)
- ✅ JWT access tokens (15-minute expiry) and refresh tokens (7-day expiry)
- ✅ Dual JWT secrets — separate secrets for access vs. refresh tokens
- ✅ Stateless JWT authentication via HttpOnly cookies
- ✅ Token rotation on every refresh — old session revoked, new session issued
- ✅ **Refresh token reuse/theft detection** using token family tracking (`familyId`)
- ✅ **Instant JWT revocation** via `tokenVersion` — works even before token expiry

### Session Management
- ✅ Per-session refresh token storage as SHA-256 hashes (never plaintext)
- ✅ Token family tracking across rotation chains
- ✅ Logout (revoke a single session or all sessions simultaneously)
- ✅ Login history tracking per user (IP, user-agent, device type, failure reason)

### Account Lifecycle
- ✅ Soft-delete with 30-day grace period (account data preserved)
- ✅ Account restore request — generates a cryptographically secure, 10-minute, single-use 6-character code
- ✅ Account restore confirm — verifies code hash, resets password, issues new tokens, revokes all old sessions
- ✅ Password reset via the restore confirm flow (works on active accounts too)
- ✅ `tokenVersion` bump on all security-critical events (delete, restore, password change)

### Security Infrastructure
- ✅ CSRF protection via the Double Submit Cookie pattern
- ✅ Tiered rate limiting (global, auth, sensitive, standard)
- ✅ bcrypt password hashing with 12 salt rounds
- ✅ Helmet HTTP security headers
- ✅ CORS with `credentials: true` and production domain locking
- ✅ 10KB request body size limit
- ✅ Role-Based Access Control (RBAC) middleware — `USER`, `ADMIN`, `OWNER`, `SUPPORT`
- ✅ Full security audit trail (fire-and-forget, never blocks requests)

### Performance
- ✅ Redis Cache-Aside for token version lookups (~1ms vs ~15ms DB fallback)
- ✅ Automatic Redis fallback to PostgreSQL if Redis is unavailable
- ✅ Graceful shutdown with clean connection teardown (Redis + Prisma)
- ✅ Database connection pooling via `@prisma/adapter-pg`

### Infrastructure
- ✅ Docker Compose multi-container environment (PostgreSQL × 2, Redis, Nginx, Adminer)
- ✅ Nginx API Gateway with `auth_request` centralized authentication
- ✅ Database-per-service isolation
- ✅ pnpm workspaces + Turborepo monorepo
- ✅ OpenAPI 3.0.3 specification
- ✅ Structured logging (Winston) — colorized in dev, JSON in production

---

## Architecture

### High-Level Overview

```
                          ┌─────────────────────────────────┐
                          │         Client (Browser)        │
                          └──────────────┬──────────────────┘
                                         │ HTTP (port 80)
                          ┌──────────────▼──────────────────┐
                          │      API Gateway (Nginx)         │
                          │  - Routes requests               │
                          │  - Enforces auth via             │
                          │    auth_request sub-requests     │
                          └──┬──────────────────────┬────────┘
                             │                      │
              ┌──────────────▼──────┐  ┌────────────▼──────────┐
              │    User Service      │  │   Machine Service      │
              │    (port 3001)       │  │   (port 3002)          │
              │  - Auth endpoints    │  │  - Machine registry     │
              │  - Profile mgmt      │  │  - Health monitoring    │
              │  - Token verify      │  │  - Snapshots           │
              └──────┬──────┬───────┘  └────────────┬──────────┘
                     │      │                        │
           ┌─────────▼─┐  ┌─▼──────────┐  ┌─────────▼─────────┐
           │ PostgreSQL │  │   Redis     │  │    PostgreSQL      │
           │ (user DB)  │  │  (cache)    │  │   (machine DB)    │
           └────────────┘  └────────────┘  └───────────────────┘
```

### Authentication Flow

```
Login Request
     │
     ▼
Zod Validation ──── fail ──► 400 Bad Request
     │
     ▼
Find Active User by Email
     │
     ▼
bcrypt.compare(password, hash) ──── fail ──► 401 (same message as wrong email)
     │
     ▼
Check Account Status (ACTIVE?) ──── fail ──► 403
     │
     ▼
Generate Access Token (JWT, 15min, includes tokenVersion)
Generate Refresh Token (JWT, 7 days, separate secret)
     │
     ▼
Hash Refresh Token (SHA-256) → Store in UserSession
Assign familyId (crypto.randomUUID) to session
     │
     ▼
Set HttpOnly cookies: accessToken, refreshToken
Set non-HttpOnly cookie: csrfToken
     │
     ▼
200 OK + User JSON body
```

### Token Refresh & Rotation Flow

```
POST /auth/refresh (with refreshToken cookie + X-CSRF-Token header)
     │
     ▼
CSRF middleware validates header == cookie
     │
     ▼
Verify JWT signature (refresh secret)
Hash incoming refresh token (SHA-256)
     │
     ├─── findValidByRefreshTokenHash() ──── found ──►  Revoke old session
     │                                                  Generate new token pair
     │                                                  Create new session (same familyId)
     │                                                  Set new cookies
     │                                                  ✅ 200 OK
     │
     └─── Not found → findAnyByRefreshTokenHash()
               │
               ├── Not found at all ──► 401 Invalid token
               │
               └── Found (but revoked!) ──► 🚨 THEFT DETECTED
                        Revoke entire token family
                        Revoke ALL user sessions
                        Bump tokenVersion (invalidate all access tokens)
                        Invalidate Redis cache
                        Log REFRESH_TOKEN_REUSE audit event
                        ► 401 Security breach
```

### Redis Cache-Aside (Token Version)

Every authenticated request triggers this flow:

```
Authenticated Request
        │
        ▼
Verify JWT signature ─── invalid ──► 401
        │
        ▼
Redis GET user-service:token-version:{userId}
        │
        ├── HIT ─────────────────────────────► Compare versions
        │                                       ├── match ──► ✅ next()
        │                                       └── mismatch ──► 401 revoked
        │
        └── MISS / Redis down
                │
                ▼
           PostgreSQL: SELECT tokenVersion WHERE id = ?
                │
                ▼
           Redis SET (TTL: 5 minutes)
                │
                ▼
           Compare versions
```

### Nginx `auth_request` Pattern

```nginx
# Protected route — fires sub-request before proxying
location /api/v1/users/ {
    auth_request /auth-verify;          # ← triggers sub-request
    proxy_pass http://user_service:3001/api/v1/users/;
}

# Internal auth verification endpoint
location = /auth-verify {
    internal;                           # ← not accessible from outside
    proxy_pass http://user_service:3001/api/v1/auth/verify;
    proxy_pass_request_body off;        # ← only cookies/headers needed
}
```

Result: downstream services never handle token validation. Authentication is enforced at the gateway for all protected routes.

---

## Security

### Security Controls Matrix

| Control | Implementation | File |
|---|---|---|
| JWT Authentication | Dual secrets, stateless, HttpOnly cookies | `jwt.util.ts`, `cookie.util.ts` |
| Instant JWT Revocation | `tokenVersion` in every JWT, checked per-request | `authenticate.ts`, `user.repository.ts` |
| Refresh Token Rotation | Old session revoked → new session issued every refresh | `auth.service.ts` |
| Token Theft Detection | Token family tracking, reuse triggers full revocation | `auth.service.ts`, `session.repository.ts` |
| Hashed Token Storage | Refresh tokens stored as SHA-256 hashes, never plaintext | `token.util.ts` |
| Password Hashing | bcryptjs, 12 salt rounds | `password.util.ts` |
| CSRF Protection | Double Submit Cookie pattern (`X-CSRF-Token` header) | `csrf.ts` |
| Cookie Security | HttpOnly, SameSite=strict, Secure (production) | `cookie.util.ts` |
| Rate Limiting | 4 tiers by sensitivity (5 to 100 req/15min) | `rate-limit.ts` |
| Security Headers | Helmet (CSP, HSTS, X-Frame-Options, MIME-sniff) | `app.ts` |
| Input Validation | Zod schemas on all endpoints, parse before processing | `validate.ts`, `auth.dto.ts` |
| CORS | Locked to production domain, credentials allowed | `app.ts` |
| Body Size Limit | 10KB max request body | `app.ts` |
| RBAC | Role guard middleware (USER/ADMIN/OWNER/SUPPORT) | `authorize.ts` |
| User Enumeration Prevention | Identical error for wrong email or password | `auth.service.ts` |
| Security Audit Trail | Fire-and-forget, 17 tracked event types | `audit.service.ts` |

### Rate Limiting Tiers

| Limiter | Limit | Window | Applied To |
|---|---|---|---|
| `globalLimiter` | 100 req | 15 min | All routes (fallback) |
| `authLimiter` | 20 req | 15 min | `/auth/login`, `/auth/register` |
| `sensitiveLimiter` | 5 req | 15 min | `/auth/restore/request`, `/auth/restore/confirm` |
| `standardLimiter` | 30 req | 15 min | `/auth/refresh`, `/auth/logout` |

---

## Tech Stack

### Core

| Technology | Version | Purpose |
|---|---|---|
| TypeScript | 5.7.3 | Primary language |
| Node.js (ESM) | Current LTS | Runtime |
| Express.js | 5.2.1 | HTTP framework |
| Prisma | 7.5.0 | ORM + schema migrations |
| PostgreSQL | 16-alpine | Primary database |
| Redis | latest | Token version cache (Cache-Aside) |
| Nginx | alpine | API Gateway, reverse proxy |

### Security Libraries

| Library | Version | Purpose |
|---|---|---|
| `jsonwebtoken` | 9.0.3 | JWT signing and verification |
| `bcryptjs` | 3.0.3 | Password hashing (12 rounds) |
| `helmet` | 8.1.0 | HTTP security headers |
| `cors` | 2.8.6 | Cross-origin resource sharing |
| `express-rate-limit` | 8.3.1 | Request rate limiting |
| `cookie-parser` | 1.4.7 | Cookie parsing (for HttpOnly auth) |

### Validation & Types

| Library | Version | Purpose |
|---|---|---|
| `zod` | 3.25.76 | Runtime input validation |
| `prisma-zod-generator` | 2.1.4 | Auto-generates Zod schemas from Prisma models |
| `openapi-typescript` | — | Generates TypeScript types from OpenAPI spec |

### Infrastructure & Tooling

| Tool | Purpose |
|---|---|
| Docker + Docker Compose | Container orchestration |
| pnpm workspaces | Monorepo package management |
| Turborepo | Monorepo build system |
| `ioredis` 5.10.1 | Redis client with pooling and retry |
| `@prisma/adapter-pg` | PostgreSQL connection pooling for Prisma |
| Winston 3.17.0 | Structured logging |
| `tsx` 4.21.0 | TypeScript execution for development |
| Adminer | Web-based database admin UI (dev) |

### Shared Internal Packages

| Package | Purpose |
|---|---|
| `@repo/shared-utils` | `AppError` class, shared error types |
| `@repo/shared-types` | OpenAPI-generated TypeScript API types |
| `@repo/shared-config` | Shared configuration across services |

---

## API Overview

> Base URL: `http://localhost/api/v1`

### Authentication Endpoints

| Method | Endpoint | Auth | CSRF | Rate Limit | Description |
|---|---|---|---|---|---|
| `POST` | `/auth/register` | ❌ | ❌ | Auth (20/15m) | Register new account |
| `POST` | `/auth/login` | ❌ | ❌ | Auth (20/15m) | Login, receive tokens in cookies |
| `POST` | `/auth/refresh` | ❌ | ✅ | Standard (30/15m) | Rotate access + refresh tokens |
| `POST` | `/auth/logout` | ✅ JWT | ✅ | Standard (30/15m) | Revoke session(s), clear cookies |
| `POST` | `/auth/restore/request` | ❌ | ❌ | Sensitive (5/15m) | Request account restore code |
| `POST` | `/auth/restore/confirm` | ❌ | ❌ | Sensitive (5/15m) | Confirm restore, set new password |
| `GET` | `/auth/verify` | ✅ JWT | ❌ | Global | Internal token verification (used by Nginx) |

### User Endpoints

| Method | Endpoint | Auth | CSRF | Description |
|---|---|---|---|---|
| `GET` | `/users/me` | ✅ JWT | ❌ | Get own profile |
| `PATCH` | `/users/me` | ✅ JWT | ✅ | Update own profile |
| `DELETE` | `/users/me` | ✅ JWT | ✅ | Soft-delete own account (30-day grace period) |

### System Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | ❌ | Health check probe for load balancers |

---

## Project Structure

```
remote-compute-platform/
│
├── services/                        # Independent microservices
│   │
│   ├── user-service/                # ✅ Fully implemented
│   │   ├── prisma/
│   │   │   ├── schema.prisma        # User, UserSession, LoginHistory, UserAuditLog
│   │   │   └── migrations/
│   │   ├── schemas/                 # Auto-generated Zod schemas (prisma-zod-generator)
│   │   └── src/
│   │       ├── app.ts               # Express app bootstrap, middleware pipeline
│   │       ├── config/
│   │       │   ├── env.ts           # Environment variable validation
│   │       │   ├── logger.ts        # Winston logger (dev: colorized, prod: JSON)
│   │       │   ├── prisma.ts        # Prisma client singleton + connection pool
│   │       │   └── redis.ts         # ioredis client, Cache-Aside helpers
│   │       ├── controllers/
│   │       │   ├── auth.controller.ts    # HTTP layer: extract req → call service → set cookies
│   │       │   └── user.controller.ts
│   │       ├── dto/
│   │       │   ├── auth.dto.ts      # Zod schemas + types derived from OpenAPI spec
│   │       │   └── user.dto.ts
│   │       ├── mappers/
│   │       │   ├── auth.mapper.ts   # DB entity → response DTO transformation
│   │       │   └── user.mapper.ts
│   │       ├── middlewares/
│   │       │   ├── authenticate.ts  # JWT verification + tokenVersion check (Redis-cached)
│   │       │   ├── authorize.ts     # RBAC role guard factory
│   │       │   ├── csrf.ts          # Double Submit Cookie CSRF validation
│   │       │   ├── error-handler.ts # Centralized error handler (last middleware)
│   │       │   ├── rate-limit.ts    # Tiered rate limiters
│   │       │   └── validate.ts      # Zod validation middleware factory
│   │       ├── repositories/
│   │       │   ├── user.repository.ts     # All User model DB operations
│   │       │   ├── session.repository.ts  # Session CRUD, revocation, reuse detection
│   │       │   └── audit.repository.ts    # Audit log writes
│   │       ├── routes/
│   │       │   ├── index.ts         # Route aggregator
│   │       │   ├── auth.routes.ts   # /auth/* with per-route middleware stacks
│   │       │   └── user.routes.ts   # /users/* — all require authenticate
│   │       ├── services/
│   │       │   ├── auth.service.ts  # Core auth business logic (716 lines)
│   │       │   ├── user.service.ts  # Profile + lifecycle business logic
│   │       │   └── audit.service.ts # Fire-and-forget security event logger
│   │       ├── types/               # Express type augmentations (req.user)
│   │       └── utils/
│   │           ├── cookie.util.ts   # setAuthCookies / clearAuthCookies
│   │           ├── jwt.util.ts      # generateAccessToken / generateRefreshToken / verify
│   │           ├── password.util.ts # hashPassword / comparePassword (bcrypt)
│   │           └── token.util.ts    # hashToken (SHA-256) / generateRestoreCode / generateCsrfToken
│   │
│   ├── machine-service/             # 🚧 Schema designed, app code pending
│   │   ├── prisma/
│   │   │   └── schema.prisma        # Machine, MachineSpecs, Tag, HealthLog, Snapshot, MaintenanceWindow
│   │   └── src/
│   │       └── app.ts               # (empty)
│   │
│   ├── api-gateway/
│   │   └── nginx.conf               # Routing + auth_request enforcement
│   │
│   ├── booking-service/             # 📋 Planned
│   ├── payment-service/             # 📋 Planned
│   ├── notification-service/        # 📋 Planned
│   ├── admin-service/               # 📋 Planned
│   └── session-service/             # 📋 Planned
│
├── packages/                        # Shared internal packages
│   ├── shared-utils/                # AppError, shared helpers
│   ├── shared-types/                # OpenAPI-generated TypeScript types
│   └── shared-config/               # Shared ESLint, TypeScript config
│
├── apps/                            # Frontend applications (separate)
│   ├── web-client/
│   └── admin-dashboard/
│
├── docs/                            # Documentation
│   ├── README.md                    # This file
│   └── user-service-audit.md        # Detailed technical audit report
│
├── openapi.yaml                     # OpenAPI 3.0.3 specification
├── docker-compose.yml               # Multi-container development environment
├── pnpm-workspace.yaml              # pnpm monorepo workspace config
├── turbo.json                       # Turborepo pipeline configuration
└── tsconfig.json                    # Root TypeScript configuration
```

---

## Getting Started

### Prerequisites

| Requirement | Version |
|---|---|
| Node.js | >= 20.x |
| pnpm | >= 9.x |
| Docker | >= 24.x |
| Docker Compose | >= 2.x |

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/remote-compute-platform.git
cd remote-compute-platform
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

```bash
# Copy the example environment file
cp services/user-service/.env.example services/user-service/.env
```

Edit `services/user-service/.env` with your values. See the [Environment Variables](#environment-variables) section below.

### 4. Start the Infrastructure (Docker)

```bash
# Start PostgreSQL, Redis, Nginx, and Adminer
docker compose up -d
```

This starts:
- PostgreSQL (user DB) on port `5432`
- PostgreSQL (machine DB) on port `5433`
- Redis on port `6379`
- Nginx API Gateway on port `80`
- Adminer on port `8080`

### 5. Run Database Migrations

```bash
cd services/user-service
pnpm db  # runs: prisma migrate dev
pnpm generate  # runs: prisma generate
```

### 6. Start the Development Server

```bash
# From the project root (Turborepo)
pnpm dev

# Or directly in the user-service
cd services/user-service
pnpm dev  # tsx watch src/app.ts
```

The user-service starts on port `3001`.

### 7. Verify It's Running

```bash
curl http://localhost:3001/health
# → {"status":"ok","service":"user-service"}
```

> Access the database admin UI at [http://localhost:8080](http://localhost:8080) (Adminer).

---

## Environment Variables

### User Service (`services/user-service/.env`)

| Variable | Example | Required | Description |
|---|---|---|---|
| `NODE_ENV` | `development` | ✅ | `development` or `production` |
| `PORT` | `3001` | ✅ | HTTP port the service listens on |
| `DATABASE_URL` | `postgresql://postgres:password@localhost:5432/user_service_db` | ✅ | PostgreSQL connection string |
| `REDIS_URL` | `redis://localhost:6379` | ✅ | Redis connection string |
| `JWT_SECRET` | `your-access-token-secret-min-32-chars` | ✅ | Secret for signing access tokens |
| `JWT_REFRESH_SECRET` | `your-refresh-token-secret-min-32-chars` | ✅ | Secret for signing refresh tokens (must differ) |
| `JWT_EXPIRES_IN` | `15m` | ✅ | Access token lifetime (e.g., `15m`, `1h`) |
| `JWT_REFRESH_EXPIRES_IN` | `7d` | ✅ | Refresh token lifetime (e.g., `7d`, `30d`) |

> ⚠️ Never commit `.env` files to version control. Use `.env.example` as a template.

> ⚠️ `JWT_SECRET` and `JWT_REFRESH_SECRET` **must** be different strings. Using the same secret removes the protection that dual secrets provide.

---

## Roadmap

### Services

- [x] **User Service** — Authentication, sessions, account lifecycle, RBAC
- [x] **API Gateway** — Nginx routing, centralized auth enforcement
- [ ] **Machine Service** — Machine registry, hardware specs, health monitoring, snapshots, maintenance windows *(schema complete, application code pending)*
- [ ] **Booking Service** — Reservations, availability checking, conflict detection *(API documented in OpenAPI spec)*
- [ ] **Payment Service** — Stripe integration, hourly billing, invoices
- [ ] **Notification Service** — Email delivery for restore codes, booking confirmations
- [ ] **Admin Service** — Admin dashboard backend, user management, platform controls
- [ ] **Session Service** — VNC / remote access session orchestration

### Platform Features

- [x] JWT authentication with dual secrets
- [x] Refresh token rotation with theft detection
- [x] Instant token revocation via `tokenVersion`
- [x] Redis caching layer
- [x] CSRF protection (Double Submit Cookie)
- [x] Tiered rate limiting
- [x] Security audit trail
- [x] Soft-delete with grace period + restore flow
- [x] OpenAPI 3.0.3 specification
- [x] Multi-container Docker Compose setup
- [ ] Email sending (currently restore codes are returned in API response in dev mode)
- [ ] Machine listing with search, sort, and tag-based filtering
- [ ] Availability checking for machine time slots
- [ ] Booking creation, management, and cancellation
- [ ] Stripe payment integration
- [ ] Two-factor authentication (TOTP — schema fields exist, flow not yet implemented)
- [ ] Email verification flow (schema field exists, endpoint not yet implemented)
- [ ] Kubernetes deployment manifests
- [ ] CI/CD pipeline
- [ ] Monitoring and observability (Prometheus / Grafana)

---

## Development Notes

This project is under **active development** and evolving incrementally by service domain.

### Engineering Principles

- **Database-per-Service** — Each microservice owns its database. No cross-service joins.
- **Controller–Service–Repository** — Strict layer separation. Controllers handle HTTP only; services contain business logic; repositories contain all DB access.
- **Constructor injection** — Dependencies are injected via constructors, enabling unit testing by passing mock databases.
- **OpenAPI-first** — The API spec drives TypeScript type generation (`openapi-typescript`). Types are shared via `@repo/shared-types`.
- **Schema-first validation** — Prisma schema drives Zod schema generation (`prisma-zod-generator`). Validation and DB schema cannot drift.
- **Security by default** — Every new endpoint gets: rate limiting, Zod validation, CSRF (if state-mutating), and authentication (if protected).
- **Fail-safe dependencies** — Redis is a performance layer, not a critical path. If Redis is down, the system falls back to PostgreSQL. Service uptime is never dependent on cache availability.

### Adding a New Service

1. Create a directory under `services/`
2. Add a `prisma/schema.prisma` with its own `datasource` block
3. Add a new PostgreSQL service in `docker-compose.yml` (new port)
4. Add a `location` block to `nginx.conf` with `auth_request /auth-verify`
5. Add the service to `pnpm-workspace.yaml` and `turbo.json`

### Code Quality

```bash
# Lint
pnpm lint

# Type check
pnpm build

# Format
pnpm format
```

---

## License

```
MIT License

Copyright (c) 2026 Remote Compute Platform

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">

**Built with production security practices from day one.**

*User Service Complete · Machine Service In Progress · More Coming*

</div>
