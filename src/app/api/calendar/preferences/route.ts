import { NextRequest } from 'next/server';
import { requireAuth, getInternalUser, AuthError } from '@/lib/auth-server';
import { db } from '@/db';
import { calendarPreferences } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/calendar/preferences — get user's calendar preferences
export async function GET(request: NextRequest) {
  try {
    const supabaseUserId = await requireAuth(request);
    const user = await getInternalUser(supabaseUserId);
    if (!user) return Response.json({ error: 'User not found' }, { status: 404 });

    let prefs = await db.query.calendarPreferences.findFirst({
      where: eq(calendarPreferences.userId, user.id),
    });

    // Create default preferences if none exist
    if (!prefs) {
      const [created] = await db
        .insert(calendarPreferences)
        .values({ userId: user.id })
        .returning();
      prefs = created;
    }

    return Response.json(prefs);
  } catch (error) {
    console.error('GET /api/calendar/preferences error:', error);
    return Response.json({ error: 'Failed to fetch preferences' }, { status: 500 });
  }
}

// PATCH /api/calendar/preferences — update calendar preferences
export async function PATCH(request: NextRequest) {
  try {
    const supabaseUserId = await requireAuth(request);
    const user = await getInternalUser(supabaseUserId);
    if (!user) return Response.json({ error: 'User not found' }, { status: 404 });

    const body = await request.json();

    // Extract only updatable fields (exclude id, userId, createdAt, updatedAt)
    const {
      timezone,
      firstDayOfWeek,
      defaultView,
      timeGridStart,
      timeGridEnd,
      timeDisplayResolution,
      timeDraggingResolution,
      eventsPerDayLimit,
    } = body;

    const updateData = {
      timezone,
      firstDayOfWeek,
      defaultView,
      timeGridStart,
      timeGridEnd,
      timeDisplayResolution,
      timeDraggingResolution,
      eventsPerDayLimit,
      updatedAt: new Date(),
    };

    // Ensure preferences exist
    let prefs = await db.query.calendarPreferences.findFirst({
      where: eq(calendarPreferences.userId, user.id),
    });

    if (!prefs) {
      // Create if not exists
      const [created] = await db
        .insert(calendarPreferences)
        .values({ userId: user.id, ...updateData })
        .returning();
      return Response.json(created);
    }

    // Update existing
    const [updated] = await db
      .update(calendarPreferences)
      .set(updateData)
      .where(eq(calendarPreferences.id, prefs.id))
      .returning();

    return Response.json(updated);
  } catch (error) {
    console.error('PATCH /api/calendar/preferences error:', error);
    return Response.json({ error: 'Failed to update preferences' }, { status: 500 });
  }
}
