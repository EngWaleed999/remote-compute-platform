import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';
import { Loader2 } from 'lucide-react';

/**
 * ProtectedRoute — Only renders children if authenticated.
 * Redirects to login with return URL if not authenticated.
 * Shows loading spinner while auth is hydrating.
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isHydrated } = useAuthStore();
  const location = useLocation();

  // Show loading while auth hydration is in progress
  if (!isHydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}

/**
 * PublicRoute — Only renders children if NOT authenticated.
 * Redirects to dashboard if already authenticated.
 */
export function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isHydrated } = useAuthStore();

  if (!isHydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
