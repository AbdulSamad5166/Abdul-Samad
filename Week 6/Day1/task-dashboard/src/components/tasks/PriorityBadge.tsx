import type { TaskPriority } from '../../types/task'
import { PRIORITY_LABELS } from '../../utils/taskHelpers'
import { Badge, type BadgeTone } from '../ui/Badge'

const PRIORITY_TONES: Record<TaskPriority, BadgeTone> = {
  low: 'slate',
  medium: 'amber',
  high: 'red',
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <Badge dot tone={PRIORITY_TONES[priority]}>
      {PRIORITY_LABELS[priority]}
    </Badge>
  )
}