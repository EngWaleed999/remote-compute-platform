import * as z from 'zod';

export const UserStatusSchema = z.enum(['ACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION', 'DELETED'])

export type UserStatus = z.infer<typeof UserStatusSchema>;