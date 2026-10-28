import React, { useState } from 'react';
import { useTasks, useUpdateTask, useDeleteTask, useCreateTask } from '../hooks/useTasks';
import { useProjects } from '../hooks/useProjects';
import { useSync } from '../hooks/useSync';
import { PageHeader } from '../components/layout/PageHeader';
import { TaskBoard } from '../components/tasks/TaskBoard';
import { TaskForm } from '../components/tasks/TaskForm';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Skeleton } from '../components/ui/Skeleton';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { PlusIcon, RefreshIcon } from '../components/icons';
import { Task, TaskStatus } from '../types';

export const BoardPage: React.FC = () => {
  const { data: tasks = [], isLoading: tasksLoading, error: tasksError, refetch } = useTasks();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { isSyncing, syncNow, relativeLastSync, syncStatus, isOnline } = useSync();

  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const createTaskMutation = useCreateTask();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [initialColumnStatus, setInitialColumnStatus] = useState<TaskStatus>('pending');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    updateTaskMutation.mutate({ taskId, updates: { status: newStatus } });
  };

  const handleNewTaskInColumn = (status: TaskStatus) => {
    setInitialColumnStatus(status);
    setIsCreateModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingTaskId) return;
    await deleteTaskMutation.mutateAsync(deletingTaskId);
    setDeletingTaskId(null);
  };

  if (tasksLoading || projectsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Skeleton className="h-[450px]" />
          <Skeleton className="h-[450px]" />
          <Skeleton className="h-[450px]" />
        </div>
      </div>
    );
  }

  if (tasksError) {
    return (
      <div className="py-8">
        <Alert type="error" title="Failed to load Kanban board">
          <p>{tasksError.message}</p>
          <Button size="sm" variant="outline" className="mt-3" onClick={() => refetch()}>
            Retry
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        pill="Workflow"
        title="Kanban Board"
        description="Visualize task progress across Pending, In Progress, and Completed stages"
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
              variant="primary"
              size="sm"
              leftIcon={<PlusIcon className="w-4 h-4" />}
              onClick={() => handleNewTaskInColumn('pending')}
            >
              Add Task
            </Button>
          </div>
        }
      />

      <TaskBoard
        tasks={tasks}
        projects={projects}
        onEditTask={(task) => setEditingTask(task)}
        onDeleteTask={(taskId) => setDeletingTaskId(taskId)}
        onStatusChange={handleStatusChange}
        onNewTaskInColumn={handleNewTaskInColumn}
      />

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add Task to Board"
        description={`Creating task in ${initialColumnStatus} column`}
        maxWidth="lg"
      >
        <TaskForm
          initialStatus={initialColumnStatus}
          projects={projects}
          onSubmit={async (formData) => {
            await createTaskMutation.mutateAsync({
              ...formData,
              status: initialColumnStatus,
            });
            setIsCreateModalOpen(false);
          }}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={createTaskMutation.isPending}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        title="Edit Task"
        maxWidth="lg"
      >
        {editingTask && (
          <TaskForm
            initialTask={editingTask}
            projects={projects}
            onSubmit={async (formData) => {
              const { subtasks: _subtasks, ...rest } = formData;
              await updateTaskMutation.mutateAsync({
                taskId: editingTask.id,
                updates: rest,
              });
              setEditingTask(null);
            }}
            onCancel={() => setEditingTask(null)}
            isLoading={updateTaskMutation.isPending}
          />
        )}
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletingTaskId}
        onClose={() => setDeletingTaskId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? You can undo this action immediately."
        confirmLabel="Delete"
        isDestructive
        isLoading={deleteTaskMutation.isPending}
      />
    </div>
  );
};
