import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  userId: SortOrderSchema.optional(),
  success: SortOrderSchema.optional(),
  method: SortOrderSchema.optional(),
  ipAddress: SortOrderSchema.optional(),
  userAgent: SortOrderSchema.optional(),
  deviceType: SortOrderSchema.optional(),
  location: SortOrderSchema.optional(),
  failureReason: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional()
}).strict();
export const LoginHistoryMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.LoginHistoryMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.LoginHistoryMaxOrderByAggregateInput>;
export const LoginHistoryMaxOrderByAggregateInputObjectZodSchema = makeSchema();
