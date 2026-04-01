import * as z from 'zod';

export const UserAuditLogScalarFieldEnumSchema = z.enum(['id', 'userId', 'action', 'description', 'oldValues', 'newValues', 'ipAddress', 'userAgent', 'requestId', 'createdAt'])

export type UserAuditLogScalarFieldEnum = z.infer<typeof UserAuditLogScalarFieldEnumSchema>;