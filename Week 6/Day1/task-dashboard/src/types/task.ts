// "as const" se array ke values literal types ban jate hain, aur hum
// runtime par bhi in values ko validate kar sakte hain (security ke liye zaroori).
export const TASK_STATUSES = ['pending', 'in-progress', 'completed'] as const
export const TASK_PRIORITIES = ['low', 'medium', 'high'] as const

export type TaskStatus = (typeof TASK_STATUSES)[number]
export type TaskPriority = (typeof TASK_PRIORITIES)[number]

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string // ISO date, e.g. "2026-11-02"
  createdAt: string // ISO date
}

// Type guard: unknown data ko check karta hai ke wo sach me Task hai ya nahi.
// localStorage ka data user/browser extension badal sakta hai, is liye kabhi blind trust nahi.
export function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) return false
  const t = value as Record<string, unknown>
  return (
    typeof t.id === 'string' &&
    typeof t.title === 'string' &&
    typeof t.description === 'string' &&
    TASK_STATUSES.includes(t.status as TaskStatus) &&
    TASK_PRIORITIES.includes(t.priority as TaskPriority) &&
    typeof t.dueDate === 'string' &&
    typeof t.createdAt === 'string'
  )
}

export function isTaskArray(value: unknown): value is Task[] {
  return Array.isArray(value) && value.every(isTask)
}