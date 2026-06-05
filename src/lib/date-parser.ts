/**
 * Lightweight natural language date parser.
 * Covers: today, tomorrow, yesterday, "in N days/weeks", "next Monday", "Dec 25", ISO dates.
 * Returns null for unrecognised input so callers can fall back to a date picker.
 */

const WEEKDAYS: Record<string, number> = {
  sunday: 0,
  sun: 0,
  monday: 1,
  mon: 1,
  tuesday: 2,
  tue: 2,
  wednesday: 3,
  wed: 3,
  thursday: 4,
  thu: 4,
  friday: 5,
  fri: 5,
  saturday: 6,
  sat: 6,
};

const MONTHS: Record<string, number> = {
  january: 0,
  jan: 0,
  february: 1,
  feb: 1,
  march: 2,
  mar: 2,
  april: 3,
  apr: 3,
  may: 4,
  june: 5,
  jun: 5,
  july: 6,
  jul: 6,
  august: 7,
  aug: 7,
  september: 8,
  sep: 8,
  sept: 8,
  october: 9,
  oct: 9,
  november: 10,
  nov: 10,
  december: 11,
  dec: 11,
};

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function nextWeekday(from: Date, target: number): Date {
  const current = from.getDay();
  let diff = target - current;
  if (diff <= 0) diff += 7;
  return addDays(from, diff);
}

export function parseNaturalDate(input: string, now: Date = new Date()): Date | null {
  const today = startOfDay(now);
  const s = input.trim().toLowerCase();

  if (!s) return null;

  // Absolute keywords
  if (s === 'today') return today;
  if (s === 'tomorrow') return addDays(today, 1);
  if (s === 'yesterday') return addDays(today, -1);
  if (s === 'next week') return addDays(today, 7);
  if (s === 'end of week' || s === 'eow') return nextWeekday(today, 5); // Friday
  if (s === 'end of month' || s === 'eom') {
    return new Date(today.getFullYear(), today.getMonth() + 1, 0);
  }

  // "in N days/weeks/months"
  const inMatch = s.match(/^in\s+(\d+)\s+(day|days|week|weeks|month|months)$/);
  if (inMatch) {
    const n = parseInt(inMatch[1], 10);
    const unit = inMatch[2];
    if (unit.startsWith('day')) return addDays(today, n);
    if (unit.startsWith('week')) return addDays(today, n * 7);
    if (unit.startsWith('month')) {
      const d = new Date(today);
      d.setMonth(d.getMonth() + n);
      return d;
    }
  }

  // "N days/weeks from now"
  const fromNowMatch = s.match(/^(\d+)\s+(day|days|week|weeks)\s+from\s+now$/);
  if (fromNowMatch) {
    const n = parseInt(fromNowMatch[1], 10);
    return fromNowMatch[2].startsWith('week') ? addDays(today, n * 7) : addDays(today, n);
  }

  // Weekday names: "monday", "next monday"
  const nextPrefix = s.startsWith('next ');
  const dayName = nextPrefix ? s.slice(5) : s;
  if (dayName in WEEKDAYS) {
    const target = WEEKDAYS[dayName];
    if (nextPrefix) {
      // always at least 7 days away
      const d = nextWeekday(today, target);
      return d.getTime() === today.getTime() ? addDays(d, 7) : d;
    }
    // nearest future weekday (or today)
    return nextWeekday(addDays(today, -1), target);
  }

  // "Dec 25" or "December 25" or "25 Dec"
  const monthDayMatch = s.match(/^([a-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?$/);
  if (monthDayMatch) {
    const monthIdx = MONTHS[monthDayMatch[1]];
    if (monthIdx !== undefined) {
      const day = parseInt(monthDayMatch[2], 10);
      const year = today.getMonth() > monthIdx ? today.getFullYear() + 1 : today.getFullYear();
      return new Date(year, monthIdx, day);
    }
  }
  const dayMonthMatch = s.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+([a-z]+)$/);
  if (dayMonthMatch) {
    const monthIdx = MONTHS[dayMonthMatch[2]];
    if (monthIdx !== undefined) {
      const day = parseInt(dayMonthMatch[1], 10);
      const year = today.getMonth() > monthIdx ? today.getFullYear() + 1 : today.getFullYear();
      return new Date(year, monthIdx, day);
    }
  }

  // ISO or standard date strings: "2025-12-25", "12/25", "12/25/2025"
  const isoMatch = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (isoMatch) {
    return new Date(parseInt(isoMatch[1]), parseInt(isoMatch[2]) - 1, parseInt(isoMatch[3]));
  }
  const slashMatch = s.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?$/);
  if (slashMatch) {
    const month = parseInt(slashMatch[1], 10) - 1;
    const day = parseInt(slashMatch[2], 10);
    let year = slashMatch[3] ? parseInt(slashMatch[3], 10) : today.getFullYear();
    if (year < 100) year += 2000;
    return new Date(year, month, day);
  }

  return null;
}

/** Format a Date as YYYY-MM-DD for use in <input type="date"> */
export function toInputDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Human-readable hint for what a string will resolve to */
export function describeParsed(input: string, now?: Date): string | null {
  const d = parseNaturalDate(input, now);
  if (!d) return null;
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}
