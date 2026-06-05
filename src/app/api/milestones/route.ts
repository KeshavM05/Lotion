import { NextRequest } from 'next/server';
import { db } from '@/db';
import { milestones, goals } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { requireAuth, getInternalUser } from '@/lib/auth-server';
import { validateBody } from '@/lib/api-middleware';
import { createMilestoneSchema } from '@/lib/validation/schemas';

// POST /api/milestones - Create new milestone
export async function POST(request: NextRequest) {
  try {
    const supabaseUserId = await requireAuth(request);
    const user = await getInternalUser(supabaseUserId);

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const { data, error } = await validateBody(request, createMilestoneSchema);
    if (error) return error;

    const { goalId, title, description, targetDate, order } = data;

    // Verify goal belongs to user
    const goal = await db.query.goals.findFirst({
      where: and(eq(goals.id, goalId), eq(goals.userId, user.id)),
    });

    if (!goal) {
      return Response.json({ error: 'Goal not found' }, { status: 404 });
    }

    const [milestone] = await db
      .insert(milestones)
      .values({
        goalId,
        title,
        description: description ?? '',
        targetDate: targetDate ? new Date(targetDate) : null,
        order: order ?? 0,
      })
      .returning();

    return Response.json(milestone, { status: 201 });
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('POST /api/milestones error:', error);
    return Response.json({ error: 'Failed to create milestone' }, { status: 500 });
  }
}
