import React from 'react';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
}) => {
  const variantStyles = {
    text: 'h-4 w-full rounded',
    rectangular: 'rounded-xl',
    circular: 'rounded-full',
  }[variant];

  return (
    <div
      aria-hidden="true"
      className={`animate-pulse bg-slate-200 dark:bg-slate-800 ${variantStyles} ${className}`}
    />
  );
};
