import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '../icons';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Pagination Navigation"
      className={`flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800 ${className}`}
    >
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
      >
        <ChevronLeftIcon className="w-3.5 h-3.5" />
        <span>Previous</span>
      </button>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
          const isCurrent = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              type="button"
              aria-current={isCurrent ? 'page' : undefined}
              onClick={() => onPageChange(pageNum)}
              className={`min-w-8 h-8 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                isCurrent
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
      >
        <span>Next</span>
        <ChevronRightIcon className="w-3.5 h-3.5" />
      </button>
    </nav>
  );
};
