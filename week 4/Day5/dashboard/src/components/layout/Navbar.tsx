import { Menu, Moon, Sun, Bell } from 'lucide-react'

interface Props {
  title: string
  dark: boolean
  onToggleDark: () => void
  onMenuClick: () => void
}

export default function Navbar({ title, dark, onToggleDark, onMenuClick }: Props) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900 sm:px-6">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden" aria-label="Open menu">
          <Menu size={22} className="text-slate-600 dark:text-slate-300" />
        </button>
        <h1 className="text-lg font-semibold capitalize text-slate-800 dark:text-slate-100">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onToggleDark}
          aria-label="Toggle dark mode"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button
          aria-label="Notifications"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Bell size={18} />
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
          AS
        </div>
      </div>
    </header>
  )
}