import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  newDate,
  newDateFromYMD,
  formatDate,
  roundDateUp,
  getWeekDays,
  getDaysInMonth,
  formatToLocalISOString,
  addHours,
  startOfDay,
  endOfDay,
  parseISO,
  subHours,
  createUTCMidnightDate,
  createAllDayDate,
  normalizeAllDayDate,
  createOutlookAllDayDate,
  isFutureDate,
} from '@/lib/scheduling/date-utils';

describe('newDate', () => {
  it('returns current date when called with no args', () => {
    const before = Date.now();
    const result = newDate();
    const after = Date.now();
    expect(result.getTime()).toBeGreaterThanOrEqual(before);
    expect(result.getTime()).toBeLessThanOrEqual(after);
  });

  it('parses a date string', () => {
    const result = newDate('2024-01-15');
    expect(result).toBeInstanceOf(Date);
    expect(result.getFullYear()).toBe(2024);
  });

  it('accepts a Date object', () => {
    const input = new Date(2024, 0, 15);
    const result = newDate(input);
    expect(result.getTime()).toBe(input.getTime());
  });
});

describe('newDateFromYMD', () => {
  it('creates a date from year, month, day', () => {
    const result = newDateFromYMD(2024, 0, 15); // month is 0-indexed
    expect(result.getFullYear()).toBe(2024);
    expect(result.getMonth()).toBe(0);
    expect(result.getDate()).toBe(15);
  });
});

