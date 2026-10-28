/**
 * Date helpers using native Date and Intl API (no date-fns or moment).
 */

/**
 * Format ISO date string (YYYY-MM-DD) into readable representation (e.g. "Oct 28, 2026").
 */
export function formatDate(dateString: string): string {
  if (!dateString) return 'No due date';
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const d = new Date(year, month, day);
    if (!isNaN(d.getTime())) {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(d);
    }
  }
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
}

/**
 * Checks if a given date string is strictly before today (00:00:00).
 */
export function isOverdue(dueDateString: string, referenceDate: Date = new Date()): boolean {
  if (!dueDateString) return false;
  const parts = dueDateString.split('-');
  if (parts.length < 3) return false;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const due = new Date(year, month, day);
  
  const today = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate()
  );

  return due.getTime() < today.getTime();
}

/**
 * Checks if a given date string is today.
 */
export function isDueToday(dueDateString: string, referenceDate: Date = new Date()): boolean {
  if (!dueDateString) return false;
  const parts = dueDateString.split('-');
  if (parts.length < 3) return false;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  
  return (
    year === referenceDate.getFullYear() &&
    month === referenceDate.getMonth() &&
    day === referenceDate.getDate()
  );
}

/**
 * Checks if a date falls within the next 7 days from reference.
 */
export function isDueThisWeek(dueDateString: string, referenceDate: Date = new Date()): boolean {
  if (!dueDateString) return false;
  const parts = dueDateString.split('-');
  if (parts.length < 3) return false;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const due = new Date(year, month, day);
  
  const today = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate()
  );
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  return due.getTime() >= today.getTime() && due.getTime() <= nextWeek.getTime();
}

/**
 * Returns today's date in YYYY-MM-DD format.
 */
export function getTodayDateString(referenceDate: Date = new Date()): string {
  const y = referenceDate.getFullYear();
  const m = String(referenceDate.getMonth() + 1).padStart(2, '0');
  const d = String(referenceDate.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Generates an array of date strings for a month calendar view.
 */
export function getCalendarMonthDays(year: number, monthIndex: number): {
  date: Date;
  dateString: string;
  isCurrentMonth: boolean;
  dayNumber: number;
}[] {
  const firstDayOfMonth = new Date(year, monthIndex, 1);
  const lastDayOfMonth = new Date(year, monthIndex + 1, 0);
  
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 is Sunday
  
  const days = [];
  
  // Previous month trailing days
  const prevMonthLastDay = new Date(year, monthIndex, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i;
    const d = new Date(year, monthIndex - 1, day);
    const mStr = String(d.getMonth() + 1).padStart(2, '0');
    const dStr = String(d.getDate()).padStart(2, '0');
    days.push({
      date: d,
      dateString: `${d.getFullYear()}-${mStr}-${dStr}`,
      isCurrentMonth: false,
      dayNumber: day,
    });
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, monthIndex, i);
    const mStr = String(monthIndex + 1).padStart(2, '0');
    const dStr = String(i).padStart(2, '0');
    days.push({
      date: d,
      dateString: `${year}-${mStr}-${dStr}`,
      isCurrentMonth: true,
      dayNumber: i,
    });
  }
  
  // Next month leading days to complete full 35 or 42 grid slots
  const remaining = (7 - (days.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, monthIndex + 1, i);
    const mStr = String(d.getMonth() + 1).padStart(2, '0');
    const dStr = String(i).padStart(2, '0');
    days.push({
      date: d,
      dateString: `${d.getFullYear()}-${mStr}-${dStr}`,
      isCurrentMonth: false,
      dayNumber: i,
    });
  }
  
  return days;
}
