import { ReactNode } from 'react';
import { Skeleton } from './Skeleton';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  isLoading?: boolean;
}

export function StatCard({
  title,
  value,
  icon,
  description,
  trend,
  isLoading = false,
}: StatCardProps) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-9 rounded-lg" />
        </div>
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-3 w-36" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-shadow hover:shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
          {icon}
        </div>
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
          {value}
        </div>
        <div className="flex items-center gap-2 mt-1">
          {trend && (
            <span
              className={`text-xs font-semibold ${
                trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {trend.value}
            </span>
          )}
          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
