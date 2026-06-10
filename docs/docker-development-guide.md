# Docker Development Setup — Complete Explanation

> This document explains **everything** about Docker in the context of your project. It's written so you can walk into a job interview and confidently explain every line.

---

## Table of Contents

1. [What is Docker and Why Do We Use It?](#1-what-is-docker-and-why-do-we-use-it)
2. [The 3 Files and What Each One Does](#2-the-3-files-and-what-each-one-does)
3. [Dockerfile.dev — Line by Line](#3-dockerfiledev--line-by-line)
4. [docker-compose.dev.yml — Line by Line](#4-docker-composedevyml--line-by-line)
5. [.dockerignore — Why It Matters](#5-dockerignore--why-it-matters)
6. [How Hot Reload Works (The Full Flow)](#6-how-hot-reload-works-the-full-flow)
7. [Networking: How Containers Talk to Each Other](#7-networking-how-containers-talk-to-each-other)
8. [Dev vs Production — The Key Differences](#8-dev-vs-production--the-key-differences)
9. [Common Interview Questions](#9-common-interview-questions)
10. [Commands Cheat Sheet](#10-commands-cheat-sheet)
11. [How to Run the Project](#11-how-to-run-the-project)
12. [Advice, Best Practices & Job Interview Tips](#12-advice-best-practices--job-interview-tips)

---

## 1. What is Docker and Why Do We Use It?

### The Problem Docker Solves

Imagine you join a new company. The project needs:

- Node.js 20 (not 18, not 22)
- PostgreSQL 16
- Redis
- Specific environment variables
- pnpm (not npm, not yarn)

Without Docker, you'd spend **hours** installing and configuring all of this. And if your teammate uses macOS while you use Windows, things might break differently on each machine. This is the classic **"it works on my machine"** problem.

### The Solution

Docker packages your application + ALL its dependencies into a **container** — a lightweight, isolated environment that runs **identically everywhere**.

```
┌─────────────────────────────────────────────────┐
│               Your Laptop (Host)                 │
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ user-    │  │ postgres │  │  redis   │      │
│  │ service  │  │    DB    │  │          │      │
│  │ (Node20) │  │  (v16)   │  │ (latest) │      │
│  └──────────┘  └──────────┘  └──────────┘      │
│       ↑              ↑             ↑            │
│       └────── Docker Network ──────┘            │
└─────────────────────────────────────────────────┘
```

### Docker vs Virtual Machines

A common question: "Why not just use a Virtual Machine (VM)?"

```
Virtual Machine:                        Docker Container:
┌───────────────────┐                   ┌───────────────────┐
│   Your App        │                   │   Your App        │
│   Libraries       │                   │   Libraries       │
│   Guest OS (2GB!) │  ← Entire OS!     │   (No Guest OS!)  │ ← Shares host kernel
│   Hypervisor      │                   │   Docker Engine   │
│   Host OS         │                   │   Host OS         │
│   Hardware        │                   │   Hardware        │
└───────────────────┘                   └───────────────────┘
Boot time: 30-60 seconds               Boot time: 1-2 seconds
Size: 2-10 GB                          Size: 50-400 MB
```

Docker containers share the host's Linux kernel, making them **10-100x lighter** than VMs.

### Key Terminology

| Term               | What It Means                                                               | Real-World Analogy                                         |
| ------------------ | --------------------------------------------------------------------------- | ---------------------------------------------------------- |
| **Image**          | A blueprint/recipe for creating a container                                 | A class in OOP                                             |
| **Container**      | A running instance of an image                                              | An object (instance of a class)                            |
| **Dockerfile**     | Instructions to BUILD an image                                              | The constructor of the class                               |
| **Volume**         | A way to share/persist data between host and container                      | A shared folder                                            |
| **Bind Mount**     | A specific volume type: maps a host folder → container folder               | A symlink between your laptop and the container            |
| **Layer**          | Each instruction in a Dockerfile creates a cacheable layer                  | Like git commits — stackable and cacheable                 |
| **Registry**       | A storage service for Docker images (Docker Hub, GitHub Container Registry) | Like npm registry but for Docker images                    |
| **Docker Compose** | A tool to define and run multi-container applications from a YAML file      | An orchestra conductor — runs all your containers together |

---

## 2. The 3 Files and What Each One Does

```
remote-compute-platform/
├── .dockerignore                          ← Tells Docker which files to SKIP during build
├── docker-compose.dev.yml                 ← Orchestrates ALL containers together (dev mode)
├── docker-compose.yml                     ← Orchestrates ALL containers together (production)
└── services/
    └── user-service/
        ├── Dockerfile              ← Production build (multi-stage, compiled JS)
        └── Dockerfile.dev          ← Development build (hot-reload, raw TypeScript)
```

| File                     | Purpose                                                             | When Does It Run?                | Who Reads It?  |
| ------------------------ | ------------------------------------------------------------------- | -------------------------------- | -------------- |
| `Dockerfile.dev`         | Defines **HOW** to build the user-service development image         | Once (at `docker build` time)    | Docker Engine  |
| `docker-compose.dev.yml` | Defines **WHAT** containers to run and **HOW** they connect         | Every time you start the project | Docker Compose |
| `.dockerignore`          | Lists files Docker should **IGNORE** when sending context to daemon | During `docker build`            | Docker Engine  |

### Why Two Dockerfiles?

```
Dockerfile       → Production: Compile TypeScript → Ship only JS → Small image → No dev tools
Dockerfile.dev   → Development: Run TypeScript directly → Hot reload → Big image → All dev tools
```

The goals are completely opposite, so we use two separate files instead of adding `if/else` logic into one file (which is considered bad practice).

---

## 3. Dockerfile.dev — Line by Line

> **File location:** `services/user-service/Dockerfile.dev`

Let's go through every single line.

---

### Line 1: `FROM node:20-alpine`

```dockerfile
FROM node:20-alpine
```

**What it does:** Every Dockerfile MUST start with `FROM`. It picks a **base image** — a pre-built operating system with tools already installed.

**Breaking it down:**

- `node` = the official Node.js image from Docker Hub
- `20` = Node.js version 20 (matches your project)
- `alpine` = Alpine Linux variant (a minimal 5MB Linux distro)

**Why Alpine?**
| Variant | Size | Use Case |
|---------|------|----------|
| `node:20` | ~900MB | Full Debian Linux. Has everything. Heavy. |
| `node:20-slim` | ~200MB | Stripped Debian. Still relatively large. |
| `node:20-alpine` | ~50MB | Minimal Alpine Linux. Best for most projects. |

**Interview answer:** "We use Alpine to minimize the image size and reduce the attack surface for security. Fewer packages installed means fewer potential vulnerabilities."

---

### Line 2: `RUN npm install -g pnpm@10`

```dockerfile
RUN npm install -g pnpm@10
```

**What it does:** `RUN` executes a shell command **during the image build** (not when the container starts). Here we install pnpm globally.

**Why `@10`?** Your root `package.json` specifies `"packageManager": "pnpm@10.32.1"`. Pinning the major version ensures compatibility.

**RUN vs CMD — The Most Confused Docker Concept:**

```
RUN  → Executes during BUILD TIME (creating the image)
       Example: installing packages, creating directories

CMD  → Executes during RUN TIME (starting the container)
       Example: starting your server
```

Think of it this way:

- `RUN` = instructions for building a house (pour concrete, install pipes)
- `CMD` = what happens when someone moves in (turn on the lights)

---

### Line 3: `WORKDIR /app`

```dockerfile
WORKDIR /app
```

**What it does:** Sets the working directory for ALL subsequent instructions. It's like running `cd /app`, but it also **creates** the directory if it doesn't exist.

Every `COPY`, `RUN`, and `CMD` after this runs from `/app`.

**Without WORKDIR:**

```dockerfile
RUN cd /app && npm install    # BAD: Each RUN starts from /
RUN cd /app && npm run build  # You have to cd every time!
```

**With WORKDIR:**

```dockerfile
WORKDIR /app
RUN npm install               # Automatically runs in /app
RUN npm run build             # Also runs in /app
```

---

### Lines 4-10: The COPY Strategy (Layer Caching)

```dockerfile
# Step 1: Copy ONLY dependency-definition files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.json ./
COPY packages/shared-config/package.json ./packages/shared-config/
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/shared-utils/package.json ./packages/shared-utils/
COPY services/user-service/package.json ./services/user-service/

# Step 2: Install dependencies
RUN pnpm install --frozen-lockfile

# Step 3: Copy actual source code AFTER install
COPY packages/ ./packages/
COPY services/user-service/prisma ./services/user-service/prisma
COPY services/user-service/prisma.config.ts ./services/user-service/prisma.config.ts
```

**This is the most important optimization in the entire Dockerfile.**

#### Why this order? Docker Layer Caching.

Docker builds images in **layers**. Each instruction creates one layer. Docker **caches** each layer. If a layer hasn't changed, Docker reuses the cached version instantly.

```
Scenario: You edited src/app.ts and rebuild

❌ BAD ORDER (COPY everything first):
   Layer 1: COPY . .                    → CHANGED (app.ts changed) → REBUILD
   Layer 2: RUN pnpm install            → REBUILD (previous layer changed)
   Result: Full pnpm install every time! (~30-60 seconds)

✅ GOOD ORDER (copy package.json first):
   Layer 1: COPY package.json ...       → CACHED ✓ (package.json didn't change)
   Layer 2: RUN pnpm install            → CACHED ✓ (dependency layer unchanged)
   Layer 3: COPY packages/ ...          → may rebuild (fast, just file copy)
   Result: Skips pnpm install entirely! (~2 seconds)
```

**Visual:**

```
┌─────────────────────────────────────────────┐
│ Layer 4: CMD ["pnpm", "dev"]                │  ← Always cached
│ Layer 3: COPY source code                    │  ← Rebuilds on code change (fast)
│ Layer 2: RUN pnpm install --frozen-lockfile  │  ← CACHED unless package.json changes
│ Layer 1: COPY package.json, lockfile         │  ← CACHED unless deps change
│ Layer 0: FROM node:20-alpine                 │  ← Always cached
└─────────────────────────────────────────────┘
```

#### What is `--frozen-lockfile`?

| Flag                | Behavior                                                                             |
| ------------------- | ------------------------------------------------------------------------------------ |
| (no flag)           | If package.json and lockfile are out of sync, pnpm **updates** the lockfile silently |
| `--frozen-lockfile` | If they're out of sync, pnpm **FAILS** with an error                                 |

Why use it? In Docker, you want **reproducible builds**. If the lockfile says "express@5.2.1", you want exactly that — not a silent upgrade to 5.3.0 that might break things.

---

### Line 11: `RUN pnpm generate`

```dockerfile
WORKDIR /app/services/user-service
RUN pnpm generate
```

**What it does:** Runs `prisma generate`, which reads your `schema.prisma` and creates a type-safe database client inside `node_modules/@prisma/client`.

We do this at **build time** so the container starts instantly without needing to generate on every restart.

---

### Line 12: `EXPOSE 3001`

```dockerfile
EXPOSE 3001
```

**What it does:** **NOTHING functional.** It's pure documentation.

`EXPOSE` tells humans and tools (like Docker Desktop): "This container expects traffic on port 3001."

**The actual port opening happens in docker-compose:**

```yaml
ports:
  - '3001:3001' # THIS is what actually opens the port
```

**Interview tip:** Many developers think `EXPOSE` opens ports. It doesn't. Always clarify this distinction.

---

### Line 13: `CMD ["pnpm", "dev"]`

```dockerfile
CMD ["pnpm", "dev"]
```

**What it does:** The command that runs when the container **starts**. `pnpm dev` executes `tsx watch src/app.ts` (from your package.json scripts).

**Exec form vs Shell form:**

```dockerfile
CMD ["pnpm", "dev"]        # Exec form (RECOMMENDED) — runs pnpm directly as PID 1
CMD pnpm dev               # Shell form — runs /bin/sh -c "pnpm dev" (extra shell process)
```

Always use the **exec form** (with brackets). It lets Node.js receive OS signals (SIGTERM, SIGINT) directly for graceful shutdown. With shell form, signals go to `/bin/sh` and may never reach your app.

---

## 4. docker-compose.dev.yml — Line by Line

> **File location:** `docker-compose.dev.yml` (project root)

Docker Compose lets you define and run **multiple containers** with a single command. Without it, you'd need to run 5+ separate `docker run` commands with dozens of flags.

---

### The `user-service` Service (Most Important)

#### `build:`

```yaml
build:
  context: .
  dockerfile: services/user-service/Dockerfile.dev
```

**`context: .`** — The build context is the **monorepo root**. When you run `docker build`, Docker takes this entire directory and sends it to the Docker daemon.

Why the root and not `./services/user-service`? Because our Dockerfile needs to `COPY` files from `packages/` which lives at the monorepo root. Docker cannot access files **outside** the build context.

```
If context = ./services/user-service:
  COPY packages/shared-utils → ❌ ERROR: forbidden path outside context

If context = . (root):
  COPY packages/shared-utils → ✅ Works
```

**`dockerfile:`** — Path to the Dockerfile, **relative to the context**.

---

#### `env_file:` vs `environment:`

```yaml
env_file:
  - ./services/user-service/.env
environment:
  DATABASE_URL: postgresql://postgres:walid-999@user_service_db:5432/user_service_db?schema=public
  REDIS_URL: redis://my_redis_cache:6379
```

**Why do we have BOTH?**

`env_file` loads **ALL** variables from your `.env` file:

```
JWT_SECRET="asle87ds87d5s76weffker64s87srfia"
JWT_REFRESH_SECRET="ds854sd8f4rf84se56f4wr89489esiw58wq9da5r"
PORT='3001'
NODE_ENV='development'
DATABASE_URL="postgresql://...@localhost:5432/..."    ← ⚠️ PROBLEM
REDIS_URL="redis://localhost:6379"                    ← ⚠️ PROBLEM
```

`environment` **overrides** specific variables. Your `.env` points to `localhost`, but inside Docker each container has its **own** localhost. We override with the container names:

```
.env file:         localhost:5432        → Talks to YOUR laptop's Postgres
docker-compose:    user_service_db:5432  → Talks to the Postgres CONTAINER
```

**Priority:** `environment` > `env_file` > Dockerfile `ENV`

---

#### `volumes:` — The Heart of Hot Reload

```yaml
volumes:
  # Volume 1: Bind mount — YOUR source code → inside the container
  - ./services/user-service/src:/app/services/user-service/src

  # Volume 2: Bind mount — YOUR prisma schema → inside the container
  - ./services/user-service/prisma:/app/services/user-service/prisma

  # Volume 3: Anonymous volume — PROTECT container's service node_modules
  - /app/services/user-service/node_modules

  # Volume 4: Anonymous volume — PROTECT container's root node_modules
  - /app/node_modules
```

##### Volumes 1 & 2: Bind Mounts

These create a **live, two-way link** between your laptop and the container:

```
Your Laptop (Host)                    Docker Container
─────────────────                    ─────────────────
services/user-service/src/app.ts  ←→  /app/services/user-service/src/app.ts
                                      (Same file! Not a copy!)
```

When you edit and save `app.ts` on your laptop, the container sees the change **instantly**. `tsx watch` detects it and restarts your server.

##### Volumes 3 & 4: Anonymous Volumes (node_modules Protection)

**This is the trickiest concept.** Without these, your app would crash.

Here's why: if we bind-mounted the entire `services/user-service/` folder, it would also overwrite the container's `node_modules/` with YOUR local `node_modules/`. Problem is:

```
Your laptop:     node_modules compiled for macOS / Windows / Ubuntu
Container:       node_modules compiled for Alpine Linux

Native modules like bcrypt, prisma, esbuild have BINARY files
that are OS-specific. Wrong OS = 💥 CRASH
```

The anonymous volume tells Docker: **"Keep the node_modules that were installed INSIDE the container during the build. Don't let the bind mount touch them."**

```
┌──────────────────────────────────────────────────────────────┐
│ Visual: How Volumes Work Together                             │
│                                                              │
│   Your Laptop                Docker Container (/app)          │
│   ──────────────            ──────────────────────           │
│   src/app.ts      ═══════►  src/app.ts         (LIVE LINK)   │
│   src/routes/     ═══════►  src/routes/        (LIVE LINK)   │
│   prisma/schema   ═══════►  prisma/schema      (LIVE LINK)   │
│                                                              │
│   node_modules    ───✕───►  node_modules   (BLOCKED/SAFE)    │
│   (your OS)       blocked   (Alpine Linux, kept intact)      │
└──────────────────────────────────────────────────────────────┘
```

---

#### `depends_on:`

```yaml
depends_on:
  - user_service_db
  - redis
```

Tells Docker Compose: "Start PostgreSQL and Redis **before** user-service."

**Important caveat:** `depends_on` only waits for the container to **start**, NOT for the database to be **ready** to accept connections. PostgreSQL might take 2-3 seconds to initialize after the container starts. That's why your app has retry logic in `connectRedis()` and Prisma handles connection retries automatically.

For stricter ordering, you can use health checks:

```yaml
depends_on:
  user_service_db:
    condition: service_healthy
```

(This requires a `healthcheck:` block on the database service.)

---

#### `restart: unless-stopped`

```yaml
restart: unless-stopped
```

| Policy           | Behavior                                                 |
| ---------------- | -------------------------------------------------------- |
| `no`             | Never restart (default)                                  |
| `always`         | Always restart, even after `docker stop` + system reboot |
| `unless-stopped` | Restart on crash, but NOT if you manually stopped it     |
| `on-failure`     | Restart only if exit code ≠ 0                            |

`unless-stopped` is ideal for development: if your app crashes due to a bug, Docker restarts it. But when you intentionally stop it with `docker compose down`, it stays stopped.

---

## 5. .dockerignore — Why It Matters

> **File location:** `.dockerignore` (project root)

When you run `docker build`, Docker takes the **entire context directory** and sends it to the Docker daemon (a separate process). Without `.dockerignore`:

```
Without .dockerignore:
  Docker sends: node_modules (500MB) + .git (50MB) + dist + logs + docs
  Transfer size: ~600MB
  Build time: SLOW

With .dockerignore:
  Docker sends: package.json + source code + prisma schema
  Transfer size: ~2MB
  Build time: FAST
```

**Our `.dockerignore` excludes:**

```
**/node_modules    → Container installs its own (different OS)
**/dist            → Dev containers don't need compiled JS
.git               → Git history not needed in containers
.vscode            → IDE config is irrelevant
**/logs            → Logs are runtime data, not build data
*.md               → Documentation not needed at runtime
docs/              → Same reason
```

**Key insight:** `.dockerignore` is read **relative to the build context** (the directory you pass to `docker build`). Since our context is the monorepo root, the `.dockerignore` goes there too.

---

## 6. How Hot Reload Works (The Full Flow)

Here's the complete journey of what happens when you save a file:

```
Step 1: You edit src/controllers/auth.controller.ts on your laptop
        (using VS Code, Cursor, vim, etc.)

Step 2: Your OS writes the change to disk

Step 3: Because of the bind mount volume in docker-compose:
          ./services/user-service/src → /app/services/user-service/src
        The container's file is the SAME file. It's a live link, not a copy.

Step 4: tsx watch (running inside the container as PID 1) has a filesystem
        watcher using inotify (Linux kernel feature).
        It detects that auth.controller.ts was modified.

Step 5: tsx kills the current Node.js process (the old server)

Step 6: tsx re-runs src/app.ts
        - tsx uses esbuild internally to compile TypeScript → JavaScript
        - But it does this ON THE FLY, in memory, in milliseconds
        - No .js files are written to disk — it's all in-memory

Step 7: Express starts a new HTTP server on port 3001

Step 8: NGINX (api-gateway container) still proxies to user-service:3001
        The DNS name hasn't changed. The port hasn't changed.
        New requests flow through seamlessly.

Total time from save to new server ready: ~1-2 seconds
```

**Why `tsx` instead of `tsc` + `node`?**

| Approach                  | What Happens                                          | Speed        |
| ------------------------- | ----------------------------------------------------- | ------------ |
| `tsc && node dist/app.js` | Compiles ALL .ts files → writes .js to disk → runs    | 3-10 seconds |
| `tsx watch src/app.ts`    | Compiles ONLY the needed files, in memory, on-the-fly | <1 second    |
| `ts-node src/app.ts`      | Like tsx but slower (uses TypeScript's own compiler)  | 2-5 seconds  |

`tsx` is the fastest option because it uses **esbuild** under the hood (written in Go, 10-100x faster than TypeScript's compiler).

---

## 7. Networking: How Containers Talk to Each Other

### The Problem: `localhost` Doesn't Work in Docker

On your laptop, everything shares the same `localhost`:

- PostgreSQL → `localhost:5432` ✅
- Redis → `localhost:6379` ✅
- Your app → `localhost:3001` ✅

This works because all processes share the same network namespace on your machine.

But in Docker, **each container is its own isolated machine** with its own network, its own `localhost`, its own IP address.

```
Container: user-service
  └── localhost → 127.0.0.1 (itself — only Node.js lives here)

Container: user_service_db
  └── localhost → 127.0.0.1 (itself — only PostgreSQL lives here)

If user-service connects to localhost:5432, it asks ITSELF
for PostgreSQL → 💥 Connection refused!
```

### The Solution: Docker Compose Networking

When you run `docker compose up`, Docker Compose automatically:

1. Creates a **bridge network** named `remote-compute-platform_default`
2. Connects ALL services to this network
3. Creates **DNS entries** for each service using its **service name** from the YAML file

```
┌─── Docker Network (remote-compute-platform_default) ───────┐
│                                                              │
│  DNS Table (managed by Docker):                              │
│  ─────────────────────────────                               │
│  "user_service_db" → 172.18.0.2    (PostgreSQL)              │
│  "my_redis_cache"  → 172.18.0.3    (Redis)                   │
│  "user-service"    → 172.18.0.4    (Node.js app)             │
│  "api-gateway"     → 172.18.0.5    (NGINX)                   │
│  "adminer"         → 172.18.0.6    (Database GUI)            │
│                                                              │
│  ✅ Every container can reach others by SERVICE NAME         │
│  ✅ Docker resolves name → IP automatically                  │
│  ❌ localhost does NOT cross container boundaries             │
└──────────────────────────────────────────────────────────────┘
```

That's why we override the environment variables in docker-compose:

```
Your .env (for running WITHOUT Docker):
  DATABASE_URL = postgresql://postgres:walid-999@localhost:5432/user_service_db
  REDIS_URL    = redis://localhost:6379

docker-compose environment (for running INSIDE Docker):
  DATABASE_URL = postgresql://postgres:walid-999@user_service_db:5432/user_service_db
  REDIS_URL    = redis://my_redis_cache:6379
                                                 ^^^^^^^^^^^^^^^^
                                                 Container name!
```

And in NGINX config:

```nginx
proxy_pass http://user-service:3001/api/v1/auth/;
                  ^^^^^^^^^^^^
                  Service name from docker-compose!
```

### `ports:` vs Internal Network

```yaml
ports:
  - '3001:3001' # host:container
```

This maps your laptop's port 3001 → the container's port 3001. It's what lets you access `http://localhost:3001` from your browser.

**But containers on the same Docker network DON'T need `ports:` to talk to each other.** They communicate directly through the internal network. `ports:` is only for accessing containers from the **host** (your laptop).

```
Your Browser → localhost:80 → api-gateway container (needs ports mapping)
api-gateway → user-service:3001 → user-service container (internal, no ports needed)
user-service → user_service_db:5432 → postgres container (internal, no ports needed)
```

---

## 8. Dev vs Production — The Key Differences

| Aspect               | Dockerfile (Production)                 | Dockerfile.dev (Development)         |
| -------------------- | --------------------------------------- | ------------------------------------ |
| **Stages**           | 2 stages (builder + runner)             | 1 stage (everything in one)          |
| **TypeScript**       | Compiled to `.js` via `tsc`             | Run directly via `tsx`               |
| **Dependencies**     | Production only (`--prod`)              | ALL deps (including devDependencies) |
| **Source code**      | Baked/copied into the image             | Bind-mounted from your laptop        |
| **Hot reload**       | ❌ No — requires full rebuild           | ✅ Yes — `tsx watch`                 |
| **Image size**       | ~150MB (small, secure)                  | ~400MB (larger, has dev tools)       |
| **Start command**    | `node dist/app.js`                      | `pnpm dev` (`tsx watch src/app.ts`)  |
| **File changes**     | Requires full `docker build` + redeploy | Instant restart (~1 second)          |
| **Dev tools inside** | ❌ No tsc, no tsx, no prisma CLI        | ✅ All available                     |

### Why 2 Stages in Production?

```
Production Dockerfile:

Stage 1: Builder
  FROM node:20-alpine AS builder
  → Install ALL dependencies (including devDependencies)
  → Compile TypeScript: tsc → generates dist/app.js
  → This stage is THROWN AWAY after building

Stage 2: Runner
  FROM node:20-alpine AS runner
  → Install ONLY production dependencies (--prod)
  → COPY dist/ from the builder stage
  → No TypeScript compiler, no tsx, no @types/*
  → Final image is small and secure
```

```
Builder stage: 400MB (has tsc, tsx, typescript, @types/*)
                ↓ copy only dist/ folder
Runner stage:  150MB (only express, prisma, bcrypt, etc.)
```

**Interview answer:** "We use multi-stage builds to separate the build environment from the runtime environment. The builder has compilers and dev tools. The runner has only what's needed to serve requests. This reduces the image size by ~60% and removes unnecessary attack surface."

### Workflow Comparison

```
Production:
  Edit code → git push → CI/CD builds image → push to registry → deploy → restart
  Time: 5-15 minutes

Development:
  Edit code → save file → tsx auto-restarts inside container
  Time: 1-2 seconds
```

---

## 9. Common Interview Questions

### Q1: "What is Docker?"

**A:** Docker is a platform that packages applications and their dependencies into lightweight, portable containers. Each container runs in isolation, ensuring the app works identically across development, testing, and production environments.

### Q2: "What is the difference between an image and a container?"

**A:** An image is a read-only template (like a class). A container is a running instance of an image (like an object). You can create many containers from the same image.

### Q3: "What is the difference between CMD and ENTRYPOINT?"

**A:** Both define what runs when a container starts.

- `CMD` can be **overridden** at runtime: `docker run myimage /bin/sh` replaces CMD.
- `ENTRYPOINT` is **fixed** — CMD becomes arguments to it.
- Use `CMD` for the default command. Use `ENTRYPOINT` when the container should always run the same executable.

### Q4: "What is the difference between COPY and ADD?"

**A:** Both copy files into the image.

- `COPY` copies files from the build context.
- `ADD` also supports URLs and auto-extracts `.tar` archives.
- **Best practice:** Always use `COPY` unless you specifically need tar extraction.

### Q5: "Why multi-stage builds?"

**A:** To keep the final image small and secure. The builder stage has compilers and dev tools (~400MB). The runner stage only has the compiled output and runtime dependencies (~150MB). Smaller images = faster deployments + fewer CVEs.

### Q6: "What happens if you don't use an anonymous volume for node_modules in dev?"

**A:** The bind mount overwrites the container's `node_modules` (compiled for Alpine Linux) with your local `node_modules` (compiled for macOS/Windows). Native modules like `bcrypt` or Prisma's query engine would crash with architecture mismatch errors.

### Q7: "How do containers communicate with each other?"

**A:** Docker Compose creates a bridge network and gives each service a DNS name matching its service name in the YAML file. Containers use these DNS names (like `user_service_db`) instead of IP addresses or `localhost`.

### Q8: "What is the difference between `ports` and `EXPOSE`?"

**A:** `EXPOSE` is documentation — it doesn't open any ports. `ports: '3001:3001'` in docker-compose maps host:container ports, making it accessible from the browser. Containers on the same network can talk to each other WITHOUT ports mapping.

### Q9: "What is Docker layer caching?"

**A:** Each Dockerfile instruction creates a layer. Docker caches layers. If a layer hasn't changed, Docker reuses the cache. That's why we copy `package.json` before source code — so `pnpm install` is cached unless dependencies change.

### Q10: "What is `docker compose down -v`?"

**A:** `down` stops and removes containers + networks. `-v` also removes **volumes** (which contain database data). Without `-v`, your PostgreSQL data survives restarts.

### Q11: "How would you debug a container that won't start?"

**A:**

1. `docker logs <container-name>` — check the app's console output
2. `docker exec -it <container-name> sh` — get a shell inside (if the container is running)
3. `docker run -it <image-name> sh` — start a fresh container with a shell (if it's crashing on startup)
4. `docker inspect <container-name>` — check networking, volumes, environment

### Q12: "What is the difference between bind mount and named volume?"

**A:**

- **Bind mount** (`./src:/app/src`): Maps a specific host folder → container folder. You control the data.
- **Named volume** (`postgres_data:/var/lib/postgresql/data`): Docker manages the storage location. Ideal for database data where you don't need direct file access.

---

## 10. Commands Cheat Sheet

### 🚀 Starting & Stopping

```bash
# Start everything in development mode (with build)
docker compose -f docker-compose.dev.yml up --build

# Start in the background (detached)
docker compose -f docker-compose.dev.yml up --build -d

# Stop all containers
docker compose -f docker-compose.dev.yml down

# Stop + delete volumes (⚠️ RESETS DATABASES)
docker compose -f docker-compose.dev.yml down -v

# Restart only user-service (after Dockerfile.dev changes)
docker compose -f docker-compose.dev.yml up --build user-service
```

### 📋 Logs & Monitoring

```bash
# View logs of a specific service (follow mode)
docker compose -f docker-compose.dev.yml logs -f user-service

# View last 50 lines of logs
docker compose -f docker-compose.dev.yml logs --tail 50 user-service

# View logs of ALL services
docker compose -f docker-compose.dev.yml logs -f

# List running containers with status and ports
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

### 🔧 Debugging

```bash
# Open a shell INSIDE the running container
docker exec -it user-service sh

# Check what port the container is actually listening on
docker exec user-service ss -tlnp

# Check environment variables inside the container
docker exec user-service printenv | grep -E "PORT|DATABASE|REDIS|NODE_ENV"

# Test NGINX → user-service connection (from inside NGINX)
docker exec api-gateway wget -qO- http://user-service:3001/health

# Check the Docker network
docker network inspect remote-compute-platform_default
```

### 🗄️ Database Commands (inside container)

```bash
# Run Prisma migration inside the container
docker exec -it user-service pnpm db

# Open Prisma Studio (database GUI)
docker exec -it user-service pnpm studio

# Generate Prisma client after schema changes
docker exec -it user-service pnpm generate
```

### 🧹 Cleanup

```bash
# Remove all stopped containers
docker container prune

# Remove all unused images
docker image prune

# Remove everything unused (containers, images, networks, volumes)
docker system prune -a --volumes
# ⚠️ DANGEROUS: This deletes ALL Docker data including database volumes
```

---

## 11. How to Run the Project

### Prerequisites

Make sure you have installed:

- **Docker Desktop** (or Docker Engine + Docker Compose on Linux)
- **Git** (to clone the repository)

You do **NOT** need to install Node.js, pnpm, PostgreSQL, or Redis on your machine. Docker provides all of these inside containers.

### Step-by-Step

#### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd remote-compute-platform
```

#### 2. Make Sure `.env` Files Exist

The user-service needs its `.env` file at `services/user-service/.env`:

```env
DATABASE_URL="postgresql://postgres:walid-999@localhost:5432/user_service_db?schema=public"
JWT_SECRET="asle87ds87d5s76weffker64s87srfia"
JWT_REFRESH_SECRET="ds854sd8f4rf84se56f4wr89489esiw58wq9da5r"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
PORT='3001'
NODE_ENV='development'
PRISMA_CLIENT_ENGINE_TYPE=library
REDIS_URL="redis://localhost:6379"
```

> **Note:** The `localhost` values in `.env` are overridden by `docker-compose.dev.yml`. The `.env` file also works for running the app outside Docker (directly on your machine).

#### 3. Build and Start All Containers

```bash
docker compose -f docker-compose.dev.yml up --build
```

**What happens:**

1. Docker builds the `user-service` image from `Dockerfile.dev`
2. Docker pulls `postgres:16-alpine`, `redis:latest`, `nginx:alpine`, `adminer` from Docker Hub (first time only)
3. All containers start in the correct order (DB → Redis → user-service → NGINX)
4. You see logs from all services in your terminal

#### 4. Run Database Migrations (First Time Only)

Open a **new terminal** and run:

```bash
docker exec -it user-service pnpm db
```

This creates the database tables based on your Prisma schema.

#### 5. Verify Everything is Working

| Service             | URL                                | What You Should See                                 |
| ------------------- | ---------------------------------- | --------------------------------------------------- |
| API Gateway (NGINX) | http://localhost                   | NGINX is running                                    |
| Auth endpoint       | http://localhost/api/v1/auth/login | JSON response (even if error, means it's connected) |
| Health check        | http://localhost:3001/health       | `{"status":"ok","service":"user-service"}`          |
| Adminer (DB GUI)    | http://localhost:8080              | Login form for database                             |

**Adminer login credentials:**

- System: PostgreSQL
- Server: `user_service_db`
- Username: `postgres`
- Password: `walid-999`
- Database: `user_service_db`

#### 6. Start Developing!

Now just edit any `.ts` file in `services/user-service/src/`. The server restarts automatically inside Docker. No need to rebuild.

#### 7. Stopping the Project

```bash
# Press Ctrl+C if running in foreground
# OR
docker compose -f docker-compose.dev.yml down
```

### Troubleshooting

| Problem                                                    | Solution                                                                                            |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `port is already in use`                                   | Another process is using the port. Run `lsof -i :3001` to find it, then kill it                     |
| `502 Bad Gateway` from NGINX                               | user-service isn't running. Check `docker logs user-service`                                        |
| `Connection refused` to database                           | Database isn't ready yet. Wait a few seconds or run `docker compose restart user-service`           |
| `pnpm install` fails in build                              | Your `pnpm-lock.yaml` might be out of sync. Run `pnpm install` locally first to update the lockfile |
| Changes not reflecting                                     | Make sure you're editing files inside `services/user-service/src/` (the bind-mounted directory)     |
| `ENOSPC: System limit for number of file watchers reached` | Run: `echo fs.inotify.max_user_watches=524288 \| sudo tee -a /etc/sysctl.conf && sudo sysctl -p`    |

---

## 12. Advice, Best Practices & Job Interview Tips

### 🏗️ Docker Best Practices

#### 1. Always Use `.dockerignore`

Without it, Docker sends `node_modules` (500MB+) to the build daemon every time. With it, builds are 10-100x faster.

#### 2. One Process Per Container

Don't run PostgreSQL + Node.js + Redis in the same container. Each container should do **one thing**. This is the "microservices mindset":

- Easier to scale (need more Node.js? Add more containers, keep 1 database)
- Easier to debug (logs are separated by service)
- Easier to update (update Redis without touching your app)

#### 3. Use Specific Image Tags

```dockerfile
# ❌ BAD: "latest" can change any day and break your build
FROM node:latest

# ✅ GOOD: Pinned to a specific version
FROM node:20-alpine
```

#### 4. Don't Run as Root

Production Dockerfiles should include:

```dockerfile
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
```

This prevents a compromised container from having root access to the host.

#### 5. Use Health Checks

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost:3001/health || exit 1
```

This lets Docker (and orchestrators like Kubernetes) know if your app is actually healthy, not just running.

#### 6. Keep Images Small

```
node:20        → 900MB  ❌
node:20-slim   → 200MB  ⚠️
node:20-alpine → 50MB   ✅
```

Smaller images = faster CI/CD, faster deployments, smaller attack surface.

#### 7. Never Store Secrets in Dockerfiles

```dockerfile
# ❌ NEVER do this — secrets end up in image layers (visible to anyone)
ENV JWT_SECRET="my-secret-key"
RUN echo "password123" > /app/.env

# ✅ Use environment variables from docker-compose or secret managers
# The secrets stay outside the image
```

---

### 💼 Job Interview Advice

#### What Companies Expect You to Know About Docker

**Junior/Mid Level:**

- What is Docker and why it's used
- How to write a basic Dockerfile
- How to use docker-compose
- Understanding of images, containers, volumes
- The `localhost` problem in Docker networking

**Senior Level:**

- Multi-stage builds and why they matter
- Layer caching optimization
- Security best practices (non-root user, minimal images)
- Docker networking modes (bridge, host, overlay)
- Container orchestration concepts (Kubernetes basics)
- CI/CD integration with Docker

#### How to Talk About Docker in Interviews

**Don't say:** "I use Docker to run my database."

**Do say:** "I containerize my microservices using Docker to ensure consistent environments across development and production. I use multi-stage builds to optimize image size, bind-mount volumes for hot-reload in development, and Docker Compose to orchestrate the full stack including PostgreSQL, Redis, and NGINX as an API gateway."

#### Demonstrate Understanding, Not Just Usage

Interviewers want to hear **WHY**, not just **WHAT**:

| Just Usage (Weak)               | Understanding (Strong)                                                                                                                              |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| "I use Alpine"                  | "I use Alpine to minimize image size and attack surface"                                                                                            |
| "I copy package.json first"     | "I copy dependency files before source code to leverage Docker's layer caching, so pnpm install is cached on code-only changes"                     |
| "I use volumes"                 | "I use bind mounts for source code hot-reload and anonymous volumes to protect container-specific node_modules from host OS architecture conflicts" |
| "I put stuff in docker-compose" | "I use Docker Compose to declaratively define my service topology, including networking, volume mounts, and startup ordering"                       |

#### Keywords That Impress Interviewers

Use these terms naturally in your answers:

- **Layer caching** — Docker's build optimization
- **Multi-stage build** — Separation of build and runtime environments
- **Bind mount vs named volume** — Different persistence strategies
- **Bridge network** — Docker's default container networking
- **Build context** — The directory sent to Docker daemon
- **Idempotent** — Building the same Dockerfile always produces the same image
- **12-Factor App** — A methodology Docker naturally supports (especially factor III: Config, factor VI: Processes)

---

### 🧠 Things Most People Don't Know (Bonus Interview Points)

#### 1. Docker doesn't actually run containers

Docker uses **containerd** and **runc** under the hood. Docker itself is just the CLI and API layer. Kubernetes bypassed Docker entirely and talks to containerd directly (this is why "Docker was deprecated in Kubernetes" made headlines — but containers still work fine).

#### 2. Every `RUN` instruction creates a layer

```dockerfile
# ❌ BAD: 3 layers, each cached separately
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get clean

# ✅ GOOD: 1 layer, everything together
RUN apt-get update && apt-get install -y curl && apt-get clean
```

Fewer layers = smaller image size, and cleanup in the same layer actually reduces size (cleaning up in a later `RUN` doesn't remove data from the previous layer).

#### 3. `docker compose` vs `docker-compose`

```bash
docker-compose    # Old standalone tool (Python-based, deprecated)
docker compose    # New plugin (Go-based, built into Docker CLI, use this one)
```

#### 4. The DNS trick with container names

The service name in docker-compose becomes the DNS hostname. But the `container_name` does NOT become the DNS name. The **service key** in the YAML is what matters:

```yaml
services:
  my-app: # ← THIS is the DNS name (my-app)
    container_name: waleed # ← This is NOT used for DNS
```

Other containers reach it via `http://my-app:3001`, NOT `http://waleed:3001`.

---

> **Final advice:** The best way to learn Docker deeply is to **break things intentionally**. Remove a volume, change a port, misconfigure networking. Watch what happens. Read the error messages. This hands-on troubleshooting is what will make you truly confident in interviews.

Good luck with your job applications! 🚀
