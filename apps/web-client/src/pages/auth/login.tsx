import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useLogin } from '@/hooks/use-auth';
import { useI18n } from '@/lib/i18n';

export function LoginPage() {
  const login = useLogin();
  const location = useLocation();
  const { t } = useI18n();
  const from = (location.state as { from?: string })?.from;

  const loginSchema = z.object({
    email: z.string().email(t('validation.emailRequired')),
    password: z.string().min(1, t('validation.passwordRequired')),
  });

  type LoginForm = z.infer<typeof loginSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: LoginForm) => {
    login.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">{t('auth.welcomeBack')}</h1>
        <p className="text-sm text-muted-foreground">{t('auth.signInDesc')}</p>
      </div>

      {from && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-info/20 bg-info/5 px-4 py-3 text-sm text-info"
        >
          {t('auth.signInRedirect')}
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t('auth.email')}</Label>
          <div className="relative">
            <Mail className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder={t('auth.emailPlaceholder')}
              className="ps-10"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t('auth.password')}</Label>
            <Link
              to="/auth/restore"
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              {t('auth.forgotPassword')}
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder={t('auth.passwordPlaceholder')}
              className="ps-10"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register('password')}
            />
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg" loading={login.isPending}>
          {t('auth.signIn')}
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Button>
      </form>

      <Separator />

      <p className="text-center text-sm text-muted-foreground">
        {t('auth.noAccount')}{' '}
        <Link to="/auth/register" className="font-medium text-primary hover:text-primary/80 transition-colors">
          {t('auth.createAccount')}
        </Link>
      </p>
    </div>
  );
}
