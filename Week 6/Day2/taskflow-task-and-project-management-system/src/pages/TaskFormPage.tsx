import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCreateTask } from '../hooks/useTasks';
import { useProjects } from '../hooks/useProjects';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { TaskForm } from '../components/tasks/TaskForm';
import { ChevronLeftIcon } from '../components/icons';

export const TaskFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: projects = [] } = useProjects();
  const createTaskMutation = useCreateTask();

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-12">
      <div>
        <Link
          to="/tasks"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary dark:text-slate-400"
        >
          <ChevronLeftIcon className="w-4 h-4" />
          <span>Back to All Tasks</span>
        </Link>
      </div>

      <PageHeader
        pill="Create"
        title="Create New Task"
        description="Define task specifications, deadlines, assign to a project, and add checklist items"
      />

      <Card headerPill="Form" title="Task Details">
        <TaskForm
          projects={projects}
          onSubmit={async (data) => {
            await createTaskMutation.mutateAsync(data);
            navigate('/tasks');
          }}
          onCancel={() => navigate('/tasks')}
          isLoading={createTaskMutation.isPending}
        />
      </Card>
    </div>
  );
};
