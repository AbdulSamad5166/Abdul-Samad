import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTask, useUpdateTask, useDeleteTask } from '../hooks/useTasks';
import { useProjects } from '../hooks/useProjects';
import { useAuth } from '../hooks/useAuth';
import { taskService } from '../services/taskService';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { SubtaskList } from '../components/tasks/SubtaskList';
import { TaskForm } from '../components/tasks/TaskForm';
import { Skeleton } from '../components/ui/Skeleton';
import { Alert } from '../components/ui/Alert';
import { PRIORITY_LABELS, STATUS_LABELS } from '../utils/constants';
import { formatDate, isDueToday, isOverdue } from '../utils/dateHelpers';
import { formatRelativeTime } from '../utils/formatters';
import {
  ChevronLeftIcon,
  ClockIcon,
  AlertIcon,
  EditIcon,
  TrashIcon,
  CheckIcon,
} from '../components/icons';
import { TaskStatus } from '../types';

export const TaskDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: task, isLoading: taskLoading, error: taskError, refetch } = useTask(id);
  const { data: projects = [] } = useProjects();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);

  const project = projects.find((p) => p.id === task?.projectId);
  const overdue = task && task.status !== 'completed' && isOverdue(task.dueDate);
  const dueToday = task && task.status !== 'completed' && isDueToday(task.dueDate);

  // Subtask handlers
  const handleToggleSubtask = async (subtaskId: string) => {
    if (!task || !user?.id) return;
    const updated = await taskService.toggleSubtask(user.id, task.id, subtaskId);
    updateTaskMutation.mutate({ taskId: task.id, updates: { subtasks: updated.subtasks } });
  };

  const handleAddSubtask = async (title: string) => {
    if (!task || !user?.id) return;
    const updated = await taskService.addSubtask(user.id, task.id, title);
    updateTaskMutation.mutate({ taskId: task.id, updates: { subtasks: updated.subtasks } });
  };

  const handleDeleteSubtask = async (subtaskId: string) => {
    if (!task || !user?.id) return;
    const updated = await taskService.deleteSubtask(user.id, task.id, subtaskId);
    updateTaskMutation.mutate({ taskId: task.id, updates: { subtasks: updated.subtasks } });
  };

  // Comment submission
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task || !user?.id || !commentInput.trim()) return;

    setIsAddingComment(true);
    try {
      const author = user?.name || 'Workspace Member';
      const updated = await taskService.addComment(user.id, task.id, author, commentInput.trim());
      updateTaskMutation.mutate({
        taskId: task.id,
        updates: {
          comments: updated.comments,
          activityHistory: updated.activityHistory,
        },
      });
      setCommentInput('');
    } finally {
      setIsAddingComment(false);
    }
  };

  // Status quick change
  const handleStatusChange = (newStatus: TaskStatus) => {
    if (!task) return;
    updateTaskMutation.mutate({ taskId: task.id, updates: { status: newStatus } });
  };

  // Delete task
  const handleDeleteTask = async () => {
    if (!task) return;
    await deleteTaskMutation.mutateAsync(task.id);
    navigate('/tasks');
  };

  if (taskLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (taskError || !task) {
    return (
      <div className="py-12">
        <Alert type="error" title="Task Not Found">
          <p>The requested task does not exist or may have been deleted.</p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="outline" onClick={() => navigate('/tasks')}>
              Back to Tasks
            </Button>
            {taskError && (
              <Button size="sm" variant="primary" onClick={() => refetch()}>
                Retry
              </Button>
            )}
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Back button */}
      <div>
        <Link
          to="/tasks"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary dark:text-slate-400"
        >
          <ChevronLeftIcon className="w-4 h-4" />
          <span>Back to All Tasks</span>
        </Link>
      </div>

      {/* Page Header */}
      <PageHeader
        pill="Task Details"
        title={task.title}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<EditIcon className="w-3.5 h-3.5" />}
              onClick={() => setIsEditModalOpen(true)}
            >
              Edit Task
            </Button>
            <Button
              variant="danger"
              size="sm"
              leftIcon={<TrashIcon className="w-3.5 h-3.5" />}
              onClick={() => setIsDeleteConfirmOpen(true)}
            >
              Delete
            </Button>
          </>
        }
      />

      {/* Main Grid: Details & Subtasks on Left, Metadata & Activity on Right */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Details, Description, Subtasks, Comments */}
        <div className="space-y-6 lg:col-span-2">
          {/* Description & Overview Card */}
          <Card headerPill="Description" title="Task Overview">
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line">
              {task.description || 'No detailed description provided for this task.'}
            </p>

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-500 mr-1">Tags:</span>
                {task.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </Card>

          {/* Subtasks Checklist Card */}
          <Card headerPill="Checklist" title="Subtasks & Progress">
            <SubtaskList
              subtasks={task.subtasks}
              onToggle={handleToggleSubtask}
              onAdd={handleAddSubtask}
              onDelete={handleDeleteSubtask}
            />
          </Card>

          {/* Discussion / Notes Card */}
          <Card headerPill="Discussion" title="Notes & Comments">
            <div className="space-y-4">
              {/* Add comment input */}
              <form onSubmit={handleAddComment} className="space-y-2">
                <textarea
                  rows={2}
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Leave a comment or progress note..."
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    size="sm"
                    variant="primary"
                    disabled={!commentInput.trim()}
                    isLoading={isAddingComment}
                  >
                    Post Note
                  </Button>
                </div>
              </form>

              {/* Comment list */}
              <div className="space-y-3 pt-2 divide-y divide-slate-100 dark:divide-slate-800">
                {task.comments.length === 0 ? (
                  <p className="text-xs text-slate-400 py-3 text-center">
                    No comments yet. Start the conversation!
                  </p>
                ) : (
                  task.comments.map((comment) => (
                    <div key={comment.id} className="pt-3 flex items-start gap-3 text-xs">
                      <div className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 shrink-0 text-[10px]">
                        {comment.author.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {comment.author}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {formatRelativeTime(comment.createdAt)}
                          </span>
                        </div>
                        <p className="mt-1 text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Metadata & Activity History */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <Card headerPill="Attributes" title="Task Properties">
            <div className="space-y-4 text-xs">
              {/* Status */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Status
                </label>
                <div className="flex items-center gap-2">
                  <Badge
                    size="md"
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
                  <div className="flex gap-1 ml-auto">
                    {task.status !== 'completed' ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleStatusChange('completed')}
                        leftIcon={<CheckIcon className="w-3.5 h-3.5 text-emerald-500" />}
                      >
                        Complete
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleStatusChange('in_progress')}
                      >
                        Reopen
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Priority */}
              <div className="border-t border-slate-100 pt-3 dark:border-slate-800">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Priority
                </label>
                <Badge
                  size="md"
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

              {/* Due Date */}
              <div className="border-t border-slate-100 pt-3 dark:border-slate-800">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Due Date
                </label>
                {overdue ? (
                  <span className="inline-flex items-center gap-1 font-bold text-rose-600 dark:text-rose-400">
                    <AlertIcon className="w-4 h-4" />
                    <span>{formatDate(task.dueDate)} (OVERDUE)</span>
                  </span>
                ) : dueToday ? (
                  <span className="inline-flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                    <ClockIcon className="w-4 h-4" />
                    <span>Due Today</span>
                  </span>
                ) : (
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {formatDate(task.dueDate)}
                  </span>
                )}
              </div>

              {/* Project */}
              <div className="border-t border-slate-100 pt-3 dark:border-slate-800">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Project
                </label>
                {project ? (
                  <span
                    className="inline-block rounded-md px-2 py-1 font-bold text-xs"
                    style={{
                      backgroundColor: `${project.color}20`,
                      color: project.color,
                    }}
                  >
                    {project.name}
                  </span>
                ) : (
                  <span className="text-slate-400">No project</span>
                )}
              </div>

              {/* Created & Updated timestamp */}
              <div className="border-t border-slate-100 pt-3 text-[11px] text-slate-400 dark:border-slate-800">
                <div>Created: {formatDate(task.createdAt)}</div>
                <div className="mt-0.5">Updated: {formatRelativeTime(task.updatedAt)}</div>
              </div>
            </div>
          </Card>

          {/* Activity History Timeline Card */}
          <Card headerPill="Audit" title="Activity History">
            <div className="space-y-3">
              {task.activityHistory.length === 0 ? (
                <p className="text-xs text-slate-400 py-2">No activity recorded.</p>
              ) : (
                task.activityHistory.map((item) => (
                  <div key={item.id} className="relative pl-4 text-xs">
                    <span className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-primary" />
                    <p className="font-medium text-slate-800 dark:text-slate-200">{item.text}</p>
                    <span className="text-[10px] text-slate-400">
                      {formatRelativeTime(item.timestamp)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Task"
        description="Update task fields and checklist"
        maxWidth="lg"
      >
        <TaskForm
          initialTask={task}
          projects={projects}
          onSubmit={async (formData) => {
            const { subtasks: _subtasks, ...rest } = formData;
            await updateTaskMutation.mutateAsync({
              taskId: task.id,
              updates: rest,
            });
            setIsEditModalOpen(false);
          }}
          onCancel={() => setIsEditModalOpen(false)}
          isLoading={updateTaskMutation.isPending}
        />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? You will be able to undo this action immediately.`}
        confirmLabel="Delete Task"
        isDestructive
        isLoading={deleteTaskMutation.isPending}
      />
    </div>
  );
};
