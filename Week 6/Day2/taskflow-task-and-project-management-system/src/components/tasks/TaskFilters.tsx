import React, { useEffect, useState } from 'react';
import { Project, TaskFilterOptions, TaskPriority, TaskSortField, TaskStatus } from '../../types';
import { useDebounce } from '../../hooks/useDebounce';
import { SearchIcon, CloseIcon, GridIcon, ListIcon } from '../icons';

interface TaskFiltersProps {
  filters: TaskFilterOptions;
  projects: Project[];
  onFilterChange: <K extends keyof TaskFilterOptions>(key: K, value: TaskFilterOptions[K]) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
  viewMode: 'list' | 'grid';
  onToggleViewMode: (mode: 'list' | 'grid') => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  filters,
  projects,
  onFilterChange,
  onReset,
  hasActiveFilters,
  viewMode,
  onToggleViewMode,
}) => {
  // Local state for instant typing, debounced before updating filter
  const [searchInput, setSearchInput] = useState(filters.search);
  const debouncedSearch = useDebounce(searchInput, 250);

  useEffect(() => {
    onFilterChange('search', debouncedSearch);
  }, [debouncedSearch, onFilterChange]);

  // Keep search input in sync if filters.search is reset
  useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      {/* Top row: Search input + View toggle + Reset */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by title, description, or #tag..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-8 text-xs text-slate-900 placeholder:text-slate-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100"
          />
          <SearchIcon className="pointer-events-none absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <CloseIcon className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* View toggle (Grid / List) & Reset */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 cursor-pointer transition-colors"
            >
              <CloseIcon className="w-3.5 h-3.5" />
              <span>Clear filters</span>
            </button>
          )}

          <div className="flex items-center rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            <button
              type="button"
              aria-label="List view"
              onClick={() => onToggleViewMode('list')}
              className={`rounded-lg p-1.5 transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-primary shadow-xs dark:bg-slate-700 dark:text-white'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label="Grid view"
              onClick={() => onToggleViewMode('grid')}
              className={`rounded-lg p-1.5 transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-primary shadow-xs dark:bg-slate-700 dark:text-white'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              <GridIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter dropdowns row */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5 pt-1 border-t border-slate-100 dark:border-slate-800/80">
        {/* Status */}
        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value as TaskStatus | 'all')}
            className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
            Priority
          </label>
          <select
            value={filters.priority}
            onChange={(e) => onFilterChange('priority', e.target.value as TaskPriority | 'all')}
            className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        {/* Project */}
        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
            Project
          </label>
          <select
            value={filters.projectId}
            onChange={(e) => onFilterChange('projectId', e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="all">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Due date filter */}
        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
            Timeline
          </label>
          <select
            value={filters.dueDateFilter}
            onChange={(e) =>
              onFilterChange(
                'dueDateFilter',
                e.target.value as TaskFilterOptions['dueDateFilter']
              )
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="all">All Dates</option>
            <option value="overdue">Overdue</option>
            <option value="today">Due Today</option>
            <option value="this_week">This Week</option>
            <option value="upcoming">Upcoming</option>
          </select>
        </div>

        {/* Sort by */}
        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
            Sort By
          </label>
          <div className="flex gap-1">
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange('sortBy', e.target.value as TaskSortField)}
              className="flex-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="createdAt">Created Date</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="title">Title</option>
            </select>
            <button
              type="button"
              onClick={() =>
                onFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')
              }
              title={`Sort ${filters.sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
            >
              {filters.sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
