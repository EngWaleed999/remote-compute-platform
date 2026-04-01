import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserAuditLogSelectObjectSchema as UserAuditLogSelectObjectSchema } from './UserAuditLogSelect.schema';
import { UserAuditLogIncludeObjectSchema as UserAuditLogIncludeObjectSchema } from './UserAuditLogInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => UserAuditLogSelectObjectSchema).optional(),
  include: z.lazy(() => UserAuditLogIncludeObjectSchema).optional()
}).strict();
export const UserAuditLogArgsObjectSchema = makeSchema();
export const UserAuditLogArgsObjectZodSchema = makeSchema();
