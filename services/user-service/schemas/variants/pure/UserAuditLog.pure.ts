import * as z from 'zod';
import { UserActionSchema } from '../../enums/UserAction.schema';
// prettier-ignore
export const UserAuditLogModelSchema = z.object({
    id: z.string(),
    userId: z.string(),
    user: z.unknown(),
    action: UserActionSchema,
    description: z.string().nullable(),
    oldValues: z.unknown().nullable(),
    newValues: z.unknown().nullable(),
    ipAddress: z.string().nullable(),
    userAgent: z.string().nullable(),
    requestId: z.string().nullable(),
    createdAt: z.date()
}).strict();

export type UserAuditLogPureType = z.infer<typeof UserAuditLogModelSchema>;
