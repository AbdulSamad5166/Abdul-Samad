export type ProgressTone = 'indigo' | 'emerald' | 'amber' | 'blue' | 'rose'
export type ProgressSize = 'sm' | 'md' | 'lg'

export interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showPercentage?: boolean
  tone?: ProgressTone
  size?: ProgressSize
  className?: string
}

const TONE_STYLES: Record<ProgressTone, string> = {
  indigo: 'bg-indigo-600',
  emerald: 'bg-emerald-600',
  amber: 'bg-amber-500',
  blue: 'bg-blue-600',
  rose: 'bg-rose-500',
}

const SIZE_STYLES: Record<ProgressSize, string> = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-3.5',
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = false,
  tone = 'indigo',
  size = 'md',
  className = '',
}: ProgressBarProps) {
  const boundedValue = Math.min(Math.max(value, 0), max)
  const percentage = max === 0 ? 0 : Math.round((boundedValue / max) * 100)

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="mb-1.5 flex items-center justify-between text-xs">
          {label && <span className="font-medium text-slate-700">{label}</span>}
          {showPercentage && <span className="font-semibold text-slate-600">{percentage}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={boundedValue}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || 'Progress'}
        className={`w-full overflow-hidden rounded-full bg-slate-100 ${SIZE_STYLES[size]}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ${TONE_STYLES[tone]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
