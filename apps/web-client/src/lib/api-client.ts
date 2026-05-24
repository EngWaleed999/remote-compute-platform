/**
 * Axios API Client — Production-Grade
 *
 * Features:
 * - Automatic CSRF token injection (Double Submit Cookie pattern)
 * - Automatic token refresh on 401 with request queuing
 * - Credentialed requests for HttpOnly cookie auth
 * - Request/Response interceptors for error normalization
 * - Concurrent request handling during refresh
 */
import axios, {
  type AxiosInstance,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios';
import { getCookie } from './utils';
import type { ApiErrorResponse } from '@/types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

// ═══════════════════════════════════════════════════
// Axios Instances
// ═══════════════════════════════════════════════════

// Bare instance — NO interceptors, used ONLY for hydration
export const bareApi: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10_000,
});

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send HttpOnly cookies with every request
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15_000,
});

// ═══════════════════════════════════════════════════
// Request Interceptor — CSRF Token Injection
// ═══════════════════════════════════════════════════

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // Read the csrfToken from the non-HttpOnly cookie
  const csrfToken = getCookie('csrfToken');
  if (csrfToken) {
    config.headers.set('X-CSRF-Token', csrfToken);
  }
  return config;
});

// ═══════════════════════════════════════════════════
// Response Interceptor — Token Refresh + Error Handling
// ═══════════════════════════════════════════════════

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

function processQueue(error: unknown): void {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Only attempt refresh on 401 and not already retrying
    // Skip refresh for login/register/refresh endpoints
    const isAuthEndpoint =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/register') ||
      originalRequest?.url?.includes('/auth/refresh');

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      if (isRefreshing) {
        // Queue this request until refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh tokens
        await api.post('/auth/refresh');
        processQueue(null);
        // Retry the original request with new cookies
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        // Refresh failed — clear auth state ONLY (no redirects)
        // Import dynamically to avoid circular dependency
        const { useAuthStore } = await import('@/store/auth-store');
        useAuthStore.getState().clearAuth();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ═══════════════════════════════════════════════════
// Error Extraction Helper
// ═══════════════════════════════════════════════════

/**
 * Extract a user-friendly error message from an Axios error.
 * Falls back to generic message if the response doesn't match the expected shape.
 */
export function extractApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    if (data?.message) return data.message;
    if (error.response?.status === 429) return 'Too many requests. Please try again later.';
    if (error.response?.status === 403) return 'Access denied.';
    if (error.response?.status === 500) return 'An unexpected server error occurred.';
    if (error.code === 'ERR_NETWORK') return 'Network error. Please check your connection.';
    if (error.code === 'ECONNABORTED') return 'Request timed out. Please try again.';
  }
  return 'An unexpected error occurred.';
}
