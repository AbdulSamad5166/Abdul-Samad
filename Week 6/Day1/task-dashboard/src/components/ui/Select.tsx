import { forwardRef, useId, type ReactNode, type SelectHTMLAttributes } from 'react'
import { ChevronDownIcon } from './Icons'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options?: SelectOption[]
  error?: string
  hint?: string
  children?: ReactNode
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, options, error, hint, id, className = '', children, ...props },
  ref,
) {
  const generatedId = useId()
  const selectId = id || generatedId
  const hintId = `${selectId}-hint`
  const errorId = `${selectId}-error`

  const hasDescription = Boolean(error || hint)
  const ariaDescribedBy = hasDescription ? (error ? errorId : hintId) : undefined

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="mb-1.5 block text-xs font-semibold text-slate-700">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <select
          ref={ref}
          id={selectId}
          aria-invalid={Boolean(error)}
          aria-describedby={ariaDescribedBy}
          className={`h-9 w-full appearance-none rounded-lg border bg-white pl-3 pr-8 text-sm text-slate-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 cursor-pointer ${
            error
              ? 'border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500'
              : 'border-slate-200 hover:border-slate-300 focus-visible:border-indigo-500 focus-visible:ring-indigo-500'
          } ${className}`}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <span className="pointer-events-none absolute right-2.5 flex items-center text-slate-400">
          <ChevronDownIcon className="h-4 w-4" />
        </span>
      </div>
      {error && (
        <p id={errorId} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={hintId} className="mt-1 text-xs text-slate-500">
          {hint}
        </p>
      )}
    </div>
  )
})
