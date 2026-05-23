import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu, Zap, Shield, Globe, Terminal, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageToggle } from '@/components/language-toggle';
import { useI18n } from '@/lib/i18n';
import type { TranslationKey } from '@/lib/i18n/translations';

const featureKeys: { icon: typeof Zap; titleKey: TranslationKey; descKey: TranslationKey }[] = [
  { icon: Zap, titleKey: 'landing.feat.instantDeploy', descKey: 'landing.feat.instantDeployDesc' },
  { icon: Shield, titleKey: 'landing.feat.security', descKey: 'landing.feat.securityDesc' },
  { icon: Globe, titleKey: 'landing.feat.global', descKey: 'landing.feat.globalDesc' },
  { icon: Terminal, titleKey: 'landing.feat.control', descKey: 'landing.feat.controlDesc' },
  { icon: BarChart3, titleKey: 'landing.feat.analytics', descKey: 'landing.feat.analyticsDesc' },
  { icon: Cpu, titleKey: 'landing.feat.workload', descKey: 'landing.feat.workloadDesc' },
];

export function LandingPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Cpu className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">{t('common.appName')}</span>
          </Link>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <Link to="/auth/login">
              <Button variant="ghost">{t('landing.signIn')}</Button>
            </Link>
            <Link to="/auth/register">
              <Button>
                {t('landing.getStarted')}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/5 blur-[120px]" />

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 inline-flex items-center rounded-full border border-border bg-surface-1 px-4 py-1.5 text-sm text-muted-foreground">
              <span className="me-2 inline-block h-2 w-2 rounded-full bg-success animate-pulse" />
              {t('landing.badge')}
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {t('landing.heroTitle1')}
              <br />
              <span className="bg-gradient-to-r from-primary via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {t('landing.heroTitle2')}
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              {t('landing.heroDesc')}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth/register">
                <Button size="lg" className="text-base px-8">
                  {t('landing.startFree')}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="text-base px-8">
                  {t('landing.seeFeatures')}
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Terminal mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 rounded-xl border border-border bg-surface-1 p-1 shadow-2xl shadow-primary/5"
          >
            <div className="rounded-lg bg-[#0d0d0f] p-6 font-mono text-sm text-left" dir="ltr">
              <div className="flex items-center gap-2 mb-4">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <span className="h-3 w-3 rounded-full bg-green-500/80" />
                <span className="ml-3 text-xs text-muted-foreground">terminal</span>
              </div>
              <div className="space-y-1">
                <p><span className="text-success">$</span> <span className="text-foreground">nova deploy --region us-east-1</span></p>
                <p className="text-muted-foreground">Creating instance... <span className="text-success">done</span></p>
                <p className="text-muted-foreground">Provisioning resources... <span className="text-success">done</span></p>
                <p className="text-muted-foreground">Instance ready at <span className="text-primary">nova-abc123.novacpu.dev</span></p>
                <p><span className="text-success">$</span> <span className="text-muted-foreground animate-pulse">▊</span></p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 lg:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight">{t('landing.featuresTitle')}</h2>
            <p className="mt-3 text-muted-foreground">{t('landing.featuresDesc')}</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featureKeys.map((feature, i) => (
              <motion.div
                key={feature.titleKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:bg-surface-1"
              >
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-2.5">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold">{t(feature.titleKey)}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t(feature.descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight">{t('landing.cta')}</h2>
          <p className="mt-3 text-muted-foreground">{t('landing.ctaDesc')}</p>
          <Link to="/auth/register">
            <Button size="lg" className="mt-8 text-base px-8">
              {t('landing.ctaButton')}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Cpu className="h-4 w-4 text-primary" />
            <span>{t('landing.copyright')}</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">{t('landing.privacy')}</a>
            <a href="#" className="hover:text-foreground transition-colors">{t('landing.terms')}</a>
            <a href="#" className="hover:text-foreground transition-colors">{t('landing.status')}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
