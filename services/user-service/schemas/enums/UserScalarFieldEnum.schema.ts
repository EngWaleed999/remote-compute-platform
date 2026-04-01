import * as z from 'zod';

export const UserScalarFieldEnumSchema = z.enum(['id', 'email', 'passwordHash', 'name', 'avatarUrl', 'phone', 'timezone', 'role', 'status', 'emailVerified', 'twoFactorEnabled', 'twoFactorSecret', 'defaultPaymentMethodId', 'stripeCustomerId', 'lastLoginAt', 'createdAt', 'updatedAt', 'deletedAt'])

export type UserScalarFieldEnum = z.infer<typeof UserScalarFieldEnumSchema>;