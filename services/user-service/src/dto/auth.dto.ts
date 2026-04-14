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

/** Refresh request body — { refreshToken } */
export type RefreshRequestDto = components['schemas']['RefreshRequest'];

// ═══════════════════════════════════════════════════
// 2️⃣ Response Types (from OpenAPI)
// ═══════════════════════════════════════════════════

/** Auth response — { accessToken, refreshToken, user } */
export type AuthResponseDto = components['schemas']['AuthResponse'];

/** Refresh response — { accessToken, refreshToken } */
export type RefreshResponseDto =
  paths['/auth/refresh']['post']['responses']['200']['content']['application/json'];

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
