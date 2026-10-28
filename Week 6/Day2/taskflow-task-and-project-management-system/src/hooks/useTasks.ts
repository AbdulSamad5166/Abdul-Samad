import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Task, TaskPriority, TaskStatus } from '../types';
import { taskService } from '../services/taskService';
import { useAuth } from './useAuth';
import { useToast } from './useToast';

export const TASK_QUERY_KEYS = {
  all: (userId: string | undefined) => ['tasks', userId] as const,
  detail: (userId: string | undefined, taskId: string | undefined) =>
    ['task', userId, taskId] as const,
};

export function useTasks() {
  const { user } = useAuth();
  const userId = user?.id;

  return useQuery({
    queryKey: TASK_QUERY_KEYS.all(userId),
    queryFn: async () => {
      if (!userId) return [];
      return taskService.getTasks(userId);
    },
    enabled: !!userId,
  });
}

export function useTask(taskId: string | undefined) {
  const { user } = useAuth();
  const userId = user?.id;

  return useQuery({
    queryKey: TASK_QUERY_KEYS.detail(userId, taskId),
    queryFn: async () => {
      if (!userId || !taskId) return null;
      return taskService.getTaskById(userId, taskId);
    },
    enabled: !!userId && !!taskId,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const toast = useToast();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      status: TaskStatus;
      priority: TaskPriority;
      dueDate: string;
      projectId: string;
      tags: string[];
      subtasks?: { title: string }[];
    }) => {
      if (!user) throw new Error('User not logged in');
      return taskService.createTask(user.id, data);
    },
    onSuccess: (newTask) => {
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all(user?.id) });
      toast.success(`Task "${newTask.title}" created successfully!`);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to create task');
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const toast = useToast();

  return useMutation({
    mutationFn: async ({
      taskId,
      updates,
    }: {
      taskId: string;
      updates: Partial<Omit<Task, 'id' | 'userId' | 'createdAt'>>;
    }) => {
      if (!user) throw new Error('User not logged in');
      return taskService.updateTask(user.id, taskId, updates);
    },
    // Optimistic UI update for immediate responsive feel
    onMutate: async ({ taskId, updates }) => {
      if (!user) return;
      await queryClient.cancelQueries({ queryKey: TASK_QUERY_KEYS.all(user.id) });
      await queryClient.cancelQueries({ queryKey: TASK_QUERY_KEYS.detail(user.id, taskId) });

      const previousTasks = queryClient.getQueryData<Task[]>(TASK_QUERY_KEYS.all(user.id));
      const previousDetail = queryClient.getQueryData<Task>(
        TASK_QUERY_KEYS.detail(user.id, taskId)
      );

      if (previousTasks) {
        queryClient.setQueryData<Task[]>(
          TASK_QUERY_KEYS.all(user.id),
          previousTasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
        );
      }

      if (previousDetail) {
        queryClient.setQueryData<Task>(TASK_QUERY_KEYS.detail(user.id, taskId), {
          ...previousDetail,
          ...updates,
        });
      }

      return { previousTasks, previousDetail };
    },
    onError: (err: Error, { taskId }, context) => {
      if (!user) return;
      if (context?.previousTasks) {
        queryClient.setQueryData(TASK_QUERY_KEYS.all(user.id), context.previousTasks);
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(TASK_QUERY_KEYS.detail(user.id, taskId), context.previousDetail);
      }
      toast.error(err.message || 'Failed to update task');
    },
    onSettled: (_data, _error, { taskId }) => {
      if (!user) return;
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all(user.id) });
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.detail(user.id, taskId) });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const toast = useToast();

  return useMutation({
    mutationFn: async (taskId: string) => {
      if (!user) throw new Error('User not logged in');
      return taskService.deleteTask(user.id, taskId);
    },
    // Optimistic UI update with Undo action
    onMutate: async (taskId: string) => {
      if (!user) return;
      await queryClient.cancelQueries({ queryKey: TASK_QUERY_KEYS.all(user.id) });
      const previousTasks = queryClient.getQueryData<Task[]>(TASK_QUERY_KEYS.all(user.id));

      const deletedTask = previousTasks?.find((t) => t.id === taskId);

      if (previousTasks) {
        queryClient.setQueryData<Task[]>(
          TASK_QUERY_KEYS.all(user.id),
          previousTasks.filter((t) => t.id !== taskId)
        );
      }

      return { previousTasks, deletedTask };
    },
    onSuccess: (deletedTask) => {
      if (!user) return;
      // Show toast with UNDO action
      toast.info(`Task "${deletedTask.title}" deleted`, {
        duration: 6000,
        undoAction: async () => {
          await taskService.restoreTask(user.id, deletedTask);
          queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all(user.id) });
          toast.success(`Task "${deletedTask.title}" restored!`);
        },
      });
    },
    onError: (err: Error, _taskId, context) => {
      if (!user) return;
      if (context?.previousTasks) {
        queryClient.setQueryData(TASK_QUERY_KEYS.all(user.id), context.previousTasks);
      }
      toast.error(err.message || 'Failed to delete task');
    },
    onSettled: () => {
      if (!user) return;
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all(user.id) });
    },
  });
}

export function useBulkUpdateStatus() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const toast = useToast();

  return useMutation({
    mutationFn: async ({ taskIds, status }: { taskIds: string[]; status: TaskStatus }) => {
      if (!user) throw new Error('User not logged in');
      return taskService.bulkUpdateStatus(user.id, taskIds, status);
    },
    onSuccess: (_, { taskIds, status }) => {
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all(user?.id) });
      toast.success(`Updated status of ${taskIds.length} tasks to ${status}`);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed bulk update');
    },
  });
}

export function useBulkDelete() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const toast = useToast();

  return useMutation({
    mutationFn: async (taskIds: string[]) => {
      if (!user) throw new Error('User not logged in');
      return taskService.bulkDelete(user.id, taskIds);
    },
    onSuccess: (_, taskIds) => {
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all(user?.id) });
      toast.info(`Deleted ${taskIds.length} tasks`);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed bulk deletion');
    },
  });
}
