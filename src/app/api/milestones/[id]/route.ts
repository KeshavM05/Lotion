import { NextRequest } from 'next/server';
import { db } from '@/db';
import { milestones } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth, getInternalUser, AuthError } from '@/lib/auth-server';
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

    // Get milestone with goal to verify ownership
    const milestone = await db.query.milestones.findFirst({
      where: eq(milestones.id, id),
      with: { goal: true },
    });

    if (!milestone || milestone.goal.userId !== user.id) {
      return Response.json({ error: 'Milestone not found' }, { status: 404 });
    }

    const { targetDate, completedAt, completed, ...rest } = data;

    const [updated] = await db
      .update(milestones)
      .set({
        ...rest,
        ...(completed !== undefined && { completed }),
        ...(targetDate !== undefined && {
          targetDate: targetDate ? new Date(targetDate) : null,
        }),
        ...(completed && !completedAt
          ? { completedAt: new Date() }
          : completedAt !== undefined && {
              completedAt: completedAt ? new Date(completedAt) : null,
            }),
      })
      .where(eq(milestones.id, id))
      .returning();

    return Response.json(updated);
  } catch (error) {
    if (error instanceof AuthError)
      return Response.json({ error: error.message }, { status: error.status });
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

    // Get milestone with goal to verify ownership
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
    if (error instanceof AuthError)
      return Response.json({ error: error.message }, { status: error.status });
    console.error('DELETE /api/milestones/[id] error:', error);
    return Response.json({ error: 'Failed to delete milestone' }, { status: 500 });
  }
}
