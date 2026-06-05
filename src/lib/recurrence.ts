import type { CalendarEvent } from '@/lib/store';

export interface DateRange {
  start: Date;
  end: Date;
}

/**
 * Given a recurring event, generate all instances that fall within the given date range.
 * Returns an array of CalendarEvent-shaped objects with adjusted start/end times.
 */
export function expandRecurringEvent(event: CalendarEvent, range: DateRange): CalendarEvent[] {
  if (!event.isRecurring || !event.recurrenceFrequency) return [];

  const frequency = event.recurrenceFrequency;
  const interval = event.recurrenceInterval ?? 1;
  const daysOfWeek = event.recurrenceDaysOfWeek ?? [];

  const originalStart = new Date(event.start);
  const originalEnd = new Date(event.end);
  const durationMs = originalEnd.getTime() - originalStart.getTime();

  // Recurrence upper bound: min of range.end and recurrenceEndDate
  const recurrenceEnd = event.recurrenceEndDate
    ? new Date(Math.min(new Date(event.recurrenceEndDate).getTime(), range.end.getTime()))
    : range.end;

  const instances: CalendarEvent[] = [];

  // Advance cursor by the appropriate interval
  function advance(date: Date): Date {
    const d = new Date(date);
    if (frequency === 'daily') {
      d.setDate(d.getDate() + interval);
    } else if (frequency === 'weekly') {
      d.setDate(d.getDate() + 7 * interval);
    } else if (frequency === 'monthly') {
      d.setMonth(d.getMonth() + interval);
    } else if (frequency === 'yearly') {
      d.setFullYear(d.getFullYear() + interval);
    }
    return d;
  }

  if (frequency === 'weekly' && daysOfWeek.length > 0) {
    // For weekly with specific days, we iterate week-by-week but emit on each selected day
    // Find the start of the week for originalStart
    const weekStart = new Date(originalStart);
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // rewind to Sunday

    let currentWeekStart = new Date(weekStart);

    // Safety cap: don't generate more than 5 years of instances
    const hardLimit = new Date(originalStart);
    hardLimit.setFullYear(hardLimit.getFullYear() + 5);
    const effectiveEnd = new Date(Math.min(recurrenceEnd.getTime(), hardLimit.getTime()));

    while (currentWeekStart <= effectiveEnd) {
      for (const dow of daysOfWeek) {
        const candidate = new Date(currentWeekStart);
        candidate.setDate(currentWeekStart.getDate() + dow);
        candidate.setHours(
          originalStart.getHours(),
          originalStart.getMinutes(),
          originalStart.getSeconds(),
          0
        );

        // Skip the original event occurrence (it's already in store.events)
        if (candidate.getTime() === originalStart.getTime()) continue;

        if (candidate < originalStart) continue;
        if (candidate > effectiveEnd) continue;
        if (candidate < range.start) continue;

        const instanceEnd = new Date(candidate.getTime() + durationMs);

        instances.push({
          ...event,
          id: `${event.id}_${candidate.getTime()}`,
          start: candidate.toISOString(),
          end: instanceEnd.toISOString(),
        });
      }

      // Advance by interval weeks
      currentWeekStart.setDate(currentWeekStart.getDate() + 7 * interval);
    }
  } else {
    // For daily / monthly / yearly (and weekly without specific days)
    let cursor = advance(new Date(originalStart));

    // Safety cap
    const hardLimit = new Date(originalStart);
    hardLimit.setFullYear(hardLimit.getFullYear() + 5);
    const effectiveEnd = new Date(Math.min(recurrenceEnd.getTime(), hardLimit.getTime()));

    while (cursor <= effectiveEnd) {
      if (cursor >= range.start) {
        const instanceEnd = new Date(cursor.getTime() + durationMs);
        instances.push({
          ...event,
          id: `${event.id}_${cursor.getTime()}`,
          start: cursor.toISOString(),
          end: instanceEnd.toISOString(),
        });
      }
      cursor = advance(cursor);
    }
  }

  return instances;
}
