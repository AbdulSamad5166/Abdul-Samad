import type { HTMLAttributes, ReactNode } from 'react'

/**
 * =======================================================================
 * Day 4 Component: Reusable Card
 * =======================================================================
 * Features:
 * - Consistent border, rounded-2xl, background, and dark mode styling
 * - Subcomponents: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
 * - Hover elevation effect matching Day 3 pattern
 * =======================================================================
 */

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  hoverable?: boolean
  glass?: boolean
  className?: string
}

export function Card({
  children,
  hoverable = true,
  glass = true,
  className = '',
  ...rest
}: CardProps) {
  const baseStyles = glass
    ? 'glass-panel rounded-2xl shadow-xs transition-all duration-200'
    : 'rounded-2xl border border-slate-200 bg-white shadow-xs transition-all duration-200 dark:border-slate-800 dark:bg-slate-900'

  const hoverStyles = hoverable
    ? 'hover:shadow-lg hover:-translate-y-0.5 hover:border-slate-300 dark:hover:border-slate-700'
    : ''

  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
}

export function CardHeader({ children, className = '', ...rest }: CardHeaderProps) {
  return (
    <div className={`p-5 pb-3 md:p-6 md:pb-4 ${className}`} {...rest}>
      {children}
    </div>
  )
}

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode
  className?: string
}

export function CardTitle({ children, className = '', ...rest }: CardTitleProps) {
  return (
    <h3
      className={`text-lg font-semibold tracking-tight text-slate-900 dark:text-white ${className}`}
      {...rest}
    >
      {children}
    </h3>
  )
}

export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode
  className?: string
}

export function CardDescription({ children, className = '', ...rest }: CardDescriptionProps) {
  return (
    <p className={`mt-0.5 text-xs text-slate-500 dark:text-slate-400 ${className}`} {...rest}>
      {children}
    </p>
  )
}

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
}

export function CardContent({ children, className = '', ...rest }: CardContentProps) {
  return (
    <div className={`p-5 pt-0 md:p-6 md:pt-0 ${className}`} {...rest}>
      {children}
    </div>
  )
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
}

export function CardFooter({ children, className = '', ...rest }: CardFooterProps) {
  return (
    <div
      className={`border-t border-slate-100 p-4 dark:border-slate-800/80 md:px-6 ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
