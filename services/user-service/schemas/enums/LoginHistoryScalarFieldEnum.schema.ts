import * as z from 'zod';

export const LoginHistoryScalarFieldEnumSchema = z.enum(['id', 'userId', 'success', 'method', 'ipAddress', 'userAgent', 'deviceType', 'location', 'failureReason', 'createdAt'])

export type LoginHistoryScalarFieldEnum = z.infer<typeof LoginHistoryScalarFieldEnumSchema>;