import { NextRequest } from 'next/server';
import { requireAuth, getInternalUser, AuthError } from '@/lib/auth-server';
import { db } from '@/db';
import { knowledgeSources } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
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

  const sources = await db
    .select()
    .from(knowledgeSources)
    .where(eq(knowledgeSources.userId, user.id))
    .orderBy(desc(knowledgeSources.createdAt));

  return Response.json(sources);
}

export async function POST(request: NextRequest) {
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

  const body = await request.json();
  const { title, content, sourceType, metadata } = body;

  if (!title || !content || !sourceType) {
    return Response.json({ error: 'title, content, and sourceType are required' }, { status: 400 });
  }

  const [source] = await db
    .insert(knowledgeSources)
    .values({
      userId: user.id,
      title,
      content,
      sourceType,
      metadata: metadata || {},
      status: 'pending',
    })
    .returning();

  return Response.json(source, { status: 201 });
}
