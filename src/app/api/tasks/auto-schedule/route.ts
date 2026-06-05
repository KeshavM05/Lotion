import { NextRequest } from 'next/server';
import { db } from '@/db';
import { tasks, autoScheduleSettings } from '@/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { requireAuth, getInternalUser } from '@/lib/auth-server';
import { SchedulingService } from '@/lib/scheduling/SchedulingService';
import { AutoScheduleSettings as TAutoScheduleSettings } from '@/lib/scheduling/types';
import { ScorerTask } from '@/lib/scheduling/SlotScorer';

export async function POST(request: NextRequest) {
  try {
    const supabaseUserId = await requireAuth(request);
    const user = await getInternalUser(supabaseUserId);

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    // 1. Fetch user's scheduling settings
    let settings = await db.query.autoScheduleSettings.findFirst({
      where: eq(autoScheduleSettings.userId, user.id),
    });

    // Default settings if none exist
    if (!settings) {
      settings = {
        id: 'default',
        userId: user.id,
        workDays: [1, 2, 3, 4, 5],
        workHourStart: 9,
        workHourEnd: 17,
        highEnergyStart: 9,
        highEnergyEnd: 12,
        mediumEnergyStart: 13,
        mediumEnergyEnd: 15,
        lowEnergyStart: 15,
        lowEnergyEnd: 17,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    // 2. Fetch tasks that need scheduling (e.g. isAutoScheduled = false or just all active tasks without scheduledStart)
    const tasksToSchedule = await db.query.tasks.findMany({
      where: and(
        eq(tasks.userId, user.id),
        eq(tasks.status, 'todo'),
        eq(tasks.scheduleLocked, false),
        isNull(tasks.scheduledStart) // only schedule tasks without a start time for now
      ),
    });

    if (tasksToSchedule.length === 0) {
      return Response.json({ message: 'No tasks to schedule', scheduledCount: 0 });
    }

    const scorerTasks: ScorerTask[] = tasksToSchedule.map((t) => ({
      id: t.id,
      energyLevel: t.energyLevel,
      timePreference: t.timePreference,
      deadline: t.deadline,
      goalId: t.goalId,
      priority: t.priority,
      durationMinutes: t.durationMinutes || 30,
      scheduledStart: null,
      scheduledEnd: null,
      scheduleLocked: t.scheduleLocked,
    })) as ScorerTask[];

    // 3. Parse optional timezone from request body
    const body = await request.json().catch(() => ({}));
    const timezone: string =
      body?.timezone && typeof body.timezone === 'string' ? body.timezone : 'UTC';

    // 4. Run Scheduling Engine
    const service = new SchedulingService(settings as TAutoScheduleSettings, timezone);
    const scheduledTasks = await service.scheduleMultipleTasks(scorerTasks, user.id);

    return Response.json({
      message: 'Successfully scheduled tasks',
      scheduledCount: scheduledTasks.length,
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('POST /api/tasks/auto-schedule error:', error);
    const errObj = {
      message: error instanceof Error ? error.message : undefined,
      stack: error instanceof Error ? error.stack : undefined,
      raw: String(error),
    };
    return Response.json(
      { error: 'Failed to run auto-scheduling: ' + JSON.stringify(errObj) },
      { status: 500 }
    );
  }
}
