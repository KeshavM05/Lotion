import { NextRequest } from 'next/server';
import { requireAuth, getInternalUser, AuthError } from '@/lib/auth-server';
import { db } from '@/db';
import { wikiPages } from '@/db/schema';
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

  const pages = await db
    .select()
    .from(wikiPages)
    .where(eq(wikiPages.userId, user.id))
    .orderBy(desc(wikiPages.updatedAt));

  return Response.json(pages);
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
  const { slug, title, content, category, linkedSourceIds, linkedPageSlugs, metadata } = body;

  if (!slug || !title || !content || !category) {
    return Response.json(
      { error: 'slug, title, content, and category are required' },
      { status: 400 }
    );
  }

  const [page] = await db
    .insert(wikiPages)
    .values({
      userId: user.id,
      slug,
      title,
      content,
      category,
      linkedSourceIds: linkedSourceIds || [],
      linkedPageSlugs: linkedPageSlugs || [],
      metadata: metadata || {},
    })
    .returning();

  return Response.json(page, { status: 201 });
}
