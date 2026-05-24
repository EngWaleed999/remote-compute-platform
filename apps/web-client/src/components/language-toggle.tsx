/**
 * Language Toggle — Switch between English and Arabic with flag icons.
 */
import { motion } from 'framer-motion';
import { Languages } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface LanguageToggleProps {
  className?: string;
}

export function LanguageToggle({ className }: LanguageToggleProps) {
  const { language, setLanguage } = useI18n();

  const toggle = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <button
      onClick={toggle}
      className={cn(
        'relative flex h-8 items-center gap-1.5 rounded-lg px-2.5 transition-colors',
        'hover:bg-accent text-muted-foreground hover:text-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'text-xs font-medium',
        className
      )}
      aria-label={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
    >
      <Languages className="h-3.5 w-3.5" />
      <motion.span
        key={language}
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 8, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {language === 'en' ? 'عربي' : 'EN'}
      </motion.span>
    </button>
  );
}
