import * as z from 'zod';
// prettier-ignore
export const LoginHistoryModelSchema = z.object({
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

export type LoginHistoryPureType = z.infer<typeof LoginHistoryModelSchema>;
