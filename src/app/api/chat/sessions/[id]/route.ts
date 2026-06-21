import { NextRequest } from 'next/server';
import { db } from '@/db';
import { chatSessions, chatMessages } from '@/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { requireAuth, getInternalUser } from '@/lib/auth-server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

  const session = await db.query.chatSessions.findFirst({
    where: and(eq(chatSessions.id, id), eq(chatSessions.userId, user.id)),
  });

  if (!session) return Response.json({ error: 'Session not found' }, { status: 404 });

  const messages = await db.query.chatMessages.findMany({
    where: eq(chatMessages.sessionId, id),
    orderBy: [asc(chatMessages.createdAt)],
  });

  return Response.json({ ...session, messages });
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
    .update(chatSessions)
    .set({
      ...(body.title !== undefined && { title: body.title }),
      ...(body.folderId !== undefined && { folderId: body.folderId }),
      ...(body.goalId !== undefined && { goalId: body.goalId }),
      updatedAt: new Date(),
    })
    .where(and(eq(chatSessions.id, id), eq(chatSessions.userId, user.id)))
    .returning();

  if (!updated) return Response.json({ error: 'Session not found' }, { status: 404 });

  return Response.json(updated);
}

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
    .delete(chatSessions)
    .where(and(eq(chatSessions.id, id), eq(chatSessions.userId, user.id)));

  return new Response(null, { status: 204 });
}
