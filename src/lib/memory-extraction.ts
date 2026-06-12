import { BedrockRuntimeClient, ConverseCommand } from '@aws-sdk/client-bedrock-runtime';
import { env } from '@/lib/env';
import { indexContent } from './context-engine';

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
 * Uses Claude Haiku (cheap & fast) to extract key information.
 * Called asynchronously after an AI response is generated.
 */
export async function extractAndStoreMemories(
  userId: string,
  conversationMessages: { role: string; content: string }[],
  goalId?: string | null
): Promise<void> {
  if (!bedrock || conversationMessages.length < 2) return;

  // Only process the last few messages to keep cost low
  const recentMessages = conversationMessages.slice(-6);

  const command = new ConverseCommand({
    modelId: EXTRACTION_MODEL,
    system: [
      {
        text: `You extract key facts and insights from conversations that would be useful to remember for future interactions. Output ONLY a JSON array of strings, each being a concise fact or insight (max 200 chars each). Extract things like:
- User preferences, habits, routines
- Important life events or milestones mentioned
- Emotional states or challenges
- Decisions made or commitments stated
- Key deadlines or dates mentioned

If nothing noteworthy, return an empty array: []
Return ONLY valid JSON, no explanation.`,
      },
    ],
    messages: [
      {
        role: 'user',
        content: [
          {
            text: `Extract memories from this conversation:\n\n${recentMessages.map((m) => `${m.role}: ${m.content}`).join('\n\n')}`,
          },
        ],
      },
    ],
    inferenceConfig: {
      maxTokens: 512,
      temperature: 0.1,
    },
  });

  try {
    const response = await bedrock.send(command);
    const text = response.output?.message?.content?.[0]?.text || '[]';

    // Parse the extracted memories
    const memories: string[] = JSON.parse(text);
    if (!Array.isArray(memories) || memories.length === 0) return;

    // Store each memory as an embedding
    for (const memory of memories.slice(0, 5)) {
      if (typeof memory === 'string' && memory.trim().length > 10) {
        await indexContent(userId, 'memory', memory.trim(), undefined, {
          goalId: goalId ?? undefined,
          extractedAt: new Date().toISOString(),
        });
      }
    }
  } catch (err) {
    console.warn('Memory extraction failed (non-fatal):', err);
  }
}
