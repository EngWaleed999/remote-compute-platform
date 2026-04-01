import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  userId: SortOrderSchema.optional(),
  token: SortOrderSchema.optional(),
  refreshToken: SortOrderSchema.optional(),
  expiresAt: SortOrderSchema.optional(),
  ipAddress: SortOrderSchema.optional(),
  userAgent: SortOrderSchema.optional(),
  deviceType: SortOrderSchema.optional(),
  location: SortOrderSchema.optional(),
  isValid: SortOrderSchema.optional(),
  revokedAt: SortOrderSchema.optional(),
  revokedReason: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  lastUsedAt: SortOrderSchema.optional()
}).strict();
export const UserSessionMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.UserSessionMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.UserSessionMaxOrderByAggregateInput>;
export const UserSessionMaxOrderByAggregateInputObjectZodSchema = makeSchema();
