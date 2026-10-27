import type { Task, TaskPriority, TaskStatus } from '../types/task'

export const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: 'Pending',
  'in-progress': 'In Progress',
  completed: 'Completed',
}

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

export function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function getTaskStats(tasks: Task[]) {
  const total = tasks.length
  const pending = tasks.filter((t) => t.status === 'pending').length
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length
  const completed = tasks.filter((t) => t.status === 'completed').length
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100)
  return { total, pending, inProgress, completed, completionRate }
}

// Sab se qareeb due date wale unfinished tasks
export function getUpcomingTasks(tasks: Task[], limit = 4): Task[] {
  return tasks
    .filter((t) => t.status !== 'completed')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate)) // ISO dates string sort se sahi chalti hain
    .slice(0, limit)
}