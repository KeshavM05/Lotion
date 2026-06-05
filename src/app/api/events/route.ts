import { NextRequest } from 'next/server';
import { db } from '@/db';
import { calendarEvents } from '@/db/schema';
import { requireAuth, getInternalUser } from '@/lib/auth-server';
import { validateBody } from '@/lib/api-middleware';
import { createEventSchema } from '@/lib/validation/schemas';
import { eq, and, gte, lte } from 'drizzle-orm';

// GET /api/events - Get calendar events for user (with optional date range)
export async function GET(request: NextRequest) {
  try {
    const supabaseUserId = await requireAuth(request);
    const user = await getInternalUser(supabaseUserId);

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start');
    const endDate = searchParams.get('end');

    let events;
    if (startDate && endDate) {
      events = await db.query.calendarEvents.findMany({
        where: and(
          eq(calendarEvents.userId, user.id),
          gte(calendarEvents.start, new Date(startDate)),
          lte(calendarEvents.end, new Date(endDate))
        ),
        orderBy: (calendarEvents, { asc }) => [asc(calendarEvents.start)],
      });
    } else {
      events = await db.query.calendarEvents.findMany({
        where: eq(calendarEvents.userId, user.id),
        orderBy: (calendarEvents, { desc }) => [desc(calendarEvents.start)],
      });
    }

    return Response.json(events);
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('GET /api/events error:', error);
    return Response.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

// POST /api/events - Create new event
export async function POST(request: NextRequest) {
  try {
    const supabaseUserId = await requireAuth(request);
    const user = await getInternalUser(supabaseUserId);

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const { data, error } = await validateBody(request, createEventSchema);
    if (error) return error;

    const {
      title,
      description,
      start,
      end,
      allDay,
      color,
      taskId,
      source,
      recurrenceFrequency,
      recurrenceEndDate,
      recurrenceDaysOfWeek,
    } = data;

    const [event] = await db
      .insert(calendarEvents)
      .values({
        userId: user.id,
        title,
        description: description ?? '',
        start: new Date(start),
        end: new Date(end),
        allDay: allDay ?? false,
        color: color ?? '#8b5cf6',
        taskId: taskId ?? null,
        source: source ?? 'local',
        recurrenceFrequency: recurrenceFrequency ?? null,
        recurrenceEndDate: recurrenceEndDate ? new Date(recurrenceEndDate) : null,
        recurrenceDaysOfWeek: recurrenceDaysOfWeek ?? null,
      })
      .returning();

    return Response.json(event, { status: 201 });
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('POST /api/events error:', error);
    return Response.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
