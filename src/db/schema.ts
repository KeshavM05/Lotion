import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  pgEnum,
  jsonb,
  vector,
  index,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

// Enums
export const priorityEnum = pgEnum('priority', ['low', 'medium', 'high', 'critical']);
export const taskStatusEnum = pgEnum('task_status', ['todo', 'in_progress', 'done', 'cancelled']);
export const goalStatusEnum = pgEnum('goal_status', ['active', 'paused', 'completed', 'abandoned']);
export const goalCategoryEnum = pgEnum('goal_category', [
  'career',
  'business',
  'finance',
  'personal',
  'health',
  'creative',
]);
export const chatRoleEnum = pgEnum('chat_role', ['user', 'assistant']);
export const moodEnum = pgEnum('mood', ['great', 'good', 'okay', 'bad', 'terrible']);
export const eventSourceEnum = pgEnum('event_source', ['local', 'google', 'outlook']);
export const recurrenceFrequencyEnum = pgEnum('recurrence_frequency', [
  'daily',
  'weekly',
  'monthly',
  'yearly',
]);
export const energyLevelEnum = pgEnum('energy_level', ['low', 'medium', 'high']);
export const timePreferenceEnum = pgEnum('time_preference', [
  'morning',
  'afternoon',
  'evening',
  'anytime',
]);

// Users
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  supabaseId: text('supabase_id').notNull().unique(),
  email: text('email').notNull().unique(),
  name: text('name'),
  avatarUrl: text('avatar_url'),
  aiMemory: text('ai_memory').default(''),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Goals
