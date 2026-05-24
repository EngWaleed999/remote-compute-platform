/**
 * Auth Store — Zustand
 *
 * Manages client-side auth state. Tokens are in HttpOnly cookies (not accessible),
 * so this store only tracks the user object and auth status.
 *
 * Auth hydration: On app load, GET /users/me is called. If it succeeds,
 * the user is authenticated. If 401, they're not.
 */
import { create } from 'zustand';
import type { User } from '@/types/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean; // Whether the initial auth check has completed

  setUser: (user: User) => void;
  clearAuth: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isHydrated: false,

  setUser: (user) =>
    set({ user, isAuthenticated: true, isHydrated: true }),

  clearAuth: () =>
    set({ user: null, isAuthenticated: false }),

  setHydrated: () =>
    set({ isHydrated: true }),
}));
