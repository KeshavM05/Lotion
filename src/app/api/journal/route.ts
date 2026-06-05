import { NextRequest } from 'next/server';
import { db } from '@/db';
import { journalEntries } from '@/db/schema';
import { requireAuth, getInternalUser } from '@/lib/auth-server';
import { eq } from 'drizzle-orm';

// GET /api/journal - Get all journal entries for user
export async function GET(request: NextRequest) {
  try {
    const supabaseUserId = await requireAuth(request);
    const user = await getInternalUser(supabaseUserId);

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const entries = await db.query.journalEntries.findMany({
      where: eq(journalEntries.userId, user.id),
      orderBy: (journalEntries, { desc }) => [desc(journalEntries.createdAt)],
    });

    return Response.json(entries);
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('GET /api/journal error:', error);
    return Response.json({ error: 'Failed to fetch journal entries' }, { status: 500 });
  }
}

// POST /api/journal - Create new journal entry
export async function POST(request: NextRequest) {
  try {
    const supabaseUserId = await requireAuth(request);
    const user = await getInternalUser(supabaseUserId);

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { content, mood, linkedGoalIds } = body;

    if (!content) {
      return Response.json({ error: 'Missing required field: content' }, { status: 400 });
    }

    const [entry] = await db
      .insert(journalEntries)
      .values({
        userId: user.id,
        content,
        mood: mood || null,
        linkedGoalIds: linkedGoalIds || [],
      })
      .returning();

    return Response.json(entry, { status: 201 });
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('POST /api/journal error:', error);
    return Response.json({ error: 'Failed to create journal entry' }, { status: 500 });
  }
}
