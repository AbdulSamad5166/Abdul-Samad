export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskComment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export type ActivityType =
  | 'created'
  | 'status_changed'
  | 'updated'
  | 'subtask_toggled'
  | 'comment_added'
  | 'synced';

export interface ActivityItem {
  id: string;
  text: string;
  timestamp: string;
  type: ActivityType;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string; // ISO date YYYY-MM-DD
  projectId: string;
  tags: string[];
  subtasks: Subtask[];
  comments: TaskComment[];
  activityHistory: ActivityItem[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  source: 'api' | 'local';
  externalId?: number | string;
  locallyModified?: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: string;
  userId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarInitials: string;
  passwordHash: string;
  createdAt: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';
export type AccentColor =
  | 'indigo'
  | 'emerald'
  | 'rose'
  | 'amber'
  | 'sky'
  | 'violet'
  | 'teal';
export type Density = 'comfortable' | 'compact';

export interface UserSettings {
  mode: ThemeMode;
  accent: AccentColor;
  density: Density;
  defaultView: 'list' | 'grid';
}

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'failed';

export interface SyncSettings {
  autoSync: boolean;
  syncInterval: number; // 0 (off), 60000 (1m), 300000 (5m), 900000 (15m)
  lastSyncedAt: string | null;
}

export type TaskSortField = 'dueDate' | 'priority' | 'createdAt' | 'title';
export type SortOrder = 'asc' | 'desc';

export interface TaskFilterOptions {
  search: string;
  status: string; // 'all' or TaskStatus
  priority: string; // 'all' or TaskPriority
  projectId: string; // 'all' or projectId
  dueDateFilter: 'all' | 'overdue' | 'today' | 'this_week' | 'upcoming';
  sortBy: TaskSortField;
  sortOrder: SortOrder;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
  duration?: number;
  undoAction?: () => void;
}
