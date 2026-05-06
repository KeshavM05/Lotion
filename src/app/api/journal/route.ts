import { NextRequest } from "next/server";
import { db } from "@/db";
import { journalEntries } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/journal - Get all journal entries for user
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const entries = await db.query.journalEntries.findMany({
      where: eq(journalEntries.userId, userId),
      orderBy: (journalEntries, { desc }) => [desc(journalEntries.createdAt)],
    });

    return Response.json(entries);
  } catch (error) {
    console.error("GET /api/journal error:", error);
    return Response.json({ error: "Failed to fetch journal entries" }, { status: 500 });
  }
}

// POST /api/journal - Create new journal entry
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { content, mood, linkedGoalIds } = body;

    if (!content) {
      return Response.json({ error: "Missing required field: content" }, { status: 400 });
    }

    const [entry] = await db
      .insert(journalEntries)
      .values({
        userId,
        content,
        mood: mood || null,
        linkedGoalIds: linkedGoalIds || [],
      })
      .returning();

    return Response.json(entry, { status: 201 });
  } catch (error) {
    console.error("POST /api/journal error:", error);
    return Response.json({ error: "Failed to create journal entry" }, { status: 500 });
  }
}
