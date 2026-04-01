import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { EnumUserActionWithAggregatesFilterObjectSchema as EnumUserActionWithAggregatesFilterObjectSchema } from './EnumUserActionWithAggregatesFilter.schema';
import { UserActionSchema } from '../enums/UserAction.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { JsonNullableWithAggregatesFilterObjectSchema as JsonNullableWithAggregatesFilterObjectSchema } from './JsonNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const userauditlogscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => UserAuditLogScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => UserAuditLogScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => UserAuditLogScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => UserAuditLogScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => UserAuditLogScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  userId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  action: z.union([z.lazy(() => EnumUserActionWithAggregatesFilterObjectSchema), UserActionSchema]).optional(),
  description: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  oldValues: z.lazy(() => JsonNullableWithAggregatesFilterObjectSchema).optional(),
  newValues: z.lazy(() => JsonNullableWithAggregatesFilterObjectSchema).optional(),
  ipAddress: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  userAgent: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  requestId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const UserAuditLogScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.UserAuditLogScalarWhereWithAggregatesInput> = userauditlogscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.UserAuditLogScalarWhereWithAggregatesInput>;
export const UserAuditLogScalarWhereWithAggregatesInputObjectZodSchema = userauditlogscalarwherewithaggregatesinputSchema;
