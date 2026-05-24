/**
 * User Hooks — TanStack Query queries and mutations for user operations.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/services/user-service';
import { useAuthStore } from '@/store/auth-store';
import { extractApiError } from '@/lib/api-client';
import { toast } from 'sonner';
import type { UpdateProfileRequest } from '@/types/api';

/** Query key for user profile */
export const USER_QUERY_KEY = ['user', 'me'] as const;

/**
 * Fetch the current user's profile.
 * Also used for auth hydration on app load.
 */
export function useUser() {
  const setUser = useAuthStore((s) => s.setUser);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const setHydrated = useAuthStore((s) => s.setHydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: async () => {
      try {
        const user = await userApi.getMe();
        setUser(user);
        return user;
      } catch {
        clearAuth();
        return null;
      } finally {
        setHydrated();
      }
    },
    enabled: isAuthenticated,
    retry: false,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Update the current user's profile.
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => userApi.updateMe(data),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.setQueryData(USER_QUERY_KEY, updatedUser);
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      toast.error(extractApiError(error));
    },
  });
}

/**
 * Delete (soft-delete) the current user's account.
 */
export function useDeleteAccount() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => userApi.deleteMe(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      toast.success('Account deleted. You have 30 days to restore it.');
      window.location.href = '/auth/login';
    },
    onError: (error) => {
      toast.error(extractApiError(error));
    },
  });
}
