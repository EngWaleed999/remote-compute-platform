/**
 * User DTOs + Zod Validation Schemas
 *
 * Type strategy:
 * - Response type: derived from OpenAPI components['schemas']['User']
 * - Update request: derived from OpenAPI PATCH /users/me body
 * - Validation: custom Zod schema for profile updates
 */
import { z } from 'zod';
import type { components, paths } from '@repo/shared-types';

// ═══════════════════════════════════════════════════
// 1️⃣ Response Types (from OpenAPI)
// ═══════════════════════════════════════════════════

/** Public user response — { id, email, name, createdAt } */
export type UserResponseDto = components['schemas']['User'];

// ═══════════════════════════════════════════════════
// 2️⃣ Request Types (from OpenAPI)
// ═══════════════════════════════════════════════════

/** Update profile request body — { name? } */
export type UpdateProfileRequestDto =
  paths['/users/me']['patch']['requestBody']['content']['application/json'];

// ═══════════════════════════════════════════════════
// 3️⃣ Zod Validation Schemas
// ═══════════════════════════════════════════════════

/** Profile update input validation */
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(1, 'Name cannot be empty')
    .max(100, 'Name is too long')
    .trim()
    .optional(),
});
