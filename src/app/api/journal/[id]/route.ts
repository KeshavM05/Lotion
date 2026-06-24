import { NextRequest } from 'next/server';
import { db } from '@/db';
import { journalEntries } from '@/db/schema';
import { requireAuth, getInternalUser, AuthError } from '@/lib/auth-server';
import { validateBody } from '@/lib/api-middleware';
import { updateJournalEntrySchema } from '@/lib/validation/schemas';
import { eq, and } from 'drizzle-orm';

// PATCH /api/journal/[id] - Update journal entry
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabaseUserId = await requireAuth(request);
    const user = await getInternalUser(supabaseUserId);

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const { id } = await params;
    const { data, error } = await validateBody(request, updateJournalEntrySchema);
    if (error) return error;

    const [updated] = await db
      .update(journalEntries)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(and(eq(journalEntries.id, id), eq(journalEntries.userId, user.id)))
      .returning();

    if (!updated) {
      return Response.json({ error: 'Journal entry not found' }, { status: 404 });
    }

    return Response.json(updated);
  } catch (error) {
    if (error instanceof AuthError)
      return Response.json({ error: error.message }, { status: error.status });
    console.error('PATCH /api/journal/[id] error:', error);
    return Response.json({ error: 'Failed to update journal entry' }, { status: 500 });
  }
}

// DELETE /api/journal/[id] - Delete journal entry
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
      .delete(journalEntries)
      .where(and(eq(journalEntries.id, id), eq(journalEntries.userId, user.id)))
      .returning();

    if (!deleted) {
      return Response.json({ error: 'Journal entry not found' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError)
      return Response.json({ error: error.message }, { status: error.status });
    console.error('DELETE /api/journal/[id] error:', error);
    return Response.json({ error: 'Failed to delete journal entry' }, { status: 500 });
  }
}
