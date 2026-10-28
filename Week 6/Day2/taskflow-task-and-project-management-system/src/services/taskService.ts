import { ActivityItem, Subtask, Task, TaskComment, TaskPriority, TaskStatus } from '../types';
import { generateId } from '../utils/id';
import { apiClient } from './api';
import {
  getUserProjectsKey,
  getUserTasksKey,
  getUserTombstonesKey,
  safeLocalStorage,
} from './storage';
import { mergeTasks } from '../utils/mergeTasks';

export interface DummyJsonTodo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

/**
 * Maps a DummyJSON API todo object into TaskFlow Task model.
 */
export function adaptDummyJsonTodo(
  todo: DummyJsonTodo,
  userId: string,
  projectId: string = ''
): Task {
  const priorities: TaskPriority[] = ['low', 'medium', 'high', 'urgent'];
  const priority = priorities[todo.id % 4];
  const status: TaskStatus = todo.completed ? 'completed' : 'pending';

  // Deterministic relative due dates across todos
  const dateOffset = (todo.id % 7) - 2;
  const d = new Date();
  d.setDate(d.getDate() + dateOffset);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const dueDate = `${y}-${m}-${day}`;

  return {
    id: `api_task_${todo.id}`,
    externalId: todo.id,
    source: 'api',
    locallyModified: false,
    title: todo.todo,
    description: `Imported from DummyJSON REST endpoint (Item #${todo.id}).`,
    status,
    priority,
    dueDate,
    projectId,
    tags: ['api-synced'],
    subtasks: [
      { id: generateId('sub'), title: 'Verify task requirements', completed: todo.completed },
      { id: generateId('sub'), title: 'Sync review milestone', completed: false },
    ],
    comments: [],
    activityHistory: [
      {
        id: generateId('act'),
        text: 'Imported from DummyJSON API',
        timestamp: new Date().toISOString(),
        type: 'synced',
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId,
  };
}

export const taskService = {
  /**
   * Retrieves all tasks strictly isolated to this user.
   */
  async getTasks(userId: string): Promise<Task[]> {
    if (!userId) return [];
    const userKey = getUserTasksKey(userId);
    return safeLocalStorage.get<Task[]>(userKey, []);
  },

  async getTaskById(userId: string, taskId: string): Promise<Task | null> {
    const tasks = await this.getTasks(userId);
    return tasks.find((t) => t.id === taskId) || null;
  },

  /**
   * Creates a locally created task.
   */
  async createTask(
    userId: string,
    data: {
      title: string;
      description: string;
      status: TaskStatus;
      priority: TaskPriority;
      dueDate: string;
      projectId: string;
      tags: string[];
      subtasks?: { title: string }[];
    }
  ): Promise<Task> {
    const newTask: Task = {
      id: generateId('task'),
      source: 'local',
      locallyModified: false,
      title: data.title.trim(),
      description: data.description.trim(),
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate,
      projectId: data.projectId,
      tags: data.tags,
      subtasks: (data.subtasks || []).map((s) => ({
        id: generateId('sub'),
        title: s.title.trim(),
        completed: false,
      })),
      comments: [],
      activityHistory: [
        {
          id: generateId('act'),
          text: 'Task created locally',
          timestamp: new Date().toISOString(),
          type: 'created',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId,
    };

    const userKey = getUserTasksKey(userId);
    const existing = safeLocalStorage.get<Task[]>(userKey, []);
    safeLocalStorage.set(userKey, [newTask, ...existing]);

    return newTask;
  },

  /**
   * Updates an existing task, marking locallyModified: true.
   */
  async updateTask(
    userId: string,
    taskId: string,
    updates: Partial<Omit<Task, 'id' | 'userId' | 'createdAt'>>
  ): Promise<Task> {
    const userKey = getUserTasksKey(userId);
    const tasks = safeLocalStorage.get<Task[]>(userKey, []);
    const index = tasks.findIndex((t) => t.id === taskId);
    if (index === -1) {
      throw new Error('Task not found.');
    }

    const oldTask = tasks[index];
    const newActivity: ActivityItem[] = [...oldTask.activityHistory];

    if (updates.status && updates.status !== oldTask.status) {
      newActivity.unshift({
        id: generateId('act'),
        text: `Status changed from ${oldTask.status} to ${updates.status}`,
        timestamp: new Date().toISOString(),
        type: 'status_changed',
      });
    }

    const updatedTask: Task = {
      ...oldTask,
      ...updates,
      locallyModified: true, // Mark modified so future syncs do not overwrite
      activityHistory: newActivity,
      updatedAt: new Date().toISOString(),
    };

    tasks[index] = updatedTask;
    safeLocalStorage.set(userKey, tasks);

    return updatedTask;
  },

  /**
   * Deletes a task. If it originated from API, records externalId in user's tombstones
   * so syncs will never revive it.
   */
  async deleteTask(userId: string, taskId: string): Promise<Task> {
    const userKey = getUserTasksKey(userId);
    const tasks = safeLocalStorage.get<Task[]>(userKey, []);
    const taskToDelete = tasks.find((t) => t.id === taskId);
    if (!taskToDelete) {
      throw new Error('Task not found.');
    }

    // If API task, record tombstone
    if (taskToDelete.externalId !== undefined && taskToDelete.externalId !== null) {
      const tombstoneKey = getUserTombstonesKey(userId);
      const tombstones = safeLocalStorage.get<string[]>(tombstoneKey, []);
      const extStr = String(taskToDelete.externalId);
      if (!tombstones.includes(extStr)) {
        safeLocalStorage.set(tombstoneKey, [...tombstones, extStr]);
      }
    }

    const remaining = tasks.filter((t) => t.id !== taskId);
    safeLocalStorage.set(userKey, remaining);

    return taskToDelete;
  },

  /**
   * Restores a deleted task (Undo action).
   */
  async restoreTask(userId: string, task: Task): Promise<void> {
    const userKey = getUserTasksKey(userId);
    const tasks = safeLocalStorage.get<Task[]>(userKey, []);

    // Remove from tombstones if it had an externalId
    if (task.externalId !== undefined && task.externalId !== null) {
      const tombstoneKey = getUserTombstonesKey(userId);
      const tombstones = safeLocalStorage.get<string[]>(tombstoneKey, []);
      safeLocalStorage.set(
        tombstoneKey,
        tombstones.filter((id) => id !== String(task.externalId))
      );
    }

    safeLocalStorage.set(userKey, [task, ...tasks]);
  },

  async bulkUpdateStatus(userId: string, taskIds: string[], status: TaskStatus): Promise<void> {
    const userKey = getUserTasksKey(userId);
    const tasks = safeLocalStorage.get<Task[]>(userKey, []);
    const updated = tasks.map((t) => {
      if (taskIds.includes(t.id)) {
        return {
          ...t,
          status,
          locallyModified: true,
          updatedAt: new Date().toISOString(),
          activityHistory: [
            {
              id: generateId('act'),
              text: `Bulk status update to ${status}`,
              timestamp: new Date().toISOString(),
              type: 'status_changed' as const,
            },
            ...t.activityHistory,
          ],
        };
      }
      return t;
    });
    safeLocalStorage.set(userKey, updated);
  },

  async bulkDelete(userId: string, taskIds: string[]): Promise<void> {
    const userKey = getUserTasksKey(userId);
    const tasks = safeLocalStorage.get<Task[]>(userKey, []);

    // Record tombstones for each deleted API task
    const tombstoneKey = getUserTombstonesKey(userId);
    const currentTombstones = safeLocalStorage.get<string[]>(tombstoneKey, []);
    const newTombstones = [...currentTombstones];

    tasks.forEach((t) => {
      if (taskIds.includes(t.id) && t.externalId !== undefined && t.externalId !== null) {
        const extStr = String(t.externalId);
        if (!newTombstones.includes(extStr)) {
          newTombstones.push(extStr);
        }
      }
    });

    safeLocalStorage.set(tombstoneKey, newTombstones);
    const filtered = tasks.filter((t) => !taskIds.includes(t.id));
    safeLocalStorage.set(userKey, filtered);
  },

  async toggleSubtask(userId: string, taskId: string, subtaskId: string): Promise<Task> {
    const task = await this.getTaskById(userId, taskId);
    if (!task) throw new Error('Task not found.');

    const subtasks = task.subtasks.map((s) =>
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
    );

    return this.updateTask(userId, taskId, { subtasks });
  },

  async addSubtask(userId: string, taskId: string, title: string): Promise<Task> {
    const task = await this.getTaskById(userId, taskId);
    if (!task) throw new Error('Task not found.');

    const newSubtask: Subtask = {
      id: generateId('sub'),
      title: title.trim(),
      completed: false,
    };

    return this.updateTask(userId, taskId, {
      subtasks: [...task.subtasks, newSubtask],
    });
  },

  async deleteSubtask(userId: string, taskId: string, subtaskId: string): Promise<Task> {
    const task = await this.getTaskById(userId, taskId);
    if (!task) throw new Error('Task not found.');

    const subtasks = task.subtasks.filter((s) => s.id !== subtaskId);
    return this.updateTask(userId, taskId, { subtasks });
  },

  async addComment(userId: string, taskId: string, author: string, content: string): Promise<Task> {
    const task = await this.getTaskById(userId, taskId);
    if (!task) throw new Error('Task not found.');

    const newComment: TaskComment = {
      id: generateId('comm'),
      author,
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    const newActivity: ActivityItem = {
      id: generateId('act'),
      text: `${author} added a note`,
      timestamp: new Date().toISOString(),
      type: 'comment_added',
    };

    return this.updateTask(userId, taskId, {
      comments: [newComment, ...task.comments],
      activityHistory: [newActivity, ...task.activityHistory],
    });
  },

  /**
   * Synchronizes tasks with the external DummyJSON REST API endpoint.
   */
  async syncWithApi(
    userId: string,
    options: {
      limit?: number;
      skip?: number;
      clearTombstones?: boolean;
      forceReset?: boolean;
    } = {}
  ): Promise<{
    tasks: Task[];
    addedCount: number;
    updatedCount: number;
    totalApiCount: number;
  }> {
    const limit = options.limit ?? 30;
    const skip = options.skip ?? 0;

    // Fetch from DummyJSON API
    const response = await apiClient.get<{
      todos: DummyJsonTodo[];
      total: number;
      skip: number;
      limit: number;
    }>(`/todos?limit=${limit}&skip=${skip}`);

    const todos = response.data.todos || [];
    const totalApiCount = response.data.total || todos.length;

    // Get default project if exists
    const projKey = getUserProjectsKey(userId);
    const projects = safeLocalStorage.get<{ id: string }[]>(projKey, []);
    const defaultProjectId = projects.length > 0 ? projects[0].id : '';

    const incomingTasks = todos.map((todo) =>
      adaptDummyJsonTodo(todo, userId, defaultProjectId)
    );

    const tombstoneKey = getUserTombstonesKey(userId);
    if (options.clearTombstones) {
      safeLocalStorage.remove(tombstoneKey);
    }
    const tombstones = options.clearTombstones
      ? []
      : safeLocalStorage.get<string[]>(tombstoneKey, []);

    const userKey = getUserTasksKey(userId);
    const existingTasks = options.forceReset ? [] : safeLocalStorage.get<Task[]>(userKey, []);

    const { mergedTasks, addedCount, updatedCount } = mergeTasks({
      existingTasks,
      incomingApiTasks: incomingTasks,
      tombstones,
    });

    safeLocalStorage.set(userKey, mergedTasks);

    return {
      tasks: mergedTasks,
      addedCount,
      updatedCount,
      totalApiCount,
    };
  },

  /**
   * Clears all user tasks, projects, tombstones, and sync settings.
   */
  async clearAllUserData(userId: string): Promise<void> {
    safeLocalStorage.remove(getUserTasksKey(userId));
    safeLocalStorage.remove(getUserProjectsKey(userId));
    safeLocalStorage.remove(getUserTombstonesKey(userId));
  },
};
