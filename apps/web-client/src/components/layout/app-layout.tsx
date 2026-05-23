/**
 * App Layout — Main dashboard shell with sidebar + header.
 * Responsive: sidebar collapses to a mobile drawer.
 * Includes theme toggle, language toggle, and i18n support.
 */
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FolderKanban,
  Server,
  CreditCard,
  BarChart3,
  Settings,
  Shield,
  Users,
  Bell,
  Activity,
  LogOut,
  Menu,
  X,
  Cpu,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageToggle } from '@/components/language-toggle';
import { useAuthStore } from '@/store/auth-store';
import { useLogout } from '@/hooks/use-auth';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import type { TranslationKey } from '@/lib/i18n/translations';

interface NavItem {
  labelKey: TranslationKey;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

function NavLink({ item, onClick }: { item: NavItem; onClick?: () => void }) {
  const location = useLocation();
  const { t } = useI18n();
  const isActive = location.pathname === item.href;

  return (
    <Link
      to={item.href}
      onClick={onClick}
      className={cn(
        'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
      )}
    >
      <span className={cn('transition-colors', isActive && 'text-primary')}>{item.icon}</span>
      <span className="flex-1">{t(item.labelKey)}</span>
      {item.badge && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
          {item.badge}
        </span>
      )}
      {isActive && <ChevronRight className="h-3.5 w-3.5 text-primary opacity-50 rtl:rotate-180" />}
    </Link>
  );
}

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const { t } = useI18n();

  const mainNav: NavItem[] = [
    { labelKey: 'nav.dashboard', href: '/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { labelKey: 'nav.projects', href: '/projects', icon: <FolderKanban className="h-4 w-4" /> },
    { labelKey: 'nav.instances', href: '/instances', icon: <Server className="h-4 w-4" /> },
    { labelKey: 'nav.analytics', href: '/analytics', icon: <BarChart3 className="h-4 w-4" /> },
    { labelKey: 'nav.billing', href: '/billing', icon: <CreditCard className="h-4 w-4" /> },
  ];

  const secondaryNav: NavItem[] = [
    { labelKey: 'nav.team', href: '/team', icon: <Users className="h-4 w-4" /> },
    { labelKey: 'nav.activity', href: '/activity', icon: <Activity className="h-4 w-4" /> },
    { labelKey: 'nav.notifications', href: '/notifications', icon: <Bell className="h-4 w-4" />, badge: '3' },
  ];

  const settingsNav: NavItem[] = [
    { labelKey: 'nav.account', href: '/settings/account', icon: <Settings className="h-4 w-4" /> },
    { labelKey: 'nav.security', href: '/settings/security', icon: <Shield className="h-4 w-4" /> },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Cpu className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-lg font-bold tracking-tight">{t('common.appName')}</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          {t('nav.platform')}
        </p>
        {mainNav.map((item) => (
          <NavLink key={item.href} item={item} onClick={() => setSidebarOpen(false)} />
        ))}

        <Separator className="my-4" />

        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          {t('nav.workspace')}
        </p>
        {secondaryNav.map((item) => (
          <NavLink key={item.href} item={item} onClick={() => setSidebarOpen(false)} />
        ))}

        <Separator className="my-4" />

        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          {t('nav.settings')}
        </p>
        {settingsNav.map((item) => (
          <NavLink key={item.href} item={item} onClick={() => setSidebarOpen(false)} />
        ))}
      </nav>

      {/* Theme & Language Controls */}
      <div className="flex items-center justify-center gap-1 px-4 py-2 border-t border-border">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      {/* User section */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3 rounded-lg px-2 py-1.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
            {user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="flex-1 truncate">
            <p className="truncate text-sm font-medium">{user?.name ?? 'User'}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => logout.mutate()}
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-shrink-0 border-e border-border bg-surface-1 lg:block">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 start-0 z-50 w-72 border-e border-border bg-surface-1 lg:hidden"
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute end-3 top-4 z-10"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top header (mobile) */}
        <header className="flex h-14 items-center gap-4 border-b border-border bg-surface-1 px-4 lg:hidden">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-primary" />
            <span className="font-bold">{t('common.appName')}</span>
          </div>
          <div className="ms-auto flex items-center gap-1">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
