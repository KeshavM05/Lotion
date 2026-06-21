import { NextRequest } from 'next/server';
import { db } from '@/db';
import { chatSessions } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { requireAuth, getInternalUser } from '@/lib/auth-server';

export async function GET(request: NextRequest) {
  let supabaseUserId: string;
  try {
    supabaseUserId = await requireAuth(request);
  } catch (error) {
    if (error instanceof Response) return error;
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await getInternalUser(supabaseUserId);
  if (!user) return Response.json({ error: 'User not found' }, { status: 404 });

  const sessions = await db.query.chatSessions.findMany({
    where: eq(chatSessions.userId, user.id),
    orderBy: [desc(chatSessions.updatedAt)],
  });

  return Response.json(sessions);
}

export async function POST(request: NextRequest) {
  let supabaseUserId: string;
  try {
    supabaseUserId = await requireAuth(request);
  } catch (error) {
    if (error instanceof Response) return error;
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await getInternalUser(supabaseUserId);
  if (!user) return Response.json({ error: 'User not found' }, { status: 404 });

  const body = await request.json();
  const { title, folderId, goalId } = body;

  const [session] = await db
    .insert(chatSessions)
    .values({
      userId: user.id,
      title: title || 'New Chat',
      folderId: folderId || null,
      goalId: goalId || null,
    })
    .returning();

  return Response.json(session, { status: 201 });
}
