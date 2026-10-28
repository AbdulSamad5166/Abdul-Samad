import type { ReactNode } from 'react'

interface Props {
  title?: string
  children: ReactNode
  className?: string
}

export default function Card({ title, children, className = '' }: Props) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className}`}
    >
      {title && (
        <h3 className="mb-4 text-base font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
      )}
      {children}
    </div>
  )
}