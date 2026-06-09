/**
 * Prisma Client Singleton
 * Ensures a single PrismaClient instance across the application.
 * Handles graceful disconnect on process exit.
 * هذا الملف مسؤول عن تشغيل بريسما داخل التطبيق وقت التشغيل
 */
import { PrismaClient } from '@prisma/client-user';
import { env } from './env.js';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({
  log: env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
  adapter,
});

// Graceful shutdown — disconnect Prisma on process termination
const gracefulDisconnect = async () => {
  await prisma.$disconnect();
};

process.on('SIGTERM', gracefulDisconnect);
process.on('SIGINT', gracefulDisconnect);

export { prisma };
