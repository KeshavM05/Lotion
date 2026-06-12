import { BedrockRuntimeClient, ConverseCommand } from '@aws-sdk/client-bedrock-runtime';
import { env } from '@/lib/env';
import { indexContent, summarizeAndIndexConversation, consolidateMemories } from './context-engine';

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

const EXTRACTION_MODEL = 'us.anthropic.claude-haiku-3-20240307-v1:0';

/**
 * Extract memorable facts/insights from a conversation and store as embeddings.
 * Also summarizes the conversation for session continuity.
 * Uses Claude Haiku (cheap & fast) for extraction.
 */
export async function extractAndStoreMemories(
  userId: string,
  conversationMessages: { role: string; content: string }[],
  goalId?: string | null
): Promise<void> {
  if (!bedrock || conversationMessages.length < 2) return;

  const recentMessages = conversationMessages.slice(-8);
  const conversationText = recentMessages.map((m) => `${m.role}: ${m.content}`).join('\n\n');

  // Run memory extraction and conversation summarization in parallel
  await Promise.allSettled([
    extractMemories(userId, conversationText, goalId),
    summarizeConversation(userId, conversationText, goalId),
  ]);

  // Periodically consolidate (every ~20 conversations, non-blocking)
  if (Math.random() < 0.05) {
    consolidateMemories(userId).catch(() => {});
  }
}

async function extractMemories(
  userId: string,
  conversationText: string,
  goalId?: string | null
): Promise<void> {
  if (!bedrock) return;

  const command = new ConverseCommand({
    modelId: EXTRACTION_MODEL,
    system: [
      {
        text: `You extract key facts and insights from conversations that would be useful to remember for future interactions. Output ONLY a JSON object with two fields:
- "memories": array of concise facts/insights (max 200 chars each)
- "updates": array of objects {old: "fact to update", new: "updated fact"} for corrections

Extract things like:
- User preferences, habits, routines
- Important life events or milestones mentioned
- Emotional states or challenges
- Decisions made or commitments stated
- Key deadlines or dates mentioned
- Corrections to previously stated information

If nothing noteworthy: {"memories": [], "updates": []}
Return ONLY valid JSON.`,
      },
    ],
    messages: [
      {
        role: 'user',
        content: [{ text: `Extract from this conversation:\n\n${conversationText}` }],
      },
    ],
    inferenceConfig: { maxTokens: 512, temperature: 0.1 },
  });

  try {
    const response = await bedrock.send(command);
    const text = response.output?.message?.content?.[0]?.text || '{}';

    const parsed = JSON.parse(text);
    const memories: string[] = parsed.memories || parsed || [];
    const updates: { old: string; new: string }[] = parsed.updates || [];

    // Store new memories
    const memoryArray = Array.isArray(memories) ? memories : [];
    for (const memory of memoryArray.slice(0, 5)) {
      if (typeof memory === 'string' && memory.trim().length > 10) {
        await indexContent(userId, 'memory', memory.trim(), undefined, {
          goalId: goalId ?? undefined,
          extractedAt: new Date().toISOString(),
        });
      }
    }

    // Process updates (corrections) — re-index with updated content
    for (const update of updates.slice(0, 3)) {
      if (update.new && update.new.trim().length > 10) {
        await indexContent(userId, 'memory', update.new.trim(), undefined, {
          goalId: goalId ?? undefined,
          extractedAt: new Date().toISOString(),
          updatedFrom: update.old,
        });
      }
    }
  } catch (err) {
    console.warn('Memory extraction failed (non-fatal):', err);
  }
}

async function summarizeConversation(
  userId: string,
  conversationText: string,
  goalId?: string | null
): Promise<void> {
  if (!bedrock) return;

  // Only summarize if conversation is substantial (> 500 chars)
  if (conversationText.length < 500) return;

  const command = new ConverseCommand({
    modelId: EXTRACTION_MODEL,
    system: [
      {
        text: `Summarize this conversation in 1-2 sentences. Focus on: what was discussed, any decisions made, and what the user plans to do next. Be specific and concise. Output ONLY the summary text, no formatting.`,
      },
    ],
    messages: [
      {
        role: 'user',
        content: [{ text: conversationText }],
      },
    ],
    inferenceConfig: { maxTokens: 200, temperature: 0.1 },
  });

  try {
    const response = await bedrock.send(command);
    const summary = response.output?.message?.content?.[0]?.text;
    if (summary && summary.trim().length > 20) {
      await summarizeAndIndexConversation(userId, summary.trim(), goalId);
    }
  } catch (err) {
    console.warn('Conversation summarization failed (non-fatal):', err);
  }
}
