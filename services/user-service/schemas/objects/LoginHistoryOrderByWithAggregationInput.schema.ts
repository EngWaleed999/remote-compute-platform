import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { LoginHistoryCountOrderByAggregateInputObjectSchema as LoginHistoryCountOrderByAggregateInputObjectSchema } from './LoginHistoryCountOrderByAggregateInput.schema';
import { LoginHistoryMaxOrderByAggregateInputObjectSchema as LoginHistoryMaxOrderByAggregateInputObjectSchema } from './LoginHistoryMaxOrderByAggregateInput.schema';
import { LoginHistoryMinOrderByAggregateInputObjectSchema as LoginHistoryMinOrderByAggregateInputObjectSchema } from './LoginHistoryMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  userId: SortOrderSchema.optional(),
  success: SortOrderSchema.optional(),
  method: SortOrderSchema.optional(),
  ipAddress: SortOrderSchema.optional(),
  userAgent: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  deviceType: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  location: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  failureReason: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  _count: z.lazy(() => LoginHistoryCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => LoginHistoryMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => LoginHistoryMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const LoginHistoryOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.LoginHistoryOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.LoginHistoryOrderByWithAggregationInput>;
export const LoginHistoryOrderByWithAggregationInputObjectZodSchema = makeSchema();
