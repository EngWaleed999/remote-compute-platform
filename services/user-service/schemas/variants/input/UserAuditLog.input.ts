import * as z from 'zod';
import { UserActionSchema } from '../../enums/UserAction.schema';
// prettier-ignore
export const UserAuditLogInputSchema = z.object({
    id: z.string(),
    userId: z.string(),
    user: z.unknown(),
    action: UserActionSchema,
    description: z.string().optional().nullable(),
    oldValues: z.unknown().optional().nullable(),
    newValues: z.unknown().optional().nullable(),
    ipAddress: z.string().optional().nullable(),
    userAgent: z.string().optional().nullable(),
    requestId: z.string().optional().nullable(),
    createdAt: z.date()
}).strict();

export type UserAuditLogInputType = z.infer<typeof UserAuditLogInputSchema>;
