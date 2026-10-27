import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { StatCard } from '../components/dashboard/StatCard'
import { NewTaskModal } from '../components/tasks/NewTaskModal'
import { TaskCard } from '../components/tasks/TaskCard'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import {
  AlertCircleIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  ClockIcon,
  PlusIcon,
  SparklesIcon,
  TasksIcon,
} from '../components/ui/Icons'
import { PageHeader } from '../components/ui/PageHeader'
import { ProgressBar } from '../components/ui/ProgressBar'
import { useTasks } from '../hooks/useTasks'
import { getTaskStats, getUpcomingTasks } from '../utils/taskHelpers'

// Sample activity data for realistic SaaS feed
const RECENT_ACTIVITIES = [
  {
    id: 'act-1',
    user: 'Alex Morgan',
    action: 'marked as completed',
    target: 'Fix navbar bug on mobile',
    time: '2 hours ago',
    type: 'completed',
  },
  {
    id: 'act-2',
    user: 'Devon Vance',
    action: 'updated priority to High on',
    target: 'Design landing page',
    time: '4 hours ago',
    type: 'updated',
  },
  {
    id: 'act-3',
    user: 'Sarah Jenkins',
    action: 'created task',
    target: 'Write API documentation',
    time: 'Yesterday',
    type: 'created',
  },
  {
    id: 'act-4',
    user: 'System',
    action: 'started sprint',
    target: 'Sprint #4 - Q4 Deliverables',
    time: '2 days ago',
    type: 'system',
  },
]

// Sample weekly velocity data for Tailwind-only visual chart
const WEEKLY_DATA = [
  { day: 'Mon', completed: 3, total: 5, height: '60%' },
  { day: 'Tue', completed: 5, total: 6, height: '83%' },
  { day: 'Wed', completed: 2, total: 4, height: '50%' },
  { day: 'Thu', completed: 6, total: 7, height: '85%' },
  { day: 'Fri', completed: 4, total: 5, height: '80%' },
  { day: 'Sat', completed: 1, total: 2, height: '50%' },
  { day: 'Sun', completed: 0, total: 1, height: '15%' },
]

export function DashboardPage() {
  const { tasks } = useTasks()
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Derived data
  const stats = useMemo(() => getTaskStats(tasks), [tasks])
  const upcoming = useMemo(() => getUpcomingTasks(tasks, 4), [tasks])

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Monitor sprint progress, deadlines, and project velocity."
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

      {/* Welcome SaaS Banner */}
      <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 p-6 text-white shadow-md">
        <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/30 px-3 py-1 text-xs font-medium text-indigo-200 backdrop-blur-xs">
              <SparklesIcon className="h-3.5 w-3.5 text-indigo-300" />
              <span>Sprint #4 is currently active</span>
            </div>
            <h2 className="mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
              Welcome back, Alex! 👋
            </h2>
            <p className="mt-1 text-sm text-indigo-100/90 leading-relaxed">
              You have completed {stats.completed} of {stats.total} total tasks. There are{' '}
              <span className="font-semibold text-white">{stats.pending} pending tasks</span>{' '}
              requiring your attention this week.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2.5">
            <Link
              to="/tasks"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-indigo-950 shadow-sm transition hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>View Tasks Board</span>
              <ChevronRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Subtle decorative glow */}
        <div
          className="pointer-events-none absolute -right-10 -top-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl"
          aria-hidden="true"
        />
      </div>

      {/* Metric Stat Cards */}
      <section aria-label="Key performance metrics" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Tasks"
          value={stats.total}
          accentClass="text-slate-900"
          icon={<TasksIcon className="h-5 w-5 text-indigo-600" />}
          trend={{ value: '+12%', isPositive: true, label: 'vs last month' }}
        />
        <StatCard
          label="In Progress"
          value={stats.inProgress}
          accentClass="text-blue-600"
          icon={<ClockIcon className="h-5 w-5 text-blue-600" />}
          trend={{ value: '3 active', isPositive: true, label: 'in current sprint' }}
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          accentClass="text-emerald-600"
          icon={<CheckCircleIcon className="h-5 w-5 text-emerald-600" />}
          trend={{ value: `${stats.completionRate}%`, isPositive: true, label: 'completion rate' }}
        />
        <StatCard
          label="Pending"
          value={stats.pending}
          accentClass="text-amber-600"
          icon={<AlertCircleIcon className="h-5 w-5 text-amber-600" />}
          trend={{ value: '2 urgent', isPositive: false, label: 'due soon' }}
        />
      </section>

      {/* Progress & Visual Activity Chart Section */}
      <section aria-label="Task progress and velocity" className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Overall Progress Card */}
        <Card className="lg:col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Sprint Completion</h2>
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-600">
              {stats.completionRate}%
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Overall status based on all workspace assignments.
          </p>

          <div className="mt-4">
            <ProgressBar
              value={stats.completionRate}
              tone="indigo"
              size="lg"
              aria-label="Overall progress percentage"
            />
          </div>

          <div className="mt-5 space-y-2.5 border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-slate-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Completed
              </span>
              <span className="font-semibold text-slate-900">{stats.completed}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-slate-600">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                In Progress
              </span>
              <span className="font-semibold text-slate-900">{stats.inProgress}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-slate-600">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Pending
              </span>
              <span className="font-semibold text-slate-900">{stats.pending}</span>
            </div>
          </div>
        </Card>

        {/* Pure Tailwind Activity Visualization (No chart library) */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Weekly Task Velocity</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Tasks completed vs planned per day this week
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
              +18% efficiency
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="mt-6 flex h-40 items-end justify-between gap-2 pt-4 border-b border-slate-100 pb-2">
            {WEEKLY_DATA.map((item) => (
              <div key={item.day} className="group flex flex-1 flex-col items-center gap-2 h-full justify-end">
                {/* Tooltip on hover */}
                <span className="text-[10px] font-semibold text-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.completed}/{item.total}
                </span>
                <div className="relative w-full max-w-[2.25rem] rounded-t-lg bg-slate-100 overflow-hidden flex flex-col justify-end h-28">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-indigo-600 to-indigo-500 transition-all duration-300 group-hover:from-indigo-700 group-hover:to-indigo-600"
                    style={{ height: item.height }}
                  />
                </div>
                <span className="text-xs font-medium text-slate-500 group-hover:text-slate-900 transition-colors">
                  {item.day}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-indigo-600" />
              Completed tasks
            </span>
            <span>Sprint Goal: 25 tasks / week</span>
          </div>
        </Card>
      </section>

      {/* Lower Row: Upcoming Deadlines & Recent Activity */}
      <section aria-label="Deadlines and activities" className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Upcoming Tasks */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Upcoming Deadlines</h2>
            <Link
              to="/tasks"
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition"
            >
              View all
            </Link>
          </div>

          {upcoming.length === 0 ? (
            <EmptyState title="All caught up!" message="You have no pending tasks scheduled right now." />
          ) : (
            <div className="space-y-3">
              {upcoming.map((task) => (
                <TaskCard key={task.id} task={task} showStatus />
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity List */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Recent Activity</h2>
            <span className="text-xs text-slate-400">Live feed</span>
          </div>

          <Card padding="sm" className="divide-y divide-slate-100">
            {RECENT_ACTIVITIES.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 font-semibold text-[10px]">
                  {activity.user.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-700 leading-snug">
                    <span className="font-semibold text-slate-900">{activity.user}</span>{' '}
                    {activity.action}{' '}
                    <span className="font-medium text-slate-900">"{activity.target}"</span>
                  </p>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">{activity.time}</span>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </section>

      {/* New Task Modal */}
      <NewTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}