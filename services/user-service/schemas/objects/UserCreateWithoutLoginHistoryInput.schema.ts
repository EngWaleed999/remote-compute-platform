import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserRoleSchema } from '../enums/UserRole.schema';
import { UserStatusSchema } from '../enums/UserStatus.schema';
import { UserSessionCreateNestedManyWithoutUserInputObjectSchema as UserSessionCreateNestedManyWithoutUserInputObjectSchema } from './UserSessionCreateNestedManyWithoutUserInput.schema';
import { UserAuditLogCreateNestedManyWithoutUserInputObjectSchema as UserAuditLogCreateNestedManyWithoutUserInputObjectSchema } from './UserAuditLogCreateNestedManyWithoutUserInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  email: z.string(),
  passwordHash: z.string(),
  name: z.string().optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  timezone: z.string().optional(),
  role: UserRoleSchema.optional(),
  status: UserStatusSchema.optional(),
  emailVerified: z.boolean().optional(),
  twoFactorEnabled: z.boolean().optional(),
  twoFactorSecret: z.string().optional().nullable(),
  defaultPaymentMethodId: z.string().optional().nullable(),
  stripeCustomerId: z.string().optional().nullable(),
  lastLoginAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  sessions: z.lazy(() => UserSessionCreateNestedManyWithoutUserInputObjectSchema).optional(),
  auditLogs: z.lazy(() => UserAuditLogCreateNestedManyWithoutUserInputObjectSchema).optional()
}).strict();
export const UserCreateWithoutLoginHistoryInputObjectSchema: z.ZodType<Prisma.UserCreateWithoutLoginHistoryInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateWithoutLoginHistoryInput>;
export const UserCreateWithoutLoginHistoryInputObjectZodSchema = makeSchema();
