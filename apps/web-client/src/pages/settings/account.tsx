import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Save, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser, useUpdateProfile } from '@/hooks/use-user';
import { useAuthStore } from '@/store/auth-store';
import { useI18n } from '@/lib/i18n';
import { useEffect } from 'react';

export function AccountSettingsPage() {
  const { isLoading } = useUser();
  const authUser = useAuthStore((s) => s.user);
  const updateProfile = useUpdateProfile();
  const { t } = useI18n();
  const navigate = useNavigate();

  const profileSchema = z.object({
    name: z.string().min(1, t('validation.nameRequired')).max(100, t('validation.nameTooLong')),
  });

  type ProfileForm = z.infer<typeof profileSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (authUser) {
      reset({ name: authUser.name ?? '' });
    }
  }, [authUser, reset]);

  const onSubmit = (data: ProfileForm) => {
    updateProfile.mutate({ name: data.name });
  };

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight">{t('settings.account')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t('settings.accountDesc')}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              {t('settings.profile')}
            </CardTitle>
            <CardDescription>{t('settings.profileDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
               <div className="space-y-2">
                  <Label htmlFor="email">{t('auth.email')}</Label>
                  <div className="relative">
                    <Mail className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      value={authUser?.email ?? ''}
                      disabled
                      className="ps-10 opacity-60"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{t('settings.emailNoChange')}</p>
                    {authUser?.emailVerified ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" />
                        {t('settings.emailVerified')}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => navigate('/auth/verify-email')}
                        className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-colors cursor-pointer"
                      >
                        <AlertTriangle className="h-3 w-3" />
                        {t('settings.emailNotVerified')}
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">{t('settings.displayName')}</Label>
                  <Input
                    id="name"
                    placeholder={t('settings.displayNamePlaceholder')}
                    error={errors.name?.message}
                    {...register('name')}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button type="submit" loading={updateProfile.isPending} disabled={!isDirty}>
                  <Save className="h-4 w-4" />
                  {t('common.save')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.accountInfo')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('settings.accountId')}</span>
              <span className="font-mono text-xs">{authUser?.id}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('settings.memberSince')}</span>
              <span>{authUser?.createdAt ? new Date(authUser.createdAt).toLocaleDateString() : '—'}</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
