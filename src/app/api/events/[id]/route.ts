import { NextRequest } from "next/server";
import { db } from "@/db";
import { calendarEvents } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// PATCH /api/events/[id] - Update event
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const [updated] = await db
      .update(calendarEvents)
      .set({
        ...body,
        start: body.start ? new Date(body.start) : undefined,
        end: body.end ? new Date(body.end) : undefined,
      })
      .where(and(eq(calendarEvents.id, params.id), eq(calendarEvents.userId, userId)))
      .returning();

    if (!updated) {
      return Response.json({ error: "Event not found" }, { status: 404 });
    }

    return Response.json(updated);
  } catch (error) {
    console.error("PATCH /api/events/[id] error:", error);
    return Response.json({ error: "Failed to update event" }, { status: 500 });
  }
}

// DELETE /api/events/[id] - Delete event
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [deleted] = await db
      .delete(calendarEvents)
      .where(and(eq(calendarEvents.id, params.id), eq(calendarEvents.userId, userId)))
      .returning();

    if (!deleted) {
      return Response.json({ error: "Event not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/events/[id] error:", error);
    return Response.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
