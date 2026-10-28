import React from 'react';
import { Link } from 'react-router-dom';
import { Project, Task } from '../../types';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { Dropdown } from '../ui/Dropdown';
import { PRIORITY_LABELS, STATUS_LABELS } from '../../utils/constants';
import { formatDate, isDueToday, isOverdue } from '../../utils/dateHelpers';
import { calculateProgressPercentage } from '../../utils/formatters';
import {
  ClockIcon,
  AlertIcon,
  EditIcon,
  TrashIcon,
  CheckIcon,
  MoreVerticalIcon,
} from '../icons';

interface TaskCardProps {
  task: Task;
  project?: Project;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: Task['status']) => void;
  isSelected?: boolean;
  onToggleSelect?: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  project,
  onEdit,
  onDelete,
  onStatusChange,
  isSelected = false,
  onToggleSelect,
}) => {
  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const totalSubtasks = task.subtasks.length;
  const subtaskProgress = calculateProgressPercentage(completedSubtasks, totalSubtasks);
  const overdue = task.status !== 'completed' && isOverdue(task.dueDate);
  const dueToday = task.status !== 'completed' && isDueToday(task.dueDate);

  return (
    <div
      className={`group relative rounded-2xl border bg-white p-4.5 shadow-2xs transition-all duration-200 hover:shadow-md dark:bg-slate-900 ${
        isSelected
          ? 'border-primary ring-2 ring-primary/20'
          : 'border-slate-200/80 hover:border-slate-300 dark:border-slate-800'
      }`}
    >
      {/* Top Header: Select box, Project badge, Priority, Actions */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {onToggleSelect && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect(task.id)}
              aria-label={`Select task ${task.title}`}
              className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
            />
          )}

          {project && (
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: `${project.color}15`,
                color: project.color,
              }}
            >
              {project.name}
            </span>
          )}

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
        </div>

        {/* Dropdown menu */}
        <Dropdown
          trigger={
            <button
              type="button"
              aria-label="Task options"
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 cursor-pointer"
            >
              <MoreVerticalIcon className="w-4 h-4" />
            </button>
          }
          items={[
            {
              id: 'edit',
              label: 'Edit Task',
              icon: <EditIcon className="w-3.5 h-3.5" />,
              onClick: () => onEdit(task),
            },
            {
              id: 'status-pending',
              label: 'Mark as Pending',
              icon: <ClockIcon className="w-3.5 h-3.5 text-amber-500" />,
              onClick: () => onStatusChange(task.id, 'pending'),
              disabled: task.status === 'pending',
            },
            {
              id: 'status-progress',
              label: 'Mark as In Progress',
              icon: <ClockIcon className="w-3.5 h-3.5 text-blue-500" />,
              onClick: () => onStatusChange(task.id, 'in_progress'),
              disabled: task.status === 'in_progress',
            },
            {
              id: 'status-completed',
              label: 'Mark as Completed',
              icon: <CheckIcon className="w-3.5 h-3.5 text-emerald-500" />,
              onClick: () => onStatusChange(task.id, 'completed'),
              disabled: task.status === 'completed',
            },
            {
              id: 'delete',
              label: 'Delete Task',
              icon: <TrashIcon className="w-3.5 h-3.5" />,
              danger: true,
              onClick: () => onDelete(task.id),
            },
          ]}
        />
      </div>

      {/* Task Title & Description */}
      <div className="mt-3">
        <Link
          to={`/tasks/${task.id}`}
          className="text-sm font-bold text-slate-900 line-clamp-2 hover:text-primary dark:text-white"
        >
          {task.title}
        </Link>
        {task.description && (
          <p className="mt-1 text-xs text-slate-500 line-clamp-2 dark:text-slate-400 leading-relaxed">
            {task.description}
          </p>
        )}
      </div>

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md dark:bg-slate-800 dark:text-slate-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Subtasks Progress */}
      {totalSubtasks > 0 && (
        <div className="mt-3">
          <div className="flex justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            <span>Checklist</span>
            <span>
              {completedSubtasks}/{totalSubtasks} ({subtaskProgress}%)
            </span>
          </div>
          <ProgressBar value={subtaskProgress} size="sm" />
        </div>
      )}

      {/* Footer: Due date with warning, Status badge */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs dark:border-slate-800/80">
        <div className="flex items-center gap-1.5">
          {overdue ? (
            <span className="flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400">
              <AlertIcon className="w-3.5 h-3.5" />
              <span>{formatDate(task.dueDate)}</span>
            </span>
          ) : dueToday ? (
            <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
              <ClockIcon className="w-3.5 h-3.5" />
              <span>Today</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
              <ClockIcon className="w-3.5 h-3.5" />
              <span>{formatDate(task.dueDate)}</span>
            </span>
          )}
        </div>

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
      </div>
    </div>
  );
};
