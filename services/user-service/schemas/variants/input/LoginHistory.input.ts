import * as z from 'zod';
// prettier-ignore
export const LoginHistoryInputSchema = z.object({
    id: z.string(),
    userId: z.string(),
    user: z.unknown(),
    success: z.boolean(),
    method: z.string(),
    ipAddress: z.string(),
    userAgent: z.string().optional().nullable(),
    deviceType: z.string().optional().nullable(),
    location: z.string().optional().nullable(),
    failureReason: z.string().optional().nullable(),
    createdAt: z.date()
}).strict();

export type LoginHistoryInputType = z.infer<typeof LoginHistoryInputSchema>;
