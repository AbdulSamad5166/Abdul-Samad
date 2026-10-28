import { useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS, getStorageItem, setStorageItem, removeStorageItem } from '../utils/storage';
import { AuthSession } from '../types/auth';

/**
 * Custom auth hook that reads and persists session details in Local Storage.
 * Strictly avoids React Context API as instructed.
 */
export function useAuth() {
  const [token, setToken] = useState<string | null>(() => {
    return getStorageItem<string | null>(STORAGE_KEYS.AUTH_TOKEN, null);
  });

  const [session, setSession] = useState<AuthSession | null>(() => {
    return getStorageItem<AuthSession | null>(STORAGE_KEYS.AUTH_USER, null);
  });

  // Keep state in sync if storage changes in another tab
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(getStorageItem<string | null>(STORAGE_KEYS.AUTH_TOKEN, null));
      setSession(getStorageItem<AuthSession | null>(STORAGE_KEYS.AUTH_USER, null));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = useCallback((newToken: string, userSession: AuthSession) => {
    setStorageItem(STORAGE_KEYS.AUTH_TOKEN, newToken);
    setStorageItem(STORAGE_KEYS.AUTH_USER, userSession);
    setToken(newToken);
    setSession(userSession);
  }, []);

  const logout = useCallback(() => {
    removeStorageItem(STORAGE_KEYS.AUTH_TOKEN);
    removeStorageItem(STORAGE_KEYS.AUTH_USER);
    setToken(null);
    setSession(null);
  }, []);

  return {
    token,
    isAuthenticated: Boolean(token),
    username: session?.username || 'Guest',
    name: session?.name || 'User',
    email: session?.email,
    avatar: session?.avatar,
    login,
    logout,
  };
}
