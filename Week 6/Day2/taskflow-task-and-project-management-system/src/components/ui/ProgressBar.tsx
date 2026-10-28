import React from 'react';

export interface ProgressBarProps {
  value: number; // 0 to 100
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  color,
  size = 'md',
  showLabel = false,
  className = '',
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  const heightClass = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }[size];

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="mb-1 flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
          <span>Progress</span>
          <span>{clamped}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        className={`w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 ${heightClass}`}
      >
        <div
          className={`h-full transition-all duration-300 rounded-full ${color || 'bg-primary'}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
