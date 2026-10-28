import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useBulkUpdateStatus,
  useBulkDelete,
} from '../hooks/useTasks';
import { useProjects } from '../hooks/useProjects';
import { useTaskFilters } from '../hooks/useTaskFilters';
import { useTheme } from '../hooks/useTheme';
import { useSync } from '../hooks/useSync';
import { PageHeader } from '../components/layout/PageHeader';
import { TaskFilters } from '../components/tasks/TaskFilters';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskRow } from '../components/tasks/TaskRow';
import { TaskForm } from '../components/tasks/TaskForm';
import { BulkActionBar } from '../components/tasks/BulkActionBar';
import { Pagination } from '../components/ui/Pagination';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { PlusIcon, RefreshIcon, DownloadIcon } from '../components/icons';
import { filterTasks, sortTasks, paginate } from '../utils/sortingFiltering';
import { Task, TaskStatus } from '../types';

export const TasksPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { defaultView } = useTheme();
  const { isSyncing, syncNow, loadMore, relativeLastSync, syncStatus, isOnline } = useSync();

  const { data: tasks = [], isLoading: tasksLoading, error: tasksError, refetch } = useTasks();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();

  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const bulkUpdateMutation = useBulkUpdateStatus();
  const bulkDeleteMutation = useBulkDelete();

  // Filters hook
  const { filters, updateFilter, resetFilters, hasActiveFilters } = useTaskFilters();

  // View mode (grid vs list)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>(defaultView || 'list');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Multi-selection state
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [isBulkDeleteConfirmOpen, setIsBulkDeleteConfirmOpen] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Sync initial query params (e.g. ?filter=overdue or ?search=...)
  useEffect(() => {
    const filterParam = searchParams.get('filter');
    const searchParam = searchParams.get('search');

    if (filterParam === 'overdue') {
      updateFilter('dueDateFilter', 'overdue');
    } else if (filterParam === 'pending' || filterParam === 'in_progress' || filterParam === 'completed') {
      updateFilter('status', filterParam as TaskStatus);
    }

    if (searchParam) {
      updateFilter('search', searchParam);
    }
  }, [searchParams, updateFilter]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Filtered & sorted tasks
  const filteredAndSortedTasks = useMemo(() => {
    const filtered = filterTasks(tasks, filters);
    return sortTasks(filtered, filters.sortBy, filters.sortOrder);
  }, [tasks, filters]);

  // Paginated result
  const paginationResult = useMemo(() => {
    return paginate(filteredAndSortedTasks, currentPage, pageSize);
  }, [filteredAndSortedTasks, currentPage, pageSize]);

  const projectMap = useMemo(() => new Map(projects.map((p) => [p.id, p])), [projects]);

  // Selection handlers
  const handleToggleSelect = (taskId: string) => {
    setSelectedTaskIds((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const handleSelectAllCurrentPage = () => {
    const pageIds = paginationResult.items.map((t) => t.id);
    const allSelected = pageIds.every((id) => selectedTaskIds.includes(id));
    if (allSelected) {
      setSelectedTaskIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedTaskIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  // Status toggle handler
  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    updateTaskMutation.mutate({ taskId, updates: { status: newStatus } });
  };

  // Delete single task handler
  const handleConfirmDelete = async () => {
    if (!deletingTaskId) return;
    await deleteTaskMutation.mutateAsync(deletingTaskId);
    setDeletingTaskId(null);
  };

  // Bulk actions
  const handleBulkComplete = async () => {
    await bulkUpdateMutation.mutateAsync({ taskIds: selectedTaskIds, status: 'completed' });
    setSelectedTaskIds([]);
  };

  const handleBulkInProgress = async () => {
    await bulkUpdateMutation.mutateAsync({ taskIds: selectedTaskIds, status: 'in_progress' });
    setSelectedTaskIds([]);
  };

  const handleBulkDeleteConfirm = async () => {
    await bulkDeleteMutation.mutateAsync(selectedTaskIds);
    setSelectedTaskIds([]);
    setIsBulkDeleteConfirmOpen(false);
  };

  const handleLoadMoreFromApi = async () => {
    setIsLoadingMore(true);
    try {
      await loadMore(tasks.length, 10);
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (tasksLoading || projectsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-20" />
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      </div>
    );
  }

  if (tasksError) {
    return (
      <div className="py-8">
        <Alert type="error" title="Failed to load tasks">
          <p>{tasksError.message}</p>
          <Button size="sm" variant="outline" className="mt-3" onClick={() => refetch()}>
            Retry
          </Button>
        </Alert>
      </div>
    );
  }

  const allPageIdsSelected =
    paginationResult.items.length > 0 &&
    paginationResult.items.every((t) => selectedTaskIds.includes(t.id));

  return (
    <div className="space-y-6 pb-20">
      {/* Header with Sync & Create */}
      <PageHeader
        pill="Tasks"
        title="Task Management"
        description={`Manage and track ${tasks.length} total tasks with search, filtering, and bulk operations`}
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
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create Task
            </Button>
          </div>
        }
      />

      {/* Filter and search toolbar */}
      <TaskFilters
        filters={filters}
        projects={projects}
        onFilterChange={updateFilter}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
      />

      {/* Results summary & Active counts */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <div>
          Showing{' '}
          <span className="font-bold text-slate-800 dark:text-slate-200">
            {paginationResult.items.length}
          </span>{' '}
          of{' '}
          <span className="font-bold text-slate-800 dark:text-slate-200">
            {filteredAndSortedTasks.length}
          </span>{' '}
          matching tasks ({tasks.length} total in workspace)
        </div>
        {hasActiveFilters && (
          <span className="text-[11px] font-semibold text-primary">Filters active</span>
        )}
      </div>

      {/* Main Task List or Grid */}
      {paginationResult.items.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
          <EmptyState
            title={hasActiveFilters ? 'No matching tasks' : 'No tasks in workspace'}
            description={
              hasActiveFilters
                ? 'No tasks matched your current filter criteria. Try broadening your search or resetting filters.'
                : 'Your task list is empty. Create your own custom task or synchronize from the REST API.'
            }
            actionLabel={hasActiveFilters ? 'Reset Filters' : 'Create Task'}
            onAction={hasActiveFilters ? resetFilters : () => setIsCreateModalOpen(true)}
            secondaryAction={
              !hasActiveFilters
                ? {
                    label: isSyncing ? 'Syncing...' : 'Sync Tasks from API',
                    onClick: () => syncNow(),
                  }
                : undefined
            }
          />
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paginationResult.items.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              project={projectMap.get(task.projectId)}
              onEdit={(t) => setEditingTask(t)}
              onDelete={(id) => setDeletingTaskId(id)}
              onStatusChange={handleStatusChange}
              isSelected={selectedTaskIds.includes(task.id)}
              onToggleSelect={handleToggleSelect}
            />
          ))}
        </div>
      ) : (
        /* List / Table view matching the deep header reference style */
        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-left text-xs">
            <thead className="table-header-theme text-white border-b border-white/10">
              <tr>
                <th className="w-10 px-4 py-3.5 text-center">
                  <input
                    type="checkbox"
                    checked={allPageIdsSelected}
                    onChange={handleSelectAllCurrentPage}
                    aria-label="Select all tasks on page"
                    className="h-4 w-4 rounded border-white/30 text-primary focus:ring-primary cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3.5 font-bold uppercase tracking-wider">Task / Tags</th>
                <th className="px-4 py-3.5 font-bold uppercase tracking-wider hidden md:table-cell">
                  Project
                </th>
                <th className="px-4 py-3.5 font-bold uppercase tracking-wider">Status</th>
                <th className="px-4 py-3.5 font-bold uppercase tracking-wider hidden sm:table-cell">
                  Priority
                </th>
                <th className="px-4 py-3.5 font-bold uppercase tracking-wider">Due Date</th>
                <th className="px-4 py-3.5 font-bold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginationResult.items.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  project={projectMap.get(task.projectId)}
                  onEdit={(t) => setEditingTask(t)}
                  onDelete={(id) => setDeletingTaskId(id)}
                  onStatusChange={handleStatusChange}
                  isSelected={selectedTaskIds.includes(task.id)}
                  onToggleSelect={handleToggleSelect}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination and API Load More */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <Pagination
          currentPage={paginationResult.currentPage}
          totalPages={paginationResult.totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />

        {/* Load More from API Button */}
        {isOnline && (
          <Button
            variant="ghost"
            size="sm"
            isLoading={isLoadingMore}
            disabled={isLoadingMore || isSyncing}
            leftIcon={<DownloadIcon className="w-4 h-4 text-primary" />}
            onClick={handleLoadMoreFromApi}
            className="text-xs text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary"
          >
            {isLoadingMore ? 'Loading More...' : 'Load More from API (+10)'}
          </Button>
        )}
      </div>

      {/* Floating Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedTaskIds.length}
        onClearSelection={() => setSelectedTaskIds([])}
        onMarkComplete={handleBulkComplete}
        onMoveToInProgress={handleBulkInProgress}
        onDeleteSelected={() => setIsBulkDeleteConfirmOpen(true)}
      />

      {/* Create Task Modal */}
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

      {/* Edit Task Modal */}
      <Modal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        title="Edit Task"
        description="Modify task details, assigned project, or status"
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

      {/* Single Task Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!deletingTaskId}
        onClose={() => setDeletingTaskId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? You can undo this action immediately after deletion."
        confirmLabel="Delete"
        isDestructive
        isLoading={deleteTaskMutation.isPending}
      />

      {/* Bulk Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={isBulkDeleteConfirmOpen}
        onClose={() => setIsBulkDeleteConfirmOpen(false)}
        onConfirm={handleBulkDeleteConfirm}
        title="Delete Selected Tasks"
        message={`Are you sure you want to delete ${selectedTaskIds.length} selected tasks? This will permanently remove them.`}
        confirmLabel="Delete All Selected"
        isDestructive
        isLoading={bulkDeleteMutation.isPending}
      />
    </div>
  );
};
