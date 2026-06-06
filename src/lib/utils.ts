import { toZonedTime, fromZonedTime, format as formatTz } from 'date-fns-tz';

export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

// ── Timezone helpers ─────────────────────────────────────────────────────────

/** Returns the browser's IANA timezone string (e.g. "America/New_York"). */
export function getUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'UTC';
  }
}

/**
 * Convert a UTC Date (or ISO string) to a wall-clock Date in the user's
 * local timezone.  Use the result only for display: hours, minutes, day
 * comparisons, and grid positioning.
 */
export function toUserTime(date: Date | string, tz = getUserTimezone()): Date {
  return toZonedTime(typeof date === 'string' ? new Date(date) : date, tz);
}

/**
 * Convert a wall-clock Date in the user's timezone back to UTC.
 * Use this before storing any ISO string.
 */
export function fromUserTime(date: Date, tz = getUserTimezone()): Date {
  return fromZonedTime(date, tz);
}

/**
 * Format a Date or ISO string using the user's timezone.
 * formatStr follows date-fns format tokens.
 */
export function formatInUserTz(
  date: Date | string,
  formatStr: string,
  tz = getUserTimezone()
): string {
  return formatTz(toUserTime(date, tz), formatStr, { timeZone: tz });
}

/**
 * True when two Dates fall on the same calendar day in the user's timezone.
 * Replaces bare `isSameDay` calls that use local midnight comparisons.
 */
export function isSameDayTz(a: Date | string, b: Date | string, tz = getUserTimezone()): boolean {
  const az = toUserTime(a, tz);
  const bz = toUserTime(b, tz);
  return (
    az.getFullYear() === bz.getFullYear() &&
    az.getMonth() === bz.getMonth() &&
    az.getDate() === bz.getDate()
  );
}

/**
 * Return the minutes-since-midnight for a UTC Date/ISO string interpreted in
 * the user's timezone.  Used for vertical positioning on the time grid.
 */
export function minutesInDayTz(date: Date | string, tz = getUserTimezone()): number {
  const z = toUserTime(date, tz);
  return z.getHours() * 60 + z.getMinutes();
}

/**
 * Produce a `datetime-local` input value (YYYY-MM-DDTHH:mm) from a UTC Date
 * converted to the user's timezone — replaces the manual offset hack.
 */
export function toLocalDatetimeStringTz(date: Date, tz = getUserTimezone()): string {
  return formatTz(toZonedTime(date, tz), "yyyy-MM-dd'T'HH:mm", { timeZone: tz });
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days <= 7) return `${days}d`;
  return formatDate(date);
}

export function getWeekDates(date: Date, firstDayOfWeek: number = 0): Date[] {
  const start = new Date(date);
  const dayOfWeek = start.getDay();
  // Calculate days to subtract to get to firstDayOfWeek
  const daysToSubtract = (dayOfWeek - firstDayOfWeek + 7) % 7;
  start.setDate(start.getDate() - daysToSubtract);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d;
  });
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function toLocalDatetimeString(date: Date): string {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}
