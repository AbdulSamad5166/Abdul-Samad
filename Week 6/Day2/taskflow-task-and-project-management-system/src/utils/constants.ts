import { AccentColor, TaskPriority, TaskStatus } from '../types';

export const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
};

export const STATUS_COLORS: Record<
  TaskStatus,
  { bg: string; text: string; border: string; dot: string }
> = {
  pending: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800/60',
    dot: 'bg-amber-500',
  },
  in_progress: {
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800/60',
    dot: 'bg-blue-500',
  },
  completed: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800/60',
    dot: 'bg-emerald-500',
  },
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

export const PRIORITY_COLORS: Record<
  TaskPriority,
  { bg: string; text: string; border: string; badge: string }
> = {
  low: {
    bg: 'bg-slate-50 dark:bg-slate-800/60',
    text: 'text-slate-600 dark:text-slate-300',
    border: 'border-slate-200 dark:border-slate-700',
    badge: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  },
  medium: {
    bg: 'bg-cyan-50 dark:bg-cyan-950/40',
    text: 'text-cyan-700 dark:text-cyan-300',
    border: 'border-cyan-200 dark:border-cyan-800/60',
    badge: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-200',
  },
  high: {
    bg: 'bg-orange-50 dark:bg-orange-950/40',
    text: 'text-orange-700 dark:text-orange-300',
    border: 'border-orange-200 dark:border-orange-800/60',
    badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900/60 dark:text-orange-200',
  },
  urgent: {
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    text: 'text-rose-700 dark:text-rose-300',
    border: 'border-rose-200 dark:border-rose-800/60',
    badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200',
  },
};

export const ACCENT_THEMES: {
  id: AccentColor;
  label: string;
  previewHex: string;
  twClass: string;
}[] = [
  { id: 'indigo', label: 'Indigo', previewHex: '#6366f1', twClass: 'bg-indigo-600' },
  { id: 'emerald', label: 'Emerald', previewHex: '#10b981', twClass: 'bg-emerald-600' },
  { id: 'rose', label: 'Rose', previewHex: '#f43f5e', twClass: 'bg-rose-600' },
  { id: 'amber', label: 'Amber', previewHex: '#f59e0b', twClass: 'bg-amber-600' },
  { id: 'sky', label: 'Sky Blue', previewHex: '#0284c7', twClass: 'bg-sky-600' },
  { id: 'violet', label: 'Violet', previewHex: '#8b5cf6', twClass: 'bg-violet-600' },
  { id: 'teal', label: 'Ocean Teal', previewHex: '#0d9488', twClass: 'bg-teal-600' },
];
