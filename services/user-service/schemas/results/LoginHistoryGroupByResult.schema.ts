import * as z from 'zod';
export const LoginHistoryGroupByResultSchema = z.array(z.object({
  id: z.string(),
  userId: z.string(),
  success: z.boolean(),
  method: z.string(),
  ipAddress: z.string(),
  userAgent: z.string(),
  deviceType: z.string(),
  location: z.string(),
  failureReason: z.string(),
  createdAt: z.date(),
  _count: z.object({
    id: z.number(),
    userId: z.number(),
    user: z.number(),
    success: z.number(),
    method: z.number(),
    ipAddress: z.number(),
    userAgent: z.number(),
    deviceType: z.number(),
    location: z.number(),
    failureReason: z.number(),
    createdAt: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    userId: z.string().nullable(),
    method: z.string().nullable(),
    ipAddress: z.string().nullable(),
    userAgent: z.string().nullable(),
    deviceType: z.string().nullable(),
    location: z.string().nullable(),
    failureReason: z.string().nullable(),
    createdAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    userId: z.string().nullable(),
    method: z.string().nullable(),
    ipAddress: z.string().nullable(),
    userAgent: z.string().nullable(),
    deviceType: z.string().nullable(),
    location: z.string().nullable(),
    failureReason: z.string().nullable(),
    createdAt: z.date().nullable()
  }).nullable().optional()
}));