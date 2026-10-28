import { SyncSettings, Task } from '../types';
import {
  getUserSyncSettingsKey,
  getUserTombstonesKey,
  safeLocalStorage,
} from './storage';
import { taskService } from './taskService';

const DEFAULT_SYNC_SETTINGS: SyncSettings = {
  autoSync: false,
  syncInterval: 300000, // 5 minutes
  lastSyncedAt: null,
};

export const syncService = {
  getSyncSettings(userId: string): SyncSettings {
    if (!userId) return DEFAULT_SYNC_SETTINGS;
    const key = getUserSyncSettingsKey(userId);
    return safeLocalStorage.get<SyncSettings>(key, DEFAULT_SYNC_SETTINGS);
  },

  updateSyncSettings(userId: string, updates: Partial<SyncSettings>): SyncSettings {
    if (!userId) return DEFAULT_SYNC_SETTINGS;
    const current = this.getSyncSettings(userId);
    const updated = { ...current, ...updates };
    safeLocalStorage.set(getUserSyncSettingsKey(userId), updated);
    return updated;
  },

  /**
   * Syncs user tasks with DummyJSON REST API.
   * Merges incoming API tasks with local tasks, respecting local changes and tombstones.
   */
  async sync(
    userId: string,
    options: {
      limit?: number;
      skip?: number;
      clearTombstones?: boolean;
      forceReset?: boolean;
    } = {}
  ): Promise<{
    tasks: Task[];
    addedCount: number;
    updatedCount: number;
    totalApiCount: number;
  }> {
    const res = await taskService.syncWithApi(userId, options);
    this.updateSyncSettings(userId, { lastSyncedAt: new Date().toISOString() });
    return res;
  },

  /**
   * Re-imports previously deleted API tasks by clearing tombstones and re-syncing.
   */
  async reimportMissing(userId: string): Promise<{
    tasks: Task[];
    addedCount: number;
    updatedCount: number;
  }> {
    const res = await this.sync(userId, { clearTombstones: true });
    return res;
  },

  /**
   * Resets all user tasks to fresh API data.
   */
  async resetToFreshApi(userId: string): Promise<{
    tasks: Task[];
    addedCount: number;
  }> {
    // Clear user tombstones
    safeLocalStorage.remove(getUserTombstonesKey(userId));
    const res = await this.sync(userId, { forceReset: true, clearTombstones: true, limit: 30 });
    return res;
  },

  /**
   * Loads more tasks from the API using pagination parameters.
   */
  async loadMore(
    userId: string,
    currentCount: number,
    pageSize: number = 10
  ): Promise<{
    tasks: Task[];
    addedCount: number;
  }> {
    const res = await this.sync(userId, { skip: currentCount, limit: pageSize });
    return res;
  },
};
