import type { ReactNode } from 'react'

/**
 * =======================================================================
 * Day 4 Component: Reusable Badge
 * =======================================================================
 * Features:
 * - Variants: success, warning, danger, info, neutral
 * - Optional status dot indicator
 * - Sizes: sm, md
 * - Rounded-full pill styling with matching borders/rings and dark mode
 * =======================================================================
 */

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral'
export type BadgeSize = 'sm' | 'md'

export interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
  dot?: boolean
  className?: string
}

const variantStyles: Record<BadgeVariant, { pill: string; dot: string }> = {
  success: {
    pill: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/30',
    dot: 'bg-emerald-500',
  },
  warning: {
    pill: 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/30',
    dot: 'bg-amber-500',
  },
  danger: {
    pill: 'bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/30',
    dot: 'bg-rose-500',
  },
  info: {
    pill: 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/30',
    dot: 'bg-blue-500',
  },
  neutral: {
    pill: 'bg-slate-100 text-slate-700 ring-slate-400/20 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700',
    dot: 'bg-slate-400',
  },
}

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[11px]',
  md: 'px-2.5 py-1 text-xs',
}

export function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
}: BadgeProps) {
  const styles = variantStyles[variant]

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ring-1 ${styles.pill} ${sizeStyles[size]} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} aria-hidden="true" />}
      <span>{children}</span>
    </span>
  )
}
