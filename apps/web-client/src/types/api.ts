// ═══════════════════════════════════════════════════
// API Types — Derived from backend contracts
// ═══════════════════════════════════════════════════

/** User response shape from GET /users/me and auth responses */
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
}

/** UserRole from backend Prisma enum */
export type UserRole = 'USER' | 'ADMIN' | 'OWNER' | 'SUPPORT';

/** UserStatus from backend Prisma enum */
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION' | 'DELETED';

// ═══════════════════════════════════════════════════
// Auth Request / Response Types
// ═══════════════════════════════════════════════════

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface RestoreRequest {
  email: string;
}

export interface ConfirmRestoreRequest {
  email: string;
  newPassword: string;
  code: string;
}

/** Response from POST /auth/login and /auth/register */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

/** Response from POST /auth/refresh */
export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

/** Response from POST /auth/restore/request */
export interface RestoreResponse {
  message: string;
  expiresIn: string;
  devCode?: string;
}

/** Response from POST /auth/restore/confirm */
export interface ConfirmRestoreResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  message: string;
}

/** Update profile request */
export interface UpdateProfileRequest {
  name?: string;
}

// ═══════════════════════════════════════════════════
// Error Types — Matches backend error handler
// ═══════════════════════════════════════════════════

/** Standard API error response shape from backend error handler */
export interface ApiErrorResponse {
  error: string;
  message: string;
  debug_info?: Record<string, unknown>;
}

// ═══════════════════════════════════════════════════
// Generic Types
// ═══════════════════════════════════════════════════

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
