import { NextRequest } from 'next/server';
import { requireAuth, getInternalUser } from '@/lib/auth-server';
import { executeToolCall } from '@/lib/ai-tools';

interface ActionConfirmation {
  id: string;
  tool: string;
  status: 'accepted' | 'rejected';
  input?: Record<string, unknown>;
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
  const { actions } = body as { actions: ActionConfirmation[] };

  if (!actions?.length) {
    return Response.json({ error: 'No actions provided' }, { status: 400 });
  }

  const results: Array<{ id: string; status: string; summary?: string }> = [];

  for (const action of actions) {
    if (action.status === 'rejected') {
      results.push({ id: action.id, status: 'rejected' });
      continue;
    }

    if (!action.input) {
      results.push({ id: action.id, status: 'error', summary: 'Missing input' });
      continue;
    }

    try {
      const result = await executeToolCall(action.tool, action.input, user.id);
      results.push({ id: action.id, status: 'completed', summary: result.summary });
    } catch (err) {
      results.push({
        id: action.id,
        status: 'error',
        summary: err instanceof Error ? err.message : 'Execution failed',
      });
    }
  }

  return Response.json({ results });
}
