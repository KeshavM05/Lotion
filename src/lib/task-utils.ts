import { type Task } from '@/lib/store';

export type TimeGroup = 'overdue' | 'today' | 'tomorrow' | 'this_week' | 'later' | 'no_due_date';

export interface TaskGroup {
  key: TimeGroup;
  label: string;
  tasks: Task[];
}

export type GroupMode = 'none' | 'time' | 'status' | 'priority';

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getTimeGroup(task: Task, now: Date = new Date()): TimeGroup {
  if (!task.deadline) return 'no_due_date';

  const deadline = new Date(task.deadline);
  const todayStart = startOfDay(now);
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);
  const dayAfterTomorrow = new Date(tomorrowStart);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
  const weekFromNow = new Date(todayStart);
  weekFromNow.setDate(weekFromNow.getDate() + 7);

  if (deadline < todayStart) return 'overdue';
  if (deadline < tomorrowStart) return 'today';
  if (deadline < dayAfterTomorrow) return 'tomorrow';
  if (deadline < weekFromNow) return 'this_week';
  return 'later';
}

const GROUP_ORDER: TimeGroup[] = [
  'overdue',
  'today',
  'tomorrow',
  'this_week',
  'later',
  'no_due_date',
];

const GROUP_LABELS: Record<TimeGroup, string> = {
  overdue: 'Overdue',
  today: 'Due Today',
  tomorrow: 'Due Tomorrow',
  this_week: 'This Week',
  later: 'Later',
  no_due_date: 'No Due Date',
};

export function groupByTime(tasks: Task[], now: Date = new Date()): TaskGroup[] {
  const buckets: Record<TimeGroup, Task[]> = {
    overdue: [],
    today: [],
    tomorrow: [],
    this_week: [],
    later: [],
    no_due_date: [],
  };

  for (const task of tasks) {
    const group = getTimeGroup(task, now);
    buckets[group].push(task);
  }

  return GROUP_ORDER.filter((key) => buckets[key].length > 0).map((key) => ({
    key,
    label: GROUP_LABELS[key],
    tasks: buckets[key],
  }));
}

export function groupByStatus(tasks: Task[]): TaskGroup[] {
  const buckets: Record<string, Task[]> = {
    todo: [],
    in_progress: [],
    done: [],
    cancelled: [],
  };
  const labels: Record<string, string> = {
    todo: 'To Do',
    in_progress: 'In Progress',
    done: 'Done',
    cancelled: 'Cancelled',
  };
  const order = ['todo', 'in_progress', 'done', 'cancelled'];

  for (const task of tasks) {
    const s = task.status || 'todo';
    if (buckets[s]) buckets[s].push(task);
    else buckets['todo'].push(task);
  }

  return order
    .filter((k) => buckets[k].length > 0)
    .map((k) => ({ key: k as TimeGroup, label: labels[k], tasks: buckets[k] }));
}

export function groupByPriority(tasks: Task[]): TaskGroup[] {
  const buckets: Record<string, Task[]> = {
    critical: [],
    high: [],
    medium: [],
    low: [],
  };
  const labels: Record<string, string> = {
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  };
  const order = ['critical', 'high', 'medium', 'low'];

  for (const task of tasks) {
    const p = task.priority || 'medium';
    if (buckets[p]) buckets[p].push(task);
    else buckets['medium'].push(task);
  }

  return order
    .filter((k) => buckets[k].length > 0)
    .map((k) => ({ key: k as TimeGroup, label: labels[k], tasks: buckets[k] }));
}
