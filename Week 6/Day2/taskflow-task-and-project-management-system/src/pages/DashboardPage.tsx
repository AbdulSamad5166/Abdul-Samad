import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks, useUpdateTask, useCreateTask } from '../hooks/useTasks';
import { useProjects } from '../hooks/useProjects';
import { useSync } from '../hooks/useSync';
import { PageHeader } from '../components/layout/PageHeader';
import { StatCard } from '../components/dashboard/StatCard';
import { RecentTasks } from '../components/dashboard/RecentTasks';
import { UpcomingTasks } from '../components/dashboard/UpcomingTasks';
import { BarChart } from '../components/charts/BarChart';
import { DonutChart } from '../components/charts/DonutChart';
import { ProgressRing } from '../components/charts/ProgressRing';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { TaskForm } from '../components/tasks/TaskForm';
import { Skeleton } from '../components/ui/Skeleton';
import { Alert } from '../components/ui/Alert';
import {
  TasksIcon,
  CheckCircleIcon,
  ClockIcon,
  AlertIcon,
  PlusIcon,
  BoardIcon,
  RefreshIcon,
  EmptyIllustration,
} from '../components/icons';
import { calculateProgressPercentage } from '../utils/formatters';
import { isOverdue } from '../utils/dateHelpers';
import { TaskStatus } from '../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: tasks = [], isLoading: tasksLoading, error: tasksError, refetch } = useTasks();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { isSyncing, syncNow, relativeLastSync, syncStatus, isOnline } = useSync();
  const updateTaskMutation = useUpdateTask();
  const createTaskMutation = useCreateTask();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Compute stats
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => t.status === 'pending').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const overdueTasks = tasks.filter((t) => t.status !== 'completed' && isOverdue(t.dueDate)).length;

  const completionRate = calculateProgressPercentage(completedTasks, totalTasks);

  // Bar chart data: tasks by status
  const barChartData = [
    { label: 'Pending', value: pendingTasks, colorClass: 'bg-amber-500' },
    { label: 'In Progress', value: inProgressTasks, colorClass: 'bg-blue-500' },
    { label: 'Completed', value: completedTasks, colorClass: 'bg-emerald-500' },
  ];

  // Donut chart data: tasks by priority
  const donutData = [
    { label: 'Low', value: tasks.filter((t) => t.priority === 'low').length, color: '#94a3b8' },
    { label: 'Medium', value: tasks.filter((t) => t.priority === 'medium').length, color: '#06b6d4' },
    { label: 'High', value: tasks.filter((t) => t.priority === 'high').length, color: '#f97316' },
    { label: 'Urgent', value: tasks.filter((t) => t.priority === 'urgent').length, color: '#f43f5e' },
  ];

  const handleToggleStatus = (taskId: string, newStatus: TaskStatus) => {
    updateTaskMutation.mutate({ taskId, updates: { status: newStatus } });
  };

  if (tasksLoading || projectsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (tasksError) {
    return (
      <div className="py-8">
        <Alert type="error" title="Could not load workspace data">
          <p>{tasksError.message}</p>
          <Button size="sm" variant="outline" className="mt-3" onClick={() => refetch()}>
            Retry Loading
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header with Sync button */}
      <PageHeader
        pill="Dashboard"
        title="Workspace Overview"
        description="Monitor tasks, track deadlines, and review productivity metrics"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              isLoading={isSyncing}
              disabled={isSyncing || !isOnline}
              leftIcon={<RefreshIcon className={`w-4 h-4 ${isSyncing ? 'animate-spin text-primary' : ''}`} />}
              onClick={() => syncNow()}
              title={`Last synced: ${relativeLastSync}`}
            >
              {isSyncing ? 'Syncing...' : syncStatus === 'failed' ? 'Retry Sync' : 'Sync Tasks'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<BoardIcon className="w-4 h-4" />}
              onClick={() => navigate('/board')}
            >
              Kanban Board
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<PlusIcon className="w-4 h-4" />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              New Task
            </Button>
          </div>
        }
      />

      {/* Zero tasks empty state banner */}
      {totalTasks === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/60 p-10 text-center dark:border-slate-800 dark:bg-slate-900/60 shadow-xs">
          <EmptyIllustration className="w-28 h-28 mx-auto text-primary" />
          <h2 className="mt-4 text-xl font-bold text-slate-800 dark:text-slate-200">
            Your workspace is clean and empty
          </h2>
          <p className="mx-auto mt-2 max-w-md text-xs text-slate-500 dark:text-slate-400">
            Get started by creating your own custom tasks, or synchronize with the REST API to populate your dashboard with initial items.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<PlusIcon className="w-4 h-4" />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create First Task
            </Button>
            <Button
              variant="outline"
              size="sm"
              isLoading={isSyncing}
              leftIcon={<RefreshIcon className="w-4 h-4" />}
              onClick={() => syncNow()}
            >
              Sync from API
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Counter Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            <StatCard
              title="Total Tasks"
              value={totalTasks}
              subtitle="All active & archive"
              icon={<TasksIcon className="w-5 h-5" />}
              highlightClass="text-slate-700 dark:text-slate-200"
              onClick={() => navigate('/tasks')}
            />
            <StatCard
              title="Pending"
              value={pendingTasks}
              subtitle="Waiting to start"
              icon={<ClockIcon className="w-5 h-5" />}
              highlightClass="text-amber-500"
              onClick={() => navigate('/tasks?filter=pending')}
            />
            <StatCard
              title="In Progress"
              value={inProgressTasks}
              subtitle="Actively underway"
              icon={<ClockIcon className="w-5 h-5" />}
              highlightClass="text-blue-500"
              onClick={() => navigate('/tasks?filter=in_progress')}
            />
            <StatCard
              title="Completed"
              value={completedTasks}
              subtitle={`${completionRate}% completion rate`}
              icon={<CheckCircleIcon className="w-5 h-5" />}
              highlightClass="text-emerald-500"
              onClick={() => navigate('/tasks?filter=completed')}
            />
            <StatCard
              title="Overdue"
              value={overdueTasks}
              subtitle="Missed deadline"
              icon={<AlertIcon className="w-5 h-5" />}
              highlightClass="text-rose-500"
              onClick={() => navigate('/tasks?filter=overdue')}
            />
          </div>

          {/* Completion Banner + Visual Charts Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Completion Progress Card */}
            <Card headerPill="Progress" title="Overall Completion" subtitle="Workspace execution health">
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <ProgressRing progress={completionRate} size={110} strokeWidth={10} />
                <div className="mt-4">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {completedTasks} of {totalTasks} Tasks Completed
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {totalTasks - completedTasks} remaining tasks across {projects.length} projects
                  </p>
                </div>
              </div>
            </Card>

            {/* Pure SVG Bar Chart: Tasks by Status */}
            <Card headerPill="Distribution" title="Tasks by Status" subtitle="Work items grouped by current workflow state">
              <BarChart data={barChartData} />
            </Card>

            {/* Pure SVG Donut Chart: Tasks by Priority */}
            <Card headerPill="Severity" title="Tasks by Priority" subtitle="Urgency distribution breakdown">
              <DonutChart data={donutData} size={130} centerLabel="Tasks" centerValue={totalTasks} />
            </Card>
          </div>

          {/* Recent & Upcoming Tasks Split */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <RecentTasks
              tasks={tasks.slice(0, 5)}
              projects={projects}
              onToggleStatus={handleToggleStatus}
            />
            <UpcomingTasks tasks={tasks} projects={projects} />
          </div>
        </>
      )}

      {/* Quick Task Creation Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Task"
        description="Add a task with title, priority, due date, tags, and checklist"
        maxWidth="lg"
      >
        <TaskForm
          projects={projects}
          onSubmit={async (formData) => {
            await createTaskMutation.mutateAsync(formData);
            setIsCreateModalOpen(false);
          }}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={createTaskMutation.isPending}
        />
      </Modal>
    </div>
  );
};
