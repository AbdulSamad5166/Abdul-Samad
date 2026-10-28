import React from 'react';

export interface PageHeaderProps {
  title: string;
  description?: string;
  pill?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  pill,
  actions,
  children,
}) => {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        {pill && (
          <span className="inline-block rounded-md bg-primary px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider mb-1 shadow-2xs">
            {pill}
          </span>
        )}
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>

      {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
      {children}
    </div>
  );
};
