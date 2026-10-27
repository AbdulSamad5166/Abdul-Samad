import type { HTMLAttributes, ReactNode } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
  hoverable?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const PADDING_STYLES = {
  none: '',
  sm: 'p-3 sm:p-4',
  md: 'p-4 sm:p-5',
  lg: 'p-6 sm:p-8',
}

export function Card({
  children,
  className = '',
  hoverable = false,
  padding = 'md',
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-all ${
        hoverable ? 'hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5' : ''
      } ${PADDING_STYLES[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}