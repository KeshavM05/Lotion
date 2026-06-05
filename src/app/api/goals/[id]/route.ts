import { NextRequest } from 'next/server';
import { db } from '@/db';
import { goals } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { requireAuth, getInternalUser } from '@/lib/auth-server';

// GET /api/goals/[id] - Get single goal
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabaseUserId = await requireAuth(request);
    const user = await getInternalUser(supabaseUserId);

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const { id } = await params;

    const goal = await db.query.goals.findFirst({
      where: and(eq(goals.id, id), eq(goals.userId, user.id)),
      with: {
        milestones: {
          orderBy: (milestones, { asc }) => [asc(milestones.order)],
        },
        tasks: true,
      },
    });

    if (!goal) {
      return Response.json({ error: 'Goal not found' }, { status: 404 });
    }

    return Response.json(goal);
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('GET /api/goals/[id] error:', error);
    return Response.json({ error: 'Failed to fetch goal' }, { status: 500 });
  }
}

// PATCH /api/goals/[id] - Update goal
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabaseUserId = await requireAuth(request);
    const user = await getInternalUser(supabaseUserId);

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const { id } = await params;
    const body = await request.json();

    const [updated] = await db
      .update(goals)
      .set({
        ...body,
        targetDate: body.targetDate ? new Date(body.targetDate) : undefined,
        updatedAt: new Date(),
      })
      .where(and(eq(goals.id, id), eq(goals.userId, user.id)))
      .returning();

    if (!updated) {
      return Response.json({ error: 'Goal not found' }, { status: 404 });
    }

    return Response.json(updated);
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('PATCH /api/goals/[id] error:', error);
    return Response.json({ error: 'Failed to update goal' }, { status: 500 });
  }
}

// DELETE /api/goals/[id] - Delete goal
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

    const [deleted] = await db
      .delete(goals)
      .where(and(eq(goals.id, id), eq(goals.userId, user.id)))
      .returning();

    if (!deleted) {
      return Response.json({ error: 'Goal not found' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('DELETE /api/goals/[id] error:', error);
    return Response.json({ error: 'Failed to delete goal' }, { status: 500 });
  }
}
