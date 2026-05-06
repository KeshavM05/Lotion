import { NextRequest } from "next/server";
import { db } from "@/db";
import { journalEntries } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// PATCH /api/journal/[id] - Update journal entry
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
      .update(journalEntries)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(and(eq(journalEntries.id, params.id), eq(journalEntries.userId, userId)))
      .returning();

    if (!updated) {
      return Response.json({ error: "Journal entry not found" }, { status: 404 });
    }

    return Response.json(updated);
  } catch (error) {
    console.error("PATCH /api/journal/[id] error:", error);
    return Response.json({ error: "Failed to update journal entry" }, { status: 500 });
  }
}

// DELETE /api/journal/[id] - Delete journal entry
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
      .delete(journalEntries)
      .where(and(eq(journalEntries.id, params.id), eq(journalEntries.userId, userId)))
      .returning();

    if (!deleted) {
      return Response.json({ error: "Journal entry not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/journal/[id] error:", error);
    return Response.json({ error: "Failed to delete journal entry" }, { status: 500 });
  }
}
