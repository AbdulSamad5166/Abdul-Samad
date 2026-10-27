import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'

export interface DropdownItem {
  id: string
  label: string
  icon?: ReactNode
  onClick?: () => void
  danger?: boolean
  divider?: boolean
}

export interface DropdownProps {
  trigger: ReactNode
  items: DropdownItem[]
  align?: 'left' | 'right'
  className?: string
}

export function Dropdown({
  trigger,
  items,
  align = 'right',
  className = '',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Close when pressing Escape
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const handleItemKeyDown = (
    e: KeyboardEvent<HTMLButtonElement>,
    item: DropdownItem,
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      item.onClick?.()
      setIsOpen(false)
    }
  }

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      <div
        role="button"
        tabIndex={0}
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setIsOpen((prev) => !prev)
          }
        }}
        className="cursor-pointer inline-flex items-center"
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className={`absolute z-30 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {items.map((item) => (
            <div key={item.id}>
              {item.divider && <div className="my-1 border-t border-slate-100" />}
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  item.onClick?.()
                  setIsOpen(false)
                }}
                onKeyDown={(e) => handleItemKeyDown(e, item)}
                className={`group flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-xs font-medium transition cursor-pointer ${
                  item.danger
                    ? 'text-red-600 hover:bg-red-50 hover:text-red-700'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {item.icon && (
                  <span
                    className={`shrink-0 transition ${
                      item.danger
                        ? 'text-red-500'
                        : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  >
                    {item.icon}
                  </span>
                )}
                <span>{item.label}</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
