import * as z from 'zod';
export const LoginHistoryFindManyResultSchema = z.object({
  data: z.array(z.object({
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