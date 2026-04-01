import * as z from 'zod';
// prettier-ignore
export const UserSessionInputSchema = z.object({
    id: z.string(),
    userId: z.string(),
    user: z.unknown(),
    token: z.string(),
    refreshToken: z.string(),
    expiresAt: z.date(),
    ipAddress: z.string().optional().nullable(),
    userAgent: z.string().optional().nullable(),
    deviceType: z.string().optional().nullable(),
    location: z.string().optional().nullable(),
    isValid: z.boolean(),
    revokedAt: z.date().optional().nullable(),
    revokedReason: z.string().optional().nullable(),
    createdAt: z.date(),
    lastUsedAt: z.date()
}).strict();

export type UserSessionInputType = z.infer<typeof UserSessionInputSchema>;
