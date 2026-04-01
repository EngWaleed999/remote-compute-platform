import * as z from 'zod';
export const UserFindFirstResultSchema = z.nullable(z.object({
  id: z.string(),
  email: z.string(),
  passwordHash: z.string(),
  name: z.string().optional(),
  avatarUrl: z.string().optional(),
  phone: z.string().optional(),
  timezone: z.string(),
  role: z.unknown(),
  status: z.unknown(),
  emailVerified: z.boolean(),
  twoFactorEnabled: z.boolean(),
  twoFactorSecret: z.string().optional(),
  defaultPaymentMethodId: z.string().optional(),
  stripeCustomerId: z.string().optional(),
  sessions: z.array(z.unknown()),
  loginHistory: z.array(z.unknown()),
  auditLogs: z.array(z.unknown()),
  lastLoginAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().optional()
}));