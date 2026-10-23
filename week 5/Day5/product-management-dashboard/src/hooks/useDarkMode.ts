import { useState, useEffect } from 'react';
import { STORAGE_KEYS, getStorageItem, setStorageItem } from '../utils/storage';

/**
 * Custom hook to toggle and persist dark mode in Local Storage
 * Synchronizes with the 'dark' CSS class on document.documentElement
 */
export function useDarkMode() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    // Check localStorage first
    const saved = getStorageItem<boolean | null>(STORAGE_KEYS.THEME_MODE, null);
    if (saved !== null) return saved;
    // Fallback to system preference
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    setStorageItem(STORAGE_KEYS.THEME_MODE, isDark);
  }, [isDark]);

  const toggleDarkMode = () => setIsDark((prev) => !prev);

  return { isDark, toggleDarkMode };
}
