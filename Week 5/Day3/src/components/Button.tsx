import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'

/**
 * =======================================================================
 * Day 4 Component: Reusable Button
 * =======================================================================
 * Features:
 * - Variants: primary, secondary, outline, danger
 * - Sizes: sm, md, lg
 * - States: hover, active, focus-visible ring, disabled (opacity & pointer-events)
 * - Accessibility: visible focus ring, type safety, accessible contrast
 * =======================================================================
 */

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: ReactNode
  children: ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-blue-600 text-white shadow-xs hover:bg-blue-500 hover:shadow-md hover:shadow-blue-500/20 focus-visible:ring-blue-500 active:scale-95 disabled:hover:bg-blue-600 dark:focus-visible:ring-offset-slate-900',
  secondary:
    'border border-slate-200/80 bg-white/80 backdrop-blur-md text-slate-700 shadow-xs hover:bg-white hover:text-slate-900 hover:border-slate-300 focus-visible:ring-blue-500 active:scale-95 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white dark:hover:border-slate-600 dark:focus-visible:ring-offset-slate-900',
  outline:
    'border border-blue-600/80 text-blue-600 bg-blue-50/40 backdrop-blur-xs hover:bg-blue-100/50 focus-visible:ring-blue-500 active:scale-95 dark:border-blue-400/80 dark:text-blue-400 dark:hover:bg-blue-950/50 dark:focus-visible:ring-offset-slate-900',
  danger:
    'bg-rose-600 text-white shadow-xs hover:bg-rose-500 hover:shadow-md hover:shadow-rose-500/20 focus-visible:ring-rose-500 active:scale-95 disabled:hover:bg-rose-600 dark:focus-visible:ring-offset-slate-900',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-2.5 py-1.5 text-xs rounded-md gap-1.5',
  md: 'px-3.5 py-2 text-sm rounded-lg gap-2',
  lg: 'px-5 py-2.5 text-base rounded-xl gap-2.5',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon,
      children,
      className = '',
      disabled = false,
      type = 'button',
      ...rest
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={`inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:active:scale-100 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...rest}
      >
        {icon && <span className="inline-flex shrink-0 items-center justify-center">{icon}</span>}
        <span>{children}</span>
      </button>
    )
  }
)

Button.displayName = 'Button'
