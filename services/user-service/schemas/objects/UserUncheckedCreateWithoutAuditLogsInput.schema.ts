import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserRoleSchema } from '../enums/UserRole.schema';
import { UserStatusSchema } from '../enums/UserStatus.schema';
import { UserSessionUncheckedCreateNestedManyWithoutUserInputObjectSchema as UserSessionUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './UserSessionUncheckedCreateNestedManyWithoutUserInput.schema';
import { LoginHistoryUncheckedCreateNestedManyWithoutUserInputObjectSchema as LoginHistoryUncheckedCreateNestedManyWithoutUserInputObjectSchema } from './LoginHistoryUncheckedCreateNestedManyWithoutUserInput.schema'

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
  sessions: z.lazy(() => UserSessionUncheckedCreateNestedManyWithoutUserInputObjectSchema).optional(),
  loginHistory: z.lazy(() => LoginHistoryUncheckedCreateNestedManyWithoutUserInputObjectSchema).optional()
}).strict();
export const UserUncheckedCreateWithoutAuditLogsInputObjectSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutAuditLogsInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUncheckedCreateWithoutAuditLogsInput>;
export const UserUncheckedCreateWithoutAuditLogsInputObjectZodSchema = makeSchema();
