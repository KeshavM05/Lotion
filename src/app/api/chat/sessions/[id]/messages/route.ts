import { NextRequest } from 'next/server';
import { db } from '@/db';
import { chatMessages, chatSessions } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { requireAuth, getInternalUser, AuthError } from '@/lib/auth-server';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

  const { id: sessionId } = await params;

  // Verify session belongs to user
  const session = await db.query.chatSessions.findFirst({
    where: and(eq(chatSessions.id, sessionId), eq(chatSessions.userId, user.id)),
  });

  if (!session) return Response.json({ error: 'Session not found' }, { status: 404 });

  const body = await request.json();
  const { messages } = body as { messages: Array<{ role: 'user' | 'assistant'; content: string }> };

  if (!messages?.length) {
    return Response.json({ error: 'Messages required' }, { status: 400 });
  }

  const inserted = await db
    .insert(chatMessages)
    .values(
      messages.map((m) => ({
        userId: user.id,
        sessionId,
        goalId: session.goalId,
        role: m.role,
        content: m.content,
      }))
    )
    .returning();

  // Update session timestamp
  await db
    .update(chatSessions)
    .set({ updatedAt: new Date() })
    .where(eq(chatSessions.id, sessionId));

  return Response.json(inserted, { status: 201 });
}
