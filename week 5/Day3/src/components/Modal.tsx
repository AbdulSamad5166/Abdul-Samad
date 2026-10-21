import { useEffect, useRef, type ReactNode } from 'react'
import { Button } from './Button.tsx'

/**
 * =======================================================================
 * Day 4 Component: Reusable Modal
 * =======================================================================
 * Features:
 * - Backdrop overlay with subtle blur
 * - Keyboard support: closes on Escape key
 * - Focus management: moves focus into modal on open and restores on close
 * - Accessibility: role="dialog", aria-modal="true", aria-labelledby
 * - Close button (X) and backdrop click handling
 * =======================================================================
 */

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
}

const maxWidthStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 'md',
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // Listen for Escape key
  useEffect(() => {
    if (!isOpen) return

    // Save previous active element to restore focus on close
    previousFocusRef.current = document.activeElement as HTMLElement

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    // Prevent background scroll
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Focus the dialog container or first interactive element
    setTimeout(() => {
      if (dialogRef.current) {
        const firstFocusable = dialogRef.current.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (firstFocusable) {
          firstFocusable.focus()
        } else {
          dialogRef.current.focus()
        }
      }
    }, 50)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = originalOverflow
      if (previousFocusRef.current) {
        previousFocusRef.current.focus()
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const titleId = 'modal-title'
  const descId = 'modal-description'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop overlay with click-to-close */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Content Container */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={`relative z-10 w-full ${maxWidthStyles[maxWidth]} rounded-3xl border border-white/60 bg-white/90 p-6 shadow-2xl backdrop-blur-2xl transition-all duration-200 focus:outline-none dark:border-slate-700/60 dark:bg-slate-900/90`}
      >
        {/* Header with Title and Close Button */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 id={titleId} className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h3>
            {description && (
              <p id={descId} className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {description}
              </p>
            )}
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            aria-label="Close modal"
            className="h-8 w-8 !p-0 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-white"
          >
            <span className="text-base leading-none" aria-hidden="true">
              ✕
            </span>
          </Button>
        </div>

        {/* Modal Body */}
        <div className="mt-4">{children}</div>

        {/* Optional Footer */}
        {footer && <div className="mt-6 flex items-center justify-end gap-3">{footer}</div>}
      </div>
    </div>
  )
}
