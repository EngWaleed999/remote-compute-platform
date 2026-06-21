/**
 * Auth API Service
 * Typed API calls for all authentication endpoints.
 * Maps 1:1 with backend auth routes.
 */
import { api } from '@/lib/api-client';
import type {
  LoginRequest,
  RegisterRequest,
  RestoreRequest,
  ConfirmRestoreRequest,
  VerifyEmailRequest,
  ResendOtpRequest,
  AuthResponse,
  RestoreResponse,
  ConfirmRestoreResponse,
  RefreshResponse,
  MessageResponse,
  ResendOtpResponse,
} from '@/types/api';

export const authApi = {
  /** POST /auth/register — no CSRF (first interaction) */
  register: (data: RegisterRequest) =>
    api.post<AuthResponse>('/auth/register', data).then((r) => r.data),

  /** POST /auth/login — no CSRF (first interaction) */
  login: (data: LoginRequest) =>
    api.post<AuthResponse>('/auth/login', data).then((r) => r.data),

  /** POST /auth/refresh — CSRF required (auto-injected by interceptor) */
  refresh: () =>
    api.post<RefreshResponse>('/auth/refresh').then((r) => r.data),

  /** POST /auth/logout — CSRF + auth required */
  logout: (sessionId?: string) =>
    api.post('/auth/logout', sessionId ? { sessionId } : {}).then(() => {}),

  /** POST /auth/restore/request — no CSRF */
  requestRestore: (data: RestoreRequest) =>
    api.post<RestoreResponse>('/auth/restore/request', data).then((r) => r.data),

  /** POST /auth/restore/confirm — no CSRF (uses code verification) */
  confirmRestore: (data: ConfirmRestoreRequest) =>
    api.post<ConfirmRestoreResponse>('/auth/restore/confirm', data).then((r) => r.data),

  /** POST /auth/verify-email — no CSRF (public, uses OTP) */
  verifyEmail: (data: VerifyEmailRequest) =>
    api.post<MessageResponse>('/auth/verify-email', data).then((r) => r.data),

  /** POST /auth/resend-otp — no CSRF (public, respects cooldown) */
  resendOtp: (data: ResendOtpRequest) =>
    api.post<ResendOtpResponse>('/auth/resend-otp', data).then((r) => r.data),
};
