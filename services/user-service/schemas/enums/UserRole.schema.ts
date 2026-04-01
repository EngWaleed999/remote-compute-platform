import * as z from 'zod';

export const UserRoleSchema = z.enum(['USER', 'ADMIN', 'OWNER', 'SUPPORT'])

export type UserRole = z.infer<typeof UserRoleSchema>;