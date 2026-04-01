import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  userId: z.literal(true).optional(),
  success: z.literal(true).optional(),
  method: z.literal(true).optional(),
  ipAddress: z.literal(true).optional(),
  userAgent: z.literal(true).optional(),
  deviceType: z.literal(true).optional(),
  location: z.literal(true).optional(),
  failureReason: z.literal(true).optional(),
  createdAt: z.literal(true).optional()
}).strict();
export const LoginHistoryMinAggregateInputObjectSchema: z.ZodType<Prisma.LoginHistoryMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.LoginHistoryMinAggregateInputType>;
export const LoginHistoryMinAggregateInputObjectZodSchema = makeSchema();
