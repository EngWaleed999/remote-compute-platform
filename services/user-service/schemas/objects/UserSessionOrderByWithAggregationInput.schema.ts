import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { UserSessionCountOrderByAggregateInputObjectSchema as UserSessionCountOrderByAggregateInputObjectSchema } from './UserSessionCountOrderByAggregateInput.schema';
import { UserSessionMaxOrderByAggregateInputObjectSchema as UserSessionMaxOrderByAggregateInputObjectSchema } from './UserSessionMaxOrderByAggregateInput.schema';
import { UserSessionMinOrderByAggregateInputObjectSchema as UserSessionMinOrderByAggregateInputObjectSchema } from './UserSessionMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  userId: SortOrderSchema.optional(),
  token: SortOrderSchema.optional(),
  refreshToken: SortOrderSchema.optional(),
  expiresAt: SortOrderSchema.optional(),
  ipAddress: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  userAgent: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  deviceType: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  location: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  isValid: SortOrderSchema.optional(),
  revokedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  revokedReason: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  lastUsedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => UserSessionCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => UserSessionMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => UserSessionMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const UserSessionOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.UserSessionOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.UserSessionOrderByWithAggregationInput>;
export const UserSessionOrderByWithAggregationInputObjectZodSchema = makeSchema();
