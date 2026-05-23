/**
 * Application Router
 * Centralized route configuration with lazy loading and route guards.
 */
import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { ProtectedRoute, PublicRoute } from '@/components/route-guard';
import { AuthLayout } from '@/components/layout/auth-layout';
import { AppLayout } from '@/components/layout/app-layout';

// Lazy-loaded pages
const LandingPage = lazy(() => import('@/pages/landing/index').then((m) => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('@/pages/auth/login').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('@/pages/auth/register').then((m) => ({ default: m.RegisterPage })));
const RestorePage = lazy(() => import('@/pages/auth/restore').then((m) => ({ default: m.RestorePage })));
const SessionExpiredPage = lazy(() => import('@/pages/auth/session-expired').then((m) => ({ default: m.SessionExpiredPage })));
const DashboardPage = lazy(() => import('@/pages/dashboard/index').then((m) => ({ default: m.DashboardPage })));
const AccountSettingsPage = lazy(() => import('@/pages/settings/account').then((m) => ({ default: m.AccountSettingsPage })));
const SecuritySettingsPage = lazy(() => import('@/pages/settings/security').then((m) => ({ default: m.SecuritySettingsPage })));
const NotFoundPage = lazy(() => import('@/pages/not-found').then((m) => ({ default: m.NotFoundPage })));

// Coming soon pages with i18n — loaded eagerly since they're lightweight wrappers
import { ComingSoonFeaturePage } from '@/pages/coming-soon-routes';

function PageLoader() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  );
}

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

export const router = createBrowserRouter([
  // Landing (public)
  {
    path: '/',
    element: (
      <SuspenseWrapper>
        <LandingPage />
      </SuspenseWrapper>
    ),
  },

  // Auth routes (public — redirect if already logged in)
  {
    element: (
      <PublicRoute>
        <SuspenseWrapper>
          <AuthLayout />
        </SuspenseWrapper>
      </PublicRoute>
    ),
    children: [
      { path: 'auth/login', element: <LoginPage /> },
      { path: 'auth/register', element: <RegisterPage /> },
      { path: 'auth/restore', element: <RestorePage /> },
    ],
  },

  // Session expired (public — no guard needed)
  {
    element: (
      <SuspenseWrapper>
        <AuthLayout />
      </SuspenseWrapper>
    ),
    children: [
      { path: 'auth/session-expired', element: <SessionExpiredPage /> },
    ],
  },

  // App routes (protected)
  {
    element: (
      <ProtectedRoute>
        <SuspenseWrapper>
          <AppLayout />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'projects', element: <ComingSoonFeaturePage feature="projects" /> },
      { path: 'instances', element: <ComingSoonFeaturePage feature="instances" /> },
      { path: 'instances/:id', element: <ComingSoonFeaturePage feature="instanceDetails" /> },
      { path: 'analytics', element: <ComingSoonFeaturePage feature="analytics" /> },
      { path: 'billing', element: <ComingSoonFeaturePage feature="billing" /> },
      { path: 'team', element: <ComingSoonFeaturePage feature="team" /> },
      { path: 'activity', element: <ComingSoonFeaturePage feature="activityLogs" /> },
      { path: 'notifications', element: <ComingSoonFeaturePage feature="notifications" /> },
      { path: 'settings', element: <Navigate to="/settings/account" replace /> },
      { path: 'settings/account', element: <AccountSettingsPage /> },
      { path: 'settings/security', element: <SecuritySettingsPage /> },
    ],
  },

  // 404
  {
    path: '*',
    element: (
      <SuspenseWrapper>
        <NotFoundPage />
      </SuspenseWrapper>
    ),
  },
]);
