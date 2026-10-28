import type { ReactNode } from 'react'

/**
 * =======================================================================
 * Day 4 Component: Reusable Alert
 * =======================================================================
 * Features:
 * - Variants: success, error, warning, info
 * - Accessible: role="alert", aria-live="polite"
 * - Optional dismiss button
 * - Semantic icons and coordinated color borders/backgrounds
 * =======================================================================
 */

export type AlertVariant = 'success' | 'error' | 'warning' | 'info'

export interface AlertProps {
  variant?: AlertVariant
  title?: string
  children: ReactNode
  onClose?: () => void
  className?: string
}

const variantStyles: Record<
  AlertVariant,
  { container: string; icon: string; title: string; defaultIcon: string }
> = {
  info: {
    container:
      'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-200',
    icon: 'text-blue-600 dark:text-blue-400',
    title: 'text-blue-900 dark:text-blue-100',
    defaultIcon: 'ℹ️',
  },
  success: {
    container:
      'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200',
    icon: 'text-emerald-600 dark:text-emerald-400',
    title: 'text-emerald-900 dark:text-emerald-100',
    defaultIcon: '✓',
  },
  warning: {
    container:
      'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200',
    icon: 'text-amber-600 dark:text-amber-400',
    title: 'text-amber-900 dark:text-amber-100',
    defaultIcon: '⚠️',
  },
  error: {
    container:
      'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200',
    icon: 'text-rose-600 dark:text-rose-400',
    title: 'text-rose-900 dark:text-rose-100',
    defaultIcon: '✕',
  },
}

export function Alert({
  variant = 'info',
  title,
  children,
  onClose,
  className = '',
}: AlertProps) {
  const styles = variantStyles[variant]

  return (
    <div
      role="alert"
      className={`relative flex items-start gap-3 rounded-xl border p-4 text-xs transition-all duration-200 ${styles.container} ${className}`}
    >
      {/* Icon badge */}
      <span className={`shrink-0 font-bold ${styles.icon}`} aria-hidden="true">
        {styles.defaultIcon}
      </span>

      {/* Content */}
      <div className="flex-1">
        {title && <h4 className={`font-semibold ${styles.title} mb-0.5`}>{title}</h4>}
        <div className="leading-relaxed">{children}</div>
      </div>

      {/* Optional Close Button */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss alert"
          className="ml-2 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <span className="text-sm font-bold leading-none" aria-hidden="true">
            ✕
          </span>
        </button>
      )}
    </div>
  )
}
