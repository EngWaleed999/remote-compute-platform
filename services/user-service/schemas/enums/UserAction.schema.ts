import * as z from 'zod';

export const UserActionSchema = z.enum(['PROFILE_UPDATED', 'PASSWORD_CHANGED', 'EMAIL_CHANGED', 'TWO_FACTOR_ENABLED', 'TWO_FACTOR_DISABLED', 'ACCOUNT_SUSPENDED', 'ACCOUNT_DELETED', 'PRIVACY_SETTINGS_CHANGED'])

export type UserAction = z.infer<typeof UserActionSchema>;