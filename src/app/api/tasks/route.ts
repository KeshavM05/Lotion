import { NextRequest } from "next/server";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/tasks - Get all tasks for user
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userTasks = await db.query.tasks.findMany({
      where: eq(tasks.userId, userId),
      orderBy: (tasks, { desc }) => [desc(tasks.createdAt)],
    });

    return Response.json(userTasks);
  } catch (error) {
    console.error("GET /api/tasks error:", error);
    return Response.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

// POST /api/tasks - Create new task
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      status,
      priority,
      goalId,
      milestoneId,
      durationMinutes,
      deadline,
      scheduledStart,
      scheduledEnd,
    } = body;

    if (!title) {
      return Response.json({ error: "Missing required field: title" }, { status: 400 });
    }

    const [task] = await db
      .insert(tasks)
      .values({
        userId,
        title,
        description: description || "",
        status: status || "todo",
        priority: priority || "medium",
        goalId: goalId || null,
        milestoneId: milestoneId || null,
        durationMinutes: durationMinutes || 30,
        deadline: deadline ? new Date(deadline) : null,
        scheduledStart: scheduledStart ? new Date(scheduledStart) : null,
        scheduledEnd: scheduledEnd ? new Date(scheduledEnd) : null,
      })
      .returning();

    return Response.json(task, { status: 201 });
  } catch (error) {
    console.error("POST /api/tasks error:", error);
    return Response.json({ error: "Failed to create task" }, { status: 500 });
  }
}
