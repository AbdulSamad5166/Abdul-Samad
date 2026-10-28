import type { HTMLAttributes } from 'react'

/**
 * =======================================================================
 * Day 4 Component: Reusable Loading Skeletons
 * =======================================================================
 * Features:
 * - Subtle pulse animation (animate-pulse)
 * - Harmonious light and dark mode colors
 * - Pre-composed skeletons for Cards and Tables
 * - Accessible: role="status", aria-live="polite", sr-only loading text
 * =======================================================================
 */

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function Skeleton({ className = '', ...rest }: SkeletonProps) {
  return (
    <div
      role="status"
      className={`animate-pulse rounded-md bg-slate-200 dark:bg-slate-800 ${className}`}
      {...rest}
    >
      <span className="sr-only">Loading content...</span>
    </div>
  )
}

/**
 * Skeleton placeholder for KPI Metric Cards
 */
export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <Skeleton className="h-3.5 w-24" />
      <Skeleton className="mt-3.5 h-8 w-32" />
      <Skeleton className="mt-3 h-4 w-28" />
    </div>
  )
}

/**
 * Skeleton placeholder for the Inventory Table
 */
export function TableSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800/70">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      ))}
    </div>
  )
}
