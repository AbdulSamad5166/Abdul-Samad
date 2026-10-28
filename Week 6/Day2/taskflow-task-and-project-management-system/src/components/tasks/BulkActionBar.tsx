import React from 'react';
import { Button } from '../ui/Button';
import { CheckIcon, TrashIcon, CloseIcon, ClockIcon } from '../icons';

interface BulkActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onMarkComplete: () => void;
  onMoveToInProgress: () => void;
  onDeleteSelected: () => void;
}

export const BulkActionBar: React.FC<BulkActionBarProps> = ({
  selectedCount,
  onClearSelection,
  onMarkComplete,
  onMoveToInProgress,
  onDeleteSelected,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900/95 px-5 py-3 text-white shadow-2xl backdrop-blur-md animate-slideUp">
      <div className="flex items-center gap-2 border-r border-slate-700 pr-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
          {selectedCount}
        </span>
        <span className="text-xs font-semibold">Selected</span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={onMarkComplete}
          leftIcon={<CheckIcon className="w-3.5 h-3.5 text-emerald-400" />}
          className="text-xs !bg-slate-800 !text-white hover:!bg-slate-700 border border-slate-700"
        >
          Complete
        </Button>

        <Button
          size="sm"
          variant="secondary"
          onClick={onMoveToInProgress}
          leftIcon={<ClockIcon className="w-3.5 h-3.5 text-blue-400" />}
          className="text-xs !bg-slate-800 !text-white hover:!bg-slate-700 border border-slate-700"
        >
          In Progress
        </Button>

        <Button
          size="sm"
          variant="danger"
          onClick={onDeleteSelected}
          leftIcon={<TrashIcon className="w-3.5 h-3.5" />}
          className="text-xs"
        >
          Delete
        </Button>

        <button
          type="button"
          onClick={onClearSelection}
          aria-label="Clear selection"
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer ml-1"
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
