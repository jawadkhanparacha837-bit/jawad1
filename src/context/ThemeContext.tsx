import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ThemeMode, AppearanceMode, AccentColor } from '../types';

export interface AccentOption {
  id: AccentColor;
  name: string;
  nameUr: string;
  previewHex: string;
}

export const ACCENT_OPTIONS: AccentOption[] = [
  { id: 'default', name: 'MediNova Cyan', nameUr: 'میڈی نووا فیروزی', previewHex: '#0891b2' },
  { id: 'pink', name: 'Pink', nameUr: 'گلابی (Pink)', previewHex: '#db2777' },
  { id: 'emerald', name: 'Emerald Green', nameUr: 'زمرد سبز (Emerald)', previewHex: '#059669' },
  { id: 'blue', name: 'Blue', nameUr: 'نیلا (Blue)', previewHex: '#2563eb' },
  { id: 'purple', name: 'Purple', nameUr: 'جامنی (Purple)', previewHex: '#7c3aed' },
  { id: 'teal', name: 'Teal', nameUr: 'ٹیل (Teal)', previewHex: '#0d9488' },
  { id: 'orange', name: 'Orange', nameUr: 'نارنجی (Orange)', previewHex: '#ea580c' }
];

interface ThemeContextValue {
  appearance: AppearanceMode;
  theme: ThemeMode; // Resolved effective theme ('light' | 'dark')
  isDark: boolean;
  accent: AccentColor;
  customColor: string;
  activeAccentHex: string;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  setAppearance: (mode: AppearanceMode) => void;
  setAccent: (accent: AccentColor) => void;
  setCustomColor: (hex: string) => void;
  resetThemeCustomization: () => void;
}

const APPEARANCE_STORAGE_KEY = 'medinova-appearance';
const LEGACY_THEME_KEY = 'medinova-theme';
const ACCENT_STORAGE_KEY = 'medinova-accent';
const CUSTOM_COLOR_STORAGE_KEY = 'medinova-custom-color';

