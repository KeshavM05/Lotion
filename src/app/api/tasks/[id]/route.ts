import { NextRequest } from "next/server";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// PATCH /api/tasks/[id] - Update task
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
      .update(tasks)
      .set({
        ...body,
        deadline: body.deadline ? new Date(body.deadline) : undefined,
        scheduledStart: body.scheduledStart ? new Date(body.scheduledStart) : undefined,
        scheduledEnd: body.scheduledEnd ? new Date(body.scheduledEnd) : undefined,
        completedAt: body.completed && !body.completedAt ? new Date() : body.completedAt ? new Date(body.completedAt) : undefined,
        updatedAt: new Date(),
      })
      .where(and(eq(tasks.id, params.id), eq(tasks.userId, userId)))
      .returning();

    if (!updated) {
      return Response.json({ error: "Task not found" }, { status: 404 });
    }

    return Response.json(updated);
  } catch (error) {
    console.error("PATCH /api/tasks/[id] error:", error);
    return Response.json({ error: "Failed to update task" }, { status: 500 });
  }
}

// DELETE /api/tasks/[id] - Delete task
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
      .delete(tasks)
      .where(and(eq(tasks.id, params.id), eq(tasks.userId, userId)))
      .returning();

    if (!deleted) {
      return Response.json({ error: "Task not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/tasks/[id] error:", error);
    return Response.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
