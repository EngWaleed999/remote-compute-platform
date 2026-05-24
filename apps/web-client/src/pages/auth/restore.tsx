import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, KeyRound, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRequestRestore, useConfirmRestore } from '@/hooks/use-auth';
import { useI18n } from '@/lib/i18n';

export function RestorePage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [devCode, setDevCode] = useState<string | undefined>();
  const { t } = useI18n();

  const requestRestore = useRequestRestore();
  const confirmRestore = useConfirmRestore();

  const requestSchema = z.object({
    email: z.string().email(t('validation.emailRequired')),
  });

  const confirmSchema = z.object({
    code: z.string().length(6, t('validation.codeLength')),
    newPassword: z.string().min(8, t('validation.passwordMin')),
    confirmPassword: z.string(),
  }).refine((d) => d.newPassword === d.confirmPassword, {
    message: t('validation.passwordsNoMatch'),
    path: ['confirmPassword'],
  });

  type RequestForm = z.infer<typeof requestSchema>;
  type ConfirmForm = z.infer<typeof confirmSchema>;

  const requestForm = useForm<RequestForm>({
    resolver: zodResolver(requestSchema),
  });

  const confirmForm = useForm<ConfirmForm>({
    resolver: zodResolver(confirmSchema),
  });

  const handleRequest = (data: RequestForm) => {
    requestRestore.mutate(data, {
      onSuccess: (response) => {
        setEmail(data.email);
        setDevCode(response.devCode);
        setStep(2);
      },
    });
  };

  const handleConfirm = (data: ConfirmForm) => {
    confirmRestore.mutate({
      email,
      code: data.code,
      newPassword: data.newPassword,
    });
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">{t('restore.title')}</h1>
              <p className="text-sm text-muted-foreground">{t('restore.desc')}</p>
            </div>

            <form onSubmit={requestForm.handleSubmit(handleRequest)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('restore.emailLabel')}</Label>
                <div className="relative">
                  <Mail className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('auth.emailPlaceholder')}
                    className="ps-10"
                    autoComplete="email"
                    error={requestForm.formState.errors.email?.message}
                    {...requestForm.register('email')}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" loading={requestRestore.isPending}>
                {t('restore.sendCode')}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              <Link to="/auth/login" className="inline-flex items-center gap-1 font-medium text-primary hover:text-primary/80">
                <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" />
                {t('restore.backToSignIn')}
              </Link>
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">{t('restore.enterCode')}</h1>
              <p className="text-sm text-muted-foreground">
                {t('restore.codeSentTo')} <span className="font-medium text-foreground">{email}</span>
              </p>
            </div>

            {devCode && (
              <div className="rounded-lg border border-warning/20 bg-warning/5 px-4 py-3 text-sm">
                <div className="flex items-center gap-2 text-warning">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="font-medium">{t('restore.devMode')}</span>
                </div>
                <p className="mt-1 font-mono text-lg font-bold text-foreground">{devCode}</p>
              </div>
            )}

            <form onSubmit={confirmForm.handleSubmit(handleConfirm)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">{t('restore.codeLabel')}</Label>
                <div className="relative">
                  <KeyRound className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="code"
                    placeholder="XXXXXX"
                    className="ps-10 font-mono text-center tracking-[0.3em] uppercase"
                    maxLength={6}
                    autoComplete="one-time-code"
                    error={confirmForm.formState.errors.code?.message}
                    {...confirmForm.register('code')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">{t('restore.newPassword')}</Label>
                <div className="relative">
                  <Lock className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder={t('auth.minPassword')}
                    className="ps-10"
                    autoComplete="new-password"
                    error={confirmForm.formState.errors.newPassword?.message}
                    {...confirmForm.register('newPassword')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('restore.confirmNew')}</Label>
                <div className="relative">
                  <Lock className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder={t('auth.confirmPasswordPlaceholder')}
                    className="ps-10"
                    autoComplete="new-password"
                    error={confirmForm.formState.errors.confirmPassword?.message}
                    {...confirmForm.register('confirmPassword')}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" loading={confirmRestore.isPending}>
                {t('restore.restoreAccount')}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1 font-medium text-primary hover:text-primary/80"
              >
                <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" />
                {t('restore.tryDifferent')}
              </button>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
