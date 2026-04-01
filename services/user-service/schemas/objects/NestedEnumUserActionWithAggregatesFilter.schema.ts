import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserActionSchema } from '../enums/UserAction.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumUserActionFilterObjectSchema as NestedEnumUserActionFilterObjectSchema } from './NestedEnumUserActionFilter.schema'

const nestedenumuseractionwithaggregatesfilterSchema = z.object({
  equals: UserActionSchema.optional(),
  in: UserActionSchema.array().optional(),
  notIn: UserActionSchema.array().optional(),
  not: z.union([UserActionSchema, z.lazy(() => NestedEnumUserActionWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumUserActionFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumUserActionFilterObjectSchema).optional()
}).strict();
export const NestedEnumUserActionWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumUserActionWithAggregatesFilter> = nestedenumuseractionwithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumUserActionWithAggregatesFilter>;
export const NestedEnumUserActionWithAggregatesFilterObjectZodSchema = nestedenumuseractionwithaggregatesfilterSchema;
