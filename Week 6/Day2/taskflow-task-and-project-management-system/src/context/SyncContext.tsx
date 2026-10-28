import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { SyncStatus } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { syncService } from '../services/syncService';
import { TASK_QUERY_KEYS } from '../hooks/useTasks';

interface SyncContextType {
  isSyncing: boolean;
  syncStatus: SyncStatus;
  lastSyncedAt: string | null;
  relativeLastSync: string;
  isOnline: boolean;
  autoSync: boolean;
  syncInterval: number; // in milliseconds (0 = off)
  syncError: string | null;
  setAutoSync: (enabled: boolean) => void;
  setSyncInterval: (intervalMs: number) => void;
  syncNow: (options?: { forceReset?: boolean; clearTombstones?: boolean }) => Promise<void>;
  reimportMissing: () => Promise<void>;
  resetToFreshApi: () => Promise<void>;
  loadMore: (currentCount: number, pageSize?: number) => Promise<number>;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

/**
 * Calculates human-readable relative time using native Intl.RelativeTimeFormat.
 */
function getRelativeTimeString(dateString: string | null): string {
  if (!dateString) return 'Never synced';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Never synced';

  const now = new Date();
  const diffInSeconds = Math.round((date.getTime() - now.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (Math.abs(diffInSeconds) < 60) {
    return 'Just now';
  }
  const diffInMinutes = Math.round(diffInSeconds / 60);
  if (Math.abs(diffInMinutes) < 60) {
    return rtf.format(diffInMinutes, 'minute');
  }
  const diffInHours = Math.round(diffInMinutes / 60);
  if (Math.abs(diffInHours) < 24) {
    return rtf.format(diffInHours, 'hour');
  }
  const diffInDays = Math.round(diffInHours / 24);
  return rtf.format(diffInDays, 'day');
}

export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();
  const toast = useToast();

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [syncError, setSyncError] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [relativeLastSync, setRelativeLastSync] = useState<string>('Never synced');

  // Online / Offline tracking
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  // Auto-sync settings
  const [autoSync, setAutoSyncState] = useState<boolean>(false);
  const [syncInterval, setSyncIntervalState] = useState<number>(300000); // 5 minutes default

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load user sync settings on user change
  useEffect(() => {
    if (!userId) {
      setLastSyncedAt(null);
      setSyncStatus('idle');
      return;
    }
    const settings = syncService.getSyncSettings(userId);
    setLastSyncedAt(settings.lastSyncedAt);
    setAutoSyncState(settings.autoSync);
    setSyncIntervalState(settings.syncInterval);
    setRelativeLastSync(getRelativeTimeString(settings.lastSyncedAt));
  }, [userId]);

  // Online/Offline event listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Network connection restored. You are back online.');
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('Working offline. All changes are saved locally.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  // Refresh relative time every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRelativeLastSync(getRelativeTimeString(lastSyncedAt));
    }, 60000);

    return () => clearInterval(interval);
  }, [lastSyncedAt]);

  const setAutoSync = useCallback(
    (enabled: boolean) => {
      setAutoSyncState(enabled);
      if (userId) {
        syncService.updateSyncSettings(userId, { autoSync: enabled });
      }
    },
    [userId]
  );

  const setSyncInterval = useCallback(
    (intervalMs: number) => {
      setSyncIntervalState(intervalMs);
      if (userId) {
        syncService.updateSyncSettings(userId, { syncInterval: intervalMs });
      }
    },
    [userId]
  );

  // Primary manual / auto sync trigger
  const syncNow = useCallback(
    async (options?: { forceReset?: boolean; clearTombstones?: boolean }) => {
      if (!userId) return;

      if (!navigator.onLine) {
        setSyncStatus('failed');
        setSyncError('Cannot sync while offline. Local tasks are preserved.');
        toast.warning('Offline: Showing locally saved tasks.');
        return;
      }

      setIsSyncing(true);
      setSyncStatus('syncing');
      setSyncError(null);

      try {
        const result = await syncService.sync(userId, options);
        const now = new Date().toISOString();
        setLastSyncedAt(now);
        setRelativeLastSync(getRelativeTimeString(now));
        setSyncStatus('synced');

        // Invalidate queries to refresh UI across all pages
        await queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all(userId) });

        if (options?.forceReset) {
          toast.success(`Reset tasks to ${result.tasks.length} fresh items from API.`);
        } else if (result.addedCount > 0 || result.updatedCount > 0) {
          toast.success(
            `Synchronized with API (+${result.addedCount} new, ${result.updatedCount} updated).`
          );
        } else {
          toast.info('Tasks are up to date with API.');
        }
      } catch (err: unknown) {
        setSyncStatus('failed');
        const msg = err instanceof Error ? err.message : 'API sync failed. Using local storage data.';
        setSyncError(msg);
        toast.error(msg, {
          undoAction: () => syncNow(options),
        });
      } finally {
        setIsSyncing(false);
      }
    },
    [userId, queryClient, toast]
  );

  const reimportMissing = useCallback(async () => {
    if (!userId) return;
    setIsSyncing(true);
    setSyncStatus('syncing');
    try {
      const res = await syncService.reimportMissing(userId);
      const now = new Date().toISOString();
      setLastSyncedAt(now);
      setRelativeLastSync(getRelativeTimeString(now));
      setSyncStatus('synced');
      await queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all(userId) });
      toast.success(`Re-imported ${res.addedCount} previously deleted API tasks.`);
    } catch (err: unknown) {
      setSyncStatus('failed');
      setSyncError(err instanceof Error ? err.message : 'Re-import failed');
      toast.error('Re-import failed. Check connection.');
    } finally {
      setIsSyncing(false);
    }
  }, [userId, queryClient, toast]);

  const resetToFreshApi = useCallback(async () => {
    if (!userId) return;
    setIsSyncing(true);
    setSyncStatus('syncing');
    try {
      const res = await syncService.resetToFreshApi(userId);
      const now = new Date().toISOString();
      setLastSyncedAt(now);
      setRelativeLastSync(getRelativeTimeString(now));
      setSyncStatus('synced');
      await queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all(userId) });
      toast.success(`Reset workspace to ${res.tasks.length} clean API tasks.`);
    } catch (err: unknown) {
      setSyncStatus('failed');
      setSyncError(err instanceof Error ? err.message : 'Reset failed');
      toast.error('Reset failed. Check connection.');
    } finally {
      setIsSyncing(false);
    }
  }, [userId, queryClient, toast]);

  const loadMore = useCallback(
    async (currentCount: number, pageSize: number = 10): Promise<number> => {
      if (!userId) return 0;
      setIsSyncing(true);
      try {
        const res = await syncService.loadMore(userId, currentCount, pageSize);
        const now = new Date().toISOString();
        setLastSyncedAt(now);
        setRelativeLastSync(getRelativeTimeString(now));
        await queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all(userId) });
        if (res.addedCount > 0) {
          toast.success(`Loaded ${res.addedCount} additional tasks from API.`);
        } else {
          toast.info('No more new tasks available from API.');
        }
        return res.addedCount;
      } catch {
        toast.error('Failed to load more tasks from API.');
        return 0;
      } finally {
        setIsSyncing(false);
      }
    },
    [userId, queryClient, toast]
  );

  // Auto-sync timer loop
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (autoSync && syncInterval > 0 && userId) {
      timerRef.current = setInterval(() => {
        if (navigator.onLine) {
          syncNow();
        }
      }, syncInterval);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [autoSync, syncInterval, userId, syncNow]);

  const value: SyncContextType = {
    isSyncing,
    syncStatus,
    lastSyncedAt,
    relativeLastSync,
    isOnline,
    autoSync,
    syncInterval,
    syncError,
    setAutoSync,
    setSyncInterval,
    syncNow,
    reimportMissing,
    resetToFreshApi,
    loadMore,
  };

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>;
};

export function useSync(): SyncContextType {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
}
