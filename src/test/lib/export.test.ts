import { describe, it, expect } from 'vitest';
import {
  exportGoalsMarkdown,
  exportChatMarkdown,
  exportJournalMarkdown,
  exportAllJSON,
  exportCalendarJSON,
  exportTasksCSV,
} from '@/lib/export';
import type {
  Goal,
  Milestone,
  Task,
  TaskList,
  CalendarEvent,
  ChatMessage,
  JournalEntry,
} from '@/lib/store';

// ─── Sample data fixtures ────────────────────────────────

const sampleGoal: Goal = {
  id: 'goal-1',
  title: 'Launch SaaS Product',
  description: 'Build and launch a profitable SaaS',
  category: 'business',
  priority: 'high',
  targetDate: '2026-12-31',
  color: '#C17A72',
  status: 'active',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const completedGoal: Goal = {
  ...sampleGoal,
  id: 'goal-2',
  title: 'Read 12 Books',
  status: 'completed',
};

const sampleMilestone: Milestone = {
  id: 'ms-1',
  goalId: 'goal-1',
  title: 'MVP Released',
  description: 'Release minimum viable product',
  targetDate: '2026-06-01',
  completed: false,
  completedAt: null,
  order: 1,
  createdAt: '2026-01-01T00:00:00.000Z',
};

const sampleTask: Task = {
  id: 'task-1',
  title: 'Design landing page',
  description: '',
  status: 'todo',
  priority: 'high',
  goalId: 'goal-1',
  milestoneId: null,
  listId: 'list-1',
  durationMinutes: 120,
  deadline: '2026-06-20',
  scheduledStart: null,
  scheduledEnd: null,
  completed: false,
  completedAt: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const completedTask: Task = {
  ...sampleTask,
  id: 'task-2',
  title: 'Set up repo',
  completed: true,
  completedAt: '2026-03-01T00:00:00.000Z',
};

const sampleTaskList: TaskList = {
  id: 'list-1',
  name: 'Work',
  color: '#C17A72',
  icon: 'briefcase',
  order: 1,
  archived: false,
  archivedAt: null,
  createdAt: '2026-01-01T00:00:00.000Z',
};

const sampleEvent: CalendarEvent = {
  id: 'evt-1',
  title: 'Team Standup',
  description: 'Daily sync',
  start: '2026-06-05T09:00:00.000Z',
  end: '2026-06-05T09:30:00.000Z',
  allDay: false,
  color: '#C17A72',
  taskId: null,
  source: 'local',
  isRecurring: true,
  recurrenceFrequency: 'daily',
  createdAt: '2026-01-01T00:00:00.000Z',
};

const sampleMessage: ChatMessage = {
  id: 'msg-1',
  goalId: 'goal-1',
  role: 'user',
  content: 'How do I stay motivated?',
  createdAt: '2026-06-01T10:00:00.000Z',
};

const aiMessage: ChatMessage = {
  id: 'msg-2',
  goalId: 'goal-1',
  role: 'assistant',
  content: 'Break your goal into smaller milestones.',
  createdAt: '2026-06-01T10:01:00.000Z',
};

const sampleJournalEntry: JournalEntry = {
  id: 'journal-1',
  content: 'Had a productive day working on the MVP.',
  mood: 'great',
  linkedGoalIds: ['goal-1'],
  createdAt: '2026-06-01T20:00:00.000Z',
  updatedAt: '2026-06-01T20:00:00.000Z',
};

// ─── Tests ───────────────────────────────────────────────

describe('exportGoalsMarkdown', () => {
  it('includes the goals header', () => {
    const result = exportGoalsMarkdown([sampleGoal], [], []);
    expect(result).toContain('# Goals & Vision Board');
  });

  it('includes goal title', () => {
    const result = exportGoalsMarkdown([sampleGoal], [], []);
    expect(result).toContain('Launch SaaS Product');
  });

  it('shows correct active/completed counts', () => {
    const result = exportGoalsMarkdown([sampleGoal, completedGoal], [], []);
    expect(result).toContain('**Total Goals:** 2');
    expect(result).toContain('**Active:** 1');
    expect(result).toContain('**Completed:** 1');
  });

  it('includes milestones section when present', () => {
    const result = exportGoalsMarkdown([sampleGoal], [sampleMilestone], []);
    expect(result).toContain('Milestones');
    expect(result).toContain('MVP Released');
  });

  it('marks completed milestones with [x]', () => {
    const completed = { ...sampleMilestone, completed: true };
    const result = exportGoalsMarkdown([sampleGoal], [completed], []);
    expect(result).toContain('[x]');
  });

  it('includes tasks section with pending and done tasks', () => {
    const result = exportGoalsMarkdown([sampleGoal], [], [sampleTask, completedTask]);
    expect(result).toContain('Tasks');
    expect(result).toContain('Design landing page');
    expect(result).toContain('~~Set up repo~~');
  });

  it('returns empty section for goals with no tasks or milestones', () => {
    const result = exportGoalsMarkdown([sampleGoal], [], []);
    expect(result).not.toContain('Milestones');
    expect(result).not.toContain('Tasks');
  });
});

describe('exportChatMarkdown', () => {
  it('includes chat header with goal title', () => {
    const result = exportChatMarkdown([sampleMessage], 'Launch SaaS Product');
    expect(result).toContain('# AI Coach Chat: Launch SaaS Product');
  });

  it('includes generic header without goal title', () => {
    const result = exportChatMarkdown([sampleMessage]);
    expect(result).toContain('# AI Coach Chat');
    expect(result).not.toContain(': ');
  });

  it('shows message count', () => {
    const result = exportChatMarkdown([sampleMessage, aiMessage]);
    expect(result).toContain('**Messages:** 2');
  });

  it('labels user messages as You', () => {
    const result = exportChatMarkdown([sampleMessage]);
    expect(result).toContain('**You**');
  });

  it('labels assistant messages as AI Coach', () => {
    const result = exportChatMarkdown([aiMessage]);
    expect(result).toContain('**AI Coach**');
  });

  it('includes message content', () => {
    const result = exportChatMarkdown([sampleMessage]);
    expect(result).toContain('How do I stay motivated?');
  });
});

describe('exportJournalMarkdown', () => {
  it('includes journal header', () => {
    const result = exportJournalMarkdown([sampleJournalEntry], [sampleGoal]);
    expect(result).toContain('# Journal');
  });

  it('shows entry count', () => {
    const result = exportJournalMarkdown([sampleJournalEntry], [sampleGoal]);
    expect(result).toContain('**Entries:** 1');
  });

  it('includes mood when present', () => {
    const result = exportJournalMarkdown([sampleJournalEntry], [sampleGoal]);
    expect(result).toContain('**Mood:** great');
  });

  it('includes entry content', () => {
    const result = exportJournalMarkdown([sampleJournalEntry], [sampleGoal]);
    expect(result).toContain('Had a productive day');
  });

  it('links to related goals by title', () => {
    const result = exportJournalMarkdown([sampleJournalEntry], [sampleGoal]);
    expect(result).toContain('Launch SaaS Product');
  });

  it('handles empty entries array', () => {
    const result = exportJournalMarkdown([], []);
    expect(result).toContain('# Journal');
    expect(result).toContain('**Entries:** 0');
  });
});

describe('exportAllJSON', () => {
  it('returns valid JSON', () => {
    const result = exportAllJSON({
      goals: [sampleGoal],
      milestones: [sampleMilestone],
      tasks: [sampleTask],
      events: [sampleEvent],
      chatMessages: [sampleMessage],
      journalEntries: [sampleJournalEntry],
      aiMemory: 'User prefers morning sessions.',
    });
    expect(() => JSON.parse(result)).not.toThrow();
  });

  it('includes exportedAt timestamp', () => {
    const result = JSON.parse(
      exportAllJSON({
        goals: [],
        milestones: [],
        tasks: [],
        events: [],
        chatMessages: [],
        journalEntries: [],
        aiMemory: '',
      })
    );
    expect(result.exportedAt).toBeDefined();
    expect(result.version).toBe('1.0');
  });

  it('includes summary counts', () => {
    const result = JSON.parse(
      exportAllJSON({
        goals: [sampleGoal],
        milestones: [sampleMilestone],
        tasks: [sampleTask],
        events: [sampleEvent],
        chatMessages: [sampleMessage],
        journalEntries: [sampleJournalEntry],
        aiMemory: '',
      })
    );
    expect(result.summary.goals).toBe(1);
    expect(result.summary.tasks).toBe(1);
    expect(result.summary.events).toBe(1);
  });
});

describe('exportCalendarJSON', () => {
  it('returns valid JSON', () => {
    const result = exportCalendarJSON([sampleEvent]);
    expect(() => JSON.parse(result)).not.toThrow();
  });

  it('includes totalEvents count', () => {
    const result = JSON.parse(exportCalendarJSON([sampleEvent]));
    expect(result.totalEvents).toBe(1);
  });

  it('includes event fields', () => {
    const result = JSON.parse(exportCalendarJSON([sampleEvent]));
    const event = result.events[0];
    expect(event.title).toBe('Team Standup');
    expect(event.isRecurring).toBe(true);
    expect(event.recurrenceFrequency).toBe('daily');
  });

  it('handles empty events array', () => {
    const result = JSON.parse(exportCalendarJSON([]));
    expect(result.totalEvents).toBe(0);
    expect(result.events).toHaveLength(0);
  });
});

describe('exportTasksCSV', () => {
  it('includes header row', () => {
    const result = exportTasksCSV([], [], []);
    expect(result).toContain('Title');
    expect(result).toContain('Status');
    expect(result).toContain('Priority');
  });

  it('includes task data row', () => {
    const result = exportTasksCSV([sampleTask], [sampleTaskList], [sampleGoal]);
    expect(result).toContain('Design landing page');
    expect(result).toContain('Work');
    expect(result).toContain('Launch SaaS Product');
  });

  it('marks completed tasks', () => {
    const result = exportTasksCSV([completedTask], [], []);
    expect(result).toContain('Yes');
  });

  it('escapes CSV values with commas', () => {
    const taskWithComma: Task = {
      ...sampleTask,
      title: 'Design, build, launch',
    };
    const result = exportTasksCSV([taskWithComma], [], []);
    expect(result).toContain('"Design, build, launch"');
  });

  it('escapes CSV values with double quotes', () => {
    const taskWithQuotes: Task = {
      ...sampleTask,
      title: 'He said "hello"',
    };
    const result = exportTasksCSV([taskWithQuotes], [], []);
    expect(result).toContain('"He said ""hello"""');
  });
});
