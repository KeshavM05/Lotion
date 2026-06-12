import { db } from '@/db';
import { contextEmbeddings } from '@/db/schema';
import { eq, and, sql, desc } from 'drizzle-orm';
import { generateEmbedding } from './embeddings';

type EmbeddingSource = 'journal' | 'chat' | 'goal' | 'task' | 'memory';

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
 * Retrieve the most relevant context for a query using cosine similarity.
 * Returns formatted text ready to inject into the AI system prompt.
 */
export async function retrieveRelevantContext(
  userId: string,
  query: string,
  goalId?: string | null,
  limit: number = 5,
  scoreThreshold: number = 0.3
): Promise<string | undefined> {
  const queryEmbedding = await generateEmbedding(query);

  // Use pgvector cosine distance operator (<=>)
  // 1 - distance = similarity (cosine distance is 1 - cosine similarity)
  const results = await db
    .select({
      content: contextEmbeddings.content,
      source: contextEmbeddings.source,
      similarity:
        sql<number>`1 - (${contextEmbeddings.embedding} <=> ${JSON.stringify(queryEmbedding)}::vector)`.as(
          'similarity'
        ),
      createdAt: contextEmbeddings.createdAt,
    })
    .from(contextEmbeddings)
    .where(eq(contextEmbeddings.userId, userId))
    .orderBy(sql`${contextEmbeddings.embedding} <=> ${JSON.stringify(queryEmbedding)}::vector`)
    .limit(limit);

  // Filter by score threshold
  const relevant = results.filter((r) => r.similarity >= scoreThreshold);

  if (relevant.length === 0) return undefined;

  // Format results with source labels
  const sourceLabels: Record<string, string> = {
    journal: 'Journal',
    chat: 'Past Conversation',
    goal: 'Goal Note',
    task: 'Task',
    memory: 'Memory',
  };

  const formatted = relevant
    .map((r) => `[${sourceLabels[r.source] ?? r.source}] ${r.content}`)
    .join('\n\n');

  return formatted;
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

/**
 * Get the count of embeddings for a user (for status display).
 */
export async function getEmbeddingCount(userId: string): Promise<number> {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(contextEmbeddings)
    .where(eq(contextEmbeddings.userId, userId));
  return result[0]?.count ?? 0;
}
