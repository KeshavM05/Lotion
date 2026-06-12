import { NextRequest } from 'next/server';
import { db } from '@/db';
import { journalEntries } from '@/db/schema';
import { requireAuth, getInternalUser } from '@/lib/auth-server';
import { validateBody } from '@/lib/api-middleware';
import { createJournalEntrySchema } from '@/lib/validation/schemas';
import { eq } from 'drizzle-orm';
import { indexContent } from '@/lib/context-engine';

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

    const { data, error } = await validateBody(request, createJournalEntrySchema);
    if (error) return error;

    const { content, mood, linkedGoalIds } = data;

    const [entry] = await db
      .insert(journalEntries)
      .values({
        userId: user.id,
        content,
        mood: mood ?? null,
        linkedGoalIds: linkedGoalIds ?? [],
      })
      .returning();

    // Index journal entry for semantic retrieval (fire-and-forget)
    indexContent(user.id, 'journal', content, entry.id, {
      mood: mood ?? undefined,
      date: entry.createdAt.toISOString(),
    }).catch(() => {});

    return Response.json(entry, { status: 201 });
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('POST /api/journal error:', error);
    return Response.json({ error: 'Failed to create journal entry' }, { status: 500 });
  }
}
