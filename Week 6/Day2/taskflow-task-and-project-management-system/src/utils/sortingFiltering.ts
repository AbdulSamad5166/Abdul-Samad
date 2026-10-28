import { Task, TaskFilterOptions, TaskPriority } from '../types';
import { isDueThisWeek, isDueToday, isOverdue } from './dateHelpers';

const PRIORITY_WEIGHTS: Record<TaskPriority, number> = {
  low: 1,
  medium: 2,
  high: 3,
  urgent: 4,
};

/**
 * Filter tasks based on search keyword, status, priority, project, and due date relative ranges.
 */
export function filterTasks(tasks: Task[], options: TaskFilterOptions): Task[] {
  return tasks.filter((task) => {
    // Search query matches title, description or tags
    if (options.search && options.search.trim()) {
      const q = options.search.toLowerCase().trim();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description.toLowerCase().includes(q);
      const matchTags = task.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTags) {
        return false;
      }
    }

    // Status filter
    if (options.status && options.status !== 'all' && task.status !== options.status) {
      return false;
    }

    // Priority filter
    if (options.priority && options.priority !== 'all' && task.priority !== options.priority) {
      return false;
    }

    // Project filter
    if (options.projectId && options.projectId !== 'all' && task.projectId !== options.projectId) {
      return false;
    }

    // Due date filter
    if (options.dueDateFilter && options.dueDateFilter !== 'all') {
      if (options.dueDateFilter === 'overdue') {
        if (task.status === 'completed' || !isOverdue(task.dueDate)) return false;
      } else if (options.dueDateFilter === 'today') {
        if (!isDueToday(task.dueDate)) return false;
      } else if (options.dueDateFilter === 'this_week') {
        if (!isDueThisWeek(task.dueDate)) return false;
      } else if (options.dueDateFilter === 'upcoming') {
        if (isOverdue(task.dueDate) || isDueToday(task.dueDate)) return false;
      }
    }

    return true;
  });
}

/**
 * Sort tasks by due date, priority, title, or creation date.
 */
export function sortTasks(tasks: Task[], sortBy: TaskFilterOptions['sortBy'], sortOrder: TaskFilterOptions['sortOrder']): Task[] {
  return [...tasks].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'dueDate': {
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        comparison = dateA - dateB;
        break;
      }
      case 'priority': {
        const weightA = PRIORITY_WEIGHTS[a.priority] || 0;
        const weightB = PRIORITY_WEIGHTS[b.priority] || 0;
        comparison = weightA - weightB; // asc: low -> urgent
        break;
      }
      case 'title': {
        comparison = a.title.localeCompare(b.title);
        break;
      }
      case 'createdAt':
      default: {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        comparison = dateA - dateB; // asc: oldest -> newest
        break;
      }
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });
}

/**
 * Paginate items array.
 */
export function paginate<T>(items: T[], page: number, pageSize: number): {
  items: T[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
} {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedItems = items.slice(startIndex, startIndex + pageSize);

  return {
    items: paginatedItems,
    totalPages,
    totalItems,
    currentPage,
  };
}
