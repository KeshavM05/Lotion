import { BedrockRuntimeClient, ConverseCommand } from '@aws-sdk/client-bedrock-runtime';
import { NextRequest } from 'next/server';
import { env } from '@/lib/env';
import { requireAuth, getInternalUser } from '@/lib/auth-server';
import { db } from '@/db';
import { wikiPages, wikiLog } from '@/db/schema';
import { eq } from 'drizzle-orm';

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

const MODEL_ID = 'us.anthropic.claude-sonnet-4-6-v1';

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

  const { question } = await request.json();
  if (!question) {
    return Response.json({ error: 'question is required' }, { status: 400 });
  }

  // Get all wiki pages for this user
  const pages = await db.select().from(wikiPages).where(eq(wikiPages.userId, user.id));

  if (pages.length === 0) {
    return Response.json({
      answer:
        'Your knowledge base is empty. Add some sources first, then I can answer questions from your accumulated knowledge.',
      citations: [],
    });
  }

  if (!bedrock) {
    // Simple keyword search fallback
    const lower = question.toLowerCase();
    const relevant = pages.filter(
      (p) => p.title.toLowerCase().includes(lower) || p.content.toLowerCase().includes(lower)
    );
    const answer =
      relevant.length > 0
        ? `Found ${relevant.length} relevant page(s):\n\n${relevant.map((p) => `**${p.title}**\n${p.content.slice(0, 200)}...`).join('\n\n')}`
        : 'No relevant pages found for your question. Try adding more sources.';

    await db.insert(wikiLog).values({
      userId: user.id,
      action: 'query',
      description: `Query: "${question}" (fallback mode)`,
      pagesAffected: relevant.map((p) => p.slug),
    });

    return Response.json({ answer, citations: relevant.map((p) => p.slug) });
  }

  try {
    // Build wiki context (truncate if too large)
    const wikiContext = pages
      .map((p) => `## [[${p.slug}]] — ${p.title}\n${p.content}`)
      .join('\n\n---\n\n')
      .slice(0, 30000);

    const systemPrompt = `You are a knowledge base assistant. Answer the user's question using ONLY the information in their wiki pages below. Cite your sources using [[page-slug]] notation.

If the answer cannot be found in the wiki, say so clearly and suggest what sources might help.

Be concise, specific, and well-structured. Use markdown formatting.

## Wiki Contents
${wikiContext}`;

    const command = new ConverseCommand({
      modelId: MODEL_ID,
      system: [{ text: systemPrompt }],
      messages: [
        {
          role: 'user',
          content: [{ text: question }],
        },
      ],
      inferenceConfig: {
        maxTokens: 2048,
        temperature: 0.4,
      },
    });

    const response = await bedrock.send(command);
    const answer = response.output?.message?.content?.[0]?.text || 'Unable to generate an answer.';

    // Extract cited pages
    const citedSlugs = [...answer.matchAll(/\[\[([^\]]+)\]\]/g)].map((m) => m[1]);

    // Log the query
    await db.insert(wikiLog).values({
      userId: user.id,
      action: 'query',
      description: `Query: "${question.slice(0, 100)}"`,
      pagesAffected: citedSlugs,
    });

    return Response.json({ answer, citations: citedSlugs });
  } catch (error) {
    console.error('Query error:', error);
    return Response.json({ error: 'Query failed' }, { status: 500 });
  }
}
