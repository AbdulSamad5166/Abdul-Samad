import type { ReactNode } from 'react'
import { Card } from '../ui/Card'
import { TrendingDownIcon, TrendingUpIcon } from '../ui/Icons'

export interface StatTrend {
  value: string
  isPositive: boolean
  label?: string
}

export interface StatCardProps {
  label: string
  value: number | string
  accentClass?: string
  icon?: ReactNode
  trend?: StatTrend
  subtitle?: string
}

export function StatCard({
  label,
  value,
  accentClass = 'text-slate-900',
  icon,
  trend,
  subtitle,
}: StatCardProps) {
  return (
    <Card hoverable className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
          <p className={`mt-2 text-2xl font-bold tracking-tight sm:text-3xl ${accentClass}`}>
            {value}
          </p>
        </div>
        {icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100/80 text-slate-600 shadow-2xs">
            {icon}
          </div>
        )}
      </div>

      {(trend || subtitle) && (
        <div className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          {trend && (
            <span
              className={`inline-flex items-center gap-1 font-semibold rounded-md px-1.5 py-0.5 text-[11px] ${
                trend.isPositive
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-rose-50 text-rose-700'
              }`}
            >
              {trend.isPositive ? (
                <TrendingUpIcon className="h-3 w-3" />
              ) : (
                <TrendingDownIcon className="h-3 w-3" />
              )}
              {trend.value}
            </span>
          )}
          <span className="text-slate-500 truncate">{trend?.label || subtitle}</span>
        </div>
      )}
    </Card>
  )
}