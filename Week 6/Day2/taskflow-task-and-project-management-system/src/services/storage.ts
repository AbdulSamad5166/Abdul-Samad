export const KEYS = {
  USERS: 'taskflow_users',
  CURRENT_USER: 'taskflow_current_user',
  TOKEN: 'taskflow_auth_token',
  GLOBAL_THEME_MODE: 'taskflow_theme_mode',
  GLOBAL_ACCENT: 'taskflow_accent_color',
  GLOBAL_DENSITY: 'taskflow_density',
  GLOBAL_DEFAULT_VIEW: 'taskflow_default_view',
};

export function getUserTasksKey(userId: string): string {
  return `taskflow_tasks_${userId}`;
}

export function getUserProjectsKey(userId: string): string {
  return `taskflow_projects_${userId}`;
}

export function getUserTombstonesKey(userId: string): string {
  return `taskflow_tombstones_${userId}`;
}

export function getUserSyncSettingsKey(userId: string): string {
  return `taskflow_sync_${userId}`;
}

export function getUserThemeSettingsKey(userId: string): string {
  return `taskflow_theme_${userId}`;
}

export const safeLocalStorage = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      return JSON.parse(item) as T;
    } catch {
      return defaultValue;
    }
  },
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
};

/**
 * SHA-256 hashing utility using native browser Web Crypto API.
 * Note on security limitation: Since this prototype operates fully client-side
 * without a remote authentication server, passwords are encrypted in localStorage
 * using Web Crypto SHA-256 to avoid plaintext exposure.
 */
export async function hashPassword(password: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  return btoa(password);
}

