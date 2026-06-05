import type { CalendarEvent } from '@/lib/store';

export type ViewMode = 'day' | 'week' | 'month';

export const HOURS = Array.from({ length: 24 }, (_, i) => i);
export const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const DAYS_FULL = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
export const HOUR_HEIGHT = 60;
export const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

export interface DragState {
  isDragging: boolean;
  dragStart: { date: Date; hour: number; minutes: number } | null;
  dragEnd: { date: Date; hour: number; minutes: number } | null;
}

export interface EventDragState {
  draggingEvent: CalendarEvent | null;
  eventDragOffset: { x: number; y: number };
  eventDragPosition: { date: Date; time: number } | null;
}

export interface ResizeState {
  resizingEvent: CalendarEvent | null;
  resizeEdge: 'top' | 'bottom' | null;
  resizeOriginalStart: Date | null;
  resizeOriginalEnd: Date | null;
}

export interface ViewMenuPreferences {
  manageDueDates: boolean;
  showScheduledTasks: boolean;
  enableDueToday: boolean;
  enableDueTomorrow: boolean;
  enableDueSoon: boolean;
  hiddenLists: string[];
}

export interface EventFormState {
  title: string;
  description: string;
  start: string;
  end: string;
  color: string;
  isRecurring: boolean;
  recurrenceFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  recurrenceInterval: number;
  recurrenceEndDate: string;
  recurrenceDaysOfWeek: number[];
}
