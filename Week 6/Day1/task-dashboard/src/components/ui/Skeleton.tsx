export type SkeletonVariant = 'text' | 'circular' | 'rectangular'

export interface SkeletonProps {
  variant?: SkeletonVariant
  className?: string
  width?: string | number
  height?: string | number
}

const VARIANT_STYLES: Record<SkeletonVariant, string> = {
  text: 'h-4 w-full rounded',
  circular: 'rounded-full',
  rectangular: 'rounded-xl',
}

export function Skeleton({
  variant = 'rectangular',
  className = '',
  width,
  height,
}: SkeletonProps) {
  const style: React.CSSProperties = {
    ...(width !== undefined && { width }),
    ...(height !== undefined && { height }),
  }

  return (
    <div
      aria-hidden="true"
      style={style}
      className={`animate-pulse bg-slate-200/80 ${VARIANT_STYLES[variant]} ${className}`}
    />
  )
}
