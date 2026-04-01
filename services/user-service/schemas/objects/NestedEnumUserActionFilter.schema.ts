import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserActionSchema } from '../enums/UserAction.schema'

const nestedenumuseractionfilterSchema = z.object({
  equals: UserActionSchema.optional(),
  in: UserActionSchema.array().optional(),
  notIn: UserActionSchema.array().optional(),
  not: z.union([UserActionSchema, z.lazy(() => NestedEnumUserActionFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumUserActionFilterObjectSchema: z.ZodType<Prisma.NestedEnumUserActionFilter> = nestedenumuseractionfilterSchema as unknown as z.ZodType<Prisma.NestedEnumUserActionFilter>;
export const NestedEnumUserActionFilterObjectZodSchema = nestedenumuseractionfilterSchema;
