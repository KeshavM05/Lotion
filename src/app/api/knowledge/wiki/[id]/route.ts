import { NextRequest } from 'next/server';
import { requireAuth, getInternalUser, AuthError } from '@/lib/auth-server';
import { db } from '@/db';
import { wikiPages } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let supabaseUserId: string;
  try {
    supabaseUserId = await requireAuth(request);
  } catch (error) {
    if (error instanceof AuthError)
      return Response.json({ error: error.message }, { status: error.status });
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await getInternalUser(supabaseUserId);
  if (!user) return Response.json({ error: 'User not found' }, { status: 404 });

  const { id } = await params;

  await db.delete(wikiPages).where(and(eq(wikiPages.id, id), eq(wikiPages.userId, user.id)));

  return Response.json({ success: true });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let supabaseUserId: string;
  try {
    supabaseUserId = await requireAuth(request);
  } catch (error) {
    if (error instanceof AuthError)
      return Response.json({ error: error.message }, { status: error.status });
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await getInternalUser(supabaseUserId);
  if (!user) return Response.json({ error: 'User not found' }, { status: 404 });

  const { id } = await params;
  const body = await request.json();

  const [updated] = await db
    .update(wikiPages)
    .set({ ...body, updatedAt: new Date() })
    .where(and(eq(wikiPages.id, id), eq(wikiPages.userId, user.id)))
    .returning();

  if (!updated) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(updated);
}
