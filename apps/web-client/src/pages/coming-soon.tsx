import { motion } from 'framer-motion';
import { Construction, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';

interface ComingSoonProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export function ComingSoonPage({ title, description, icon }: ComingSoonProps) {
  const { t } = useI18n();

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
          {icon ?? <Construction className="h-10 w-10 text-primary" />}
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{description}</p>
        <div className="mt-2 inline-flex items-center rounded-full bg-surface-2 px-3 py-1 text-xs text-muted-foreground">
          <span className="me-1.5 inline-block h-1.5 w-1.5 rounded-full bg-warning animate-pulse" />
          {t('common.inDevelopment')}
        </div>
        <div className="mt-8">
          <Link to="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
              {t('common.backToDashboard')}
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
