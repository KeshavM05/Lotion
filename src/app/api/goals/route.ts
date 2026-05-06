import { NextRequest } from "next/server";
import { db } from "@/db";
import { goals } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// GET /api/goals - Get all goals for user
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userGoals = await db.query.goals.findMany({
      where: eq(goals.userId, userId),
      orderBy: (goals, { desc }) => [desc(goals.createdAt)],
    });

    return Response.json(userGoals);
  } catch (error) {
    console.error("GET /api/goals error:", error);
    return Response.json({ error: "Failed to fetch goals" }, { status: 500 });
  }
}

// POST /api/goals - Create new goal
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, category, priority, targetDate, color, status } = body;

    if (!title || !category || !color) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const [goal] = await db
      .insert(goals)
      .values({
        userId,
        title,
        description: description || "",
        category,
        priority: priority || "medium",
        targetDate: targetDate ? new Date(targetDate) : null,
        color,
        status: status || "active",
      })
      .returning();

    return Response.json(goal, { status: 201 });
  } catch (error) {
    console.error("POST /api/goals error:", error);
    return Response.json({ error: "Failed to create goal" }, { status: 500 });
  }
}
