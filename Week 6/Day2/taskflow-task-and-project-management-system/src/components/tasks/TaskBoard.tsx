import React from 'react';
import { Project, Task, TaskStatus } from '../../types';
import { TaskCard } from './TaskCard';
import { PlusIcon } from '../icons';
import { Button } from '../ui/Button';

interface TaskBoardProps {
  tasks: Task[];
  projects: Project[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onNewTaskInColumn?: (status: TaskStatus) => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  projects,
  onEditTask,
  onDeleteTask,
  onStatusChange,
  onNewTaskInColumn,
}) => {
  const projectMap = new Map(projects.map((p) => [p.id, p]));

  const columns: { id: TaskStatus; title: string; colorDot: string; bgTint: string }[] = [
    {
      id: 'pending',
      title: 'To Do / Pending',
      colorDot: 'bg-amber-500',
      bgTint: 'bg-amber-500/5',
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      colorDot: 'bg-blue-500',
      bgTint: 'bg-blue-500/5',
    },
    {
      id: 'completed',
      title: 'Completed',
      colorDot: 'bg-emerald-500',
      bgTint: 'bg-emerald-500/5',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-start">
      {columns.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.id);

        return (
          <div
            key={col.id}
            className="flex flex-col rounded-2xl border border-slate-200/80 bg-slate-100/60 p-4 dark:border-slate-800 dark:bg-slate-900/50 min-h-[500px]"
          >
            {/* Column Header */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${col.colorDot}`} />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {col.title}
                </h3>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-slate-600 shadow-2xs dark:bg-slate-800 dark:text-slate-300">
                  {columnTasks.length}
                </span>
              </div>

              {onNewTaskInColumn && (
                <button
                  type="button"
                  onClick={() => onNewTaskInColumn(col.id)}
                  aria-label={`Add task in ${col.title}`}
                  className="rounded-lg p-1 text-slate-500 hover:bg-white hover:text-primary dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Column Cards */}
            <div className="space-y-3 flex-1">
              {columnTasks.length === 0 ? (
                <div className="flex h-36 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 p-4 text-center dark:border-slate-800">
                  <p className="text-xs text-slate-400">No tasks in this stage</p>
                  {onNewTaskInColumn && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onNewTaskInColumn(col.id)}
                      leftIcon={<PlusIcon className="w-3.5 h-3.5" />}
                      className="mt-2 text-xs"
                    >
                      Add task
                    </Button>
                  )}
                </div>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    project={projectMap.get(task.projectId)}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                    onStatusChange={onStatusChange}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
