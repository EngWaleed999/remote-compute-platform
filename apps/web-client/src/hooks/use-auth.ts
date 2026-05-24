/**
 * Auth Hooks — TanStack Query mutations for auth operations.
 * Handles auth state updates after successful mutations.
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/services/auth-service';
import { useAuthStore } from '@/store/auth-store';
import { extractApiError } from '@/lib/api-client';
import { toast } from 'sonner';
import type { LoginRequest, RegisterRequest, RestoreRequest, ConfirmRestoreRequest } from '@/types/api';

export function useLogin() {
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (data) => {
      setUser(data.user);
      toast.success('Welcome back!');
      navigate('/dashboard', { replace: true });
    },
    onError: (error) => {
      toast.error(extractApiError(error));
    },
  });
}

export function useRegister() {
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (data) => {
      setUser(data.user);
      toast.success('Account created successfully!');
      navigate('/dashboard', { replace: true });
    },
    onError: (error) => {
      toast.error(extractApiError(error));
    },
  });
}

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      navigate('/auth/login', { replace: true });
    },
    onError: () => {
      // Force logout even if API call fails
      clearAuth();
      queryClient.clear();
      navigate('/auth/login', { replace: true });
    },
  });
}

export function useRequestRestore() {
  return useMutation({
    mutationFn: (data: RestoreRequest) => authApi.requestRestore(data),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(extractApiError(error));
    },
  });
}

export function useConfirmRestore() {
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: ConfirmRestoreRequest) => authApi.confirmRestore(data),
    onSuccess: (data) => {
      setUser(data.user);
      toast.success(data.message);
      navigate('/dashboard', { replace: true });
    },
    onError: (error) => {
      toast.error(extractApiError(error));
    },
  });
}
