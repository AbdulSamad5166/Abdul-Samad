import React from 'react';
import { Link } from 'react-router-dom';
import { Project, Task } from '../../types';
import { Badge } from '../ui/Badge';
import { Dropdown } from '../ui/Dropdown';
import { PRIORITY_LABELS, STATUS_LABELS } from '../../utils/constants';
import { formatDate, isDueToday, isOverdue } from '../../utils/dateHelpers';
import {
  AlertIcon,
  CheckIcon,
  ClockIcon,
  EditIcon,
  MoreVerticalIcon,
  TrashIcon,
} from '../icons';

interface TaskRowProps {
  task: Task;
  project?: Project;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: Task['status']) => void;
  isSelected?: boolean;
  onToggleSelect?: (taskId: string) => void;
}

export const TaskRow: React.FC<TaskRowProps> = ({
  task,
  project,
  onEdit,
  onDelete,
  onStatusChange,
  isSelected = false,
  onToggleSelect,
}) => {
  const overdue = task.status !== 'completed' && isOverdue(task.dueDate);
  const dueToday = task.status !== 'completed' && isDueToday(task.dueDate);

  return (
    <tr
      className={`border-b border-slate-100 transition-colors hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-800/40 ${
        isSelected ? 'bg-primary/5' : ''
      }`}
    >
      {/* Checkbox column */}
      <td className="w-10 px-4 py-3 text-center">
        {onToggleSelect && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(task.id)}
            aria-label={`Select task ${task.title}`}
            className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
          />
        )}
      </td>

      {/* Title & tags */}
      <td className="px-4 py-3 min-w-[200px]">
        <Link
          to={`/tasks/${task.id}`}
          className={`block text-xs font-bold hover:text-primary ${
            task.status === 'completed'
              ? 'text-slate-400 line-through dark:text-slate-500'
              : 'text-slate-900 dark:text-white'
          }`}
        >
          {task.title}
        </Link>
        {task.tags && task.tags.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {task.tags.map((tag) => (
              <span
                key={tag}
                className="text-[9px] font-medium bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded dark:bg-slate-800 dark:text-slate-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </td>

      {/* Project */}
      <td className="px-4 py-3 hidden md:table-cell">
        {project ? (
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full inline-block"
            style={{
              backgroundColor: `${project.color}15`,
              color: project.color,
            }}
          >
            {project.name}
          </span>
        ) : (
          <span className="text-xs text-slate-400">—</span>
        )}
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <Badge
          size="sm"
          variant={
            task.status === 'completed'
              ? 'success'
              : task.status === 'in_progress'
              ? 'info'
              : 'warning'
          }
        >
          {STATUS_LABELS[task.status]}
        </Badge>
      </td>

      {/* Priority */}
      <td className="px-4 py-3 hidden sm:table-cell">
        <Badge
          size="sm"
          variant={
            task.priority === 'urgent'
              ? 'danger'
              : task.priority === 'high'
              ? 'warning'
              : 'default'
          }
        >
          {PRIORITY_LABELS[task.priority]}
        </Badge>
      </td>

      {/* Due Date */}
      <td className="px-4 py-3 whitespace-nowrap text-xs">
        {overdue ? (
          <span className="flex items-center gap-1 font-bold text-rose-600 dark:text-rose-400">
            <AlertIcon className="w-3.5 h-3.5" />
            <span>{formatDate(task.dueDate)}</span>
          </span>
        ) : dueToday ? (
          <span className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
            <ClockIcon className="w-3.5 h-3.5" />
            <span>Today</span>
          </span>
        ) : (
          <span className="text-slate-600 dark:text-slate-300">
            {formatDate(task.dueDate)}
          </span>
        )}
      </td>

      {/* Actions */}
      <td className="px-4 py-3 text-right">
        <Dropdown
          trigger={
            <button
              type="button"
              aria-label="Actions"
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 cursor-pointer"
            >
              <MoreVerticalIcon className="w-4 h-4" />
            </button>
          }
          items={[
            {
              id: 'edit',
              label: 'Edit',
              icon: <EditIcon className="w-3.5 h-3.5" />,
              onClick: () => onEdit(task),
            },
            {
              id: 'mark-complete',
              label: task.status === 'completed' ? 'Reopen Task' : 'Mark Completed',
              icon: <CheckIcon className="w-3.5 h-3.5 text-emerald-500" />,
              onClick: () =>
                onStatusChange(task.id, task.status === 'completed' ? 'pending' : 'completed'),
            },
            {
              id: 'delete',
              label: 'Delete',
              icon: <TrashIcon className="w-3.5 h-3.5" />,
              danger: true,
              onClick: () => onDelete(task.id),
            },
          ]}
        />
      </td>
    </tr>
  );
};
