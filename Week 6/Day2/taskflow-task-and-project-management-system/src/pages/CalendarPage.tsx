import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { getCalendarMonthDays, formatDate, isDueToday } from '../utils/dateHelpers';
import { PRIORITY_LABELS, STATUS_LABELS } from '../utils/constants';
import { ChevronLeftIcon, ChevronRightIcon, ClockIcon } from '../components/icons';
import { Task } from '../types';

export const CalendarPage: React.FC = () => {
  const { data: tasks = [] } = useTasks();

  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 9, 28)); // October 2026 default
  const [selectedDayString, setSelectedDayString] = useState<string>('2026-10-28');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Month navigation
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
    const now = new Date();
    const mStr = String(now.getMonth() + 1).padStart(2, '0');
    const dStr = String(now.getDate()).padStart(2, '0');
    setSelectedDayString(`${now.getFullYear()}-${mStr}-${dStr}`);
  };

  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(
    currentDate
  );

  const days = useMemo(() => getCalendarMonthDays(year, month), [year, month]);

  // Map tasks by dueDate
  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    tasks.forEach((t) => {
      const list = map.get(t.dueDate) || [];
      list.push(t);
      map.set(t.dueDate, list);
    });
    return map;
  }, [tasks]);

  const selectedDayTasks = tasksByDate.get(selectedDayString) || [];

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        pill="Schedule"
        title="Calendar View"
        description="Browse task deadlines on a native interactive monthly grid"
        actions={
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleToday}>
              Today
            </Button>
            <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                aria-label="Previous month"
                className="rounded-lg p-1.5 text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <span className="px-3 text-xs font-bold text-slate-800 dark:text-slate-200">
                {monthName}
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="Next month"
                className="rounded-lg p-1.5 text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 items-start">
        {/* 3 cols: Calendar Grid */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900 lg:col-span-3">
          {/* Day names header */}
          <div className="grid grid-cols-7 border-b border-slate-100 pb-2 text-center text-xs font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Grid cells */}
          <div className="grid grid-cols-7 gap-1 pt-2">
            {days.map((dayItem) => {
              const dayTasks = tasksByDate.get(dayItem.dateString) || [];
              const isSelected = selectedDayString === dayItem.dateString;
              const isCurrentDay = isDueToday(dayItem.dateString);

              return (
                <div
                  key={dayItem.dateString}
                  onClick={() => setSelectedDayString(dayItem.dateString)}
                  className={`min-h-[90px] rounded-xl p-2 transition-all cursor-pointer border ${
                    isSelected
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                      : dayItem.isCurrentMonth
                      ? 'border-slate-100 bg-white hover:border-slate-300 dark:border-slate-800/80 dark:bg-slate-900 dark:hover:border-slate-700'
                      : 'border-transparent bg-slate-50/50 text-slate-400 dark:bg-slate-900/30 dark:text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        isCurrentDay
                          ? 'bg-primary text-white shadow-xs'
                          : isSelected
                          ? 'text-primary'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {dayItem.dayNumber}
                    </span>

                    {dayTasks.length > 0 && (
                      <span className="rounded-full bg-slate-200 px-1.5 py-0.2 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {dayTasks.length}
                      </span>
                    )}
                  </div>

                  {/* Micro task tags */}
                  <div className="mt-1 space-y-1 overflow-hidden">
                    {dayTasks.slice(0, 2).map((t) => (
                      <div
                        key={t.id}
                        className={`truncate rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                          t.priority === 'urgent'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                            : t.priority === 'high'
                            ? 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300'
                            : 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light'
                        }`}
                        title={t.title}
                      >
                        {t.title}
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <span className="text-[10px] text-slate-400 block pl-1">
                        +{dayTasks.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 1 col: Selected Day Breakdown */}
        <div className="space-y-4">
          <Card
            headerPill="Selected Day"
            title={formatDate(selectedDayString)}
            subtitle={`${selectedDayTasks.length} task${selectedDayTasks.length === 1 ? '' : 's'} scheduled`}
          >
            <div className="space-y-3">
              {selectedDayTasks.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  <ClockIcon className="mx-auto w-8 h-8 text-slate-300 mb-2" />
                  No tasks due on this date.
                </div>
              ) : (
                selectedDayTasks.map((t) => (
                  <Link
                    key={t.id}
                    to={`/tasks/${t.id}`}
                    className="block rounded-xl border border-slate-100 bg-slate-50/70 p-3 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {t.title}
                      </span>
                      <Badge
                        size="sm"
                        variant={
                          t.priority === 'urgent'
                            ? 'danger'
                            : t.priority === 'high'
                            ? 'warning'
                            : 'default'
                        }
                      >
                        {PRIORITY_LABELS[t.priority]}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Status: {STATUS_LABELS[t.status]}</span>
                      <span className="text-primary font-semibold">View &rarr;</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
