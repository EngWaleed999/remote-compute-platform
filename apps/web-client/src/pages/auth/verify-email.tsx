import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, RefreshCw, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVerifyEmail, useResendOtp } from '@/hooks/use-auth';
import { useAuthStore } from '@/store/auth-store';
import { useI18n } from '@/lib/i18n';

export function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useI18n();
  const authUser = useAuthStore((s) => s.user);

  // Resolve userId + email from route state (post-register) or auth store (redirect)
  const routeState = location.state as { userId?: string; email?: string } | null;
  const userId = routeState?.userId || authUser?.id;
  const email = routeState?.email || authUser?.email;

  // Redirect if no userId from any source (direct URL access without being logged in)
  useEffect(() => {
    if (!userId) {
      navigate('/auth/register', { replace: true });
    }
  }, [userId, navigate]);

  const verifyMutation = useVerifyEmail();
  const resendMutation = useResendOtp();

  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [cooldown, setCooldown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Auto-focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Backspace: clear current and go back
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 0) return;

    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i] ?? '';
    }
    setOtp(newOtp);

    // Focus the next empty input or the last one
    const nextEmpty = newOtp.findIndex((d) => !d);
    inputRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();
  };

  const handleSubmit = () => {
    if (!userId) return;
    const code = otp.join('');
    if (code.length !== 6) return;

    verifyMutation.mutate({
      userId,
      enteredOtp: code,
    });
  };

  const handleResend = () => {
    if (!userId || cooldown > 0) return;
    resendMutation.mutate(
      { userId },
      { onSuccess: (data) => setCooldown(data.cooldown || 60) }
    );
  };

  const formatCooldown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m > 0) {
      return `${m}:${s.toString().padStart(2, '0')}`;
    }
    return `${s}s`;
  };

  const isComplete = otp.every((d) => d !== '');

  if (!userId) return null;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2 text-center"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <ShieldCheck className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{t('verify.title')}</h1>
        <p className="text-sm text-muted-foreground">
          {t('verify.desc')}
        </p>
        {email && (
          <p className="text-sm font-medium text-foreground">
            {email}
          </p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center gap-2 rtl:flex-row-reverse"
        onPaste={handlePaste}
      >
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className={
              'h-13 w-11 rounded-lg border border-border bg-card text-center text-xl font-bold text-foreground ' +
              'focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ' +
              'transition-all duration-200 ' +
              (digit ? 'border-primary/50 bg-primary/5' : '')
            }
            aria-label={`Digit ${i + 1}`}
          />
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <Button
          onClick={handleSubmit}
          className="w-full"
          size="lg"
          disabled={!isComplete}
          loading={verifyMutation.isPending}
        >
          {t('verify.verifyButton')}
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Button>

        <div className="flex items-center justify-center gap-2 text-sm">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{t('verify.noCode')}</span>
          <button
            onClick={handleResend}
            disabled={cooldown > 0 || resendMutation.isPending}
            className={
              'font-medium transition-colors ' +
              (cooldown > 0
                ? 'text-muted-foreground cursor-not-allowed'
                : 'text-primary hover:text-primary/80 cursor-pointer')
            }
          >
            {resendMutation.isPending ? (
              <RefreshCw className="inline h-3.5 w-3.5 animate-spin" />
            ) : cooldown > 0 ? (
              `${t('verify.resendIn')} ${formatCooldown(cooldown)}`
            ) : (
              t('verify.resend')
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
