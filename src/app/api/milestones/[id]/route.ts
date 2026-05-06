import { NextRequest } from "next/server";
import { db } from "@/db";
import { milestones, goals } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// PATCH /api/milestones/[id] - Update milestone
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

    // Get milestone with goal to verify ownership
    const milestone = await db.query.milestones.findFirst({
      where: eq(milestones.id, params.id),
      with: { goal: true },
    });

    if (!milestone || milestone.goal.userId !== userId) {
      return Response.json({ error: "Milestone not found" }, { status: 404 });
    }

    const [updated] = await db
      .update(milestones)
      .set({
        ...body,
        targetDate: body.targetDate ? new Date(body.targetDate) : undefined,
        completedAt: body.completed && !body.completedAt ? new Date() : body.completedAt ? new Date(body.completedAt) : undefined,
      })
      .where(eq(milestones.id, params.id))
      .returning();

    return Response.json(updated);
  } catch (error) {
    console.error("PATCH /api/milestones/[id] error:", error);
    return Response.json({ error: "Failed to update milestone" }, { status: 500 });
  }
}

// DELETE /api/milestones/[id] - Delete milestone
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get milestone with goal to verify ownership
    const milestone = await db.query.milestones.findFirst({
      where: eq(milestones.id, params.id),
      with: { goal: true },
    });

    if (!milestone || milestone.goal.userId !== userId) {
      return Response.json({ error: "Milestone not found" }, { status: 404 });
    }

    await db.delete(milestones).where(eq(milestones.id, params.id));

    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/milestones/[id] error:", error);
    return Response.json({ error: "Failed to delete milestone" }, { status: 500 });
  }
}
