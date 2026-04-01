import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserSessionFindManySchema as UserSessionFindManySchema } from '../findManyUserSession.schema';
import { LoginHistoryFindManySchema as LoginHistoryFindManySchema } from '../findManyLoginHistory.schema';
import { UserAuditLogFindManySchema as UserAuditLogFindManySchema } from '../findManyUserAuditLog.schema';
import { UserCountOutputTypeArgsObjectSchema as UserCountOutputTypeArgsObjectSchema } from './UserCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  sessions: z.union([z.boolean(), z.lazy(() => UserSessionFindManySchema)]).optional(),
  loginHistory: z.union([z.boolean(), z.lazy(() => LoginHistoryFindManySchema)]).optional(),
  auditLogs: z.union([z.boolean(), z.lazy(() => UserAuditLogFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => UserCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const UserIncludeObjectSchema: z.ZodType<Prisma.UserInclude> = makeSchema() as unknown as z.ZodType<Prisma.UserInclude>;
export const UserIncludeObjectZodSchema = makeSchema();
