import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  userId: z.literal(true).optional(),
  token: z.literal(true).optional(),
  refreshToken: z.literal(true).optional(),
  expiresAt: z.literal(true).optional(),
  ipAddress: z.literal(true).optional(),
  userAgent: z.literal(true).optional(),
  deviceType: z.literal(true).optional(),
  location: z.literal(true).optional(),
  isValid: z.literal(true).optional(),
  revokedAt: z.literal(true).optional(),
  revokedReason: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  lastUsedAt: z.literal(true).optional()
}).strict();
export const UserSessionMinAggregateInputObjectSchema: z.ZodType<Prisma.UserSessionMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.UserSessionMinAggregateInputType>;
export const UserSessionMinAggregateInputObjectZodSchema = makeSchema();
