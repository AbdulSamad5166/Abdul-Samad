import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, leftIcon, rightIcon, id, className = '', ...props },
  ref,
) {
  const generatedId = useId()
  const inputId = id || generatedId
  const hintId = `${inputId}-hint`
  const errorId = `${inputId}-error`

  const ariaDescribedBy = error ? errorId : hint ? hintId : undefined

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-xs font-semibold text-slate-700">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 flex items-center text-slate-400">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={ariaDescribedBy}
          className={`h-9 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
            leftIcon ? 'pl-9' : ''
          } ${rightIcon ? 'pr-9' : ''} ${
            error
              ? 'border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500'
              : 'border-slate-200 hover:border-slate-300 focus-visible:border-indigo-500 focus-visible:ring-indigo-500'
          } ${className}`}
          {...props}
        />
        {rightIcon && (
          <span className="pointer-events-none absolute right-3 flex items-center text-slate-400">
            {rightIcon}
          </span>
        )}
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
