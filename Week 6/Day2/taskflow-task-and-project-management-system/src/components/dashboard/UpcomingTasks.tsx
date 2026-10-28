import React from 'react';
import { Link } from 'react-router-dom';
import { Task, Project } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { PRIORITY_LABELS } from '../../utils/constants';
import { formatDate, isDueToday, isOverdue } from '../../utils/dateHelpers';
import { ClockIcon, AlertIcon } from '../icons';

interface UpcomingTasksProps {
  tasks: Task[];
  projects: Project[];
}

export const UpcomingTasks: React.FC<UpcomingTasksProps> = ({ tasks, projects }) => {
  const projectMap = new Map(projects.map((p) => [p.id, p]));

  // Filter pending or in-progress tasks that are overdue, due today, or due soon
  const dueTasks = tasks
    .filter((t) => t.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  return (
    <Card
      headerPill="Schedule"
      title="Due Today & Upcoming"
      subtitle="Critical deadlines requiring your attention"
    >
      <div className="space-y-2.5">
        {dueTasks.length === 0 ? (
          <p className="py-6 text-center text-xs text-slate-400">All caught up! No upcoming tasks.</p>
        ) : (
          dueTasks.map((task) => {
            const project = projectMap.get(task.projectId);
            const overdue = isOverdue(task.dueDate);
            const dueToday = isDueToday(task.dueDate);

            return (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3 transition-all hover:bg-slate-100/70 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800"
              >
                <div className="min-w-0 flex-1 mr-3">
                  <div className="flex items-center gap-2">
                    {overdue && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-rose-600 dark:text-rose-400">
                        <AlertIcon className="w-3 h-3" />
                        OVERDUE
                      </span>
                    )}
                    {dueToday && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                        <ClockIcon className="w-3 h-3" />
                        TODAY
                      </span>
                    )}
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
                  </div>

                  <Link
                    to={`/tasks/${task.id}`}
                    className="mt-1 block text-xs font-semibold text-slate-900 truncate hover:text-primary dark:text-slate-100"
                  >
                    {task.title}
                  </Link>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Due: {formatDate(task.dueDate)}
                  </p>
                </div>

                <div className="shrink-0">
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
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};
