import { NextRequest } from "next/server";
import { db } from "@/db";
import { milestones } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth, getInternalUser } from "@/lib/auth-server";

// PATCH /api/milestones/[id] - Update milestone
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabaseUserId = await requireAuth(request);
    const user = await getInternalUser(supabaseUserId);

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const { id } = await params;
    const body = await request.json();

    // Get milestone with goal to verify ownership
    const milestone = await db.query.milestones.findFirst({
      where: eq(milestones.id, id),
      with: { goal: true },
    });

    if (!milestone || milestone.goal.userId !== user.id) {
      return Response.json({ error: "Milestone not found" }, { status: 404 });
    }

    const [updated] = await db
      .update(milestones)
      .set({
        ...body,
        targetDate: body.targetDate ? new Date(body.targetDate) : undefined,
        completedAt: body.completed && !body.completedAt ? new Date() : body.completedAt ? new Date(body.completedAt) : undefined,
      })
      .where(eq(milestones.id, id))
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabaseUserId = await requireAuth(request);
    const user = await getInternalUser(supabaseUserId);

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const { id } = await params;

    // Get milestone with goal to verify ownership
    const milestone = await db.query.milestones.findFirst({
      where: eq(milestones.id, id),
      with: { goal: true },
    });

    if (!milestone || milestone.goal.userId !== user.id) {
      return Response.json({ error: "Milestone not found" }, { status: 404 });
    }

    await db.delete(milestones).where(eq(milestones.id, id));

    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/milestones/[id] error:", error);
    return Response.json({ error: "Failed to delete milestone" }, { status: 500 });
  }
}
