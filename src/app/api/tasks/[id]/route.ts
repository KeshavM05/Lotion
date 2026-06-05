import { NextRequest } from 'next/server';
import { db } from '@/db';
import { tasks } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { requireAuth, getInternalUser } from '@/lib/auth-server';
import { validateBody } from '@/lib/api-middleware';
import { updateTaskSchema } from '@/lib/validation/schemas';

// PATCH /api/tasks/[id] - Update task
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabaseUserId = await requireAuth(request);
    const user = await getInternalUser(supabaseUserId);

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const { id } = await params;
    const { data, error } = await validateBody(request, updateTaskSchema);
    if (error) return error;

    const { deadline, scheduledStart, scheduledEnd, completed, completedAt, ...rest } = data;

    const [updated] = await db
      .update(tasks)
      .set({
        ...rest,
        ...(deadline !== undefined && { deadline: deadline ? new Date(deadline) : null }),
        ...(scheduledStart !== undefined && {
          scheduledStart: scheduledStart ? new Date(scheduledStart) : null,
        }),
        ...(scheduledEnd !== undefined && {
          scheduledEnd: scheduledEnd ? new Date(scheduledEnd) : null,
        }),
        completedAt:
          completed && !completedAt
            ? new Date()
            : completedAt !== undefined
              ? completedAt
                ? new Date(completedAt)
                : null
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
    console.error('DELETE /api/tasks/[id] error:', error);
    return Response.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
