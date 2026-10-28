import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  DashboardIcon,
  TasksIcon,
  BoardIcon,
  ProjectIcon,
  CalendarIcon,
  ProfileIcon,
  SettingsIcon,
  LogoIcon,
  CloseIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '../icons';

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onCloseMobile?: () => void;
  isMobile?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed = false,
  onToggleCollapse,
  onCloseMobile,
  isMobile = false,
}) => {
  const navItems = [
    { to: '/', label: 'Dashboard', icon: <DashboardIcon className="w-5 h-5 shrink-0" /> },
    { to: '/tasks', label: 'Tasks', icon: <TasksIcon className="w-5 h-5 shrink-0" /> },
    { to: '/board', label: 'Kanban Board', icon: <BoardIcon className="w-5 h-5 shrink-0" /> },
    { to: '/projects', label: 'Projects', icon: <ProjectIcon className="w-5 h-5 shrink-0" /> },
    { to: '/calendar', label: 'Calendar', icon: <CalendarIcon className="w-5 h-5 shrink-0" /> },
    { to: '/profile', label: 'My Profile', icon: <ProfileIcon className="w-5 h-5 shrink-0" /> },
    { to: '/settings', label: 'Settings', icon: <SettingsIcon className="w-5 h-5 shrink-0" /> },
  ];

  return (
    <aside
      className={`sidebar-theme flex flex-col justify-between text-slate-100 transition-all duration-300 z-30 select-none ${
        isMobile ? 'w-64 h-full shadow-2xl' : collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white shadow-inner">
              <LogoIcon className="w-6 h-6" />
            </div>
            {(!collapsed || isMobile) && (
              <div>
                <span className="font-extrabold text-base tracking-tight text-white block">TaskFlow</span>
                <span className="text-[10px] text-white/70 block uppercase tracking-wider font-semibold">Workspace</span>
              </div>
            )}
          </div>

          {isMobile ? (
            <button
              onClick={onCloseMobile}
              aria-label="Close sidebar"
              className="rounded-lg p-1.5 text-white/80 hover:bg-white/10 hover:text-white cursor-pointer"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          ) : (
            onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                className="hidden lg:flex rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white cursor-pointer"
              >
                {collapsed ? <ChevronRightIcon className="w-4 h-4" /> : <ChevronLeftIcon className="w-4 h-4" />}
              </button>
            )
          )}
        </div>

        {/* Navigation items */}
        <nav className="space-y-1.5 p-3" aria-label="Main Navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={isMobile ? onCloseMobile : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-white/20 text-white shadow-xs backdrop-blur-xs font-bold'
                    : 'text-white/75 hover:bg-white/10 hover:text-white'
                } ${collapsed && !isMobile ? 'justify-center px-2' : ''}`
              }
              title={collapsed && !isMobile ? item.label : undefined}
            >
              {item.icon}
              {(!collapsed || isMobile) && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer Info / Badge */}
      {(!collapsed || isMobile) && (
        <div className="border-t border-white/10 p-4">
          <div className="rounded-xl bg-white/10 p-3 text-[11px] text-white/90">
            <div className="font-bold flex items-center justify-between">
              <span>TaskFlow Pro</span>
              <span className="rounded bg-white/20 px-1.5 py-0.2 text-[9px] uppercase tracking-wide">v2.4</span>
            </div>
            <p className="mt-1 text-white/70 text-[10px] leading-relaxed">
              DummyJSON synced &amp; offline ready.
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};
