import { NextRequest } from 'next/server';
import { db } from '@/db';
import { calendarEvents } from '@/db/schema';
import { requireAuth, getInternalUser } from '@/lib/auth-server';
import { eq, and } from 'drizzle-orm';

// PATCH /api/events/[id] - Update event
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabaseUserId = await requireAuth(request);
    const user = await getInternalUser(supabaseUserId);

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const { id } = await params;
    const body = await request.json();

    const [updated] = await db
      .update(calendarEvents)
      .set({
        ...body,
        start: body.start ? new Date(body.start) : undefined,
        end: body.end ? new Date(body.end) : undefined,
      })
      .where(and(eq(calendarEvents.id, id), eq(calendarEvents.userId, user.id)))
      .returning();

    if (!updated) {
      return Response.json({ error: 'Event not found' }, { status: 404 });
    }

    return Response.json(updated);
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('PATCH /api/events/[id] error:', error);
    return Response.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

// DELETE /api/events/[id] - Delete event
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabaseUserId = await requireAuth(request);
    const user = await getInternalUser(supabaseUserId);

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const { id } = await params;

    const [deleted] = await db
      .delete(calendarEvents)
      .where(and(eq(calendarEvents.id, id), eq(calendarEvents.userId, user.id)))
      .returning();

    if (!deleted) {
      return Response.json({ error: 'Event not found' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('DELETE /api/events/[id] error:', error);
    return Response.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
