import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';

export function SessionExpiredPage() {
  const { t } = useI18n();

  return (
    <div className="space-y-6 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-warning/10"
      >
        <ShieldAlert className="h-8 w-8 text-warning" />
      </motion.div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">{t('session.expired')}</h1>
        <p className="text-sm text-muted-foreground">{t('session.expiredDesc')}</p>
      </div>

      <Link to="/auth/login">
        <Button size="lg" className="w-full">
          {t('session.signInAgain')}
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Button>
      </Link>
    </div>
  );
}
