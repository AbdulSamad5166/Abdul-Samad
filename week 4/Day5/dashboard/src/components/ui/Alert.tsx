import type { ReactNode } from 'react'

interface Props {
  type?: 'success' | 'error'
  children: ReactNode
  onClose?: () => void
}

export default function Alert({ type = 'success', children, onClose }: Props) {
  const color =
    type === 'success'
      ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'
      : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'
  return (
    <div role="alert" className={`flex items-center justify-between rounded-lg border px-4 py-3 text-sm ${color}`}>
      <span>{children}</span>
      {onClose && (
        <button onClick={onClose} aria-label="Dismiss" className="ml-4 font-bold">
          ×
        </button>
      )}
    </div>
  )
}