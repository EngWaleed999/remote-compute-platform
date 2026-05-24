/**
 * Auth Layout — Full-screen centered layout for login/register/restore pages.
 * Features a split-screen design with branding on left, form on right.
 * Includes theme and language toggles.
 */
import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageToggle } from '@/components/language-toggle';
import { useI18n } from '@/lib/i18n';

export function AuthLayout() {
  const { t } = useI18n();

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left Panel — Branding */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-surface-1 p-12">
        {/* Gradient background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Cpu className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">{t('common.appName')}</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-4">
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-3"
          >
            <p className="text-2xl font-medium leading-relaxed text-foreground/90">
              {t('landing.quote')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('landing.quoteDesc')}
            </p>
          </motion.blockquote>
        </div>

        <div className="relative z-10">
          <p className="text-xs text-muted-foreground">
            {t('landing.copyright')}
          </p>
        </div>
      </div>

      {/* Right Panel — Auth Form */}
      <div className="relative flex items-center justify-center p-6 sm:p-12">
        {/* Top-right controls */}
        <div className="absolute top-4 end-4 flex items-center gap-1">
          <LanguageToggle />
          <ThemeToggle />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-[420px] space-y-6"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-3 lg:hidden mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Cpu className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">{t('common.appName')}</span>
          </div>

          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
