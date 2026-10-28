import type { ReactNode } from 'react'
import { useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { useDarkMode } from '../../hooks/useDarkMode'
import type { Page } from '../../types'

interface Props {
  page: Page
  onNavigate: (page: Page) => void
  children: ReactNode
}

export default function Layout({ page, onNavigate, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { dark, toggle } = useDarkMode()

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar
        page={page}
        onNavigate={onNavigate}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar
          title={page}
          dark={dark}
          onToggleDark={toggle}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}