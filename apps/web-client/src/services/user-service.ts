/**
 * User API Service
 * Typed API calls for user management endpoints.
 */
import { api } from '@/lib/api-client';
import type { User, UpdateProfileRequest } from '@/types/api';

export const userApi = {
  /** GET /users/me — requires auth (no CSRF for safe methods) */
  getMe: () => api.get<User>('/users/me').then((r) => r.data),

  /** PATCH /users/me — requires auth + CSRF */
  updateMe: (data: UpdateProfileRequest) =>
    api.patch<User>('/users/me', data).then((r) => r.data),

  /** DELETE /users/me — requires auth + CSRF */
  deleteMe: () => api.delete('/users/me').then(() => {}),
};
