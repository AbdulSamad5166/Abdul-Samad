import { useState, useCallback } from 'react';
import { TaskFilterOptions } from '../types';

const initialFilters: TaskFilterOptions = {
  search: '',
  status: 'all',
  priority: 'all',
  projectId: 'all',
  dueDateFilter: 'all',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export function useTaskFilters() {
  const [filters, setFilters] = useState<TaskFilterOptions>(initialFilters);

  const updateFilter = useCallback(
    <K extends keyof TaskFilterOptions>(key: K, value: TaskFilterOptions[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const hasActiveFilters =
    filters.search !== '' ||
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.projectId !== 'all' ||
    filters.dueDateFilter !== 'all';

  return {
    filters,
    setFilters,
    updateFilter,
    resetFilters,
    hasActiveFilters,
  };
}
