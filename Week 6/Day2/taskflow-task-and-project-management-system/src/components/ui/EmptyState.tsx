import React from 'react';
import { EmptyIllustration } from '../icons';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  secondaryAction,
  className = '',
  icon,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center text-slate-500 dark:text-slate-400 ${className}`}
    >
      <div className="mb-4 text-primary">
        {icon ? <div className="mx-auto">{icon}</div> : <EmptyIllustration />}
      </div>
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">{title}</h3>
      <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        {description}
      </p>
      {(actionLabel || secondaryAction) && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          {actionLabel && onAction && (
            <Button size="sm" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
          {secondaryAction && (
            <Button size="sm" variant="outline" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
