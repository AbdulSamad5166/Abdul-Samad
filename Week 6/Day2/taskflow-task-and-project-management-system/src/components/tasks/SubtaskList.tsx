import React, { useState } from 'react';
import { Subtask } from '../../types';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { calculateProgressPercentage } from '../../utils/formatters';
import { PlusIcon, TrashIcon } from '../icons';

interface SubtaskListProps {
  subtasks: Subtask[];
  onToggle: (subtaskId: string) => void;
  onAdd: (title: string) => void;
  onDelete: (subtaskId: string) => void;
  isEditable?: boolean;
}

export const SubtaskList: React.FC<SubtaskListProps> = ({
  subtasks,
  onToggle,
  onAdd,
  onDelete,
  isEditable = true,
}) => {
  const [newTitle, setNewTitle] = useState('');

  const completedCount = subtasks.filter((s) => s.completed).length;
  const totalCount = subtasks.length;
  const progress = calculateProgressPercentage(completedCount, totalCount);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      onAdd(newTitle.trim());
      setNewTitle('');
    }
  };

  return (
    <div className="space-y-3">
      {/* Progress header */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-slate-700 dark:text-slate-300">
          Subtasks ({completedCount}/{totalCount})
        </span>
        <span className="font-semibold text-primary">{progress}% completed</span>
      </div>

      <ProgressBar value={progress} size="sm" />

      {/* Checklist items */}
      <div className="space-y-1.5 pt-1">
        {subtasks.length === 0 ? (
          <p className="text-xs text-slate-400 py-2">No subtasks added yet.</p>
        ) : (
          subtasks.map((subtask) => (
            <div
              key={subtask.id}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 transition-colors hover:bg-slate-100/80 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800"
            >
              <label className="flex items-center gap-3 cursor-pointer select-none flex-1 min-w-0 mr-2">
                <input
                  type="checkbox"
                  checked={subtask.completed}
                  onChange={() => onToggle(subtask.id)}
                  aria-label={`Mark subtask ${subtask.title} as ${subtask.completed ? 'incomplete' : 'completed'}`}
                  className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                />
                <span
                  className={`text-xs break-words ${
                    subtask.completed
                      ? 'text-slate-400 line-through dark:text-slate-500'
                      : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {subtask.title}
                </span>
              </label>

              {isEditable && (
                <button
                  type="button"
                  onClick={() => onDelete(subtask.id)}
                  aria-label={`Delete subtask ${subtask.title}`}
                  className="text-slate-400 hover:text-rose-500 cursor-pointer p-1 transition-colors"
                >
                  <TrashIcon className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add subtask input */}
      {isEditable && (
        <form onSubmit={handleAdd} className="flex gap-2 pt-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Add new subtask item..."
            className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          <Button
            type="submit"
            size="sm"
            variant="secondary"
            disabled={!newTitle.trim()}
            leftIcon={<PlusIcon className="w-3.5 h-3.5" />}
          >
            Add
          </Button>
        </form>
      )}
    </div>
  );
};
