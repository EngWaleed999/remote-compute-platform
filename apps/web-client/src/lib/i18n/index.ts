/**
 * i18n Store — Zustand
 * Manages language state + provides translation function.
 * Persists language choice in localStorage.
 * Automatically applies RTL direction for Arabic.
 */
import { create } from 'zustand';
import { translations, type Language, type TranslationKey } from './translations';

interface I18nState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  isRTL: boolean;
}

function getInitialLanguage(): Language {
  const saved = localStorage.getItem('novacpu-lang');
  if (saved === 'ar' || saved === 'en') return saved;
  // Detect browser language
  const browserLang = navigator.language.startsWith('ar') ? 'ar' : 'en';
  return browserLang;
}

function applyDirection(lang: Language) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = lang;
  // Add font for Arabic
  if (lang === 'ar') {
    document.documentElement.style.fontFamily = '"IBM Plex Sans Arabic", "Inter", system-ui, sans-serif';
  } else {
    document.documentElement.style.fontFamily = '';
  }
}

const initialLang = getInitialLanguage();
applyDirection(initialLang);

export const useI18n = create<I18nState>((set, get) => ({
  language: initialLang,
  isRTL: initialLang === 'ar',

  setLanguage: (lang) => {
    localStorage.setItem('novacpu-lang', lang);
    applyDirection(lang);
    set({ language: lang, isRTL: lang === 'ar' });
  },

  t: (key) => {
    const lang = get().language;
    return translations[lang][key] ?? translations.en[key] ?? key;
  },
}));
