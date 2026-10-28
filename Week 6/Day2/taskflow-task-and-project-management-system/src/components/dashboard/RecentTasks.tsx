import React from 'react';
import { Link } from 'react-router-dom';
import { Task, Project } from '../../types';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { STATUS_LABELS } from '../../utils/constants';
import { formatDate } from '../../utils/dateHelpers';
import { CheckCircleIcon, ChevronRightIcon } from '../icons';

interface RecentTasksProps {
  tasks: Task[];
  projects: Project[];
  onToggleStatus: (taskId: string, currentStatus: Task['status']) => void;
}

export const RecentTasks: React.FC<RecentTasksProps> = ({
  tasks,
  projects,
  onToggleStatus,
}) => {
  const projectMap = new Map(projects.map((p) => [p.id, p]));

  return (
    <Card
      headerPill="Activity"
      title="Recent Tasks"
      subtitle="Latest tasks added or modified in your workspace"
      action={
        <Link
          to="/tasks"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          <span>View all</span>
          <ChevronRightIcon className="w-3.5 h-3.5" />
        </Link>
      }
    >
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {tasks.length === 0 ? (
          <p className="py-6 text-center text-xs text-slate-400">No recent tasks available.</p>
        ) : (
          tasks.map((task) => {
            const project = projectMap.get(task.projectId);
            const isCompleted = task.status === 'completed';

            return (
              <div
                key={task.id}
                className="flex items-center justify-between py-3 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30 rounded-lg px-2"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() =>
                      onToggleStatus(task.id, isCompleted ? 'pending' : 'completed')
                    }
                    aria-label={`Mark task ${task.title} as ${isCompleted ? 'pending' : 'completed'}`}
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors cursor-pointer ${
                      isCompleted
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-slate-300 hover:border-primary dark:border-slate-600'
                    }`}
                  >
                    {isCompleted && <CheckCircleIcon className="w-3.5 h-3.5" />}
                  </button>

                  <div className="min-w-0">
                    <Link
                      to={`/tasks/${task.id}`}
                      className={`block text-xs font-semibold truncate hover:text-primary ${
                        isCompleted
                          ? 'text-slate-400 line-through dark:text-slate-500'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {task.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-0.5">
                      {project && (
                        <span
                          className="text-[10px] font-medium px-1.5 py-0.2 rounded"
                          style={{
                            backgroundColor: `${project.color}20`,
                            color: project.color,
                          }}
                        >
                          {project.name}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400">
                        Due {formatDate(task.dueDate)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 ml-3">
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
          })
        )}
      </div>
    </Card>
  );
};
