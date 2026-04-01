import * as z from 'zod';
import { UserRoleSchema } from '../../enums/UserRole.schema';
import { UserStatusSchema } from '../../enums/UserStatus.schema';
// prettier-ignore
export const UserInputSchema = z.object({
    id: z.string(),
    email: z.string(),
    passwordHash: z.string(),
    name: z.string().optional().nullable(),
    avatarUrl: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    timezone: z.string(),
    role: UserRoleSchema,
    status: UserStatusSchema,
    emailVerified: z.boolean(),
    twoFactorEnabled: z.boolean(),
    twoFactorSecret: z.string().optional().nullable(),
    defaultPaymentMethodId: z.string().optional().nullable(),
    stripeCustomerId: z.string().optional().nullable(),
    sessions: z.array(z.unknown()),
    loginHistory: z.array(z.unknown()),
    auditLogs: z.array(z.unknown()),
    lastLoginAt: z.date().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().optional().nullable()
}).strict();

export type UserInputType = z.infer<typeof UserInputSchema>;
