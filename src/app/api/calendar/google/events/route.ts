import { NextRequest } from 'next/server';
import { requireAuth, getInternalUser } from '@/lib/auth-server';
import { getGoogleAccessToken } from '@/lib/google-calendar';
import { db } from '@/db';
import { calendarEvents } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

// GET /api/calendar/google/events — fetch from Google, upsert into DB, return events
export async function GET(request: NextRequest) {
  let supabaseUserId: string;
  try {
    supabaseUserId = await requireAuth(request);
  } catch {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await getInternalUser(supabaseUserId);
  if (!user) return Response.json({ error: 'User not found' }, { status: 404 });

  const token = await getGoogleAccessToken(user.id);
  if (!token) {
    return Response.json(
      { error: 'Google Calendar not connected', code: 'NOT_CONNECTED' },
      { status: 401 }
    );
  }

  const { searchParams } = request.nextUrl;
  const timeMin =
    searchParams.get('timeMin') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const timeMax =
    searchParams.get('timeMax') || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString();

  const url = new URL('https://www.googleapis.com/calendar/v3/calendars/primary/events');
  url.searchParams.set('timeMin', timeMin);
  url.searchParams.set('timeMax', timeMax);
  url.searchParams.set('singleEvents', 'true');
  url.searchParams.set('orderBy', 'startTime');
  url.searchParams.set('maxResults', '500');

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return Response.json(
      { error: 'Failed to fetch from Google', details: err },
      { status: res.status }
    );
  }

  const data = await res.json();
  const items: GoogleCalendarEvent[] = data.items || [];

  // Upsert each event into our DB
  const upserted = await Promise.all(
    items.map(async (item) => {
      const start = item.start?.dateTime || item.start?.date || '';
      const end = item.end?.dateTime || item.end?.date || '';
      if (!start || !end) return null;

      const existing = await db.query.calendarEvents.findFirst({
        where: and(eq(calendarEvents.userId, user.id), eq(calendarEvents.googleEventId, item.id)),
      });

      const values = {
        userId: user.id,
        title: item.summary || '(No title)',
        description: item.description || '',
        start: new Date(start),
        end: new Date(end),
        allDay: !item.start?.dateTime,
        color: '#4285f4',
        source: 'google' as const,
        googleEventId: item.id,
        isRecurring: !!(item.recurrence || item.recurringEventId),
      };

      if (existing) {
        await db.update(calendarEvents).set(values).where(eq(calendarEvents.id, existing.id));
        return { ...existing, ...values };
      } else {
        const [created] = await db.insert(calendarEvents).values(values).returning();
        return created;
      }
    })
  );

  return Response.json({ events: upserted.filter(Boolean), synced: upserted.length });
}

// POST /api/calendar/google/events — create event in Google Calendar
export async function POST(request: NextRequest) {
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

  const body = await request.json();
  const { title, description, start, end, allDay } = body;

  const googleEvent: Record<string, unknown> = {
    summary: title,
    description: description || '',
    start: allDay ? { date: start.slice(0, 10) } : { dateTime: start },
    end: allDay ? { date: end.slice(0, 10) } : { dateTime: end },
  };

  const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(googleEvent),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return Response.json(
      { error: 'Failed to create in Google', details: err },
      { status: res.status }
    );
  }

  const created = await res.json();

  // Store googleEventId back in our DB row if localEventId provided
  if (body.localEventId) {
    await db
      .update(calendarEvents)
      .set({ googleEventId: created.id })
      .where(and(eq(calendarEvents.userId, user.id), eq(calendarEvents.id, body.localEventId)));
  }

  return Response.json({ googleEventId: created.id });
}

interface GoogleCalendarEvent {
  id: string;
  summary?: string;
  description?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
  recurrence?: string[];
  recurringEventId?: string;
}
