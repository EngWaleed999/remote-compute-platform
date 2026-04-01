import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  userId: SortOrderSchema.optional(),
  action: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  oldValues: SortOrderSchema.optional(),
  newValues: SortOrderSchema.optional(),
  ipAddress: SortOrderSchema.optional(),
  userAgent: SortOrderSchema.optional(),
  requestId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional()
}).strict();
export const UserAuditLogCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.UserAuditLogCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.UserAuditLogCountOrderByAggregateInput>;
export const UserAuditLogCountOrderByAggregateInputObjectZodSchema = makeSchema();
