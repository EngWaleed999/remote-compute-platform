/**
 * Coming Soon Feature Pages — Wrapper that reads translations reactively.
 * This ensures language changes are reflected immediately.
 */
import {
  Server,
  FolderKanban,
  CreditCard,
  BarChart3,
  Users,
  Bell,
  Activity,
  Terminal,
} from 'lucide-react';
import { ComingSoonPage } from '@/pages/coming-soon';
import { useI18n } from '@/lib/i18n';
import type { TranslationKey } from '@/lib/i18n/translations';

type Feature = 'projects' | 'instances' | 'instanceDetails' | 'analytics' | 'billing' | 'team' | 'activityLogs' | 'notifications';

const featureConfig: Record<Feature, { titleKey: TranslationKey; descKey: TranslationKey; icon: React.ReactNode }> = {
  projects: { titleKey: 'coming.projects', descKey: 'coming.projectsDesc', icon: <FolderKanban className="h-10 w-10 text-primary" /> },
  instances: { titleKey: 'coming.instances', descKey: 'coming.instancesDesc', icon: <Server className="h-10 w-10 text-primary" /> },
  instanceDetails: { titleKey: 'coming.instanceDetails', descKey: 'coming.instanceDetailsDesc', icon: <Terminal className="h-10 w-10 text-primary" /> },
  analytics: { titleKey: 'coming.analytics', descKey: 'coming.analyticsDesc', icon: <BarChart3 className="h-10 w-10 text-primary" /> },
  billing: { titleKey: 'coming.billing', descKey: 'coming.billingDesc', icon: <CreditCard className="h-10 w-10 text-primary" /> },
  team: { titleKey: 'coming.team', descKey: 'coming.teamDesc', icon: <Users className="h-10 w-10 text-primary" /> },
  activityLogs: { titleKey: 'coming.activityLogs', descKey: 'coming.activityLogsDesc', icon: <Activity className="h-10 w-10 text-primary" /> },
  notifications: { titleKey: 'coming.notifications', descKey: 'coming.notificationsDesc', icon: <Bell className="h-10 w-10 text-primary" /> },
};

export function ComingSoonFeaturePage({ feature }: { feature: Feature }) {
  const { t } = useI18n();
  const config = featureConfig[feature];

  return (
    <ComingSoonPage
      title={t(config.titleKey)}
      description={t(config.descKey)}
      icon={config.icon}
    />
  );
}
