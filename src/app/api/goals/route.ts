import { NextRequest } from "next/server";
import { db } from "@/db";
import { goals } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth, getInternalUser } from "@/lib/auth-server";
import { validateBody } from "@/lib/api-middleware";
import { createGoalSchema } from "@/lib/validation/schemas";

// GET /api/goals - Get all goals for user
export async function GET(request: NextRequest) {
  try {
    const supabaseUserId = await requireAuth(request);
    const user = await getInternalUser(supabaseUserId);

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const userGoals = await db.query.goals.findMany({
      where: eq(goals.userId, user.id),
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
    const supabaseUserId = await requireAuth(request);
    const user = await getInternalUser(supabaseUserId);

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const { data, error } = await validateBody(request, createGoalSchema);
    if (error) return error;

    const { title, description, category, priority, targetDate, color, status } = data;

    const [goal] = await db
      .insert(goals)
      .values({
        userId: user.id,
        title,
        description: description ?? "",
        category,
        priority,
        targetDate: targetDate ? new Date(targetDate) : null,
        color,
        status,
      })
      .returning();

    return Response.json(goal, { status: 201 });
  } catch (error) {
    console.error("POST /api/goals error:", error);
    return Response.json({ error: "Failed to create goal" }, { status: 500 });
  }
}
