import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { UserAuditLogCountOrderByAggregateInputObjectSchema as UserAuditLogCountOrderByAggregateInputObjectSchema } from './UserAuditLogCountOrderByAggregateInput.schema';
import { UserAuditLogMaxOrderByAggregateInputObjectSchema as UserAuditLogMaxOrderByAggregateInputObjectSchema } from './UserAuditLogMaxOrderByAggregateInput.schema';
import { UserAuditLogMinOrderByAggregateInputObjectSchema as UserAuditLogMinOrderByAggregateInputObjectSchema } from './UserAuditLogMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  userId: SortOrderSchema.optional(),
  action: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  oldValues: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  newValues: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  ipAddress: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  userAgent: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  requestId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  _count: z.lazy(() => UserAuditLogCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => UserAuditLogMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => UserAuditLogMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const UserAuditLogOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.UserAuditLogOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.UserAuditLogOrderByWithAggregationInput>;
export const UserAuditLogOrderByWithAggregationInputObjectZodSchema = makeSchema();
