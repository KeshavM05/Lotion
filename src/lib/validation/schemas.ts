import { z } from 'zod';

// Goal schemas
export const createGoalSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(2000, 'Description too long').optional().default(''),
  category: z.enum(['career', 'business', 'finance', 'personal', 'health', 'creative']),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional().default('medium'),
  targetDate: z.string().datetime({ offset: true }).optional().nullable(),
  color: z.string().min(1, 'Color is required'),
  status: z.enum(['active', 'paused', 'completed', 'abandoned']).optional().default('active'),
});

export const updateGoalSchema = createGoalSchema.partial();

// Task schemas
export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(300, 'Title too long'),
  description: z.string().max(2000, 'Description too long').optional().default(''),
  status: z.enum(['todo', 'in_progress', 'done', 'cancelled']).optional().default('todo'),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional().default('medium'),
  goalId: z.string().uuid('Invalid goal ID').optional().nullable(),
  milestoneId: z.string().uuid('Invalid milestone ID').optional().nullable(),
  listId: z.string().uuid('Invalid list ID').optional().nullable(),
  durationMinutes: z.number().int().positive().optional().default(30),
  deadline: z.string().datetime({ offset: true }).optional().nullable(),
  scheduledStart: z.string().datetime({ offset: true }).optional().nullable(),
  scheduledEnd: z.string().datetime({ offset: true }).optional().nullable(),
  energyLevel: z.enum(['low', 'medium', 'high']).optional().default('medium'),
  timePreference: z
    .enum(['morning', 'afternoon', 'evening', 'anytime'])
    .optional()
    .default('anytime'),
  tags: z.array(z.string()).optional().default([]),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  completed: z.boolean().optional(),
  completedAt: z.string().datetime({ offset: true }).optional().nullable(),
  scheduleLocked: z.boolean().optional(),
  isAutoScheduled: z.boolean().optional(),
  scheduleScore: z.number().int().optional().nullable(),
});

// Journal schemas
export const createJournalEntrySchema = z.object({
  content: z.string().min(1, 'Content is required').max(50000, 'Content too long'),
  mood: z.enum(['great', 'good', 'okay', 'bad', 'terrible']).optional().nullable(),
  linkedGoalIds: z.array(z.string().uuid('Invalid goal ID')).optional().default([]),
});

export const updateJournalEntrySchema = createJournalEntrySchema.partial();

// Milestone schemas
export const createMilestoneSchema = z.object({
  goalId: z.string().uuid('Invalid goal ID'),
  title: z.string().min(1, 'Title is required').max(300, 'Title too long'),
  description: z.string().max(2000, 'Description too long').optional().default(''),
  targetDate: z.string().datetime({ offset: true }).optional().nullable(),
  order: z.number().int().nonnegative().optional().default(0),
});

export const updateMilestoneSchema = createMilestoneSchema
  .omit({ goalId: true })
  .partial()
  .extend({
    completed: z.boolean().optional(),
    completedAt: z.string().datetime({ offset: true }).optional().nullable(),
  });

// Calendar event schemas
export const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(300, 'Title too long'),
  description: z.string().max(2000, 'Description too long').optional().default(''),
  start: z.string().datetime({ offset: true }),
  end: z.string().datetime({ offset: true }),
  allDay: z.boolean().optional().default(false),
  color: z.string().optional().default('#8b5cf6'),
  taskId: z.string().uuid('Invalid task ID').optional().nullable(),
  source: z.enum(['local', 'google', 'outlook']).optional().default('local'),
  recurrenceFrequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional().nullable(),
  recurrenceEndDate: z.string().datetime({ offset: true }).optional().nullable(),
  recurrenceDaysOfWeek: z.array(z.number().int().min(0).max(6)).optional().nullable(),
});

export const updateEventSchema = createEventSchema.partial();

// Task list schemas
export const createTaskListSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  color: z.string().optional().default('#8b5cf6'),
  icon: z.string().optional().default('circle'),
  order: z.number().int().nonnegative().optional().default(0),
});

export const updateTaskListSchema = createTaskListSchema.partial();

// Chat message schema
export const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1, 'Message content is required').max(10000, 'Message too long'),
});

export const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1, 'At least one message is required'),
  goalContext: z.string().max(5000).optional(),
  aiMemory: z.string().max(10000).optional(),
  calendarContext: z.string().max(5000).optional(),
  tasksContext: z.string().max(5000).optional(),
});

export type CreateGoalInput = z.infer<typeof createGoalSchema>;
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type CreateJournalEntryInput = z.infer<typeof createJournalEntrySchema>;
export type UpdateJournalEntryInput = z.infer<typeof updateJournalEntrySchema>;
export type ChatRequestInput = z.infer<typeof chatRequestSchema>;
export type CreateTaskListInput = z.infer<typeof createTaskListSchema>;
export type UpdateTaskListInput = z.infer<typeof updateTaskListSchema>;
export type CreateMilestoneInput = z.infer<typeof createMilestoneSchema>;
export type UpdateMilestoneInput = z.infer<typeof updateMilestoneSchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
