/**
 * LocalStorage wrapper with safe JSON serialization and error handling
 */

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'pm_auth_token',
  AUTH_USER: 'pm_auth_user',
  THEME_MODE: 'pm_theme_mode',
  PROFILE_DATA: 'pm_user_profile',
} as const;

export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
  }
}

export function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
}

export function getRawToken(): string | null {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (!token) return null;
    // Handle both plain string or JSON string
    return token.startsWith('"') ? JSON.parse(token) : token;
  } catch {
    return null;
  }
}
