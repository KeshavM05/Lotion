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

  const pages = await db.select().from(wikiPages).where(eq(wikiPages.userId, user.id));

  if (pages.length === 0) {
    return Response.json({ report: 'No wiki pages to lint.', issues: [] });
  }

  // Basic structural lint (works without AI)
  const issues: Array<{ type: string; description: string; page?: string }> = [];

  // Find orphan pages (no inbound links)
  const allLinked = new Set(pages.flatMap((p) => p.linkedPageSlugs as string[]));
  const orphans = pages.filter((p) => !allLinked.has(p.slug));
  orphans.forEach((p) => {
    issues.push({ type: 'orphan', description: `"${p.title}" has no inbound links`, page: p.slug });
  });

  // Find broken links
  const allSlugs = new Set(pages.map((p) => p.slug));
  pages.forEach((p) => {
    const linked = p.linkedPageSlugs as string[];
    linked.forEach((slug) => {
      if (!allSlugs.has(slug)) {
        issues.push({
          type: 'broken_link',
          description: `"${p.title}" links to non-existent [[${slug}]]`,
          page: p.slug,
        });
      }
    });
  });

  // Find short/stub pages
  pages.forEach((p) => {
    if (p.content.length < 100) {
      issues.push({
        type: 'stub',
        description: `"${p.title}" is very short (${p.content.length} chars)`,
        page: p.slug,
      });
    }
  });

  if (!bedrock) {
    const report =
      issues.length > 0
        ? `Found ${issues.length} issue(s):\n\n${issues.map((i) => `- **${i.type}**: ${i.description}`).join('\n')}`
        : 'No structural issues found. Wiki looks healthy!';

    await db.insert(wikiLog).values({
      userId: user.id,
      action: 'lint',
      description: `Health check: ${issues.length} issue(s) found (structural only)`,
      pagesAffected: [...new Set(issues.map((i) => i.page).filter(Boolean) as string[])],
    });

    return Response.json({ report, issues, mode: 'structural' });
  }

  try {
    // AI-powered deep lint
    const wikiContext = pages
      .map((p) => `## [[${p.slug}]] — ${p.title} (${p.category})\n${p.content.slice(0, 500)}`)
      .join('\n\n---\n\n')
      .slice(0, 20000);

    const systemPrompt = `You are a wiki health checker. Analyze the following wiki pages and identify issues.

Look for:
1. Contradictions between pages
2. Stale or potentially outdated claims
3. Important concepts mentioned but lacking dedicated pages
4. Missing cross-references between related pages
5. Data gaps that could be filled
6. Suggestions for new pages or improvements

Respond with a JSON object: { "report": "markdown summary", "issues": [{ "type": "contradiction|gap|stale|suggestion", "description": "...", "page": "slug or null" }] }`;

    const command = new ConverseCommand({
      modelId: MODEL_ID,
      system: [{ text: systemPrompt }],
      messages: [
        {
          role: 'user',
          content: [
            {
              text: `Structural issues already found:\n${issues.map((i) => `- ${i.type}: ${i.description}`).join('\n')}\n\nWiki pages:\n${wikiContext}`,
            },
          ],
        },
      ],
      inferenceConfig: {
        maxTokens: 2048,
        temperature: 0.3,
      },
    });

    const response = await bedrock.send(command);
    const rawText = response.output?.message?.content?.[0]?.text || '{}';

    let aiResult: { report?: string; issues?: typeof issues };
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      aiResult = JSON.parse(jsonMatch ? jsonMatch[0] : rawText);
    } catch {
      aiResult = { report: rawText, issues: [] };
    }

    const allIssues = [...issues, ...(aiResult.issues || [])];

    await db.insert(wikiLog).values({
      userId: user.id,
      action: 'lint',
      description: `Health check: ${allIssues.length} issue(s) found`,
      pagesAffected: [...new Set(allIssues.map((i) => i.page).filter(Boolean) as string[])],
    });

    return Response.json({
      report: aiResult.report || `Found ${allIssues.length} issues.`,
      issues: allIssues,
      mode: 'ai',
    });
  } catch (error) {
    console.error('Lint error:', error);
    // Return structural issues even if AI fails
    await db.insert(wikiLog).values({
      userId: user.id,
      action: 'lint',
      description: `Health check: ${issues.length} structural issue(s) (AI failed)`,
      pagesAffected: [...new Set(issues.map((i) => i.page).filter(Boolean) as string[])],
    });

    return Response.json({
      report: `Found ${issues.length} structural issues.`,
      issues,
      mode: 'structural',
    });
  }
}
