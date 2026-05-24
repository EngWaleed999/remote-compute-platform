/**
 * App Component
 * Root component that sets up all providers and auth hydration.
 *
 * Auth hydration strategy:
 * - On mount, call GET /users/me
 * - If it succeeds → user is authenticated (cookies are valid)
 * - If it fails with 401 → user is not authenticated
 * - Until hydration completes, route guards show a loading spinner
 */
import { useEffect, useRef } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { queryClient } from '@/lib/query-client';
import { router } from '@/router';
import { useAuthStore } from '@/store/auth-store';
import { bareApi } from '@/lib/api-client';

function AuthHydration({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const setHydrated = useAuthStore((s) => s.setHydrated);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const hydrationStarted = useRef(false);

  useEffect(() => {
    if (isHydrated || hydrationStarted.current) return;
    hydrationStarted.current = true;

    async function hydrate() {
      try {
        const { data } = await bareApi.get('/users/me');
        setUser(data);
      } catch {
        // Do NOTHING. No clearAuth, no redirect. State is already clean.
      } finally {
        setHydrated();
      }
    }

    hydrate();
  }, [isHydrated, setUser, setHydrated]);

  return <>{children}</>;
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthHydration>
        <RouterProvider router={router} />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-foreground)',
            },
          }}
          richColors
          closeButton
        />
      </AuthHydration>
    </QueryClientProvider>
  );
}
