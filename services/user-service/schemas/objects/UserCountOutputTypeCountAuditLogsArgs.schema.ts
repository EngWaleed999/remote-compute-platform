import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserAuditLogWhereInputObjectSchema as UserAuditLogWhereInputObjectSchema } from './UserAuditLogWhereInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserAuditLogWhereInputObjectSchema).optional()
}).strict();
export const UserCountOutputTypeCountAuditLogsArgsObjectSchema = makeSchema();
export const UserCountOutputTypeCountAuditLogsArgsObjectZodSchema = makeSchema();
