import { describe, it, expect } from 'vitest';
import { expandRecurringEvent, type DateRange } from '@/lib/recurrence';
import type { CalendarEvent } from '@/lib/store';

// Base event: daily standup starting June 1, 2026 09:00–09:30
const baseEvent: CalendarEvent = {
  id: 'evt-1',
  title: 'Daily Standup',
  description: '',
  start: '2026-06-01T09:00:00.000Z',
  end: '2026-06-01T09:30:00.000Z',
  allDay: false,
  color: '#C17A72',
  tagId: null,
  taskId: null,
  source: 'local',
  isRecurring: true,
  recurrenceFrequency: 'daily',
  recurrenceInterval: 1,
  createdAt: '2026-01-01T00:00:00.000Z',
};

const weekRange: DateRange = {
  start: new Date('2026-06-01T00:00:00.000Z'),
  end: new Date('2026-06-08T00:00:00.000Z'),
};

describe('expandRecurringEvent', () => {
  it('returns empty array for non-recurring events', () => {
    const nonRecurring: CalendarEvent = { ...baseEvent, isRecurring: false };
    const result = expandRecurringEvent(nonRecurring, weekRange);
    expect(result).toHaveLength(0);
  });

  it('returns empty array when recurrenceFrequency is missing', () => {
    const noFreq: CalendarEvent = {
      ...baseEvent,
      recurrenceFrequency: undefined,
    };
    const result = expandRecurringEvent(noFreq, weekRange);
    expect(result).toHaveLength(0);
  });

  it('generates daily recurrences within range', () => {
    // Range: June 1–8, original on June 1, so instances June 2–7 (6 days)
    const result = expandRecurringEvent(baseEvent, weekRange);
    expect(result.length).toBeGreaterThanOrEqual(6);
    // All within range
    for (const instance of result) {
      const start = new Date(instance.start);
      expect(start >= weekRange.start).toBe(true);
      expect(start < weekRange.end).toBe(true);
    }
  });

  it('preserves event duration for each instance', () => {
    const result = expandRecurringEvent(baseEvent, weekRange);
    const durationMs = 30 * 60 * 1000; // 30 minutes
    for (const instance of result) {
      const start = new Date(instance.start);
      const end = new Date(instance.end);
      expect(end.getTime() - start.getTime()).toBe(durationMs);
    }
  });

  it('generates unique IDs for each instance', () => {
    const result = expandRecurringEvent(baseEvent, weekRange);
    const ids = result.map((e) => e.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('skips the original event occurrence', () => {
    const result = expandRecurringEvent(baseEvent, weekRange);
    const originalStart = baseEvent.start;
    const hasOriginal = result.some((e) => e.start === originalStart);
    expect(hasOriginal).toBe(false);
  });

  it('respects recurrenceEndDate', () => {
    const event: CalendarEvent = {
      ...baseEvent,
      recurrenceEndDate: '2026-06-04T00:00:00.000Z',
    };
    const result = expandRecurringEvent(event, weekRange);
    for (const instance of result) {
      expect(new Date(instance.start) <= new Date('2026-06-04T00:00:00.000Z')).toBe(true);
    }
  });

  it('generates weekly recurrences with correct interval', () => {
    const weekly: CalendarEvent = {
      ...baseEvent,
      recurrenceFrequency: 'weekly',
      recurrenceInterval: 1,
    };
    // Range: 4 weeks
    const monthRange: DateRange = {
      start: new Date('2026-06-01T00:00:00.000Z'),
      end: new Date('2026-06-30T00:00:00.000Z'),
    };
    const result = expandRecurringEvent(weekly, monthRange);
    // Should have 3 instances: June 8, 15, 22 (June 1 is the original, June 29 is within range)
    expect(result.length).toBeGreaterThanOrEqual(3);
    // Verify intervals are exactly 7 days apart
    if (result.length >= 2) {
      const diff = new Date(result[1].start).getTime() - new Date(result[0].start).getTime();
      expect(diff).toBe(7 * 24 * 60 * 60 * 1000);
    }
  });

  it('generates monthly recurrences', () => {
    const monthly: CalendarEvent = {
      ...baseEvent,
      recurrenceFrequency: 'monthly',
    };
    const yearRange: DateRange = {
      start: new Date('2026-06-01T00:00:00.000Z'),
      end: new Date('2026-12-31T00:00:00.000Z'),
    };
    const result = expandRecurringEvent(monthly, yearRange);
    // Should have instances: July 1, Aug 1, Sep 1, Oct 1, Nov 1, Dec 1 = 6
    expect(result.length).toBeGreaterThanOrEqual(5);
  });

  it('handles weekly recurrence with specific days of week', () => {
    // Recur every Monday (1) and Wednesday (3)
    const weekly: CalendarEvent = {
      ...baseEvent,
      start: '2026-06-01T09:00:00.000Z', // Monday
      end: '2026-06-01T09:30:00.000Z',
      recurrenceFrequency: 'weekly',
      recurrenceDaysOfWeek: [1, 3], // Mon, Wed
    };
    const twoWeekRange: DateRange = {
      start: new Date('2026-06-01T00:00:00.000Z'),
      end: new Date('2026-06-15T00:00:00.000Z'),
    };
    const result = expandRecurringEvent(weekly, twoWeekRange);
    // Check all instances land on Monday or Wednesday
    for (const instance of result) {
      const day = new Date(instance.start).getUTCDay();
      expect([1, 3]).toContain(day);
    }
  });

  it('preserves original event metadata on instances', () => {
    const result = expandRecurringEvent(baseEvent, weekRange);
    expect(result.length).toBeGreaterThan(0);
    const instance = result[0];
    expect(instance.title).toBe(baseEvent.title);
    expect(instance.color).toBe(baseEvent.color);
    expect(instance.isRecurring).toBe(true);
  });
});
