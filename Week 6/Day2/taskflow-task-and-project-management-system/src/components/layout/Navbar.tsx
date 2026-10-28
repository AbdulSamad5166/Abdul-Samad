import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useTasks } from '../../hooks/useTasks';
import { useSync } from '../../hooks/useSync';
import {
  SearchIcon,
  SunIcon,
  MoonIcon,
  AlertIcon,
  LogoutIcon,
  ProfileIcon,
  SettingsIcon,
  DownloadIcon,
  RefreshIcon,
  WifiIcon,
  WifiOffIcon,
} from '../icons';
import { Avatar } from '../ui/Avatar';
import { Dropdown } from '../ui/Dropdown';
import { ACCENT_THEMES } from '../../utils/constants';
import { isDueToday, isOverdue } from '../../utils/dateHelpers';

interface NavbarProps {
  onOpenMobileSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileSidebar }) => {
  const { user, logout } = useAuth();
  const { mode, setMode, isDark, accent, setAccent } = useTheme();
  const { data: tasks = [] } = useTasks();
  const { isSyncing, syncNow, relativeLastSync, isOnline, syncStatus } = useSync();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');

  // Notifications: compute tasks due today or overdue
  const dueOrOverdueTasks = tasks.filter(
    (t) => t.status !== 'completed' && (isDueToday(t.dueDate) || isOverdue(t.dueDate))
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tasks?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleToggleTheme = () => {
    if (mode === 'light') setMode('dark');
    else if (mode === 'dark') setMode('system');
    else setMode('light');
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 sm:px-6">
      {/* Left side: Hamburger + Search */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          aria-label="Open mobile navigation menu"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 lg:hidden dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Search bar */}
        <form onSubmit={handleSearchSubmit} className="relative hidden sm:block w-56 md:w-72">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, tags, or projects..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
          <SearchIcon className="pointer-events-none absolute left-3 top-2 w-4 h-4 text-slate-400" />
        </form>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Online / Offline status indicator */}
        <div
          title={isOnline ? 'Online: sync enabled' : 'Offline: changes saved locally'}
          className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
            isOnline
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
              : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
          }`}
        >
          {isOnline ? (
            <>
              <WifiIcon className="w-3.5 h-3.5" />
              <span>Online</span>
            </>
          ) : (
            <>
              <WifiOffIcon className="w-3.5 h-3.5" />
              <span>Offline</span>
            </>
          )}
        </div>

        {/* Sync/Refresh button with spinner & relative time */}
        <button
          type="button"
          onClick={() => syncNow()}
          disabled={isSyncing || !isOnline}
          aria-label="Synchronize tasks with API"
          title={`Synced: ${relativeLastSync}. Click to sync now`}
          className="group relative flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
        >
          <RefreshIcon
            className={`w-3.5 h-3.5 text-primary ${isSyncing ? 'animate-spin text-primary' : 'group-hover:rotate-45 transition-transform'}`}
          />
          <span className="hidden lg:inline text-[11px]">
            {isSyncing ? 'Syncing...' : syncStatus === 'failed' ? 'Retry Sync' : 'Sync'}
          </span>
          {syncStatus === 'synced' && (
            <span className="hidden xl:inline text-[10px] text-slate-400 font-normal">
              ({relativeLastSync})
            </span>
          )}
        </button>

        {/* Quick Accent Selector */}
        <div className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {ACCENT_THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setAccent(theme.id)}
              aria-label={`Select ${theme.label} theme`}
              title={theme.label}
              className={`w-4 h-4 rounded-full transition-transform cursor-pointer ${
                accent === theme.id ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'opacity-70 hover:opacity-100'
              }`}
              style={{ backgroundColor: theme.previewHex }}
            />
          ))}
        </div>

        {/* Theme mode toggle */}
        <button
          type="button"
          onClick={handleToggleTheme}
          aria-label={`Theme mode: ${mode}. Click to change`}
          title={`Theme: ${mode} (click to toggle)`}
          className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
        >
          {isDark ? <MoonIcon className="w-4 h-4 text-amber-400" /> : <SunIcon className="w-4 h-4 text-amber-500" />}
        </button>

        {/* Due Tasks Alert Dropdown */}
        <Dropdown
          trigger={
            <div
              className="relative rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
              title="Notifications"
            >
              <AlertIcon className="w-4 h-4" />
              {dueOrOverdueTasks.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
                  {dueOrOverdueTasks.length}
                </span>
              )}
            </div>
          }
          items={[
            {
              id: 'header-notice',
              label: `${dueOrOverdueTasks.length} urgent/due tasks`,
              icon: <AlertIcon className="w-4 h-4 text-rose-500" />,
              onClick: () => navigate('/tasks?filter=overdue'),
            },
            ...dueOrOverdueTasks.slice(0, 4).map((t) => ({
              id: t.id,
              label: t.title.substring(0, 22) + (t.title.length > 22 ? '...' : ''),
              onClick: () => navigate(`/tasks/${t.id}`),
            })),
            {
              id: 'view-all',
              label: 'View all tasks',
              onClick: () => navigate('/tasks'),
            },
          ]}
        />

        {/* Project ZIP export shortcut button */}
        <button
          type="button"
          onClick={() => navigate('/settings')}
          title="Export Project ZIP / Settings"
          aria-label="Export Project"
          className="hidden md:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
        >
          <DownloadIcon className="w-3.5 h-3.5 text-primary" />
          <span>Export ZIP</span>
        </button>

        {/* User profile dropdown */}
        <Dropdown
          trigger={
            <div className="flex items-center gap-2 rounded-xl p-1 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
              <Avatar initials={user?.avatarInitials || 'HA'} size="sm" />
              <div className="hidden sm:block text-left">
                <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 leading-none">
                  {user?.name || 'User'}
                </span>
                <span className="block text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-none">
                  Online
                </span>
              </div>
            </div>
          }
          items={[
            {
              id: 'profile',
              label: 'My Profile',
              icon: <ProfileIcon className="w-4 h-4" />,
              onClick: () => navigate('/profile'),
            },
            {
              id: 'settings',
              label: 'Settings & Theme',
              icon: <SettingsIcon className="w-4 h-4" />,
              onClick: () => navigate('/settings'),
            },
            {
              id: 'logout',
              label: 'Log out',
              icon: <LogoutIcon className="w-4 h-4" />,
              danger: true,
              onClick: () => {
                logout();
                navigate('/login');
              },
            },
          ]}
        />
      </div>
    </header>
  );
};
