import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { UserActionSchema } from '../enums/UserAction.schema';
import { EnumUserActionFieldUpdateOperationsInputObjectSchema as EnumUserActionFieldUpdateOperationsInputObjectSchema } from './EnumUserActionFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { UserUpdateOneRequiredWithoutAuditLogsNestedInputObjectSchema as UserUpdateOneRequiredWithoutAuditLogsNestedInputObjectSchema } from './UserUpdateOneRequiredWithoutAuditLogsNestedInput.schema'

import { JsonValueSchema as jsonSchema } from '../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  action: z.union([UserActionSchema, z.lazy(() => EnumUserActionFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  oldValues: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  newValues: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  ipAddress: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  userAgent: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  requestId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutAuditLogsNestedInputObjectSchema).optional()
}).strict();
export const UserAuditLogUpdateInputObjectSchema: z.ZodType<Prisma.UserAuditLogUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.UserAuditLogUpdateInput>;
export const UserAuditLogUpdateInputObjectZodSchema = makeSchema();
