import { motion } from 'framer-motion';
import {
  Server,
  Activity,
  CreditCard,
  ArrowUpRight,
  Cpu,
  HardDrive,
  Wifi,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth-store';
import { useI18n } from '@/lib/i18n';
import { Link } from 'react-router-dom';
import type { TranslationKey } from '@/lib/i18n/translations';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { t } = useI18n();

  const stats: { labelKey: TranslationKey; value: string; icon: typeof Server; changeKey: TranslationKey; color: string }[] = [
    { labelKey: 'dashboard.activeInstances', value: '0', icon: Server, changeKey: 'dashboard.noInstances', color: 'text-primary' },
    { labelKey: 'dashboard.cpuUsage', value: '0%', icon: Cpu, changeKey: 'dashboard.idle', color: 'text-success' },
    { labelKey: 'dashboard.storage', value: '0 GB', icon: HardDrive, changeKey: 'dashboard.used', color: 'text-warning' },
    { labelKey: 'dashboard.network', value: '0 Mbps', icon: Wifi, changeKey: 'dashboard.noTraffic', color: 'text-info' },
  ];

  const quickActions: { labelKey: TranslationKey; href: string; icon: string }[] = [
    { labelKey: 'dashboard.createProject', href: '/projects', icon: '📁' },
    { labelKey: 'dashboard.deployInstance', href: '/instances', icon: '🖥️' },
    { labelKey: 'dashboard.setupBilling', href: '/billing', icon: '💳' },
    { labelKey: 'dashboard.inviteTeam', href: '/team', icon: '👥' },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t('dashboard.welcomeBack')} {user?.name?.split(' ')[0] ?? ''}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{t('dashboard.overview')}</p>
        </div>
        <Link to="/instances">
          <Button>
            {t('dashboard.deploy')}
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat) => (
          <motion.div key={stat.labelKey} variants={itemVariants}>
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t(stat.labelKey)}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{t(stat.changeKey)}</p>
              </CardContent>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent pointer-events-none" />
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={itemVariants} initial="hidden" animate="show">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                {t('dashboard.quickStart')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  to={action.href}
                  className="flex items-center gap-3 rounded-lg border border-border bg-surface-1 px-4 py-3 text-sm transition-all hover:bg-surface-2 hover:border-primary/30 group"
                >
                  <span className="text-lg">{action.icon}</span>
                  <span className="flex-1 font-medium">{t(action.labelKey)}</span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} initial="hidden" animate="show">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                {t('dashboard.recentActivity')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-surface-2 p-4 mb-4">
                  <Activity className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">{t('dashboard.noActivity')}</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">{t('dashboard.noActivityDesc')}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Usage Overview */}
      <motion.div variants={itemVariants} initial="hidden" animate="show">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              {t('dashboard.currentUsage')}
            </CardTitle>
            <Link to="/billing">
              <Button variant="ghost" size="sm">{t('dashboard.viewBilling')}</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-sm text-muted-foreground">{t('dashboard.noUsage')}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
