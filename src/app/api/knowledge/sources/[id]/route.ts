import { NextRequest } from 'next/server';
import { requireAuth, getInternalUser } from '@/lib/auth-server';
import { db } from '@/db';
import { knowledgeSources } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let supabaseUserId: string;
  try {
    supabaseUserId = await requireAuth(request);
  } catch (error) {
    if (error instanceof Response) return error;
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await getInternalUser(supabaseUserId);
  if (!user) return Response.json({ error: 'User not found' }, { status: 404 });

  const { id } = await params;

  await db
    .delete(knowledgeSources)
    .where(and(eq(knowledgeSources.id, id), eq(knowledgeSources.userId, user.id)));

  return Response.json({ success: true });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let supabaseUserId: string;
  try {
    supabaseUserId = await requireAuth(request);
  } catch (error) {
    if (error instanceof Response) return error;
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await getInternalUser(supabaseUserId);
  if (!user) return Response.json({ error: 'User not found' }, { status: 404 });

  const { id } = await params;
  const body = await request.json();

  const [updated] = await db
    .update(knowledgeSources)
    .set(body)
    .where(and(eq(knowledgeSources.id, id), eq(knowledgeSources.userId, user.id)))
    .returning();

  if (!updated) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(updated);
}
