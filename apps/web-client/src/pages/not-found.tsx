import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';

export function NotFoundPage() {
  const { t } = useI18n();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-surface-2">
          <SearchX className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-6xl font-bold tracking-tight text-foreground">{t('notFound.title')}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{t('notFound.desc')}</p>
        <Link to="/dashboard">
          <Button className="mt-8" size="lg">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t('common.backToDashboard')}
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
