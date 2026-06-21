import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';
import { Loader2 } from 'lucide-react';

/**
 * Loading spinner — shared by all guards.
 */
function GuardLoader() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

/**
 * ProtectedRoute — Only renders children if authenticated AND email is verified.
 *
 * Guards:
 *   1. Not hydrated → loading spinner
 *   2. Not authenticated → redirect to /auth/login
 *   3. Authenticated but email NOT verified → redirect to /auth/verify-email
 *   4. All good → render children
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isHydrated, user } = useAuthStore();
  const location = useLocation();

  if (!isHydrated) {
    return <GuardLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }

  // Authenticated but email not verified → force verify
  if (user && !user.emailVerified) {
    return (
      <Navigate
        to="/auth/verify-email"
        state={{ userId: user.id, email: user.email }}
        replace
      />
    );
  }

  return <>{children}</>;
}

/**
 * PublicRoute — Only renders children if NOT authenticated.
 * Redirects to dashboard if already authenticated (and verified).
 * Redirects to verify-email if authenticated but not verified.
 */
export function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isHydrated, user } = useAuthStore();

  if (!isHydrated) {
    return <GuardLoader />;
  }

  if (isAuthenticated) {
    // Authenticated but not verified → send to verify page, not dashboard
    if (user && !user.emailVerified) {
      return (
        <Navigate
          to="/auth/verify-email"
          state={{ userId: user.id, email: user.email }}
          replace
        />
      );
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
