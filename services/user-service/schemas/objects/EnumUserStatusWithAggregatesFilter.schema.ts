import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserStatusSchema } from '../enums/UserStatus.schema';
import { NestedEnumUserStatusWithAggregatesFilterObjectSchema as NestedEnumUserStatusWithAggregatesFilterObjectSchema } from './NestedEnumUserStatusWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumUserStatusFilterObjectSchema as NestedEnumUserStatusFilterObjectSchema } from './NestedEnumUserStatusFilter.schema'

const makeSchema = () => z.object({
  equals: UserStatusSchema.optional(),
  in: UserStatusSchema.array().optional(),
  notIn: UserStatusSchema.array().optional(),
  not: z.union([UserStatusSchema, z.lazy(() => NestedEnumUserStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumUserStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumUserStatusFilterObjectSchema).optional()
}).strict();
export const EnumUserStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumUserStatusWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumUserStatusWithAggregatesFilter>;
export const EnumUserStatusWithAggregatesFilterObjectZodSchema = makeSchema();
