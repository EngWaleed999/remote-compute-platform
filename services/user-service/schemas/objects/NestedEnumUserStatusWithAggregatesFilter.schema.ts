import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserStatusSchema } from '../enums/UserStatus.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumUserStatusFilterObjectSchema as NestedEnumUserStatusFilterObjectSchema } from './NestedEnumUserStatusFilter.schema'

const nestedenumuserstatuswithaggregatesfilterSchema = z.object({
  equals: UserStatusSchema.optional(),
  in: UserStatusSchema.array().optional(),
  notIn: UserStatusSchema.array().optional(),
  not: z.union([UserStatusSchema, z.lazy(() => NestedEnumUserStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumUserStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumUserStatusFilterObjectSchema).optional()
}).strict();
export const NestedEnumUserStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumUserStatusWithAggregatesFilter> = nestedenumuserstatuswithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumUserStatusWithAggregatesFilter>;
export const NestedEnumUserStatusWithAggregatesFilterObjectZodSchema = nestedenumuserstatuswithaggregatesfilterSchema;
