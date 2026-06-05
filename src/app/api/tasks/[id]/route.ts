import { NextRequest } from 'next/server';
import { db } from '@/db';
import { tasks } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { requireAuth, getInternalUser } from '@/lib/auth-server';

// PATCH /api/tasks/[id] - Update task
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
      .update(tasks)
      .set({
        ...body,
        deadline: body.deadline ? new Date(body.deadline) : undefined,
        scheduledStart: body.scheduledStart ? new Date(body.scheduledStart) : undefined,
        scheduledEnd: body.scheduledEnd ? new Date(body.scheduledEnd) : undefined,
        completedAt:
          body.completed && !body.completedAt
            ? new Date()
            : body.completedAt
              ? new Date(body.completedAt)
              : undefined,
        updatedAt: new Date(),
      })
      .where(and(eq(tasks.id, id), eq(tasks.userId, user.id)))
      .returning();

    if (!updated) {
      return Response.json({ error: 'Task not found' }, { status: 404 });
    }

    return Response.json(updated);
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('PATCH /api/tasks/[id] error:', error);
    return Response.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

// DELETE /api/tasks/[id] - Delete task
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
      .delete(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, user.id)))
      .returning();

    if (!deleted) {
      return Response.json({ error: 'Task not found' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('DELETE /api/tasks/[id] error:', error);
    return Response.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
