import * as z from 'zod';

export const UserSessionScalarFieldEnumSchema = z.enum(['id', 'userId', 'token', 'refreshToken', 'expiresAt', 'ipAddress', 'userAgent', 'deviceType', 'location', 'isValid', 'revokedAt', 'revokedReason', 'createdAt', 'lastUsedAt'])

export type UserSessionScalarFieldEnum = z.infer<typeof UserSessionScalarFieldEnumSchema>;