import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserStatusSchema } from '../enums/UserStatus.schema'

const nestedenumuserstatusfilterSchema = z.object({
  equals: UserStatusSchema.optional(),
  in: UserStatusSchema.array().optional(),
  notIn: UserStatusSchema.array().optional(),
  not: z.union([UserStatusSchema, z.lazy(() => NestedEnumUserStatusFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumUserStatusFilterObjectSchema: z.ZodType<Prisma.NestedEnumUserStatusFilter> = nestedenumuserstatusfilterSchema as unknown as z.ZodType<Prisma.NestedEnumUserStatusFilter>;
export const NestedEnumUserStatusFilterObjectZodSchema = nestedenumuserstatusfilterSchema;
