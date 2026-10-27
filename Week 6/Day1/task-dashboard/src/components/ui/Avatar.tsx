export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away'

export interface AvatarProps {
  name: string
  src?: string
  size?: AvatarSize
  status?: AvatarStatus
  className?: string
}

const SIZE_STYLES: Record<AvatarSize, { container: string; text: string; dot: string }> = {
  xs: { container: 'h-6 w-6', text: 'text-[10px]', dot: 'h-1.5 w-1.5' },
  sm: { container: 'h-8 w-8', text: 'text-xs', dot: 'h-2 w-2' },
  md: { container: 'h-9 w-9', text: 'text-xs', dot: 'h-2.5 w-2.5' },
  lg: { container: 'h-11 w-11', text: 'text-sm', dot: 'h-3 w-3' },
  xl: { container: 'h-14 w-14', text: 'text-base', dot: 'h-3.5 w-3.5' },
}

const STATUS_STYLES: Record<AvatarStatus, string> = {
  online: 'bg-emerald-500 ring-white',
  offline: 'bg-slate-400 ring-white',
  busy: 'bg-red-500 ring-white',
  away: 'bg-amber-500 ring-white',
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0 || !parts[0]) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function Avatar({
  name,
  src,
  size = 'md',
  status,
  className = '',
}: AvatarProps) {
  const currentSize = SIZE_STYLES[size]
  const initials = getInitials(name)

  return (
    <div className={`relative inline-flex shrink-0 ${currentSize.container} ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className="h-full w-full rounded-full object-cover ring-1 ring-slate-200"
        />
      ) : (
        <div
          aria-label={name}
          className={`flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 font-semibold text-white shadow-xs ${currentSize.text}`}
        >
          {initials}
        </div>
      )}
      {status && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ring-2 ${currentSize.dot} ${STATUS_STYLES[status]}`}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  )
}
