import { NextRequest } from 'next/server';
import { db } from '@/db';
import { milestones } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth, getInternalUser } from '@/lib/auth-server';
import { validateBody } from '@/lib/api-middleware';
import { updateMilestoneSchema } from '@/lib/validation/schemas';

// PATCH /api/milestones/[id] - Update milestone
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabaseUserId = await requireAuth(request);
    const user = await getInternalUser(supabaseUserId);

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const { id } = await params;
    const { data, error } = await validateBody(request, updateMilestoneSchema);
    if (error) return error;

    // Verify ownership via goal relation
    const milestone = await db.query.milestones.findFirst({
      where: eq(milestones.id, id),
      with: { goal: true },
    });

    if (!milestone || milestone.goal.userId !== user.id) {
      return Response.json({ error: 'Milestone not found' }, { status: 404 });
    }

    const { targetDate, completed, completedAt, ...rest } = data;

    const [updated] = await db
      .update(milestones)
      .set({
        ...rest,
        ...(targetDate !== undefined && { targetDate: targetDate ? new Date(targetDate) : null }),
        ...(completed !== undefined && { completed }),
        completedAt:
          completed && !completedAt ? new Date() : completedAt ? new Date(completedAt) : undefined,
      })
      .where(eq(milestones.id, id))
      .returning();

    return Response.json(updated);
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('PATCH /api/milestones/[id] error:', error);
    return Response.json({ error: 'Failed to update milestone' }, { status: 500 });
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
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const { id } = await params;

    // Verify ownership via goal relation
    const milestone = await db.query.milestones.findFirst({
      where: eq(milestones.id, id),
      with: { goal: true },
    });

    if (!milestone || milestone.goal.userId !== user.id) {
      return Response.json({ error: 'Milestone not found' }, { status: 404 });
    }

    await db.delete(milestones).where(eq(milestones.id, id));

    return Response.json({ success: true });
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('DELETE /api/milestones/[id] error:', error);
    return Response.json({ error: 'Failed to delete milestone' }, { status: 500 });
  }
}
