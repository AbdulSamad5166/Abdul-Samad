import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'

/**
 * =======================================================================
 * Day 4 Component: Reusable Input
 * =======================================================================
 * Features:
 * - Label association with htmlFor & id
 * - Validation states: default, error, success
 * - Accessible error and helper messages via aria-describedby
 * - Consistent border, rounded corners, focus rings, dark mode support
 * =======================================================================
 */

export type InputState = 'default' | 'error' | 'success'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  state?: InputState
  icon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      label,
      error,
      helperText,
      state = 'default',
      icon,
      className = '',
      disabled = false,
      ...rest
    },
    ref
  ) => {
    // Generate fallback ID if not supplied
    const fallbackId = useId()
    const inputId = id || fallbackId
    const errorId = `${inputId}-error`
    const helperId = `${inputId}-helper`

    const resolvedState: InputState = error ? 'error' : state

    // Border and focus state colors
    const stateStyles = {
      default:
        'border-slate-300 hover:border-slate-400 focus:border-blue-500 focus:ring-blue-500/20 dark:border-slate-700 dark:hover:border-slate-600 dark:focus:border-blue-500 dark:focus:ring-blue-500/30',
      error:
        'border-rose-500 text-rose-900 focus:border-rose-500 focus:ring-rose-500/20 dark:border-rose-500 dark:text-rose-100 dark:focus:border-rose-500 dark:focus:ring-rose-500/30',
      success:
        'border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20 dark:border-emerald-500 dark:focus:border-emerald-500 dark:focus:ring-emerald-500/30',
    }

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
          >
            {label}
            {rest.required && <span className="ml-1 text-rose-500">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {icon && (
            <div className="pointer-events-none absolute left-3 flex items-center text-slate-400 dark:text-slate-500">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={resolvedState === 'error'}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 shadow-xs transition-all duration-150 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-60 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:disabled:bg-slate-900 ${
              icon ? 'pl-9' : ''
            } ${stateStyles[resolvedState]} ${className}`}
            {...rest}
          />
        </div>

        {error && (
          <p id={errorId} className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p id={helperId} className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
