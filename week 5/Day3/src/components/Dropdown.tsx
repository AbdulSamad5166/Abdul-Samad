import { useState, useRef, useEffect, type ReactNode, type KeyboardEvent as ReactKeyboardEvent } from 'react'

/**
 * =======================================================================
 * Day 4 Component: Reusable Dropdown
 * =======================================================================
 * Features:
 * - Trigger element customizable via render or button
 * - Keyboard interactions: Enter/Space to toggle, Escape to close, arrow key focus
 * - Click-outside to close
 * - ARIA menu pattern: aria-haspopup, aria-expanded, role="menu", role="menuitem"
 * - Consistent border, shadow, and dark mode styling
 * =======================================================================
 */

export interface DropdownItem {
  id: string
  label: string
  icon?: ReactNode
  onClick?: () => void
  disabled?: boolean
  danger?: boolean
}

export interface DropdownProps {
  trigger: ReactNode
  items: DropdownItem[]
  align?: 'left' | 'right'
  className?: string
}

export function Dropdown({ trigger, items, align = 'right', className = '' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close on outside click or Escape key
  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleKeyDownMenu = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const buttons = menuRef.current?.querySelectorAll<HTMLButtonElement>(
        'button:not([disabled])'
      )
      if (!buttons || buttons.length === 0) return

      const currentIndex = Array.from(buttons).indexOf(document.activeElement as HTMLButtonElement)
      if (event.key === 'ArrowDown') {
        const nextIndex = (currentIndex + 1) % buttons.length
        buttons[nextIndex]?.focus()
      } else {
        const prevIndex = (currentIndex - 1 + buttons.length) % buttons.length
        buttons[prevIndex]?.focus()
      }
    }
  }

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      {/* Trigger element with ARIA bindings */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
            e.preventDefault()
            setIsOpen(true)
          }
        }}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        {trigger}
      </div>

      {/* Menu overlay container */}
      {isOpen && (
        <div
          ref={menuRef}
          role="menu"
          tabIndex={-1}
          onKeyDown={handleKeyDownMenu}
          className={`absolute ${
            align === 'right' ? 'right-0' : 'left-0'
          } mt-2 w-52 origin-top-right rounded-2xl border border-white/60 bg-white/90 p-1.5 shadow-xl backdrop-blur-xl ring-1 ring-black/5 focus:outline-none z-30 dark:border-slate-700/60 dark:bg-slate-900/90 dark:ring-white/10`}
        >
          {items.map((item) => (
            <button
              key={item.id}
              role="menuitem"
              type="button"
              disabled={item.disabled}
              onClick={() => {
                if (item.disabled) return
                item.onClick?.()
                setIsOpen(false)
              }}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors ${
                item.disabled
                  ? 'cursor-not-allowed opacity-40 text-slate-400'
                  : item.danger
                  ? 'text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
            >
              {item.icon && <span className="shrink-0">{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