export const goals = pgTable('goals', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').default(''),
  category: goalCategoryEnum('category').notNull(),
  priority: priorityEnum('priority').default('medium').notNull(),
  targetDate: timestamp('target_date'),
  color: text('color').notNull(),
  status: goalStatusEnum('status').default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Milestones
export const milestones = pgTable('milestones', {
  id: uuid('id').primaryKey().defaultRandom(),
  goalId: uuid('goal_id')
    .notNull()
    .references(() => goals.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').default(''),
  targetDate: timestamp('target_date'),
  completed: boolean('completed').default(false).notNull(),
  completedAt: timestamp('completed_at'),
  order: integer('order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Task Lists
export const taskLists = pgTable('task_lists', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  color: text('color').notNull().default('#8b5cf6'),
  icon: text('icon').notNull().default('circle'),
  order: integer('order').default(0).notNull(),
  archived: boolean('archived').default(false).notNull(),
  archivedAt: timestamp('archived_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Tasks
export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  listId: uuid('list_id').references(() => taskLists.id, { onDelete: 'set null' }),
  goalId: uuid('goal_id').references(() => goals.id, { onDelete: 'set null' }),
  milestoneId: uuid('milestone_id').references(() => milestones.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  description: text('description').default(''),
  status: taskStatusEnum('status').default('todo').notNull(),
  priority: priorityEnum('priority').default('medium').notNull(),
  durationMinutes: integer('duration_minutes').default(30).notNull(),
  deadline: timestamp('deadline'),
  scheduledStart: timestamp('scheduled_start'),
  scheduledEnd: timestamp('scheduled_end'),
  isAutoScheduled: boolean('is_auto_scheduled').default(false).notNull(),
  scheduleLocked: boolean('schedule_locked').default(false).notNull(),
  scheduleScore: integer('schedule_score'),
  lastScheduled: timestamp('last_scheduled'),
  completed: boolean('completed').default(false).notNull(),
  completedAt: timestamp('completed_at'),
  // Advanced filtering fields
  energyLevel: energyLevelEnum('energy_level').default('medium'),
  timePreference: timePreferenceEnum('time_preference').default('anytime'),
  tags: jsonb('tags').$type<string[]>().default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Calendar Events
export const calendarEvents = pgTable('calendar_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  taskId: uuid('task_id').references(() => tasks.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  description: text('description').default(''),
  start: timestamp('start').notNull(),
  end: timestamp('end').notNull(),
  allDay: boolean('all_day').default(false).notNull(),
  color: text('color').default('#8b5cf6'),
  source: eventSourceEnum('source').default('local').notNull(),
  googleEventId: text('google_event_id'),
  outlookEventId: text('outlook_event_id'),
  // Recurrence fields
  isRecurring: boolean('is_recurring').default(false).notNull(),
  recurrenceFrequency: recurrenceFrequencyEnum('recurrence_frequency'),
  recurrenceInterval: integer('recurrence_interval').default(1),
  recurrenceEndDate: timestamp('recurrence_end_date'),
  recurrenceDaysOfWeek: jsonb('recurrence_days_of_week').$type<number[]>(), // 0=Sun, 1=Mon, etc
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Chat Sessions
export const chatSessions = pgTable('chat_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull().default('New Chat'),
  folderId: text('folder_id'),
  goalId: uuid('goal_id').references(() => goals.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Chat Messages
export const chatMessages = pgTable('chat_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  sessionId: uuid('session_id')
    .notNull()
    .references(() => chatSessions.id, { onDelete: 'cascade' }),
  goalId: uuid('goal_id').references(() => goals.id, { onDelete: 'cascade' }),
  role: chatRoleEnum('role').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Journal Entries
export const journalEntries = pgTable('journal_entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  mood: moodEnum('mood'),
  linkedGoalIds: jsonb('linked_goal_ids').$type<string[]>().default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Auto Schedule Settings
export const autoScheduleSettings = pgTable('auto_schedule_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
  workDays: jsonb('work_days').$type<number[]>().default([1, 2, 3, 4, 5]), // Mon-Fri
  workHourStart: integer('work_hour_start').default(9).notNull(), // 9 AM
  workHourEnd: integer('work_hour_end').default(17).notNull(), // 5 PM
  highEnergyStart: integer('high_energy_start').default(9),
  highEnergyEnd: integer('high_energy_end').default(12),
  mediumEnergyStart: integer('medium_energy_start').default(13),
  mediumEnergyEnd: integer('medium_energy_end').default(15),
  lowEnergyStart: integer('low_energy_start').default(15),
  lowEnergyEnd: integer('low_energy_end').default(17),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// OAuth Connections (For Google/Outlook Calendar Sync)
export const oauthConnections = pgTable('oauth_connections', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  provider: text('provider').notNull(), // 'google' | 'outlook'
  providerAccountId: text('provider_account_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Calendar Preferences
export const calendarPreferences = pgTable('calendar_preferences', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
  timezone: text('timezone').default('America/Toronto').notNull(),
  firstDayOfWeek: integer('first_day_of_week').default(0).notNull(), // 0=Sunday, 1=Monday
  defaultView: text('default_view').default('week').notNull(), // 'day' | 'week' | 'month'
  timeGridStart: integer('time_grid_start').default(0).notNull(), // 0-23 (hour)
  timeGridEnd: integer('time_grid_end').default(24).notNull(), // 0-24 (hour)
  timeDisplayResolution: integer('time_display_resolution').default(15).notNull(), // minutes
  timeDraggingResolution: integer('time_dragging_resolution').default(15).notNull(), // minutes
  eventsPerDayLimit: integer('events_per_day_limit').default(4).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Knowledge Base Sources
export const kbSourceStatusEnum = pgEnum('kb_source_status', [
  'pending',
  'processing',
  'ingested',
  'failed',
]);

export const knowledgeSources = pgTable('knowledge_sources', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  sourceType: text('source_type').notNull(), // 'article', 'book', 'podcast', 'meeting', 'note', 'research'
  status: kbSourceStatusEnum('status').default('pending').notNull(),
  metadata: jsonb('metadata').$type<Record<string, unknown>>().default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Knowledge Base Wiki Pages
export const wikiPages = pgTable('wiki_pages', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  slug: text('slug').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  category: text('category').notNull(), // 'concept', 'entity', 'summary', 'comparison', 'synthesis'
  linkedSourceIds: jsonb('linked_source_ids').$type<string[]>().default([]),
  linkedPageSlugs: jsonb('linked_page_slugs').$type<string[]>().default([]),
  metadata: jsonb('metadata').$type<Record<string, unknown>>().default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Knowledge Base Log
export const wikiLog = pgTable('wiki_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  action: text('action').notNull(), // 'ingest', 'query', 'lint', 'update'
  description: text('description').notNull(),
  pagesAffected: jsonb('pages_affected').$type<string[]>().default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Context Embeddings (pgvector for semantic search)
export const contextEmbeddingSourceEnum = pgEnum('embedding_source', [
  'journal',
  'chat',
  'goal',
  'task',
  'memory',
]);

export const contextEmbeddings = pgTable(
  'context_embeddings',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    source: contextEmbeddingSourceEnum('source').notNull(),
    sourceId: text('source_id'), // ID of the source record (journal entry, goal, etc.)
    content: text('content').notNull(), // The text that was embedded
    embedding: vector('embedding', { dimensions: 1024 }).notNull(),
    metadata: jsonb('metadata').$type<Record<string, unknown>>().default({}),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('context_embeddings_user_idx').on(table.userId),
    index('context_embeddings_source_idx').on(table.userId, table.source),
    index('context_embeddings_vector_idx').using('hnsw', table.embedding.op('vector_cosine_ops')),
  ]
);

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  goals: many(goals),
  tasks: many(tasks),
  taskLists: many(taskLists),
  calendarEvents: many(calendarEvents),
  chatSessions: many(chatSessions),
  chatMessages: many(chatMessages),
  journalEntries: many(journalEntries),
  autoScheduleSettings: one(autoScheduleSettings, {
    fields: [users.id],
    references: [autoScheduleSettings.userId],
  }),
  calendarPreferences: one(calendarPreferences, {
    fields: [users.id],
    references: [calendarPreferences.userId],
  }),
  oauthConnections: many(oauthConnections),
}));

export const goalsRelations = relations(goals, ({ one, many }) => ({
  user: one(users, { fields: [goals.userId], references: [users.id] }),
  milestones: many(milestones),
  tasks: many(tasks),
  chatMessages: many(chatMessages),
}));

export const milestonesRelations = relations(milestones, ({ one, many }) => ({
  goal: one(goals, { fields: [milestones.goalId], references: [goals.id] }),
  tasks: many(tasks),
}));

export const taskListsRelations = relations(taskLists, ({ one, many }) => ({
  user: one(users, { fields: [taskLists.userId], references: [users.id] }),
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  user: one(users, { fields: [tasks.userId], references: [users.id] }),
  goal: one(goals, { fields: [tasks.goalId], references: [goals.id] }),
  milestone: one(milestones, { fields: [tasks.milestoneId], references: [milestones.id] }),
  list: one(taskLists, { fields: [tasks.listId], references: [taskLists.id] }),
  calendarEvents: many(calendarEvents),
}));

export const calendarEventsRelations = relations(calendarEvents, ({ one }) => ({
  user: one(users, { fields: [calendarEvents.userId], references: [users.id] }),
  task: one(tasks, { fields: [calendarEvents.taskId], references: [tasks.id] }),
}));

export const chatSessionsRelations = relations(chatSessions, ({ one, many }) => ({
  user: one(users, { fields: [chatSessions.userId], references: [users.id] }),
  goal: one(goals, { fields: [chatSessions.goalId], references: [goals.id] }),
  messages: many(chatMessages),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  user: one(users, { fields: [chatMessages.userId], references: [users.id] }),
  session: one(chatSessions, { fields: [chatMessages.sessionId], references: [chatSessions.id] }),
  goal: one(goals, { fields: [chatMessages.goalId], references: [goals.id] }),
}));

export const journalEntriesRelations = relations(journalEntries, ({ one }) => ({
  user: one(users, { fields: [journalEntries.userId], references: [users.id] }),
}));

export const autoScheduleSettingsRelations = relations(autoScheduleSettings, ({ one }) => ({
  user: one(users, { fields: [autoScheduleSettings.userId], references: [users.id] }),
}));

export const oauthConnectionsRelations = relations(oauthConnections, ({ one }) => ({
  user: one(users, { fields: [oauthConnections.userId], references: [users.id] }),
}));

export const calendarPreferencesRelations = relations(calendarPreferences, ({ one }) => ({
  user: one(users, { fields: [calendarPreferences.userId], references: [users.id] }),
}));

export const knowledgeSourcesRelations = relations(knowledgeSources, ({ one }) => ({
  user: one(users, { fields: [knowledgeSources.userId], references: [users.id] }),
}));

export const wikiPagesRelations = relations(wikiPages, ({ one }) => ({
  user: one(users, { fields: [wikiPages.userId], references: [users.id] }),
}));

export const wikiLogRelations = relations(wikiLog, ({ one }) => ({
  user: one(users, { fields: [wikiLog.userId], references: [users.id] }),
}));
