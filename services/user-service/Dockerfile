# ─────────────────────────────────────────────────────────────────────────────
# Stage 1: Builder
# Purpose: Install ALL dependencies (including devDependencies) and compile
#          TypeScript into plain JavaScript in the /dist folder.
# We use a separate "builder" stage so that devDependencies (like tsc, tsx)
# do NOT end up in the final production image, keeping it lean and secure.
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

# Install pnpm globally because this is a pnpm monorepo
RUN npm install -g pnpm

WORKDIR /app

# Copy workspace config files needed to resolve monorepo packages
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY package.json ./
COPY tsconfig.json ./

# Copy the shared packages this service depends on (referenced as workspace:*)
COPY packages/ ./packages/

# Copy the service source code
COPY services/user-service/ ./services/user-service/

# Install all dependencies (including devDependencies for the build step)
RUN pnpm install --frozen-lockfile

# Compile TypeScript → JavaScript
# Output will be in services/user-service/dist/
RUN pnpm --filter @repo/user-service build


# ─────────────────────────────────────────────────────────────────────────────
# Stage 2: Production Runner
# Purpose: Copy ONLY the compiled output and production dependencies.
#          No TypeScript compiler, no source code, no dev tools.
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

RUN npm install -g pnpm

WORKDIR /app

# Copy workspace config files
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY package.json ./

# Copy shared packages
COPY packages/ ./packages/

# Copy the service's package.json and compiled output from the builder stage
COPY services/user-service/package.json ./services/user-service/package.json
COPY --from=builder /app/services/user-service/dist ./services/user-service/dist

# Copy prisma schema (needed to generate the Prisma client at runtime)
COPY services/user-service/prisma ./services/user-service/prisma

# Install ONLY production dependencies (no devDependencies)
RUN pnpm install --prod --frozen-lockfile

# Generate the Prisma client inside the container
RUN pnpm --filter @repo/user-service generate

# Tell Docker this container will use port 3001.
# This is metadata only — it does NOT publish the port to the host.
# The actual publishing happens in docker-compose.yml via "ports:".
EXPOSE 3001

WORKDIR /app/services/user-service

# Start the compiled Node.js application
CMD ["node", "dist/app.js"]
