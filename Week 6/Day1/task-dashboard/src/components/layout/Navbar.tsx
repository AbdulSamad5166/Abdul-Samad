import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Avatar } from '../ui/Avatar'
import {
  BellIcon,
  ChevronDownIcon,
  LogOutIcon,
  MenuIcon,
  SearchIcon,
  SettingsIcon,
  UserIcon,
} from '../ui/Icons'

interface NavbarProps {
  onMenuClick: () => void
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const userMenuRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Close menus on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setIsUserMenuOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(target)) {
        setIsNotifOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  // Close menus on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsUserMenuOpen(false)
        setIsNotifOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer lg:hidden"
        >
          <MenuIcon className="h-5 w-5" />
        </button>

        {/* Search input (UI only) */}
        <div className="relative hidden sm:block w-72 md:w-80">
          <label htmlFor="navbar-search" className="sr-only">
            Search tasks, projects, or tags
          </label>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <SearchIcon className="h-4 w-4" />
          </div>
          <input
            id="navbar-search"
            type="search"
            placeholder="Search tasks, projects..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-12 text-xs text-slate-900 placeholder:text-slate-400 transition hover:bg-white hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20"
          />
          <kbd className="pointer-events-none absolute inset-y-0 right-2 my-auto hidden h-5 select-none items-center rounded border border-slate-200 bg-white px-1.5 font-mono text-[10px] font-medium text-slate-400 sm:inline-flex">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notification Bell with Badge & Dropdown */}
        <div ref={notifRef} className="relative">
          <button
            type="button"
            aria-label="Notifications (3 unread)"
            aria-expanded={isNotifOpen}
            aria-haspopup="true"
            onClick={() => {
              setIsNotifOpen((prev) => !prev)
              setIsUserMenuOpen(false)
            }}
            className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer transition"
          >
            <BellIcon className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-600" />
            </span>
          </button>

          {isNotifOpen && (
            <div
              role="region"
              aria-label="Recent notifications"
              className="absolute right-0 z-30 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl ring-1 ring-black/5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 px-1">
                <span className="text-xs font-semibold text-slate-900">Notifications</span>
                <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-600">
                  3 new
                </span>
              </div>
              <div className="mt-2 space-y-1">
                <div className="rounded-lg p-2 text-xs hover:bg-slate-50 transition cursor-pointer">
                  <p className="font-medium text-slate-800">Task deadline approaching</p>
                  <p className="text-slate-500 mt-0.5">"Fix navbar bug" is due tomorrow.</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">15m ago</span>
                </div>
                <div className="rounded-lg p-2 text-xs hover:bg-slate-50 transition cursor-pointer">
                  <p className="font-medium text-slate-800">New assignment</p>
                  <p className="text-slate-500 mt-0.5">You were added to "Mobile App Redesign".</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">1h ago</span>
                </div>
                <div className="rounded-lg p-2 text-xs hover:bg-slate-50 transition cursor-pointer">
                  <p className="font-medium text-slate-800">Weekly report ready</p>
                  <p className="text-slate-500 mt-0.5">Sprint #4 analytics summary generated.</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">3h ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200" aria-hidden="true" />

        {/* User Profile Avatar with Dropdown */}
        <div ref={userMenuRef} className="relative">
          <button
            type="button"
            aria-label="User account menu"
            aria-expanded={isUserMenuOpen}
            aria-haspopup="true"
            onClick={() => {
              setIsUserMenuOpen((prev) => !prev)
              setIsNotifOpen(false)
            }}
            className="flex items-center gap-2.5 rounded-xl p-1.5 text-left transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
          >
            <Avatar name="Alex Morgan" size="sm" status="online" />
            <div className="hidden text-left md:block">
              <p className="text-xs font-semibold text-slate-900 leading-tight">Abdul Samad </p>
              <p className="text-[11px] text-slate-500 leading-tight">Product Lead</p>
            </div>
            <ChevronDownIcon className="hidden h-3.5 w-3.5 text-slate-400 md:block" />
          </button>

          {isUserMenuOpen && (
            <div
              role="menu"
              aria-orientation="vertical"
              className="absolute right-0 z-30 mt-2 w-56 rounded-2xl border border-slate-200 bg-white py-1.5 shadow-xl ring-1 ring-black/5"
            >
              <div className="border-b border-slate-100 px-3.5 py-2.5">
                <p className="text-xs font-semibold text-slate-900">Abdul Samad</p>
                <p className="text-[11px] text-slate-500 truncate">[as8822237@gmail.com]</p>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setIsUserMenuOpen(false)
                    navigate('/settings')
                  }}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition cursor-pointer"
                >
                  <UserIcon className="h-4 w-4 text-slate-400" />
                  <span>Profile details</span>
                </button>

                <Link
                  to="/settings"
                  role="menuitem"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition cursor-pointer"
                >
                  <SettingsIcon className="h-4 w-4 text-slate-400" />
                  <span>Workspace settings</span>
                </Link>
              </div>

              <div className="border-t border-slate-100 py-1">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setIsUserMenuOpen(false)
                    alert('Signed out successfully (demo UI).')
                  }}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition cursor-pointer"
                >
                  <LogOutIcon className="h-4 w-4 text-red-500" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}