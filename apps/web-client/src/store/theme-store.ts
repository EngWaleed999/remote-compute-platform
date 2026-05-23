/**
 * Theme Store — Zustand
 * Manages dark/light mode with smooth transition animation.
 * Persists preference in localStorage.
 */
import { create } from 'zustand';

type Theme = 'dark' | 'light';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

function getInitialTheme(): Theme {
  const saved = localStorage.getItem('novacpu-theme');
  if (saved === 'dark' || saved === 'light') return saved;
  return 'dark'; // Default to dark for cloud platform aesthetic
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;

  // Add transition class for smooth animation
  root.classList.add('theme-transition');

  if (theme === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.remove('dark');
    root.classList.add('light');
  }

  // Remove transition class after animation completes
  setTimeout(() => {
    root.classList.remove('theme-transition');
  }, 500);
}

const initialTheme = getInitialTheme();
applyTheme(initialTheme);

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: initialTheme,

  setTheme: (theme) => {
    localStorage.setItem('novacpu-theme', theme);
    applyTheme(theme);
    set({ theme });
  },

  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('novacpu-theme', next);
    applyTheme(next);
    set({ theme: next });
  },
}));
