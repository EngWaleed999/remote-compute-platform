import * as z from 'zod';
import { UserRoleSchema } from '../../enums/UserRole.schema';
import { UserStatusSchema } from '../../enums/UserStatus.schema';
// prettier-ignore
export const UserModelSchema = z.object({
    id: z.string(),
    email: z.string(),
    passwordHash: z.string(),
    name: z.string().nullable(),
    avatarUrl: z.string().nullable(),
    phone: z.string().nullable(),
    timezone: z.string(),
    role: UserRoleSchema,
    status: UserStatusSchema,
    emailVerified: z.boolean(),
    twoFactorEnabled: z.boolean(),
    twoFactorSecret: z.string().nullable(),
    defaultPaymentMethodId: z.string().nullable(),
    stripeCustomerId: z.string().nullable(),
    sessions: z.array(z.unknown()),
    loginHistory: z.array(z.unknown()),
    auditLogs: z.array(z.unknown()),
    lastLoginAt: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable()
}).strict();

export type UserPureType = z.infer<typeof UserModelSchema>;