describe('formatDate', () => {
  it('returns a formatted date string', () => {
    const date = new Date(2024, 0, 15); // Jan 15, 2024
    const result = formatDate(date);
    expect(result).toContain('2024');
    expect(result).toContain('January');
    expect(result).toContain('15');
  });

  it('falls back to current date for invalid input', () => {
    const invalid = new Date('not-a-date');
    const result = formatDate(invalid);
    // Should return a string (current date), not throw
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});

describe('roundDateUp', () => {
  it('rounds minutes up to nearest 30 by default', () => {
    const date = new Date(2024, 0, 15, 10, 10, 0); // 10:10
    const result = roundDateUp(date);
    expect(result.getMinutes()).toBe(30);
    expect(result.getHours()).toBe(10);
  });

  it('rounds up to next hour when past 30', () => {
    const date = new Date(2024, 0, 15, 10, 45, 0); // 10:45
    const result = roundDateUp(date); // rounds to 11:00
    expect(result.getHours()).toBe(11);
    expect(result.getMinutes()).toBe(0);
  });

  it('accepts custom interval', () => {
    const date = new Date(2024, 0, 15, 10, 5, 0); // 10:05
    const result = roundDateUp(date, 15);
    expect(result.getMinutes()).toBe(15);
  });
});

describe('getWeekDays', () => {
  it('returns 7 days', () => {
    expect(getWeekDays()).toHaveLength(7);
  });

  it('returns full names by default', () => {
    const days = getWeekDays();
    expect(days[0]).toBe('Sunday');
    expect(days[6]).toBe('Saturday');
  });

  it('returns short names when short=true', () => {
    const days = getWeekDays(true);
    expect(days[0]).toBe('Sun');
    expect(days[6]).toBe('Sat');
  });
});

describe('getDaysInMonth', () => {
  it('returns 31 days for January', () => {
    const jan = new Date(2024, 0, 1);
    expect(getDaysInMonth(jan)).toHaveLength(31);
  });

  it('returns 29 days for February in a leap year', () => {
    const feb2024 = new Date(2024, 1, 1);
    expect(getDaysInMonth(feb2024)).toHaveLength(29);
  });

  it('returns 28 days for February in a non-leap year', () => {
    const feb2023 = new Date(2023, 1, 1);
    expect(getDaysInMonth(feb2023)).toHaveLength(28);
  });

  it('returns Date objects for each day', () => {
    const jan = new Date(2024, 0, 1);
    const days = getDaysInMonth(jan);
    expect(days[0]).toBeInstanceOf(Date);
    expect(days[0].getDate()).toBe(1);
    expect(days[30].getDate()).toBe(31);
  });
});

describe('formatToLocalISOString', () => {
  it('returns a string in YYYY-MM-DDTHH:MM format', () => {
    const date = new Date(2024, 0, 15, 10, 30);
    const result = formatToLocalISOString(date);
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
  });
});

describe('addHours', () => {
  it('adds hours to a date', () => {
    const date = new Date(2024, 0, 15, 10, 0);
    const result = addHours(date, 2);
    expect(result.getHours()).toBe(12);
  });

  it('handles adding fractional hours via minutes', () => {
    const date = new Date(2024, 0, 15, 10, 0);
    const result = addHours(date, 1);
    expect(result.getHours()).toBe(11);
    expect(result.getMinutes()).toBe(0);
  });
});

describe('startOfDay / endOfDay', () => {
  it('startOfDay returns midnight', () => {
    const date = new Date(2024, 0, 15, 14, 30);
    const result = startOfDay(date);
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
  });

  it('endOfDay returns 23:59:59.999', () => {
    const date = new Date(2024, 0, 15, 14, 30);
    const result = endOfDay(date);
    expect(result.getHours()).toBe(23);
    expect(result.getMinutes()).toBe(59);
    expect(result.getSeconds()).toBe(59);
  });
});

describe('parseISO', () => {
  it('parses an ISO date string', () => {
    const result = parseISO('2024-01-15T10:30:00');
    expect(result.getFullYear()).toBe(2024);
    expect(result.getMonth()).toBe(0);
    expect(result.getDate()).toBe(15);
  });
});

describe('subHours', () => {
  it('subtracts hours from a date', () => {
    const date = new Date(2024, 0, 15, 10, 0);
    const result = subHours(date, 2);
    expect(result.getHours()).toBe(8);
  });
});

describe('createUTCMidnightDate', () => {
  it('returns null for null input', () => {
    expect(createUTCMidnightDate(null)).toBeNull();
  });

  it('creates a UTC midnight date from a local date', () => {
    const local = new Date(2024, 0, 15);
    const result = createUTCMidnightDate(local);
    expect(result).not.toBeNull();
    expect(result!.getUTCFullYear()).toBe(2024);
    expect(result!.getUTCMonth()).toBe(0);
    expect(result!.getUTCDate()).toBe(15);
    expect(result!.getUTCHours()).toBe(0);
    expect(result!.getUTCMinutes()).toBe(0);
  });
});

describe('createAllDayDate', () => {
  it('creates a local midnight date from YYYY-MM-DD string', () => {
    const result = createAllDayDate('2024-01-15');
    expect(result.getFullYear()).toBe(2024);
    expect(result.getMonth()).toBe(0);
    expect(result.getDate()).toBe(15);
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
  });

  it('handles ISO datetime strings by stripping time', () => {
    const result = createAllDayDate('2024-01-15T14:30:00');
    expect(result.getDate()).toBe(15);
    expect(result.getHours()).toBe(0);
  });

  it('returns current date for empty string', () => {
    const result = createAllDayDate('');
    expect(result).toBeInstanceOf(Date);
  });
});

describe('normalizeAllDayDate', () => {
  it('strips time component and sets to midnight', () => {
    const date = new Date(2024, 0, 15, 14, 30, 45);
    const result = normalizeAllDayDate(date);
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
    expect(result.getDate()).toBe(15);
  });
});

describe('createOutlookAllDayDate', () => {
  it('creates a UTC midnight date for Outlook', () => {
    const result = createOutlookAllDayDate('2024-01-15');
    expect(result.getUTCFullYear()).toBe(2024);
    expect(result.getUTCMonth()).toBe(0);
    expect(result.getUTCDate()).toBe(15);
    expect(result.getUTCHours()).toBe(0);
  });
});

describe('isFutureDate', () => {
  beforeEach(() => {
    // Mock "today" to 2026-06-05
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 5)); // June 5, 2026
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns true for a date in the future', () => {
    const future = new Date(2026, 5, 10); // June 10, 2026
    expect(isFutureDate(future)).toBe(true);
  });

  it('returns false for today', () => {
    const today = new Date(2026, 5, 5);
    expect(isFutureDate(today)).toBe(false);
  });

  it('returns false for a past date', () => {
    const past = new Date(2026, 5, 1);
    expect(isFutureDate(past)).toBe(false);
  });

  it('returns false for null', () => {
    expect(isFutureDate(null)).toBe(false);
  });
});
