import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useRegister } from '@/hooks/use-auth';
import { useI18n } from '@/lib/i18n';

export function RegisterPage() {
  const registerMutation = useRegister();
  const { t } = useI18n();

  const registerSchema = z.object({
    name: z.string().min(1, t('validation.nameRequired')).max(100, t('validation.nameTooLong')),
    email: z.string().email(t('validation.emailRequired')),
    password: z.string().min(8, t('validation.passwordMin')),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('validation.passwordsNoMatch'),
    path: ['confirmPassword'],
  });

  type RegisterForm = z.infer<typeof registerSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = (data: RegisterForm) => {
    registerMutation.mutate({
      name: data.name,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">{t('auth.createAccountTitle')}</h1>
        <p className="text-sm text-muted-foreground">{t('auth.createAccountDesc')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t('auth.fullName')}</Label>
          <div className="relative">
            <User className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="name"
              placeholder={t('auth.namePlaceholder')}
              className="ps-10"
              autoComplete="name"
              error={errors.name?.message}
              {...register('name')}
            />
          </div>
        </div>

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
          <Label htmlFor="password">{t('auth.password')}</Label>
          <div className="relative">
            <Lock className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder={t('auth.minPassword')}
              className="ps-10"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register('password')}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
          <div className="relative">
            <Lock className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type="password"
              placeholder={t('auth.confirmPasswordPlaceholder')}
              className="ps-10"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg" loading={registerMutation.isPending}>
          {t('auth.createAccount')}
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground">
        {t('auth.termsText')}{' '}
        <a href="#" className="text-primary hover:underline">{t('auth.termsLink')}</a>
        {' '}{t('auth.and')}{' '}
        <a href="#" className="text-primary hover:underline">{t('auth.privacyLink')}</a>.
      </p>

      <Separator />

      <p className="text-center text-sm text-muted-foreground">
        {t('auth.hasAccount')}{' '}
        <Link to="/auth/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
          {t('auth.signIn')}
        </Link>
      </p>
    </div>
  );
}
