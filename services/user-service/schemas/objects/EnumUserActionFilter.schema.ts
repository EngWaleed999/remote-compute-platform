import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserActionSchema } from '../enums/UserAction.schema';
import { NestedEnumUserActionFilterObjectSchema as NestedEnumUserActionFilterObjectSchema } from './NestedEnumUserActionFilter.schema'

const makeSchema = () => z.object({
  equals: UserActionSchema.optional(),
  in: UserActionSchema.array().optional(),
  notIn: UserActionSchema.array().optional(),
  not: z.union([UserActionSchema, z.lazy(() => NestedEnumUserActionFilterObjectSchema)]).optional()
}).strict();
export const EnumUserActionFilterObjectSchema: z.ZodType<Prisma.EnumUserActionFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumUserActionFilter>;
export const EnumUserActionFilterObjectZodSchema = makeSchema();
