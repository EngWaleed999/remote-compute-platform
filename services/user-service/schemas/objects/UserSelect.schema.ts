import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserSessionFindManySchema as UserSessionFindManySchema } from '../findManyUserSession.schema';
import { LoginHistoryFindManySchema as LoginHistoryFindManySchema } from '../findManyLoginHistory.schema';
import { UserAuditLogFindManySchema as UserAuditLogFindManySchema } from '../findManyUserAuditLog.schema';
import { UserCountOutputTypeArgsObjectSchema as UserCountOutputTypeArgsObjectSchema } from './UserCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  email: z.boolean().optional(),
  passwordHash: z.boolean().optional(),
  name: z.boolean().optional(),
  avatarUrl: z.boolean().optional(),
  phone: z.boolean().optional(),
  timezone: z.boolean().optional(),
  role: z.boolean().optional(),
  status: z.boolean().optional(),
  emailVerified: z.boolean().optional(),
  twoFactorEnabled: z.boolean().optional(),
  twoFactorSecret: z.boolean().optional(),
  defaultPaymentMethodId: z.boolean().optional(),
  stripeCustomerId: z.boolean().optional(),
  sessions: z.union([z.boolean(), z.lazy(() => UserSessionFindManySchema)]).optional(),
  loginHistory: z.union([z.boolean(), z.lazy(() => LoginHistoryFindManySchema)]).optional(),
  auditLogs: z.union([z.boolean(), z.lazy(() => UserAuditLogFindManySchema)]).optional(),
  lastLoginAt: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  deletedAt: z.boolean().optional(),
  _count: z.union([z.boolean(), z.lazy(() => UserCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const UserSelectObjectSchema: z.ZodType<Prisma.UserSelect> = makeSchema() as unknown as z.ZodType<Prisma.UserSelect>;
export const UserSelectObjectZodSchema = makeSchema();
