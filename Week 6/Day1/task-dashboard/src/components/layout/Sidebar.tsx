import { useEffect, type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import {
  CalendarIcon,
  CloseIcon,
  DashboardIcon,
  HelpCircleIcon,
  ProjectsIcon,
  SettingsIcon,
  SparklesIcon,
  TasksIcon,
} from '../ui/Icons'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface NavItem {
  to: string
  label: string
  icon: ReactNode
  end: boolean
  badge?: string
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: <DashboardIcon className="h-5 w-5" />, end: true },
  { to: '/tasks', label: 'Tasks', icon: <TasksIcon className="h-5 w-5" />, end: false, badge: '6' },
  { to: '/projects', label: 'Projects', icon: <ProjectsIcon className="h-5 w-5" />, end: false },
  { to: '/calendar', label: 'Calendar', icon: <CalendarIcon className="h-5 w-5" />, end: false },
  { to: '/settings', label: 'Settings', icon: <SettingsIcon className="h-5 w-5" />, end: false },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs transition-opacity lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        aria-label="Sidebar navigation"
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200/90 bg-white transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
          <NavLink to="/" onClick={onClose} className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-xs transition group-hover:scale-105">
              <span className="font-extrabold text-base tracking-wider">TM</span>
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900">Task Management</span>
              <span className="ml-1.5 rounded-full bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-600">
                PRO
              </span>
            </div>
          </NavLink>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 lg:hidden cursor-pointer"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav aria-label="Main navigation" className="flex-1 space-y-1 overflow-y-auto p-3">
          <p className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <span
                      className={`transition-colors ${
                        isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        isActive
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Upgrade / Help Card */}
        <div className="p-3 border-t border-slate-100">
          <div className="rounded-2xl bg-gradient-to-br from-indigo-50 via-indigo-50/50 to-purple-50 p-3.5 border border-indigo-100/80 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <SparklesIcon className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                PRO PLAN
              </span>
            </div>
            <p className="mt-2 text-xs font-semibold text-slate-900">Unlock Pro Analytics</p>
            <p className="mt-0.5 text-[11px] text-slate-500 leading-snug">
              Collaborate with unlimited team members and advanced exports.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => alert('Upgrade to Pro dialog (demo UI)')}
                className="w-full rounded-lg bg-indigo-600 py-1.5 text-center text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer transition"
              >
                Upgrade Now
              </button>
              <button
                type="button"
                aria-label="Help and documentation"
                onClick={() => alert('TaskFlow Help Center (demo UI)')}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 cursor-pointer transition"
              >
                <HelpCircleIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}