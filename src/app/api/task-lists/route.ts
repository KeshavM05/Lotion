import { NextRequest } from "next/server";
import { db } from "@/db";
import { taskLists } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth, getInternalUser } from "@/lib/auth-server";

// GET /api/task-lists - Get all task lists for user
export async function GET(request: NextRequest) {
  try {
    const supabaseUserId = await requireAuth(request);
    const user = await getInternalUser(supabaseUserId);

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const userTaskLists = await db.query.taskLists.findMany({
      where: eq(taskLists.userId, user.id),
      orderBy: (taskLists, { asc }) => [asc(taskLists.order)],
    });

    return Response.json(userTaskLists);
  } catch (error) {
    console.error("GET /api/task-lists error:", error);
    return Response.json({ error: "Failed to fetch task lists" }, { status: 500 });
  }
}

// POST /api/task-lists - Create new task list
export async function POST(request: NextRequest) {
  try {
    const supabaseUserId = await requireAuth(request);
    const user = await getInternalUser(supabaseUserId);

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const { name, color, icon, order } = body;

    if (!name) {
      return Response.json({ error: "Name is required" }, { status: 400 });
    }

    const newList = await db.insert(taskLists).values({
      userId: user.id,
      name,
      color: color || "#8b5cf6",
      icon: icon || "circle",
      order: order || 0,
    }).returning();

    return Response.json(newList[0]);
  } catch (error) {
    console.error("POST /api/task-lists error:", error);
    return Response.json({ error: "Failed to create task list" }, { status: 500 });
  }
}
