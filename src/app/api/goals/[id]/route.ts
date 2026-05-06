import { NextRequest } from "next/server";
import { db } from "@/db";
import { goals } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// GET /api/goals/[id] - Get single goal
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const goal = await db.query.goals.findFirst({
      where: and(eq(goals.id, params.id), eq(goals.userId, userId)),
      with: {
        milestones: {
          orderBy: (milestones, { asc }) => [asc(milestones.order)],
        },
        tasks: true,
      },
    });

    if (!goal) {
      return Response.json({ error: "Goal not found" }, { status: 404 });
    }

    return Response.json(goal);
  } catch (error) {
    console.error("GET /api/goals/[id] error:", error);
    return Response.json({ error: "Failed to fetch goal" }, { status: 500 });
  }
}

// PATCH /api/goals/[id] - Update goal
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
      .update(goals)
      .set({
        ...body,
        targetDate: body.targetDate ? new Date(body.targetDate) : undefined,
        updatedAt: new Date(),
      })
      .where(and(eq(goals.id, params.id), eq(goals.userId, userId)))
      .returning();

    if (!updated) {
      return Response.json({ error: "Goal not found" }, { status: 404 });
    }

    return Response.json(updated);
  } catch (error) {
    console.error("PATCH /api/goals/[id] error:", error);
    return Response.json({ error: "Failed to update goal" }, { status: 500 });
  }
}

// DELETE /api/goals/[id] - Delete goal
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
      .delete(goals)
      .where(and(eq(goals.id, params.id), eq(goals.userId, userId)))
      .returning();

    if (!deleted) {
      return Response.json({ error: "Goal not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/goals/[id] error:", error);
    return Response.json({ error: "Failed to delete goal" }, { status: 500 });
  }
}
