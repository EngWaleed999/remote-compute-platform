import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserActionSchema } from '../enums/UserAction.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { UserCreateNestedOneWithoutAuditLogsInputObjectSchema as UserCreateNestedOneWithoutAuditLogsInputObjectSchema } from './UserCreateNestedOneWithoutAuditLogsInput.schema'

import { JsonValueSchema as jsonSchema } from '../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  action: UserActionSchema,
  description: z.string().optional().nullable(),
  oldValues: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  newValues: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
  requestId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutAuditLogsInputObjectSchema)
}).strict();
export const UserAuditLogCreateInputObjectSchema: z.ZodType<Prisma.UserAuditLogCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.UserAuditLogCreateInput>;
export const UserAuditLogCreateInputObjectZodSchema = makeSchema();
