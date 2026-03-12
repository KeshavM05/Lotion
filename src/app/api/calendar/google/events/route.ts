import { NextRequest } from "next/server";

// GET /api/calendar/google/events — fetch events from Google Calendar
export async function GET(request: NextRequest) {
  const token = request.cookies.get("google_calendar_token")?.value;

  if (!token) {
    return Response.json({ error: "Not authenticated with Google Calendar" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const timeMin = searchParams.get("timeMin") || new Date().toISOString();
  const timeMax = searchParams.get("timeMax") || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  try {
    const url = new URL("https://www.googleapis.com/calendar/v3/calendars/primary/events");
    url.searchParams.set("timeMin", timeMin);
    url.searchParams.set("timeMax", timeMax);
    url.searchParams.set("singleEvents", "true");
    url.searchParams.set("orderBy", "startTime");

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      return Response.json({ error: "Failed to fetch events" }, { status: res.status });
    }

    const data = await res.json();
    const events = (data.items || []).map(
      (item: {
        id: string;
        summary?: string;
        description?: string;
        start?: { dateTime?: string; date?: string };
        end?: { dateTime?: string; date?: string };
        colorId?: string;
      }) => ({
        id: item.id,
        title: item.summary || "(No title)",
        description: item.description || "",
        start: item.start?.dateTime || item.start?.date || "",
        end: item.end?.dateTime || item.end?.date || "",
        allDay: !item.start?.dateTime,
        color: "#4285f4",
        source: "google",
      })
    );

    return Response.json({ events });
  } catch {
    return Response.json({ error: "Failed to fetch Google Calendar events" }, { status: 500 });
  }
}
