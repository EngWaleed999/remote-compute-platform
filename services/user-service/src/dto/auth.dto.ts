/**
 * Auth DTOs + Zod Validation Schemas
 *
 * Type strategy:
 * - Request types: derived directly from OpenAPI api-schema.d.ts paths
 * - Response types: derived from OpenAPI components (AuthResponse)
 * - Validation schemas: custom Zod schemas with business rules (min password length, email format)
 *
 * We do NOT duplicate types that already exist in the generated OpenAPI types.
 */
import { z } from 'zod';
import type { paths, components } from '@repo/shared-types';

// ═══════════════════════════════════════════════════
// 1️⃣ Request Types (from OpenAPI paths)
// ═══════════════════════════════════════════════════

/** Register request body — { email, password, name } */
export type RegisterRequestDto =
  paths['/auth/register']['post']['requestBody']['content']['application/json'];

/** Login request body — { email, password } */
export type LoginRequestDto =
  paths['/auth/login']['post']['requestBody']['content']['application/json'];

/** Verify Email request body — { userId, enteredOtp } */
export type VerifyEmailRequestDto =
  paths['/auth/verify-email']['post']['requestBody']['content']['application/json'];

/** Refresh request body — { refreshToken } */
export type RefreshRequestDto = components['schemas']['RefreshRequest'];

/** Restore Request request body - { email }  */
export type RestoreRequestDto =
  paths['/auth/restore/request']['post']['requestBody']['content']['application/json'];

/** Confim Request request body - { email ,newPassword, code? }  */
export type ConfirmRequestDto =
  paths['/auth/restore/confirm']['post']['requestBody']['content']['application/json'];

// ═══════════════════════════════════════════════════
// 2️⃣ Response Types (from OpenAPI)
// ═══════════════════════════════════════════════════

/** Auth response — { accessToken, refreshToken, user } */
export type AuthResponseDto = components['schemas']['AuthResponse'];

/** Refresh response — { accessToken, refreshToken } */
export type RefreshResponseDto =
  paths['/auth/refresh']['post']['responses']['200']['content']['application/json'];

/** Restore Request response - {  message , expiresIn, devCode} */
export type RestoreResponseDto =
  paths['/auth/restore/request']['post']['responses']['200']['content']['application/json'];

/** Confirm Response response - {email, code , newPassword} */
export type ConfirmResponseDto =
  paths['/auth/restore/confirm']['post']['responses']['200']['content']['application/json'];
// ═══════════════════════════════════════════════════
// 3️⃣ Zod Validation Schemas (business rules)
// ═══════════════════════════════════════════════════

/** Registration input validation */
export const registerSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email format')
    .toLowerCase()
    .trim(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters'),
  name: z
    .string({ required_error: 'Name is required' })
    .min(1, 'Name cannot be empty')
    .max(100, 'Name is too long')
    .trim(),
});

/** Verify Email input validation */
export const verifyEmailSchema = z.object({
  userId: z.string({ required_error: 'User ID is required' }).uuid('Invalid User ID format'),
  enteredOtp: z.string({ required_error: 'OTP is required' }).length(6, 'OTP must be exactly 6 digits'),
}) satisfies z.ZodType<VerifyEmailRequestDto>;

/** Login input validation */
export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email format')
    .toLowerCase()
    .trim(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required'),
});

/** Refresh token input validation */
export const refreshSchema = z.object({
  refreshToken: z
    .string({ required_error: 'Refresh token is required' })
    .min(1, 'Refresh token is required'),
});

/** Restore request input validation — POST /auth/restore/request */
export const restoreRequestSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email format')
    .toLowerCase()
    .trim(),
});

/** Confirm restore input validation — POST /auth/restore/confirm */
export const confirmRestoreSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email format')
    .toLowerCase()
    .trim(),

  newPassword: z
    .string({ required_error: 'New password is required' })
    .min(8, 'Password must be at least 8 characters'),

  code: z
    .string()
    .min(6, 'Code must be exactly 6 characters')
    .max(6, 'Code must be exactly 6 characters'),
});

// ═══════════════════════════════════════════════════
// 4️⃣ Request Metadata (for login history tracking)
// ═══════════════════════════════════════════════════

/** Metadata extracted from the HTTP request for security logging
 * use it in
 * loggin : where the user come from / country
 * Security: Detect suspicious login attempts
 * Analytics: how many users use Android or Ios
 * Ratelimiting
 */
export interface RequestMeta {
  ipAddress: string;
  userAgent?: string;
  deviceType?: string;
}
