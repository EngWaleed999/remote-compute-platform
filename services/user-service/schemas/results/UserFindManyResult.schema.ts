import * as z from 'zod';
export const UserFindManyResultSchema = z.object({
  data: z.array(z.object({
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
})),
  pagination: z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean()
})
});