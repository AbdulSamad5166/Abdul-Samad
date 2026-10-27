import type { TaskStatus } from '../../types/task'
import { STATUS_LABELS } from '../../utils/taskHelpers'
import { Badge, type BadgeTone } from '../ui/Badge'

const STATUS_TONES: Record<TaskStatus, BadgeTone> = {
  pending: 'amber',
  'in-progress': 'blue',
  completed: 'green',
}

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <Badge dot tone={STATUS_TONES[status]}>
      {STATUS_LABELS[status]}
    </Badge>
  )
}