import { NextRequest } from "next/server";
import { db } from "@/db";
import { milestones, goals } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// POST /api/milestones - Create new milestone
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { goalId, title, description, targetDate, order } = body;

    if (!goalId || !title) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify goal belongs to user
    const goal = await db.query.goals.findFirst({
      where: and(eq(goals.id, goalId), eq(goals.userId, userId)),
    });

    if (!goal) {
      return Response.json({ error: "Goal not found" }, { status: 404 });
    }

    const [milestone] = await db
      .insert(milestones)
      .values({
        goalId,
        title,
        description: description || "",
        targetDate: targetDate ? new Date(targetDate) : null,
        order: order ?? 0,
      })
      .returning();

    return Response.json(milestone, { status: 201 });
  } catch (error) {
    console.error("POST /api/milestones error:", error);
    return Response.json({ error: "Failed to create milestone" }, { status: 500 });
  }
}
