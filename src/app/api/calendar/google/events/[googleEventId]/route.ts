import { NextRequest } from 'next/server';
import { requireAuth, getInternalUser } from '@/lib/auth-server';
import { getGoogleAccessToken } from '@/lib/google-calendar';

// PATCH /api/calendar/google/events/[googleEventId] — update event in Google Calendar
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ googleEventId: string }> }
) {
  let supabaseUserId: string;
  try {
    supabaseUserId = await requireAuth(request);
  } catch {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await getInternalUser(supabaseUserId);
  if (!user) return Response.json({ error: 'User not found' }, { status: 404 });

  const token = await getGoogleAccessToken(user.id);
  if (!token) return Response.json({ error: 'Google Calendar not connected' }, { status: 401 });

  const { googleEventId } = await params;
  const body = await request.json();
  const { title, description, start, end, allDay } = body;

  const patch: Record<string, unknown> = {};
  if (title !== undefined) patch.summary = title;
  if (description !== undefined) patch.description = description;
  if (start !== undefined)
    patch.start = allDay ? { date: start.slice(0, 10) } : { dateTime: start };
  if (end !== undefined) patch.end = allDay ? { date: end.slice(0, 10) } : { dateTime: end };

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${googleEventId}`,
    {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return Response.json(
      { error: 'Failed to update in Google', details: err },
      { status: res.status }
    );
  }

  return Response.json({ ok: true });
}

// DELETE /api/calendar/google/events/[googleEventId] — delete event from Google Calendar
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ googleEventId: string }> }
) {
  let supabaseUserId: string;
  try {
    supabaseUserId = await requireAuth(request);
  } catch {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await getInternalUser(supabaseUserId);
  if (!user) return Response.json({ error: 'User not found' }, { status: 404 });

  const token = await getGoogleAccessToken(user.id);
  if (!token) return Response.json({ error: 'Google Calendar not connected' }, { status: 401 });

  const { googleEventId } = await params;

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${googleEventId}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  // 204 = deleted, 410 = already gone — both are fine
  if (!res.ok && res.status !== 410) {
    const err = await res.json().catch(() => ({}));
    return Response.json(
      { error: 'Failed to delete from Google', details: err },
      { status: res.status }
    );
  }

  return Response.json({ ok: true });
}
