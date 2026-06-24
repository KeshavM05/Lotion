import { NextRequest } from 'next/server';
import { requireAuth, getInternalUser, AuthError } from '@/lib/auth-server';
import { indexContent, removeEmbeddings } from '@/lib/context-engine';
import { z } from 'zod';

const indexRequestSchema = z.object({
  action: z.enum(['index', 'remove']),
  source: z.enum(['journal', 'chat', 'goal', 'task', 'memory']),
  sourceId: z.string().optional(),
  content: z.string().max(10000).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

/**
 * POST /api/ai/index-content
 * Index content into the embedding store for semantic retrieval.
 * Called when journal entries, goals, or chat messages are created/updated.
 */
export async function POST(request: NextRequest) {
  try {
    const supabaseUserId = await requireAuth(request);
    const user = await getInternalUser(supabaseUserId);
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const parsed = indexRequestSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: 'Invalid request', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { action, source, sourceId, content, metadata } = parsed.data;

    if (action === 'index') {
      if (!content) {
        return Response.json({ error: 'Content is required for indexing' }, { status: 400 });
      }
      await indexContent(user.id, source, content, sourceId, metadata);
      return Response.json({ success: true });
    }

    if (action === 'remove') {
      if (!sourceId) {
        return Response.json({ error: 'sourceId is required for removal' }, { status: 400 });
      }
      await removeEmbeddings(user.id, source, sourceId);
      return Response.json({ success: true });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    if (error instanceof AuthError)
      return Response.json({ error: error.message }, { status: error.status });
    console.error('Index content error:', error);
    return Response.json({ error: 'Failed to index content' }, { status: 500 });
  }
}
