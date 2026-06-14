import { BedrockRuntimeClient, ConverseCommand } from '@aws-sdk/client-bedrock-runtime';
import { NextRequest } from 'next/server';
import { env } from '@/lib/env';
import { requireAuth, getInternalUser } from '@/lib/auth-server';
import { db } from '@/db';
import { knowledgeSources, wikiPages, wikiLog } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

const bedrock =
  env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY
    ? new BedrockRuntimeClient({
        region: env.AWS_REGION,
        credentials: {
          accessKeyId: env.AWS_ACCESS_KEY_ID,
          secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        },
      })
    : null;

const MODEL_ID = 'us.anthropic.claude-sonnet-4-20250514-v1:0';

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

  const { sourceId } = await request.json();
  if (!sourceId) {
    return Response.json({ error: 'sourceId is required' }, { status: 400 });
  }

  // Get the source
  const [source] = await db
    .select()
    .from(knowledgeSources)
    .where(and(eq(knowledgeSources.id, sourceId), eq(knowledgeSources.userId, user.id)));

  if (!source) {
    return Response.json({ error: 'Source not found' }, { status: 404 });
  }

  // Mark as processing
  await db
    .update(knowledgeSources)
    .set({ status: 'processing' })
    .where(eq(knowledgeSources.id, sourceId));

  if (!bedrock) {
    // Fallback: create a basic summary page without AI
    const slug = source.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const [page] = await db
      .insert(wikiPages)
      .values({
        userId: user.id,
        slug,
        title: source.title,
        content: `# ${source.title}\n\n## Summary\n${source.content.slice(0, 1000)}\n\n## Source\n- Type: ${source.sourceType}\n- Added: ${new Date(source.createdAt).toLocaleDateString()}`,
        category: 'summary',
        linkedSourceIds: [sourceId],
        linkedPageSlugs: [],
        metadata: { sourceType: source.sourceType },
      })
      .returning();

    await db
      .update(knowledgeSources)
      .set({ status: 'ingested' })
      .where(eq(knowledgeSources.id, sourceId));

    await db.insert(wikiLog).values({
      userId: user.id,
      action: 'ingest',
      description: `Ingested "${source.title}" (fallback mode — AI not configured)`,
      pagesAffected: [slug],
    });

    return Response.json({ pages: [page], mode: 'fallback' });
  }

  try {
    // Get existing wiki pages for context
    const existingPages = await db
      .select({ slug: wikiPages.slug, title: wikiPages.title })
      .from(wikiPages)
      .where(eq(wikiPages.userId, user.id));

    const existingIndex = existingPages.map((p) => `- [[${p.slug}]]: ${p.title}`).join('\n');

    const systemPrompt = `You are a knowledge base curator. Your job is to ingest a raw source document and produce structured wiki pages.

Given a source document, you must:
1. Extract the key concepts, entities, and insights
2. Produce 1-3 wiki pages (as JSON) that capture the knowledge
3. Each page should have: slug (url-safe), title, content (markdown), category (one of: concept, entity, summary, comparison, synthesis), linkedPageSlugs (references to existing pages)

Existing wiki pages for cross-referencing:
${existingIndex || '(none yet)'}

Respond ONLY with a JSON array of page objects. No explanation outside the JSON.
Example:
[
  {
    "slug": "machine-learning-basics",
    "title": "Machine Learning Basics",
    "content": "# Machine Learning Basics\\n\\n## Key Ideas\\n...",
    "category": "concept",
    "linkedPageSlugs": ["neural-networks"]
  }
]`;

    const command = new ConverseCommand({
      modelId: MODEL_ID,
      system: [{ text: systemPrompt }],
      messages: [
        {
          role: 'user',
          content: [
            {
              text: `Source title: ${source.title}\nSource type: ${source.sourceType}\n\nContent:\n${source.content.slice(0, 8000)}`,
            },
          ],
        },
      ],
      inferenceConfig: {
        maxTokens: 4096,
        temperature: 0.3,
      },
    });

    const response = await bedrock.send(command);
    const rawText = response.output?.message?.content?.[0]?.text || '[]';

    // Parse the AI response
    let pages: Array<{
      slug: string;
      title: string;
      content: string;
      category: string;
      linkedPageSlugs?: string[];
    }>;

    try {
      // Extract JSON from the response (handle markdown code blocks)
      const jsonMatch = rawText.match(/\[[\s\S]*\]/);
      pages = JSON.parse(jsonMatch ? jsonMatch[0] : rawText);
    } catch {
      // If parsing fails, create a single summary page
      pages = [
        {
          slug: source.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, ''),
          title: source.title,
          content: rawText,
          category: 'summary',
          linkedPageSlugs: [],
        },
      ];
    }

    // Insert wiki pages
    const createdPages = [];
    for (const page of pages) {
      const [created] = await db
        .insert(wikiPages)
        .values({
          userId: user.id,
          slug: page.slug,
          title: page.title,
          content: page.content,
          category: page.category as any,
          linkedSourceIds: [sourceId],
          linkedPageSlugs: page.linkedPageSlugs || [],
          metadata: { sourceType: source.sourceType },
        })
        .returning();
      createdPages.push(created);
    }

    // Mark source as ingested
    await db
      .update(knowledgeSources)
      .set({ status: 'ingested' })
      .where(eq(knowledgeSources.id, sourceId));

    // Log the ingest
    await db.insert(wikiLog).values({
      userId: user.id,
      action: 'ingest',
      description: `Ingested "${source.title}" → ${createdPages.length} page(s) created`,
      pagesAffected: createdPages.map((p) => p.slug),
    });

    return Response.json({ pages: createdPages, mode: 'ai' });
  } catch (error) {
    console.error('Ingest error:', error);
    await db
      .update(knowledgeSources)
      .set({ status: 'failed' })
      .where(eq(knowledgeSources.id, sourceId));
    return Response.json({ error: 'Ingest failed' }, { status: 500 });
  }
}
