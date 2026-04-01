import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  email: SortOrderSchema.optional(),
  passwordHash: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  avatarUrl: SortOrderSchema.optional(),
  phone: SortOrderSchema.optional(),
  timezone: SortOrderSchema.optional(),
  role: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  emailVerified: SortOrderSchema.optional(),
  twoFactorEnabled: SortOrderSchema.optional(),
  twoFactorSecret: SortOrderSchema.optional(),
  defaultPaymentMethodId: SortOrderSchema.optional(),
  stripeCustomerId: SortOrderSchema.optional(),
  lastLoginAt: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  deletedAt: SortOrderSchema.optional()
}).strict();
export const UserCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCountOrderByAggregateInput>;
export const UserCountOrderByAggregateInputObjectZodSchema = makeSchema();
