import * as z from 'zod';
// prettier-ignore
export const UserSessionModelSchema = z.object({
    id: z.string(),
    userId: z.string(),
    user: z.unknown(),
    token: z.string(),
    refreshToken: z.string(),
    expiresAt: z.date(),
    ipAddress: z.string().nullable(),
    userAgent: z.string().nullable(),
    deviceType: z.string().nullable(),
    location: z.string().nullable(),
    isValid: z.boolean(),
    revokedAt: z.date().nullable(),
    revokedReason: z.string().nullable(),
    createdAt: z.date(),
    lastUsedAt: z.date()
}).strict();

export type UserSessionPureType = z.infer<typeof UserSessionModelSchema>;
