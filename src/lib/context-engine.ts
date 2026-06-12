import { db } from '@/db';
import { contextEmbeddings, chatMessages, goals, journalEntries } from '@/db/schema';
import { eq, and, sql, desc, inArray } from 'drizzle-orm';
import { generateEmbedding } from './embeddings';

type EmbeddingSource = 'journal' | 'chat' | 'goal' | 'task' | 'memory';

// --- Core CRUD ---

/**
 * Store a piece of content with its embedding for later semantic retrieval.
 */
export async function indexContent(
  userId: string,
  source: EmbeddingSource,
  content: string,
  sourceId?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  const embedding = await generateEmbedding(content);

  // Upsert: if same sourceId exists, replace it
  if (sourceId) {
    const existing = await db
      .select({ id: contextEmbeddings.id })
      .from(contextEmbeddings)
      .where(
        and(
          eq(contextEmbeddings.userId, userId),
          eq(contextEmbeddings.source, source),
          eq(contextEmbeddings.sourceId, sourceId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(contextEmbeddings)
        .set({ content, embedding, metadata: metadata ?? {}, createdAt: new Date() })
        .where(eq(contextEmbeddings.id, existing[0].id));
      return;
    }
  }

  await db.insert(contextEmbeddings).values({
    userId,
    source,
    sourceId: sourceId ?? null,
    content,
    embedding,
    metadata: metadata ?? {},
  });
}

/**
 * Remove all embeddings for a specific source record.
 */
export async function removeEmbeddings(
  userId: string,
  source: EmbeddingSource,
  sourceId: string
): Promise<void> {
  await db
    .delete(contextEmbeddings)
    .where(
      and(
        eq(contextEmbeddings.userId, userId),
        eq(contextEmbeddings.source, source),
        eq(contextEmbeddings.sourceId, sourceId)
      )
    );
}

// --- Tiered Context Retrieval (L0 / L1 / L2) ---

/**
 * L0: Always-loaded context — user's AI memory doc + active goal summaries.
 * This is cheap (no embedding search), always included.
 */
async function getL0Context(userId: string, goalId?: string | null): Promise<string> {
  const parts: string[] = [];

  // Recent memories (last 10, always loaded)
  const memories = await db
    .select({ content: contextEmbeddings.content })
    .from(contextEmbeddings)
    .where(and(eq(contextEmbeddings.userId, userId), eq(contextEmbeddings.source, 'memory')))
    .orderBy(desc(contextEmbeddings.createdAt))
    .limit(10);

  if (memories.length > 0) {
    parts.push('**Memories:**\n' + memories.map((m) => `- ${m.content}`).join('\n'));
  }

  // If in a goal context, load recent goal-specific memories
  if (goalId) {
    const goalMemories = await db
      .select({ content: contextEmbeddings.content })
      .from(contextEmbeddings)
      .where(
        and(
          eq(contextEmbeddings.userId, userId),
          eq(contextEmbeddings.source, 'memory'),
          sql`${contextEmbeddings.metadata}->>'goalId' = ${goalId}`
        )
      )
      .orderBy(desc(contextEmbeddings.createdAt))
      .limit(5);

    if (goalMemories.length > 0) {
      parts.push(
        '**Goal-specific memories:**\n' + goalMemories.map((m) => `- ${m.content}`).join('\n')
      );
    }
  }

  return parts.join('\n\n');
}

/**
 * L1: Session-relevant context — recent conversation summary for continuity.
 * Loads the last few chat messages for the current session.
 */
async function getL1Context(userId: string, goalId?: string | null): Promise<string> {
  // Get recent chat history summary (last 3 conversations condensed)
  const recentChats = await db
    .select({ content: contextEmbeddings.content, createdAt: contextEmbeddings.createdAt })
    .from(contextEmbeddings)
    .where(and(eq(contextEmbeddings.userId, userId), eq(contextEmbeddings.source, 'chat')))
    .orderBy(desc(contextEmbeddings.createdAt))
    .limit(3);

  if (recentChats.length === 0) return '';

  return (
    '**Recent conversation summaries:**\n' + recentChats.map((c) => `- ${c.content}`).join('\n')
  );
}

/**
 * L2: Semantic search — deep retrieval based on the user's current query.
 * Most expensive tier, uses embedding similarity.
 */
async function getL2Context(
  userId: string,
  query: string,
  limit: number = 5,
  scoreThreshold: number = 0.35
): Promise<string> {
  const queryEmbedding = await generateEmbedding(query);

  const results = await db
    .select({
      content: contextEmbeddings.content,
      source: contextEmbeddings.source,
      similarity:
        sql<number>`1 - (${contextEmbeddings.embedding} <=> ${JSON.stringify(queryEmbedding)}::vector)`.as(
          'similarity'
        ),
    })
    .from(contextEmbeddings)
    .where(eq(contextEmbeddings.userId, userId))
    .orderBy(sql`${contextEmbeddings.embedding} <=> ${JSON.stringify(queryEmbedding)}::vector`)
    .limit(limit);

  const relevant = results.filter((r) => r.similarity >= scoreThreshold);
  if (relevant.length === 0) return '';

  const sourceLabels: Record<string, string> = {
    journal: 'Journal',
    chat: 'Past Conversation',
    goal: 'Goal',
    task: 'Task',
    memory: 'Memory',
  };

  return relevant
    .map(
      (r) =>
        `[${sourceLabels[r.source] ?? r.source}, ${Math.round(r.similarity * 100)}% match] ${r.content}`
    )
    .join('\n\n');
}

/**
 * Main retrieval function — assembles context from all three tiers.
 * Respects a token budget to avoid overloading the prompt.
 */
export async function retrieveRelevantContext(
  userId: string,
  query: string,
  goalId?: string | null,
  tokenBudget: number = 2000
): Promise<string | undefined> {
  // Rough token estimation: 1 token ≈ 4 chars
  const charBudget = tokenBudget * 4;

  let context = '';

  // L0: Always loaded (memories, goal context)
  const l0 = await getL0Context(userId, goalId);
  if (l0) context += l0;

  // L1: Session continuity
  if (context.length < charBudget * 0.6) {
    const l1 = await getL1Context(userId, goalId);
    if (l1) context += '\n\n' + l1;
  }

  // L2: Semantic search (only if we have budget left)
  if (context.length < charBudget * 0.8) {
    const remainingBudget = charBudget - context.length;
    const l2Limit = Math.min(5, Math.max(2, Math.floor(remainingBudget / 400)));
    const l2 = await getL2Context(userId, query, l2Limit);
    if (l2) context += '\n\n**Relevant context:**\n' + l2;
  }

  // Truncate if over budget
  if (context.length > charBudget) {
    context = context.slice(0, charBudget) + '...';
  }

  return context.trim() || undefined;
}

// --- Memory Evolution ---

/**
 * Deduplicate and merge similar memories to prevent bloat.
 * Groups memories by similarity and keeps the most recent/comprehensive version.
 */
export async function consolidateMemories(userId: string): Promise<number> {
  const allMemories = await db
    .select({
      id: contextEmbeddings.id,
      content: contextEmbeddings.content,
      embedding: contextEmbeddings.embedding,
      createdAt: contextEmbeddings.createdAt,
    })
    .from(contextEmbeddings)
    .where(and(eq(contextEmbeddings.userId, userId), eq(contextEmbeddings.source, 'memory')))
    .orderBy(desc(contextEmbeddings.createdAt));

  if (allMemories.length < 10) return 0;

  // Find duplicate pairs (similarity > 0.85)
  const toDelete: string[] = [];
  const processed = new Set<number>();

  for (let i = 0; i < allMemories.length; i++) {
    if (processed.has(i)) continue;
    for (let j = i + 1; j < allMemories.length; j++) {
      if (processed.has(j)) continue;
      // Check similarity via DB
      const [sim] = await db
        .select({
          similarity:
            sql<number>`1 - (${JSON.stringify(allMemories[i].embedding)}::vector <=> ${JSON.stringify(allMemories[j].embedding)}::vector)`.as(
              'sim'
            ),
        })
        .from(sql`(SELECT 1) as t`);

      if (sim.similarity > 0.85) {
        // Keep the newer/longer one, delete the other
        const keep = allMemories[i].content.length >= allMemories[j].content.length ? i : j;
        const remove = keep === i ? j : i;
        toDelete.push(allMemories[remove].id);
        processed.add(remove);
      }
    }
  }

  if (toDelete.length > 0) {
    await db.delete(contextEmbeddings).where(inArray(contextEmbeddings.id, toDelete));
  }

  // Also prune if total memories > 100 (keep most recent 80)
  if (allMemories.length - toDelete.length > 100) {
    const oldIds = allMemories
      .filter((m) => !toDelete.includes(m.id))
      .slice(80)
      .map((m) => m.id);
    if (oldIds.length > 0) {
      await db.delete(contextEmbeddings).where(inArray(contextEmbeddings.id, oldIds));
    }
    return toDelete.length + oldIds.length;
  }

  return toDelete.length;
}

// --- Conversation Summarization ---

/**
 * Summarize a batch of chat messages into a single embedding.
 * Called when conversations grow long, to compress history.
 */
export async function summarizeAndIndexConversation(
  userId: string,
  summary: string,
  goalId?: string | null
): Promise<void> {
  await indexContent(userId, 'chat', summary, undefined, {
    goalId: goalId ?? undefined,
    summarizedAt: new Date().toISOString(),
    type: 'conversation_summary',
  });
}

// --- Bulk Indexing ---

/**
 * Re-index all of a user's data (goals, journal, etc.)
 * Used for initial setup or periodic refresh.
 */
export async function reindexUserData(userId: string): Promise<{ indexed: number }> {
  let count = 0;

  // Index all goals
  const userGoals = await db.select().from(goals).where(eq(goals.userId, userId));

  for (const goal of userGoals) {
    const text = `Goal: ${goal.title}${goal.description ? ` — ${goal.description}` : ''} (${goal.category}, ${goal.priority} priority, ${goal.status})`;
    await indexContent(userId, 'goal', text, goal.id, { category: goal.category });
    count++;
  }

  // Index recent journal entries (last 30)
  const entries = await db
    .select()
    .from(journalEntries)
    .where(eq(journalEntries.userId, userId))
    .orderBy(desc(journalEntries.createdAt))
    .limit(30);

  for (const entry of entries) {
    await indexContent(userId, 'journal', entry.content, entry.id, {
      mood: entry.mood ?? undefined,
      date: entry.createdAt.toISOString(),
    });
    count++;
  }

  return { indexed: count };
}

// --- Stats ---

export async function getEmbeddingCount(userId: string): Promise<number> {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(contextEmbeddings)
    .where(eq(contextEmbeddings.userId, userId));
  return result[0]?.count ?? 0;
}

export async function getEmbeddingStats(userId: string) {
  const results = await db
    .select({
      source: contextEmbeddings.source,
      count: sql<number>`count(*)`,
    })
    .from(contextEmbeddings)
    .where(eq(contextEmbeddings.userId, userId))
    .groupBy(contextEmbeddings.source);

  return Object.fromEntries(results.map((r) => [r.source, r.count]));
}
