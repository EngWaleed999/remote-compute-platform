import * as z from 'zod';
export const UserSessionFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  userId: z.string(),
  user: z.unknown(),
  token: z.string(),
  refreshToken: z.string(),
  expiresAt: z.date(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  deviceType: z.string().optional(),
  location: z.string().optional(),
  isValid: z.boolean(),
  revokedAt: z.date().optional(),
  revokedReason: z.string().optional(),
  createdAt: z.date(),
  lastUsedAt: z.date()
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