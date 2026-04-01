import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCountOutputTypeCountSessionsArgsObjectSchema as UserCountOutputTypeCountSessionsArgsObjectSchema } from './UserCountOutputTypeCountSessionsArgs.schema';
import { UserCountOutputTypeCountLoginHistoryArgsObjectSchema as UserCountOutputTypeCountLoginHistoryArgsObjectSchema } from './UserCountOutputTypeCountLoginHistoryArgs.schema';
import { UserCountOutputTypeCountAuditLogsArgsObjectSchema as UserCountOutputTypeCountAuditLogsArgsObjectSchema } from './UserCountOutputTypeCountAuditLogsArgs.schema'

const makeSchema = () => z.object({
  sessions: z.union([z.boolean(), z.lazy(() => UserCountOutputTypeCountSessionsArgsObjectSchema)]).optional(),
  loginHistory: z.union([z.boolean(), z.lazy(() => UserCountOutputTypeCountLoginHistoryArgsObjectSchema)]).optional(),
  auditLogs: z.union([z.boolean(), z.lazy(() => UserCountOutputTypeCountAuditLogsArgsObjectSchema)]).optional()
}).strict();
export const UserCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.UserCountOutputTypeSelect>;
export const UserCountOutputTypeSelectObjectZodSchema = makeSchema();
