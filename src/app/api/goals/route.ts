import { NextRequest } from 'next/server';
import { db } from '@/db';
import { goals } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth, getInternalUser, AuthError } from '@/lib/auth-server';
import { validateBody } from '@/lib/api-middleware';
import { createGoalSchema } from '@/lib/validation/schemas';
import { indexContent } from '@/lib/context-engine';

// GET /api/goals - Get all goals for user
export async function GET(request: NextRequest) {
  try {
    const supabaseUserId = await requireAuth(request);
    const user = await getInternalUser(supabaseUserId);

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const userGoals = await db.query.goals.findMany({
      where: eq(goals.userId, user.id),
      orderBy: (goals, { desc }) => [desc(goals.createdAt)],
    });

    return Response.json(userGoals);
  } catch (error) {
    if (error instanceof AuthError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    console.error('GET /api/goals error:', error);
    return Response.json(
      { error: 'Failed to fetch goals', detail: String(error) },
      { status: 500 }
    );
  }
}

// POST /api/goals - Create new goal
export async function POST(request: NextRequest) {
  try {
    const supabaseUserId = await requireAuth(request);
    const user = await getInternalUser(supabaseUserId);

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const { data, error } = await validateBody(request, createGoalSchema);
    if (error) return error;

    const { title, description, category, priority, targetDate, color, status } = data;

    const [goal] = await db
      .insert(goals)
      .values({
        userId: user.id,
        title,
        description: description ?? '',
        category,
        priority,
        targetDate: targetDate ? new Date(targetDate) : null,
        color,
        status,
      })
      .returning();

    // Index goal for semantic retrieval
    const text = `Goal: ${goal.title}${goal.description ? ` — ${goal.description}` : ''} (${goal.category}, ${goal.priority} priority)`;
    indexContent(user.id, 'goal', text, goal.id, { category: goal.category }).catch(() => {});

    return Response.json(goal, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError)
      return Response.json({ error: error.message }, { status: error.status });
    console.error('POST /api/goals error:', error);
    return Response.json({ error: 'Failed to create goal' }, { status: 500 });
  }
}
