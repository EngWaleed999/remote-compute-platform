/**
 * User Service — Express Application Entry Point
 *
 * Sets up:
 * - Security middleware (helmet, cors)
 * - JSON body parsing
 * - Route mounting (/auth/*, /users/*)
 * - Centralized error handling
 * - Graceful shutdown
 */
import express, { type Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { appRoutes } from './routes/index.js';
import { errorHandler } from './middlewares/error-handler.js';

const app: Express = express();

// ═══════════════════════════════════════════════════
// 1️⃣ Security Middleware
// ═══════════════════════════════════════════════════
app.use(helmet());
app.use(cors());

// ═══════════════════════════════════════════════════
// 2️⃣ Body Parsing
// ═══════════════════════════════════════════════════
app.use(express.json({ limit: '10kb' })); // Limit body size for security
app.use(express.urlencoded({ extended: true }));

// ═══════════════════════════════════════════════════
// 3️⃣ Health Check (useful for load balancers / k8s)
// ═══════════════════════════════════════════════════
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'user-service' });
});

// ═══════════════════════════════════════════════════
// 4️⃣ API Routes
// ═══════════════════════════════════════════════════
app.use('/api/v1', appRoutes);
app.get('/test', (req, res) => {
  res.send('server Worling');
});

// ═══════════════════════════════════════════════════
// 5️⃣ Centralized Error Handler (must be LAST)
// ═══════════════════════════════════════════════════
app.use(errorHandler);

// ═══════════════════════════════════════════════════
// 6️⃣ Start Server
// ═══════════════════════════════════════════════════
const PORT = parseInt(env.PORT, 10);

app.listen(PORT, () => {
  logger.info(`🚀 User-service running on port ${PORT} [${env.NODE_ENV}]`);
  console.log(`🚀 User-service running on port ${PORT} [${env.NODE_ENV}]`);
});

export { app };
