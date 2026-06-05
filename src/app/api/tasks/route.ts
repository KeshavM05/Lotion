import { NextRequest } from "next/server";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth, getInternalUser } from "@/lib/auth-server";

// GET /api/tasks - Get all tasks for user
export async function GET(request: NextRequest) {
  try {
    const supabaseUserId = await requireAuth(request);
    const user = await getInternalUser(supabaseUserId);

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const userTasks = await db.query.tasks.findMany({
      where: eq(tasks.userId, user.id),
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
    const supabaseUserId = await requireAuth(request);
    const user = await getInternalUser(supabaseUserId);

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const {
      title,
      description,
      status,
      priority,
      goalId,
      milestoneId,
      listId,
      durationMinutes,
      deadline,
      scheduledStart,
      scheduledEnd,
      energyLevel,
      timePreference,
      tags,
    } = body;

    if (!title) {
      return Response.json({ error: "Missing required field: title" }, { status: 400 });
    }

    const [task] = await db
      .insert(tasks)
      .values({
        userId: user.id,
        title,
        description: description || "",
        status: status || "todo",
        priority: priority || "medium",
        goalId: goalId || null,
        milestoneId: milestoneId || null,
        listId: listId || null,
        durationMinutes: durationMinutes || 30,
        deadline: deadline ? new Date(deadline) : null,
        scheduledStart: scheduledStart ? new Date(scheduledStart) : null,
        scheduledEnd: scheduledEnd ? new Date(scheduledEnd) : null,
        energyLevel: energyLevel || "medium",
        timePreference: timePreference || "anytime",
        tags: tags || [],
      })
      .returning();

    return Response.json(task, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/tasks error:", error);
    return Response.json({ error: error.message || "Failed to create task" }, { status: 500 });
  }
}
