import { useState } from 'react'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  PlusIcon,
} from '../components/ui/Icons'
import { PageHeader } from '../components/ui/PageHeader'

interface CalendarEvent {
  id: string
  day: number
  isCurrentMonth: boolean
  title: string
  priority: 'high' | 'medium' | 'low'
  time?: string
  status?: 'completed' | 'in-progress' | 'pending'
}

const SAMPLE_EVENTS: CalendarEvent[] = [
  {
    id: 'ev-1',
    day: 18,
    isCurrentMonth: true,
    title: 'Sprint Planning',
    priority: 'medium',
    time: '10:00 AM',
    status: 'completed',
  },
  {
    id: 'ev-2',
    day: 24,
    isCurrentMonth: true,
    title: 'Prepare weekly report',
    priority: 'low',
    time: '04:00 PM',
    status: 'completed',
  },
  {
    id: 'ev-3',
    day: 25,
    isCurrentMonth: true,
    title: 'Fix navbar bug',
    priority: 'high',
    time: '02:30 PM',
    status: 'completed',
  },
  {
    id: 'ev-4',
    day: 27,
    isCurrentMonth: true,
    title: 'Sprint Demo & Review',
    priority: 'high',
    time: '03:00 PM',
    status: 'in-progress',
  },
  {
    id: 'ev-5',
    day: 28,
    isCurrentMonth: true,
    title: 'Review pull requests',
    priority: 'medium',
    time: '11:00 AM',
    status: 'in-progress',
  },
  {
    id: 'ev-6',
    day: 30,
    isCurrentMonth: true,
    title: 'Design landing page',
    priority: 'high',
    time: '05:00 PM',
    status: 'in-progress',
  },
  {
    id: 'ev-7',
    day: 4,
    isCurrentMonth: false,
    title: 'Write API documentation',
    priority: 'medium',
    time: '01:00 PM',
    status: 'pending',
  },
]

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// Generate 42 days grid for October 2026
// Oct 1, 2026 was Thursday, so Sep 28, 29, 30 precede it.
const CALENDAR_CELLS = [
  { day: 28, isCurrentMonth: false },
  { day: 29, isCurrentMonth: false },
  { day: 30, isCurrentMonth: false },
  ...Array.from({ length: 31 }, (_, i) => ({ day: i + 1, isCurrentMonth: true })),
  ...Array.from({ length: 8 }, (_, i) => ({ day: i + 1, isCurrentMonth: false })),
]

export function CalendarPage() {
  const [selectedDay, setSelectedDay] = useState(27)

  const activeEvents = SAMPLE_EVENTS.filter(
    (ev) => ev.isCurrentMonth && ev.day === selectedDay,
  )

  return (
    <>
      <PageHeader
        title="Calendar"
        description="Schedule sprints, milestones, and deliverable deadlines."
        action={
          <Button
            variant="primary"
            leftIcon={<PlusIcon className="h-4 w-4" />}
            onClick={() => alert('Schedule Event Dialog (UI demo)')}
          >
            Add Event
          </Button>
        }
      />

      {/* Calendar Controls Bar */}
      <Card className="mb-6 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-900">October 2026</h2>
            <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-0.5">
              <button
                type="button"
                aria-label="Previous month"
                className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition cursor-pointer"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Next month"
                className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition cursor-pointer"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => setSelectedDay(27)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              Today
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
              Month View
            </span>
            <span className="rounded-lg px-2.5 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 transition cursor-pointer">
              Week
            </span>
            <span className="rounded-lg px-2.5 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 transition cursor-pointer">
              Day
            </span>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Monthly Calendar Grid (3 columns on desktop) */}
        <div className="lg:col-span-3">
          <Card padding="none" className="overflow-hidden">
            {/* Weekday Headings */}
            <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/80 text-center text-xs font-semibold text-slate-600">
              {DAYS_OF_WEEK.map((weekday) => (
                <div key={weekday} className="py-2.5">
                  {weekday}
                </div>
              ))}
            </div>

            {/* Date Cells Grid */}
            <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 bg-slate-50/30">
              {CALENDAR_CELLS.map((cell, index) => {
                const isToday = cell.isCurrentMonth && cell.day === 27
                const isSelected = cell.isCurrentMonth && cell.day === selectedDay
                const cellEvents = SAMPLE_EVENTS.filter(
                  (ev) => ev.isCurrentMonth === cell.isCurrentMonth && ev.day === cell.day,
                )

                return (
                  <div
                    key={`${cell.day}-${index}`}
                    onClick={() => {
                      if (cell.isCurrentMonth) setSelectedDay(cell.day)
                    }}
                    className={`min-h-[85px] p-1.5 sm:p-2 transition cursor-pointer ${
                      cell.isCurrentMonth ? 'bg-white hover:bg-indigo-50/30' : 'bg-slate-50/60'
                    } ${isSelected ? 'ring-2 ring-indigo-500 ring-inset' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                          isToday
                            ? 'bg-indigo-600 font-bold text-white shadow-2xs'
                            : cell.isCurrentMonth
                            ? 'text-slate-800'
                            : 'text-slate-400'
                        }`}
                      >
                        {cell.day}
                      </span>
                      {cellEvents.length > 0 && (
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                      )}
                    </div>

                    {/* Events inside date cell */}
                    <div className="mt-1 space-y-1">
                      {cellEvents.slice(0, 2).map((ev) => (
                        <div
                          key={ev.id}
                          className={`truncate rounded px-1.5 py-0.5 text-[10px] font-medium ${
                            ev.priority === 'high'
                              ? 'bg-red-50 text-red-700'
                              : ev.priority === 'medium'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-indigo-50 text-indigo-700'
                          }`}
                        >
                          {ev.title}
                        </div>
                      ))}
                      {cellEvents.length > 2 && (
                        <span className="text-[9px] font-semibold text-slate-400 pl-1">
                          +{cellEvents.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* Selected Day Agenda Sidebar */}
        <div className="space-y-4">
          <Card>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Agenda
                </p>
                <h3 className="text-base font-bold text-slate-900">
                  Oct {selectedDay}, 2026
                </h3>
              </div>
              <Badge tone="indigo">
                {activeEvents.length} {activeEvents.length === 1 ? 'task' : 'tasks'}
              </Badge>
            </div>

            <div className="mt-4 space-y-3">
              {activeEvents.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No scheduled items for this date.
                </div>
              ) : (
                activeEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 transition hover:bg-white"
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-xs font-semibold text-slate-900 leading-snug">
                        {ev.title}
                      </p>
                      <Badge
                        dot
                        tone={
                          ev.priority === 'high'
                            ? 'red'
                            : ev.priority === 'medium'
                            ? 'amber'
                            : 'slate'
                        }
                      >
                        {ev.priority}
                      </Badge>
                    </div>

                    {ev.time && (
                      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
                        <ClockIcon className="h-3 w-3 text-slate-400" />
                        <span>{ev.time}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
