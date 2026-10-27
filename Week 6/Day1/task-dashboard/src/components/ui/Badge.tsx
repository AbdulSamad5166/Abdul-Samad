import type { ReactNode } from 'react'

export type BadgeTone = 'slate' | 'amber' | 'blue' | 'green' | 'red' | 'indigo' | 'purple'

const TONES: Record<BadgeTone, { badge: string; dot: string }> = {
  slate: {
    badge: 'bg-slate-100 text-slate-700 ring-slate-200',
    dot: 'bg-slate-400',
  },
  amber: {
    badge: 'bg-amber-50 text-amber-700 ring-amber-200/80',
    dot: 'bg-amber-500',
  },
  blue: {
    badge: 'bg-blue-50 text-blue-700 ring-blue-200/80',
    dot: 'bg-blue-500',
  },
  green: {
    badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200/80',
    dot: 'bg-emerald-500',
  },
  red: {
    badge: 'bg-red-50 text-red-700 ring-red-200/80',
    dot: 'bg-red-500',
  },
  indigo: {
    badge: 'bg-indigo-50 text-indigo-700 ring-indigo-200/80',
    dot: 'bg-indigo-500',
  },
  purple: {
    badge: 'bg-purple-50 text-purple-700 ring-purple-200/80',
    dot: 'bg-purple-500',
  },
}

export interface BadgeProps {
  tone?: BadgeTone
  dot?: boolean
  children: ReactNode
  className?: string
}

export function Badge({ tone = 'slate', dot = false, children, className = '' }: BadgeProps) {
  const currentTone = TONES[tone] || TONES.slate

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${currentTone.badge} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${currentTone.dot}`} aria-hidden="true" />}
      {children}
    </span>
  )
}