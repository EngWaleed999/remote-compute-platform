import * as z from 'zod';
export const UserAuditLogUpsertResultSchema = z.object({
  id: z.string(),
  userId: z.string(),
  user: z.unknown(),
  action: z.unknown(),
  description: z.string().optional(),
  oldValues: z.unknown().optional(),
  newValues: z.unknown().optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  requestId: z.string().optional(),
  createdAt: z.date()
});