import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserStatusSchema } from '../enums/UserStatus.schema';
import { NestedEnumUserStatusFilterObjectSchema as NestedEnumUserStatusFilterObjectSchema } from './NestedEnumUserStatusFilter.schema'

const makeSchema = () => z.object({
  equals: UserStatusSchema.optional(),
  in: UserStatusSchema.array().optional(),
  notIn: UserStatusSchema.array().optional(),
  not: z.union([UserStatusSchema, z.lazy(() => NestedEnumUserStatusFilterObjectSchema)]).optional()
}).strict();
export const EnumUserStatusFilterObjectSchema: z.ZodType<Prisma.EnumUserStatusFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumUserStatusFilter>;
export const EnumUserStatusFilterObjectZodSchema = makeSchema();
