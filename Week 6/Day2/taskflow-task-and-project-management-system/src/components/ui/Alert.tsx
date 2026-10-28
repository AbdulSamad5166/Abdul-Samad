import React from 'react';
import { AlertIcon, CheckCircleIcon, CloseIcon } from '../icons';

export interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  children,
  onClose,
  className = '',
}) => {
  const styles = {
    info: 'bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950/40 dark:text-blue-200 dark:border-blue-900',
    success: 'bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-900',
    warning: 'bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-900',
    error: 'bg-rose-50 text-rose-900 border-rose-200 dark:bg-rose-950/40 dark:text-rose-200 dark:border-rose-900',
  }[type];

  return (
    <div
      role="alert"
      className={`relative flex items-start gap-3 rounded-xl border p-4 text-xs ${styles} ${className}`}
    >
      <div className="shrink-0 mt-0.5">
        {type === 'success' ? (
          <CheckCircleIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <AlertIcon className="w-4 h-4" />
        )}
      </div>
      <div className="flex-1">
        {title && <h4 className="font-bold mb-0.5">{title}</h4>}
        <div className="text-slate-700 dark:text-slate-300">{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss alert"
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
