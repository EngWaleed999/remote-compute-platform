import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  userId: SortOrderSchema.optional(),
  action: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  ipAddress: SortOrderSchema.optional(),
  userAgent: SortOrderSchema.optional(),
  requestId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional()
}).strict();
export const UserAuditLogMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.UserAuditLogMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.UserAuditLogMaxOrderByAggregateInput>;
export const UserAuditLogMaxOrderByAggregateInputObjectZodSchema = makeSchema();
