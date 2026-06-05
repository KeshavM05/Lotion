import { NextRequest } from 'next/server';
import { db } from '@/db';
import { taskLists, tasks } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { requireAuth, getInternalUser } from '@/lib/auth-server';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabaseUserId = await requireAuth(request);
    const user = await getInternalUser(supabaseUserId);

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const { id } = await params;
    const body = await request.json();

    // Verify ownership
    const list = await db.query.taskLists.findFirst({
      where: and(eq(taskLists.id, id), eq(taskLists.userId, user.id)),
    });

    if (!list) {
      return Response.json({ error: 'List not found or unauthorized' }, { status: 404 });
    }

    const updated = await db
      .update(taskLists)
      .set({
        name: body.name !== undefined ? body.name : list.name,
        color: body.color !== undefined ? body.color : list.color,
        icon: body.icon !== undefined ? body.icon : list.icon,
        order: body.order !== undefined ? body.order : list.order,
        archived: body.archived !== undefined ? body.archived : list.archived,
        archivedAt:
          body.archivedAt !== undefined
            ? body.archivedAt
              ? new Date(body.archivedAt)
              : null
            : list.archivedAt,
      })
      .where(eq(taskLists.id, id))
      .returning();

    return Response.json(updated[0]);
  } catch (error) {
    console.error('PATCH /api/task-lists/[id] error:', error);
    return Response.json({ error: 'Failed to update list' }, { status: 500 });
  }
}

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

    // Verify ownership
    const list = await db.query.taskLists.findFirst({
      where: and(eq(taskLists.id, id), eq(taskLists.userId, user.id)),
    });

    if (!list) {
      return Response.json({ error: 'List not found or unauthorized' }, { status: 404 });
    }

    // Delete the list (cascade takes care of it or sets list_id to null per schema)
    await db.delete(taskLists).where(eq(taskLists.id, id));

    return Response.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/task-lists/[id] error:', error);
    return Response.json({ error: 'Failed to delete list' }, { status: 500 });
  }
}
