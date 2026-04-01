import * as z from 'zod';
export const LoginHistoryUpsertResultSchema = z.object({
  id: z.string(),
  userId: z.string(),
  user: z.unknown(),
  success: z.boolean(),
  method: z.string(),
  ipAddress: z.string(),
  userAgent: z.string().optional(),
  deviceType: z.string().optional(),
  location: z.string().optional(),
  failureReason: z.string().optional(),
  createdAt: z.date()
});