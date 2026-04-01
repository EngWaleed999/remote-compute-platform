import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  userId: z.literal(true).optional(),
  action: z.literal(true).optional(),
  description: z.literal(true).optional(),
  oldValues: z.literal(true).optional(),
  newValues: z.literal(true).optional(),
  ipAddress: z.literal(true).optional(),
  userAgent: z.literal(true).optional(),
  requestId: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const UserAuditLogCountAggregateInputObjectSchema: z.ZodType<Prisma.UserAuditLogCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.UserAuditLogCountAggregateInputType>;
export const UserAuditLogCountAggregateInputObjectZodSchema = makeSchema();
