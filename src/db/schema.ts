import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const priorityEnum = pgEnum("priority", ["low", "medium", "high", "critical"]);
export const taskStatusEnum = pgEnum("task_status", ["todo", "in_progress", "done", "cancelled"]);
export const goalStatusEnum = pgEnum("goal_status", ["active", "paused", "completed", "abandoned"]);
export const goalCategoryEnum = pgEnum("goal_category", ["career", "business", "finance", "personal", "health", "creative"]);
export const chatRoleEnum = pgEnum("chat_role", ["user", "assistant"]);
export const moodEnum = pgEnum("mood", ["great", "good", "okay", "bad", "terrible"]);
export const eventSourceEnum = pgEnum("event_source", ["local", "google", "outlook"]);
export const recurrenceFrequencyEnum = pgEnum("recurrence_frequency", ["daily", "weekly", "monthly", "yearly"]);
export const energyLevelEnum = pgEnum("energy_level", ["low", "medium", "high"]);
export const timePreferenceEnum = pgEnum("time_preference", ["morning", "afternoon", "evening", "anytime"]);

// Users
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  supabaseId: text("supabase_id").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name"),
  avatarUrl: text("avatar_url"),
  aiMemory: text("ai_memory").default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Goals
export const goals = pgTable("goals", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").default(""),
  category: goalCategoryEnum("category").notNull(),
  priority: priorityEnum("priority").default("medium").notNull(),
  targetDate: timestamp("target_date"),
  color: text("color").notNull(),
  status: goalStatusEnum("status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Milestones
export const milestones = pgTable("milestones", {
  id: uuid("id").primaryKey().defaultRandom(),
  goalId: uuid("goal_id")
    .notNull()
    .references(() => goals.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").default(""),
  targetDate: timestamp("target_date"),
  completed: boolean("completed").default(false).notNull(),
  completedAt: timestamp("completed_at"),
  order: integer("order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tasks
export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  goalId: uuid("goal_id").references(() => goals.id, { onDelete: "set null" }),
  milestoneId: uuid("milestone_id").references(() => milestones.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  description: text("description").default(""),
  status: taskStatusEnum("status").default("todo").notNull(),
  priority: priorityEnum("priority").default("medium").notNull(),
  durationMinutes: integer("duration_minutes").default(30).notNull(),
  deadline: timestamp("deadline"),
  scheduledStart: timestamp("scheduled_start"),
  scheduledEnd: timestamp("scheduled_end"),
  completed: boolean("completed").default(false).notNull(),
  completedAt: timestamp("completed_at"),
  // Advanced filtering fields
  energyLevel: energyLevelEnum("energy_level").default("medium"),
  timePreference: timePreferenceEnum("time_preference").default("anytime"),
  tags: jsonb("tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Calendar Events
export const calendarEvents = pgTable("calendar_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  taskId: uuid("task_id").references(() => tasks.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  description: text("description").default(""),
  start: timestamp("start").notNull(),
  end: timestamp("end").notNull(),
  allDay: boolean("all_day").default(false).notNull(),
  color: text("color").default("#8b5cf6"),
  source: eventSourceEnum("source").default("local").notNull(),
  googleEventId: text("google_event_id"),
  // Recurrence fields
  isRecurring: boolean("is_recurring").default(false).notNull(),
  recurrenceFrequency: recurrenceFrequencyEnum("recurrence_frequency"),
  recurrenceInterval: integer("recurrence_interval").default(1),
  recurrenceEndDate: timestamp("recurrence_end_date"),
  recurrenceDaysOfWeek: jsonb("recurrence_days_of_week").$type<number[]>(), // 0=Sun, 1=Mon, etc
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Chat Messages
export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  goalId: uuid("goal_id").references(() => goals.id, { onDelete: "cascade" }),
  role: chatRoleEnum("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Journal Entries
export const journalEntries = pgTable("journal_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  mood: moodEnum("mood"),
  linkedGoalIds: jsonb("linked_goal_ids").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  goals: many(goals),
  tasks: many(tasks),
  calendarEvents: many(calendarEvents),
  chatMessages: many(chatMessages),
  journalEntries: many(journalEntries),
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

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  user: one(users, { fields: [tasks.userId], references: [users.id] }),
  goal: one(goals, { fields: [tasks.goalId], references: [goals.id] }),
  milestone: one(milestones, { fields: [tasks.milestoneId], references: [milestones.id] }),
  calendarEvents: many(calendarEvents),
}));

export const calendarEventsRelations = relations(calendarEvents, ({ one }) => ({
  user: one(users, { fields: [calendarEvents.userId], references: [users.id] }),
  task: one(tasks, { fields: [calendarEvents.taskId], references: [tasks.id] }),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  user: one(users, { fields: [chatMessages.userId], references: [users.id] }),
  goal: one(goals, { fields: [chatMessages.goalId], references: [goals.id] }),
}));

export const journalEntriesRelations = relations(journalEntries, ({ one }) => ({
  user: one(users, { fields: [journalEntries.userId], references: [users.id] }),
}));
