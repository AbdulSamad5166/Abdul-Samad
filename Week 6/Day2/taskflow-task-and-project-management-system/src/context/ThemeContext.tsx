import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AccentColor, Density, ThemeMode, UserSettings } from '../types';
import {
  getUserThemeSettingsKey,
  safeLocalStorage,
  KEYS,
} from '../services/storage';
import { useAuth } from './AuthContext';

interface ThemeContextType {
  mode: ThemeMode;
  isDark: boolean;
  accent: AccentColor;
  density: Density;
  defaultView: 'list' | 'grid';
  setMode: (mode: ThemeMode) => void;
  setAccent: (accent: AccentColor) => void;
  setDensity: (density: Density) => void;
  setDefaultView: (view: 'list' | 'grid') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id;

  const [mode, setModeState] = useState<ThemeMode>(() => {
    return safeLocalStorage.get<ThemeMode>(KEYS.GLOBAL_THEME_MODE, 'system');
  });

  const [accent, setAccentState] = useState<AccentColor>(() => {
    return safeLocalStorage.get<AccentColor>(KEYS.GLOBAL_ACCENT, 'indigo');
  });

  const [density, setDensityState] = useState<Density>(() => {
    return safeLocalStorage.get<Density>(KEYS.GLOBAL_DENSITY, 'comfortable');
  });

  const [defaultView, setDefaultViewState] = useState<'list' | 'grid'>(() => {
    return safeLocalStorage.get<'list' | 'grid'>(KEYS.GLOBAL_DEFAULT_VIEW, 'list');
  });

  const [isDark, setIsDark] = useState<boolean>(false);

  // Load user-specific theme settings if user logs in
  useEffect(() => {
    if (!userId) return;
    const userThemeKey = getUserThemeSettingsKey(userId);
    const userSettings = safeLocalStorage.get<UserSettings | null>(userThemeKey, null);
    if (userSettings) {
      if (userSettings.mode) setModeState(userSettings.mode);
      if (userSettings.accent) setAccentState(userSettings.accent);
      if (userSettings.density) setDensityState(userSettings.density);
      if (userSettings.defaultView) setDefaultViewState(userSettings.defaultView);
    }
  }, [userId]);

  // Compute actual dark state
  const calculateIsDark = useCallback((targetMode: ThemeMode): boolean => {
    if (targetMode === 'dark') return true;
    if (targetMode === 'light') return false;
    return (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  }, []);

  // Sync DOM classes and attributes whenever mode, accent, or density change
  useEffect(() => {
    const dark = calculateIsDark(mode);
    setIsDark(dark);

    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    root.setAttribute('data-accent', accent);
    root.setAttribute('data-density', density);

    // Save global settings for instant zero-flash pre-render
    safeLocalStorage.set(KEYS.GLOBAL_THEME_MODE, mode);
    safeLocalStorage.set(KEYS.GLOBAL_ACCENT, accent);
    safeLocalStorage.set(KEYS.GLOBAL_DENSITY, density);
    safeLocalStorage.set(KEYS.GLOBAL_DEFAULT_VIEW, defaultView);

    // If logged in, save to user settings
    if (userId) {
      const userThemeKey = getUserThemeSettingsKey(userId);
      safeLocalStorage.set<UserSettings>(userThemeKey, {
        mode,
        accent,
        density,
        defaultView,
      });
    }
  }, [mode, accent, density, defaultView, userId, calculateIsDark]);

  // Listen to OS system color scheme changes if mode is 'system'
  useEffect(() => {
    if (mode !== 'system' || typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const dark = e.matches;
      setIsDark(dark);
      if (dark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode]);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
  }, []);

  const setAccent = useCallback((newAccent: AccentColor) => {
    setAccentState(newAccent);
  }, []);

  const setDensity = useCallback((newDensity: Density) => {
    setDensityState(newDensity);
  }, []);

  const setDefaultView = useCallback((newView: 'list' | 'grid') => {
    setDefaultViewState(newView);
  }, []);

  const value: ThemeContextType = {
    mode,
    isDark,
    accent,
    density,
    defaultView,
    setMode,
    setAccent,
    setDensity,
    setDefaultView,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
