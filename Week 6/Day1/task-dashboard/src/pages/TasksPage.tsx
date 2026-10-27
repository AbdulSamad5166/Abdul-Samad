import { useState, type ChangeEvent } from 'react'
import { NewTaskModal } from '../components/tasks/NewTaskModal'
import { PriorityBadge } from '../components/tasks/PriorityBadge'
import { StatusBadge } from '../components/tasks/StatusBadge'
import { TaskCard } from '../components/tasks/TaskCard'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import {
  BoardViewIcon,
  CalendarIcon,
  ListViewIcon,
  PlusIcon,
  SearchIcon,
} from '../components/ui/Icons'
import { PageHeader } from '../components/ui/PageHeader'
import { Select } from '../components/ui/Select'
import { useTasks } from '../hooks/useTasks'
import { TASK_STATUSES } from '../types/task'
import { formatDate, STATUS_LABELS } from '../utils/taskHelpers'

export function TasksPage() {
  const { tasks } = useTasks()

  // UI-only toolbar states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('dueDate')
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board')

  return (
    <>
      <PageHeader
        title="Tasks Board"
        description="Organize and monitor tasks across different development stages."
        action={
          <Button
            variant="primary"
            leftIcon={<PlusIcon className="h-4 w-4" />}
            onClick={() => setIsModalOpen(true)}
          >
            New Task
          </Button>
        }
      />

      {/* Toolbar */}
      <Card className="mb-6 p-3 sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Search & Filters */}
          <div className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:items-center">
            {/* Search Input (UI only) */}
            <div className="relative min-w-[200px] flex-1">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <SearchIcon className="h-4 w-4" />
              </span>
              <input
                type="search"
                value={searchQuery}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20"
              />
            </div>

            {/* Filter Dropdowns (UI only) */}
            <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
              <Select
                aria-label="Filter by status"
                value={statusFilter}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
                className="text-xs h-9"
                options={[
                  { value: 'all', label: 'All Statuses' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'in-progress', label: 'In Progress' },
                  { value: 'completed', label: 'Completed' },
                ]}
              />

              <Select
                aria-label="Filter by priority"
                value={priorityFilter}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setPriorityFilter(e.target.value)}
                className="text-xs h-9"
                options={[
                  { value: 'all', label: 'All Priorities' },
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' },
                ]}
              />
            </div>
          </div>

          {/* Sort & View Mode Toggle */}
          <div className="flex items-center justify-between gap-2.5 border-t border-slate-100 pt-3 lg:border-t-0 lg:pt-0">
            <div className="w-36">
              <Select
                aria-label="Sort tasks"
                value={sortBy}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value)}
                className="text-xs h-9"
                options={[
                  { value: 'dueDate', label: 'Sort: Due Date' },
                  { value: 'priority', label: 'Sort: Priority' },
                  { value: 'title', label: 'Sort: Title' },
                ]}
              />
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5">
              <button
                type="button"
                aria-label="Board view"
                onClick={() => setViewMode('board')}
                className={`flex h-8 w-8 items-center justify-center rounded-md text-xs transition cursor-pointer ${
                  viewMode === 'board'
                    ? 'bg-white text-indigo-600 shadow-2xs font-semibold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <BoardViewIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="List view"
                onClick={() => setViewMode('list')}
                className={`flex h-8 w-8 items-center justify-center rounded-md text-xs transition cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white text-indigo-600 shadow-2xs font-semibold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <ListViewIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Task View (Board vs List) */}
      {viewMode === 'board' ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {TASK_STATUSES.map((status) => {
            const columnTasks = tasks.filter((task) => task.status === status)
            const count = columnTasks.length

            return (
              <section
                key={status}
                aria-labelledby={`col-${status}`}
                className="flex flex-col rounded-2xl bg-slate-100/70 p-3.5 border border-slate-200/60"
              >
                {/* Column Header */}
                <div className="mb-3.5 flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        status === 'completed'
                          ? 'bg-emerald-500'
                          : status === 'in-progress'
                          ? 'bg-blue-500'
                          : 'bg-amber-500'
                      }`}
                    />
                    <h2 id={`col-${status}`} className="text-sm font-semibold text-slate-800">
                      {STATUS_LABELS[status]}
                    </h2>
                  </div>
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-600 shadow-2xs">
                    {count}
                  </span>
                </div>

                {/* Column Items */}
                <div className="space-y-3">
                  {count === 0 ? (
                    <EmptyState
                      title="No tasks"
                      message={`Nothing is ${STATUS_LABELS[status].toLowerCase()} yet.`}
                      className="bg-white/80 py-8"
                    />
                  ) : (
                    columnTasks.map((task) => <TaskCard key={task.id} task={task} />)
                  )}
                </div>
              </section>
            )
          })}
        </div>
      ) : (
        /* List View */
        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    Task
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Priority
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Due Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {tasks.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500">
                      No tasks found.
                    </td>
                  </tr>
                ) : (
                  tasks.map((task) => (
                    <tr key={task.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-900">{task.title}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {task.description}
                        </p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StatusBadge status={task.status} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <PriorityBadge priority={task.priority} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <CalendarIcon className="h-3.5 w-3.5 text-slate-400" />
                          <span>{formatDate(task.dueDate)}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Accessible New Task Modal */}
      <NewTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}