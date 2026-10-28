import React, { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { useProjects } from '../hooks/useProjects';
import { useSync } from '../hooks/useSync';
import { useToast } from '../hooks/useToast';
import { taskService } from '../services/taskService';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { ACCENT_THEMES } from '../utils/constants';
import {
  SunIcon,
  MoonIcon,
  DownloadIcon,
  TrashIcon,
  CheckIcon,
  RefreshIcon,
  WifiIcon,
  WifiOffIcon,
} from '../components/icons';
import { Density } from '../types';

export const SettingsPage: React.FC = () => {
  const { mode, setMode, accent, setAccent, density, setDensity, defaultView, setDefaultView } =
    useTheme();
  const { user } = useAuth();
  const { data: tasks = [] } = useTasks();
  const { data: projects = [] } = useProjects();
  const {
    isSyncing,
    syncStatus,
    lastSyncedAt,
    relativeLastSync,
    isOnline,
    autoSync,
    syncInterval,
    setAutoSync,
    setSyncInterval,
    syncNow,
    reimportMissing,
    resetToFreshApi,
  } = useSync();

  const toast = useToast();

  const [isClearDataModalOpen, setIsClearDataModalOpen] = useState(false);
  const [isResetApiModalOpen, setIsResetApiModalOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  // Export tasks as JSON
  const handleExportJson = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      user: { name: user?.name, email: user?.email },
      projects,
      tasks,
    };
    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `taskflow-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Workspace exported as JSON file!');
  };

  // Download project source ZIP
  const handleDownloadZip = () => {
    const a = document.createElement('a');
    a.href = '/task-management-system.zip';
    a.download = 'task-management-system.zip';
    a.click();
    toast.info('Downloading complete project package (task-management-system.zip)...');
  };

  // Clear data handler
  const handleClearData = async () => {
    if (!user) return;
    setIsClearing(true);
    try {
      await taskService.clearAllUserData(user.id);
      setIsClearDataModalOpen(false);
      toast.success('All tasks and projects have been reset.');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to clear data');
    } finally {
      setIsClearing(false);
    }
  };

  // Reset to fresh API data
  const handleConfirmResetApi = async () => {
    setIsResetApiModalOpen(false);
    await resetToFreshApi();
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      <PageHeader
        pill="Preferences"
        title="Settings & Appearance"
        description="Customize theme modes, color accents, API synchronization, display density, and workspace data backup"
      />

      {/* Theme Mode Card */}
      <Card headerPill="Display" title="Theme Mode" subtitle="Choose your preferred color scheme (Light, Dark, or OS System Sync)">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-2">
          {/* Light */}
          <button
            type="button"
            onClick={() => setMode('light')}
            className={`flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition-all cursor-pointer ${
              mode === 'light'
                ? 'border-primary bg-primary/5 ring-2 ring-primary/20 font-bold'
                : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
            }`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-500 mb-2">
              <SunIcon className="w-5 h-5" />
            </div>
            <span className="text-sm text-slate-800 dark:text-slate-200">Light Mode</span>
            <span className="text-[11px] text-slate-400 mt-0.5">High-contrast bright interface</span>
          </button>

          {/* Dark */}
          <button
            type="button"
            onClick={() => setMode('dark')}
            className={`flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition-all cursor-pointer ${
              mode === 'dark'
                ? 'border-primary bg-primary/5 ring-2 ring-primary/20 font-bold'
                : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
            }`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-950/60 text-indigo-400 mb-2">
              <MoonIcon className="w-5 h-5" />
            </div>
            <span className="text-sm text-slate-800 dark:text-slate-200">Dark Mode</span>
            <span className="text-[11px] text-slate-400 mt-0.5">Easy on the eyes in low light</span>
          </button>

          {/* System */}
          <button
            type="button"
            onClick={() => setMode('system')}
            className={`flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition-all cursor-pointer ${
              mode === 'system'
                ? 'border-primary bg-primary/5 ring-2 ring-primary/20 font-bold'
                : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
            }`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 mb-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect width="20" height="14" x="2" y="3" rx="2" />
                <line x1="8" x2="16" y1="21" y2="21" />
                <line x1="12" x2="12" y1="17" y2="21" />
              </svg>
            </div>
            <span className="text-sm text-slate-800 dark:text-slate-200">System Sync</span>
            <span className="text-[11px] text-slate-400 mt-0.5">Follows operating system</span>
          </button>
        </div>
      </Card>

      {/* Accent Theme Selection with Live Preview Cards */}
      <Card
        headerPill="Colors"
        title="Accent Color Theme"
        subtitle="Select from the 6 functional system accents (Indigo, Emerald, Rose, Amber, Sky, Violet) or Ocean Teal"
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 pt-2">
          {ACCENT_THEMES.map((theme) => {
            const isSelected = accent === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => setAccent(theme.id)}
                className={`relative flex flex-col items-start rounded-2xl border p-3.5 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-xs'
                    : 'border-slate-200/80 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                <div className="flex w-full items-center justify-between mb-2">
                  <span
                    className="h-6 w-6 rounded-full shadow-inner ring-2 ring-white dark:ring-slate-900"
                    style={{ backgroundColor: theme.previewHex }}
                  />
                  {isSelected && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white">
                      <CheckIcon className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {theme.label}
                </span>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                  {theme.previewHex}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Data & API Synchronization */}
      <Card
        headerPill="Sync"
        title="Data & API Synchronization"
        subtitle="Manage REST API synchronization with DummyJSON and local offline cache"
      >
        <div className="space-y-6 pt-1 text-xs">
          {/* Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  isOnline
                    ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                    : 'bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
                }`}
              >
                {isOnline ? <WifiIcon className="w-5 h-5" /> : <WifiOffIcon className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Network: {isOnline ? 'Online' : 'Offline'}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      syncStatus === 'synced'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                        : syncStatus === 'syncing'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                          : syncStatus === 'failed'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                            : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {syncStatus.toUpperCase()}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Last synchronized: {relativeLastSync}{' '}
                  {lastSyncedAt && `(${new Date(lastSyncedAt).toLocaleTimeString()})`}
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              isLoading={isSyncing}
              disabled={isSyncing || !isOnline}
              leftIcon={<RefreshIcon className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />}
              onClick={() => syncNow()}
            >
              Sync Now
            </Button>
          </div>

          {/* Auto-sync configuration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200/80 p-4 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    Automatic Background Sync
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Periodically pulls updates when connected
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSync}
                    onChange={(e) => setAutoSync(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 p-4 dark:border-slate-800">
              <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                Sync Frequency Interval
              </label>
              <select
                value={syncInterval}
                disabled={!autoSync}
                onChange={(e) => setSyncInterval(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 disabled:opacity-50"
              >
                <option value={60000}>Every 1 minute</option>
                <option value={300000}>Every 5 minutes (Recommended)</option>
                <option value={900000}>Every 15 minutes</option>
                <option value={0}>Manual only</option>
              </select>
            </div>
          </div>

          {/* Sync actions: Re-import and Fresh Reset */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="rounded-2xl border border-slate-200/80 p-4 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200">Re-import Missing API Tasks</h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Clears local deletion tombstones and pulls in all original API tasks without overwriting your locally modified tasks.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-fit"
                isLoading={isSyncing}
                disabled={isSyncing || !isOnline}
                onClick={reimportMissing}
              >
                Re-import Missing Tasks
              </Button>
            </div>

            <div className="rounded-2xl border border-rose-200/60 bg-rose-50/20 p-4 dark:border-rose-900/40 dark:bg-rose-950/20 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-rose-700 dark:text-rose-400">Reset to Fresh API Data</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Replaces all current tasks with a pristine batch of 30 items fetched freshly from the REST API endpoint.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-fit border-rose-200 text-rose-700 hover:bg-rose-100/50 dark:border-rose-800 dark:text-rose-400"
                isLoading={isSyncing}
                disabled={isSyncing || !isOnline}
                onClick={() => setIsResetApiModalOpen(true)}
              >
                Reset to Fresh API
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Layout & Density Options */}
      <Card headerPill="Layout" title="Density & Default View">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 pt-1 text-xs">
          {/* Density */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Interface Density
            </label>
            <div className="flex gap-2">
              {(['comfortable', 'compact'] as Density[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDensity(d)}
                  className={`flex-1 rounded-xl border py-2 px-3 text-center capitalize transition-colors cursor-pointer ${
                    density === d
                      ? 'border-primary bg-primary text-white font-bold'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-[11px] text-slate-400">
              {density === 'compact' ? 'Condensed padding for higher data density' : 'Spacious padding and breathing room'}
            </p>
          </div>

          {/* Default Task View */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Default Task View
            </label>
            <div className="flex gap-2">
              {(['list', 'grid'] as const).map((view) => (
                <button
                  key={view}
                  type="button"
                  onClick={() => setDefaultView(view)}
                  className={`flex-1 rounded-xl border py-2 px-3 text-center capitalize transition-colors cursor-pointer ${
                    defaultView === view
                      ? 'border-primary bg-primary text-white font-bold'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                  }`}
                >
                  {view} View
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-[11px] text-slate-400">
              Initial view selected when opening the Tasks page
            </p>
          </div>
        </div>
      </Card>

      {/* Project Deliverables & Export */}
      <Card
        headerPill="Deliverables"
        title="Project Package & Backup"
        subtitle="Download standalone source code or export task data"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-1">
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Download Full VS Code Project (ZIP)
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Includes package.json, source tree, theme stylesheet, and README
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<DownloadIcon className="w-4 h-4" />}
            onClick={handleDownloadZip}
          >
            Download ZIP
          </Button>
        </div>

        <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Export Tasks as JSON
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Download your current tasks, tags, subtasks, and projects in JSON format
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<DownloadIcon className="w-4 h-4" />}
            onClick={handleExportJson}
          >
            Export JSON
          </Button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card headerPill="Danger" title="Reset Workspace Data">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs">
          <div>
            <h4 className="font-bold text-rose-600 dark:text-rose-400">Clear All Workspace Data</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Delete all created tasks and projects for your account. You can then start from scratch or sync freshly.
            </p>
          </div>
          <Button
            variant="danger"
            size="sm"
            leftIcon={<TrashIcon className="w-3.5 h-3.5" />}
            onClick={() => setIsClearDataModalOpen(true)}
          >
            Clear Data
          </Button>
        </div>
      </Card>

      {/* Clear Data Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isClearDataModalOpen}
        onClose={() => setIsClearDataModalOpen(false)}
        onConfirm={handleClearData}
        title="Reset All Data"
        message="Are you sure you want to clear all tasks and projects? This action cannot be reversed."
        confirmLabel="Yes, Reset All"
        isDestructive
        isLoading={isClearing}
      />

      {/* Reset to Fresh API Data Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetApiModalOpen}
        onClose={() => setIsResetApiModalOpen(false)}
        onConfirm={handleConfirmResetApi}
        title="Reset to Fresh API Data"
        message="This will replace all your current tasks with a fresh batch from the API. Any local unsynced tasks will be replaced. Continue?"
        confirmLabel="Reset to Fresh API"
        isDestructive
        isLoading={isSyncing}
      />
    </div>
  );
};
