import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  email: z.literal(true).optional(),
  passwordHash: z.literal(true).optional(),
  name: z.literal(true).optional(),
  avatarUrl: z.literal(true).optional(),
  phone: z.literal(true).optional(),
  timezone: z.literal(true).optional(),
  role: z.literal(true).optional(),
  status: z.literal(true).optional(),
  emailVerified: z.literal(true).optional(),
  twoFactorEnabled: z.literal(true).optional(),
  twoFactorSecret: z.literal(true).optional(),
  defaultPaymentMethodId: z.literal(true).optional(),
  stripeCustomerId: z.literal(true).optional(),
  lastLoginAt: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  deletedAt: z.literal(true).optional()
}).strict();
export const UserMinAggregateInputObjectSchema: z.ZodType<Prisma.UserMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.UserMinAggregateInputType>;
export const UserMinAggregateInputObjectZodSchema = makeSchema();
