import * as z from 'zod';
// prettier-ignore
export const LoginHistoryResultSchema = z.object({
    id: z.string(),
    userId: z.string(),
    user: z.unknown(),
    success: z.boolean(),
    method: z.string(),
    ipAddress: z.string(),
    userAgent: z.string().nullable(),
    deviceType: z.string().nullable(),
    location: z.string().nullable(),
    failureReason: z.string().nullable(),
    createdAt: z.date()
}).strict();

export type LoginHistoryResultType = z.infer<typeof LoginHistoryResultSchema>;
