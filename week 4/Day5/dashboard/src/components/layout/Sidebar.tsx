import { LayoutDashboard, Users, Settings, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Page } from '../../types'

interface Props {
  page: Page
  onNavigate: (page: Page) => void
  open: boolean
  onClose: () => void
}

const items: { id: Page; label: string; icon: LucideIcon }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ page, onNavigate, open, onClose }: Props) {
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-200 bg-white transition-transform dark:border-slate-800 dark:bg-slate-900 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6 dark:border-slate-800">
          <span className="text-xl font-bold text-indigo-600">Admin Dashboard</span>
          <button className="lg:hidden" onClick={onClose} aria-label="Close menu">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <nav className="space-y-1 p-4">
          {items.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                onNavigate(id)
                onClose()
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                page === id
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  )
}