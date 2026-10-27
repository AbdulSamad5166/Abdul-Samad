import type { Task } from '../../types/task'
import { formatDate } from '../../utils/taskHelpers'
import { CalendarIcon } from '../ui/Icons'
import { PriorityBadge } from './PriorityBadge'
import { StatusBadge } from './StatusBadge'

interface TaskCardProps {
  task: Task
  showStatus?: boolean
  onClick?: () => void
}

export function TaskCard({ task, showStatus = false, onClick }: TaskCardProps) {
  return (
    <article
      onClick={onClick}
      className="group relative rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
          {task.title}
        </h3>
        <div className="shrink-0">
          <PriorityBadge priority={task.priority} />
        </div>
      </div>

      <p className="mt-2 line-clamp-2 text-xs text-slate-600 leading-relaxed">
        {task.description}
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <div className="flex items-center gap-1.5 text-slate-500">
          <CalendarIcon className="h-3.5 w-3.5 text-slate-400" />
          <time dateTime={task.dueDate} className="font-medium text-[11px]">
            {formatDate(task.dueDate)}
          </time>
        </div>
        {showStatus && <StatusBadge status={task.status} />}
      </div>
    </article>
  )
}