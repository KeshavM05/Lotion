import { NextRequest } from 'next/server';
import { requireAuth, getInternalUser, AuthError } from '@/lib/auth-server';
import { reindexUserData, getEmbeddingStats, consolidateMemories } from '@/lib/context-engine';

/**
 * POST /api/ai/reindex
 * Re-indexes all user data for semantic search. Idempotent.
 * Also consolidates duplicate memories.
 */
export async function POST(request: NextRequest) {
  try {
    const supabaseUserId = await requireAuth(request);
    const user = await getInternalUser(supabaseUserId);
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const { indexed } = await reindexUserData(user.id);
    const consolidated = await consolidateMemories(user.id);
    const stats = await getEmbeddingStats(user.id);

    return Response.json({ indexed, consolidated, stats });
  } catch (error) {
    if (error instanceof AuthError)
      return Response.json({ error: error.message }, { status: error.status });
    console.error('Reindex error:', error);
    return Response.json({ error: 'Failed to reindex' }, { status: 500 });
  }
}

/**
 * GET /api/ai/reindex
 * Get embedding stats for the user.
 */
export async function GET(request: NextRequest) {
  try {
    const supabaseUserId = await requireAuth(request);
    const user = await getInternalUser(supabaseUserId);
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const stats = await getEmbeddingStats(user.id);
    return Response.json({ stats });
  } catch (error) {
    if (error instanceof AuthError)
      return Response.json({ error: error.message }, { status: error.status });
    return Response.json({ error: 'Failed to get stats' }, { status: 500 });
  }
}