function getSystemTheme(): ThemeMode {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

function getInitialAppearance(): AppearanceMode {
  if (typeof window === 'undefined') return 'light';
  try {
    const saved = window.localStorage.getItem(APPEARANCE_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved;
    }
    const legacy = window.localStorage.getItem(LEGACY_THEME_KEY);
    if (legacy === 'light' || legacy === 'dark') {
      return legacy;
    }
  } catch {
    // Ignore storage access errors
  }
  return 'light';
}

function getInitialAccent(): AccentColor {
  if (typeof window === 'undefined') return 'default';
  try {
    const saved = window.localStorage.getItem(ACCENT_STORAGE_KEY) as AccentColor | null;
    if (
      saved &&
      ['default', 'pink', 'emerald', 'blue', 'purple', 'teal', 'orange', 'custom'].includes(saved)
    ) {
      return saved;
    }
  } catch {
    // Ignore storage access errors
  }
  return 'default';
}

function getInitialCustomColor(): string {
  if (typeof window === 'undefined') return '#0891b2';
  try {
    const saved = window.localStorage.getItem(CUSTOM_COLOR_STORAGE_KEY);
    if (saved && /^#[0-9a-fA-F]{6}$/.test(saved)) {
      return saved;
    }
  } catch {
    // Ignore storage access errors
  }
  return '#0891b2';
}

/**
 * Converts a hex color (#RRGGBB) to RGB components [0..255]
 */
function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  if (isNaN(num)) return [8, 145, 178];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/**
 * Mixes two RGB colors by weight (0 = 100% color1, 1 = 100% color2)
 */
function mixRgb(c1: [number, number, number], c2: [number, number, number], weight: number): string {
  const r = Math.round(c1[0] * (1 - weight) + c2[0] * weight);
  const g = Math.round(c1[1] * (1 - weight) + c2[1] * weight);
  const b = Math.round(c1[2] * (1 - weight) + c2[2] * weight);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/**
 * Computes WCAG relative luminance to automatically choose readable foreground text (#ffffff or #0f172a)
 */
export function getReadableForeground(hex: string): string {
  const [r, g, b] = hexToRgb(hex).map(v => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.42 ? '#0f172a' : '#ffffff';
}

/**
 * Generates a full 50..950 Tailwind shade scale from a custom hex color,
 * ensuring high contrast for text and backgrounds in both Light and Dark modes.
 */
function generateCustomShadeScale(baseHex: string): Record<string, string> {
  const rgb = hexToRgb(baseHex);
  const white: [number, number, number] = [255, 255, 255];
  const black: [number, number, number] = [6, 12, 24];

  return {
    '--color-cyan-50': mixRgb(rgb, white, 0.92),
    '--color-cyan-100': mixRgb(rgb, white, 0.84),
    '--color-cyan-200': mixRgb(rgb, white, 0.68),
    '--color-cyan-300': mixRgb(rgb, white, 0.45),
    '--color-cyan-400': mixRgb(rgb, white, 0.22),
    '--color-cyan-500': mixRgb(rgb, white, 0.06),
    '--color-cyan-600': baseHex,
    '--color-cyan-700': mixRgb(rgb, black, 0.18),
    '--color-cyan-800': mixRgb(rgb, black, 0.36),
    '--color-cyan-900': mixRgb(rgb, black, 0.54),
    '--color-cyan-950': mixRgb(rgb, black, 0.76),
    '--primary': baseHex,
    '--primary-hover': mixRgb(rgb, black, 0.15),
    '--primary-foreground': getReadableForeground(baseHex),
    '--ring': baseHex
  };
}

const CUSTOM_SCALE_PROPERTIES = [
  '--color-cyan-50',
  '--color-cyan-100',
  '--color-cyan-200',
  '--color-cyan-300',
  '--color-cyan-400',
  '--color-cyan-500',
  '--color-cyan-600',
  '--color-cyan-700',
  '--color-cyan-800',
  '--color-cyan-900',
  '--color-cyan-950',
  '--primary',
  '--primary-hover',
  '--primary-foreground',
  '--ring'
];

const ThemeContext = createContext<ThemeContextValue>({
  appearance: 'light',
  theme: 'light',
  isDark: false,
  accent: 'default',
  customColor: '#0891b2',
  activeAccentHex: '#0891b2',
  toggleTheme: () => {},
  setTheme: () => {},
  setAppearance: () => {},
  setAccent: () => {},
  setCustomColor: () => {},
  resetThemeCustomization: () => {}
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appearance, setAppearanceState] = useState<AppearanceMode>(getInitialAppearance);
  const [systemTheme, setSystemTheme] = useState<ThemeMode>(getSystemTheme);
  const [accent, setAccentState] = useState<AccentColor>(getInitialAccent);
  const [customColor, setCustomColorState] = useState<string>(getInitialCustomColor);

  const resolvedTheme: ThemeMode = appearance === 'system' ? systemTheme : appearance;

  // Listen to OS system theme changes when Appearance is set to 'system'
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Apply resolved light/dark theme to DOM & persist appearance
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.setAttribute('data-theme', resolvedTheme);
    root.setAttribute('data-appearance', appearance);
    root.style.colorScheme = resolvedTheme;

    try {
      window.localStorage.setItem(APPEARANCE_STORAGE_KEY, appearance);
      window.localStorage.setItem(LEGACY_THEME_KEY, resolvedTheme);
    } catch {
      // Ignore storage access errors
    }
  }, [appearance, resolvedTheme]);

  // Apply accent color to DOM & persist accent
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.setAttribute('data-accent', accent);

    if (accent === 'custom') {
      const customScale = generateCustomShadeScale(customColor);
      Object.entries(customScale).forEach(([prop, val]) => {
        root.style.setProperty(prop, val);
      });
    } else {
      // Clear inline custom properties so CSS [data-accent="..."] rules take effect cleanly
      CUSTOM_SCALE_PROPERTIES.forEach(prop => {
        root.style.removeProperty(prop);
      });
    }

    try {
      window.localStorage.setItem(ACCENT_STORAGE_KEY, accent);
      window.localStorage.setItem(CUSTOM_COLOR_STORAGE_KEY, customColor);
    } catch {
      // Ignore storage access errors
    }
  }, [accent, customColor]);

  const setAppearance = useCallback((mode: AppearanceMode) => {
    setAppearanceState(mode);
  }, []);

  const setTheme = useCallback((mode: ThemeMode) => {
    setAppearanceState(mode);
  }, []);

  const toggleTheme = useCallback(() => {
    setAppearanceState(prev => {
      const currentEffective = prev === 'system' ? getSystemTheme() : prev;
      return currentEffective === 'light' ? 'dark' : 'light';
    });
  }, []);

  const setAccent = useCallback((newAccent: AccentColor) => {
    setAccentState(newAccent);
  }, []);

  const setCustomColor = useCallback((hex: string) => {
    setCustomColorState(hex);
    setAccentState('custom');
  }, []);

  const resetThemeCustomization = useCallback(() => {
    setAppearanceState('light');
    setAccentState('default');
    setCustomColorState('#0891b2');
  }, []);

  const activeAccentHex =
    accent === 'custom'
      ? customColor
      : ACCENT_OPTIONS.find(o => o.id === accent)?.previewHex || '#0891b2';

  return (
    <ThemeContext.Provider
      value={{
        appearance,
        theme: resolvedTheme,
        isDark: resolvedTheme === 'dark',
        accent,
        customColor,
        activeAccentHex,
        toggleTheme,
        setTheme,
        setAppearance,
        setAccent,
        setCustomColor,
        resetThemeCustomization
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
