import { NextRequest } from 'next/server';
import { db } from '@/db';
import { taskLists } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { requireAuth, getInternalUser } from '@/lib/auth-server';
import { validateBody } from '@/lib/api-middleware';
import { createTaskListSchema } from '@/lib/validation/schemas';

// GET /api/task-lists?archived=true - Get task lists for user (optionally filter by archived)
export async function GET(request: NextRequest) {
  try {
    const supabaseUserId = await requireAuth(request);
    const user = await getInternalUser(supabaseUserId);

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const archivedParam = request.nextUrl.searchParams.get('archived');
    const whereClause =
      archivedParam === 'true'
        ? and(eq(taskLists.userId, user.id), eq(taskLists.archived, true))
        : archivedParam === 'false'
          ? and(eq(taskLists.userId, user.id), eq(taskLists.archived, false))
          : eq(taskLists.userId, user.id);

    const userTaskLists = await db.query.taskLists.findMany({
      where: whereClause,
      orderBy: (taskLists, { asc }) => [asc(taskLists.order)],
    });

    return Response.json(userTaskLists);
  } catch (error) {
    console.error('GET /api/task-lists error:', error);
    return Response.json({ error: 'Failed to fetch task lists' }, { status: 500 });
  }
}

// POST /api/task-lists - Create new task list
export async function POST(request: NextRequest) {
  try {
    const supabaseUserId = await requireAuth(request);
    const user = await getInternalUser(supabaseUserId);

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const { data, error } = await validateBody(request, createTaskListSchema);
    if (error) return error;

    const { name, color, icon, order } = data;

    const newList = await db
      .insert(taskLists)
      .values({
        userId: user.id,
        name,
        color,
        icon,
        order,
      })
      .returning();

    return Response.json(newList[0]);
  } catch (error) {
    console.error('POST /api/task-lists error:', error);
    return Response.json({ error: 'Failed to create task list' }, { status: 500 });
  }
}
