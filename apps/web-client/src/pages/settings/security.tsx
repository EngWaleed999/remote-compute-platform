import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Trash2, AlertTriangle, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useDeleteAccount } from '@/hooks/use-user';
import { useLogout } from '@/hooks/use-auth';
import { useI18n } from '@/lib/i18n';

export function SecuritySettingsPage() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const deleteAccount = useDeleteAccount();
  const logout = useLogout();
  const { t } = useI18n();

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight">{t('security.title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t('security.desc')}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              {t('security.activeSessions')}
            </CardTitle>
            <CardDescription>{t('security.activeSessionsDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border bg-surface-1 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{t('security.currentSession')}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t('security.currentSessionDesc')}</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">
                  {t('security.active')}
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => logout.mutate()}
              loading={logout.isPending}
            >
              <LogOut className="h-4 w-4" />
              {t('security.signOutAll')}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card>
          <CardHeader>
            <CardTitle>{t('security.password')}</CardTitle>
            <CardDescription>{t('security.passwordDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border bg-surface-1 p-4 text-center">
              <p className="text-sm text-muted-foreground">
                {t('security.passwordNotAvailable')}
                {' '}
                <span className="text-foreground font-medium">{t('security.comingSoon')}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              {t('security.dangerZone')}
            </CardTitle>
            <CardDescription>{t('security.dangerDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">{t('security.deleteAccount')}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t('security.deleteAccountDesc')}</p>
                </div>
                {!showDeleteConfirm ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="shrink-0"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <Trash2 className="h-4 w-4" />
                    {t('security.deleteAccount')}
                  </Button>
                ) : (
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                      {t('common.cancel')}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      loading={deleteAccount.isPending}
                      onClick={() => deleteAccount.mutate()}
                    >
                      {t('security.confirmDelete')}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <p className="text-xs text-muted-foreground">{t('security.deleteNote')}</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
