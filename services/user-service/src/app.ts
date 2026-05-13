/**
 * User Service — Express Application Entry Point
 *
 * Sets up:
 * - Security middleware (helmet, cors, cookie-parser)
 * - JSON body parsing
 * - Route mounting (/auth/*, /users/*)
 * - Centralized error handling
 * - Redis connection
 * - Graceful shutdown
 */
import express, { type Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { appRoutes } from './routes/index.js';
import { errorHandler } from './middlewares/error-handler.js';
import { connectRedis, disconnectRedis } from './config/redis.js';

const app: Express = express();

// ═══════════════════════════════════════════════════
// 1️⃣ Security Middleware
// ═══════════════════════════════════════════════════
app.use(helmet());
// نظام حماية في المتصفح يمنع اي موقع عشوائي يرسل ريكويست لسيرفرك
app.use(
  cors({
    origin: env.NODE_ENV === 'production' ? 'https://yourplatform.com' : true,
    credentials: true, // Required for cookies to work cross-origin
  })
);

// ═══════════════════════════════════════════════════
// 2️⃣ Body Parsing + Cookie Parsing
// ═══════════════════════════════════════════════════
app.use(express.json({ limit: '10kb' })); // Limit body size for security
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Required for HttpOnly cookie-based auth

// ═══════════════════════════════════════════════════
// 3️⃣ Rate Limiting (global fallback)
// ═══════════════════════════════════════════════════
import { globalLimiter } from './middlewares/rate-limit.js';
app.use(globalLimiter);

// ═══════════════════════════════════════════════════
// 4️⃣ Health Check (useful for load balancers / k8s)
// ═══════════════════════════════════════════════════
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'user-service' });
});

// ═══════════════════════════════════════════════════
// 5️⃣ API Routes
// ═══════════════════════════════════════════════════
app.use('/api/v1', appRoutes);

// ═══════════════════════════════════════════════════
// 6️⃣ Centralized Error Handler (must be LAST)
// ═══════════════════════════════════════════════════
app.use(errorHandler);

// ═══════════════════════════════════════════════════
// 7️⃣ Start Server + Redis Connection
// ═══════════════════════════════════════════════════
const PORT = parseInt(env.PORT, 10);

async function bootstrap() {
  // Connect to Redis (non-blocking — app works without it via DB fallback)
  await connectRedis();

  app.listen(PORT, () => {
    logger.info(`🚀 User-service running on port ${PORT} [${env.NODE_ENV}]`);
    console.log(`🚀 User-service running on port ${PORT} [${env.NODE_ENV}]`);
  });
}

bootstrap().catch((err) => {
  logger.error({ message: 'Failed to start server', error: err });
  process.exit(1);
});

// ═══════════════════════════════════════════════════
// 8️⃣ Graceful Shutdown
// ═══════════════════════════════════════════════════
const gracefulShutdown = async () => {
  logger.info('Shutting down gracefully...');
  await disconnectRedis();
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

export { app };
