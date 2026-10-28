import type { ReactNode } from 'react'

/**
 * =======================================================================
 * Day 4 Component: Reusable Navigation Elements
 * =======================================================================
 * Features:
 * - Semantic <nav> element
 * - Accessible aria-current="page" on active item
 * - Responsive layouts: works cleanly across mobile, tablet, and desktop
 * - Badge indicators, hover, and focus visible states
 * =======================================================================
 */

export interface NavItemType {
  id: string
  label: string
  icon?: ReactNode
  badge?: string | number
}

export interface NavigationProps {
  items: NavItemType[]
  activeId: string
  onSelect: (id: string) => void
  direction?: 'horizontal' | 'vertical'
  className?: string
}

export function Navigation({
  items,
  activeId,
  onSelect,
  direction = 'vertical',
  className = '',
}: NavigationProps) {
  const isVertical = direction === 'vertical'

  return (
    <nav
      className={`flex ${
        isVertical
          ? 'flex-col gap-1.5'
          : 'flex-row gap-2 overflow-x-auto pb-2 scrollbar-none'
      } ${className}`}
      aria-label="Sidebar Navigation"
    >
      {items.map((item) => {
        const isActive = activeId === item.id
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            aria-current={isActive ? 'page' : undefined}
            className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              isActive
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              {item.icon && (
                <span
                  className={`shrink-0 transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'
                  }`}
                >
                  {item.icon}
                </span>
              )}
              <span className="whitespace-nowrap">{item.label}</span>
            </div>

            {item.badge !== undefined && (
              <span
                className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                  isActive
                    ? 'bg-blue-700 text-white dark:bg-blue-500/40'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {item.badge}
              </span>
            )}
          </button>
        )
      })}
    </nav>
  )
}
