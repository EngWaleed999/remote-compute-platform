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
import type { LoginRequest, RegisterRequest, RestoreRequest, ConfirmRestoreRequest, VerifyEmailRequest, ResendOtpRequest, UpdateEmailRequest } from '@/types/api';

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
      toast.success('Account created! Please verify your email.');
      navigate('/auth/verify-email', { state: { userId: data.user.id, email: data.user.email }, replace: true });
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

export function useVerifyEmail() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: (data: VerifyEmailRequest) => authApi.verifyEmail(data),
    onSuccess: (data) => {
      // Update local state so ProtectedRoute allows entry
      if (user) {
        setUser({ ...user, emailVerified: true });
      }
      toast.success(data.message);
      navigate('/dashboard', { replace: true });
    },
    onError: (error) => {
      toast.error(extractApiError(error));
    },
  });
}

export function useResendOtp() {
  return useMutation({
    mutationFn: (data: ResendOtpRequest) => authApi.resendOtp(data),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(extractApiError(error));
    },
  });
}

export function useUpdateEmail() {
  const setUser = useAuthStore((s) => s.setUser);
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: (data: UpdateEmailRequest) => authApi.updateEmail(data),
    onSuccess: (data) => {
      // Update local auth store with new email
      if (user) {
        setUser({ ...user, email: data.email });
      }
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(extractApiError(error));
    },
  });
}
