import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { EnumUserActionFilterObjectSchema as EnumUserActionFilterObjectSchema } from './EnumUserActionFilter.schema';
import { UserActionSchema } from '../enums/UserAction.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const userauditlogscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => UserAuditLogScalarWhereInputObjectSchema), z.lazy(() => UserAuditLogScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => UserAuditLogScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => UserAuditLogScalarWhereInputObjectSchema), z.lazy(() => UserAuditLogScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  userId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  action: z.union([z.lazy(() => EnumUserActionFilterObjectSchema), UserActionSchema]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  oldValues: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  newValues: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  ipAddress: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  userAgent: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  requestId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const UserAuditLogScalarWhereInputObjectSchema: z.ZodType<Prisma.UserAuditLogScalarWhereInput> = userauditlogscalarwhereinputSchema as unknown as z.ZodType<Prisma.UserAuditLogScalarWhereInput>;
export const UserAuditLogScalarWhereInputObjectZodSchema = userauditlogscalarwhereinputSchema;
