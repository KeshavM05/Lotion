import { db } from '@/db';
import { tasks, goals, milestones, calendarEvents, users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { indexContent, retrieveRelevantContext } from '@/lib/context-engine';

export interface ToolResult {
  summary: string;
  data: Record<string, unknown>;
}

export async function handleCreateTask(
  input: {
    title: string;
    description?: string;
    priority?: string;
    goalId?: string;
    deadline?: string;
    durationMinutes?: number;
  },
  userId: string
): Promise<ToolResult> {
  const [task] = await db
    .insert(tasks)
    .values({
      userId,
      title: input.title,
      description: input.description ?? '',
      priority: (input.priority as 'low' | 'medium' | 'high' | 'critical') ?? 'medium',
      goalId: input.goalId ?? null,
      deadline: input.deadline ? new Date(input.deadline) : null,
      durationMinutes: input.durationMinutes ?? 30,
    })
    .returning();

  return { summary: `Created task: ${task.title}`, data: { id: task.id, title: task.title } };
}

export async function handleCreateGoal(
  input: {
    title: string;
    description?: string;
    category: string;
    priority?: string;
    targetDate?: string;
    color?: string;
  },
  userId: string
): Promise<ToolResult> {
  const [goal] = await db
    .insert(goals)
    .values({
      userId,
      title: input.title,
      description: input.description ?? '',
      category: input.category as
        | 'career'
        | 'business'
        | 'finance'
        | 'personal'
        | 'health'
        | 'creative',
      priority: (input.priority as 'low' | 'medium' | 'high' | 'critical') ?? 'medium',
      targetDate: input.targetDate ? new Date(input.targetDate) : null,
      color: input.color ?? '#C17A72',
    })
    .returning();

  const text = `Goal: ${goal.title}${goal.description ? ` — ${goal.description}` : ''} (${goal.category}, ${goal.priority} priority)`;
  indexContent(userId, 'goal', text, goal.id, { category: goal.category }).catch(() => {});

  return { summary: `Created goal: ${goal.title}`, data: { id: goal.id, title: goal.title } };
}

export async function handleCreateMilestone(
  input: { goalId: string; title: string; description?: string; targetDate?: string },
  userId: string
): Promise<ToolResult> {
  // Verify the goal belongs to the user
  const goal = await db.query.goals.findFirst({
    where: and(eq(goals.id, input.goalId), eq(goals.userId, userId)),
  });
  if (!goal) {
    return { summary: 'Goal not found', data: { error: 'Goal not found or not owned by user' } };
  }

  const [milestone] = await db
    .insert(milestones)
    .values({
      goalId: input.goalId,
      title: input.title,
      description: input.description ?? '',
      targetDate: input.targetDate ? new Date(input.targetDate) : null,
    })
    .returning();

  return {
    summary: `Created milestone: ${milestone.title}`,
    data: { id: milestone.id, title: milestone.title, goalId: input.goalId },
  };
}

export async function handleCreateEvent(
  input: {
    title: string;
    start: string;
    end: string;
    description?: string;
    allDay?: boolean;
    color?: string;
  },
  userId: string
): Promise<ToolResult> {
  const [event] = await db
    .insert(calendarEvents)
    .values({
      userId,
      title: input.title,
      start: new Date(input.start),
      end: new Date(input.end),
      description: input.description ?? '',
      allDay: input.allDay ?? false,
      color: input.color ?? '#8b5cf6',
      source: 'local',
    })
    .returning();

  return {
    summary: `Scheduled: ${event.title}`,
    data: { id: event.id, title: event.title, start: input.start, end: input.end },
  };
}

export async function handleMoveEvent(
  input: { eventId: string; newStart: string; newEnd: string },
  userId: string
): Promise<ToolResult> {
  const [updated] = await db
    .update(calendarEvents)
    .set({ start: new Date(input.newStart), end: new Date(input.newEnd) })
    .where(and(eq(calendarEvents.id, input.eventId), eq(calendarEvents.userId, userId)))
    .returning();

  if (!updated) {
    return { summary: 'Event not found', data: { error: 'Event not found' } };
  }

  return {
    summary: `Moved event: ${updated.title}`,
    data: { id: updated.id, title: updated.title, start: input.newStart, end: input.newEnd },
  };
}

export async function handleSaveMemory(
  input: { content: string },
  userId: string
): Promise<ToolResult> {
  // Append to user's AI memory document
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  const currentMemory = user?.aiMemory || '';
  const updatedMemory = currentMemory
    ? `${currentMemory}\n- ${input.content}`
    : `- ${input.content}`;

  await db.update(users).set({ aiMemory: updatedMemory }).where(eq(users.id, userId));

  // Index for semantic retrieval
  indexContent(userId, 'memory', input.content, undefined, { type: 'user_stated' }).catch(() => {});

  return { summary: `Remembered: ${input.content}`, data: { saved: true } };
}

export async function handleSearchKnowledge(
  input: { query: string },
  userId: string
): Promise<ToolResult> {
  const context = await retrieveRelevantContext(userId, input.query);
  return {
    summary: `Searched knowledge for: ${input.query}`,
    data: { results: context || 'No relevant results found.' },
  };
}
