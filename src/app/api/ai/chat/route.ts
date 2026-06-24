import { BedrockRuntimeClient, ConverseCommand } from '@aws-sdk/client-bedrock-runtime';
import type { Message, ContentBlock } from '@aws-sdk/client-bedrock-runtime';
import { NextRequest } from 'next/server';
import { env } from '@/lib/env';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { validateBody } from '@/lib/api-middleware';
import { chatRequestSchema } from '@/lib/validation/schemas';
import { requireAuth, getInternalUser, AuthError } from '@/lib/auth-server';
import { retrieveRelevantContext } from '@/lib/context-engine';
import { extractAndStoreMemories } from '@/lib/memory-extraction';
import { db } from '@/db';
import { chatSessions, chatMessages } from '@/db/schema';
import { eq } from 'drizzle-orm';
import {
  toolDefinitions,
  IMMEDIATE_TOOLS,
  executeToolCall,
  type ProposedAction,
} from '@/lib/ai-tools';

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

const MODEL_ID = 'us.anthropic.claude-sonnet-4-5-20250929-v1:0';
const MAX_TOOL_ROUNDS = 5;

export async function POST(request: NextRequest) {
  let supabaseUserId: string;
  try {
    supabaseUserId = await requireAuth(request);
  } catch (error) {
    if (error instanceof AuthError)
      return Response.json({ error: error.message }, { status: error.status });
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'anonymous';

  const rateCheck = checkRateLimit(`ai:${ip}`, RATE_LIMITS.ai);
  if (!rateCheck.allowed) {
    return Response.json(
      { error: 'Too many requests', retryAfterMs: rateCheck.retryAfterMs },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rateCheck.retryAfterMs / 1000)) } }
    );
  }

  const { data, error } = await validateBody(request, chatRequestSchema);
  if (error) return error;

  if (!bedrock) {
    return Response.json({ error: 'AI not configured' }, { status: 503 });
  }

  try {
    const { messages, sessionId, goalContext, aiMemory, calendarContext, tasksContext, goalId } =
      data;

    // Semantic context retrieval
    let semanticContext: string | undefined;
    const user = await getInternalUser(supabaseUserId);
    if (!user) return Response.json({ error: 'User not found' }, { status: 404 });

    try {
      const lastUserMsg = messages[messages.length - 1];
      if (lastUserMsg?.role === 'user') {
        semanticContext = await retrieveRelevantContext(user.id, lastUserMsg.content, goalId);
      }
    } catch (err) {
      console.warn('Semantic context retrieval failed (non-fatal):', err);
    }

    const systemPrompt = buildSystemPrompt({
      goalContext,
      aiMemory,
      calendarContext,
      tasksContext,
      semanticContext,
    });

    // Build conversation messages for Bedrock
    let conversationMessages: Message[] = messages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: [{ text: m.content }],
    }));

    const pendingActions: ProposedAction[] = [];

    // Agentic loop
    for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
      const command = new ConverseCommand({
        modelId: MODEL_ID,
        system: [{ text: systemPrompt }],
        messages: conversationMessages,
        inferenceConfig: { maxTokens: 2048, temperature: 0.7 },
        toolConfig: { tools: toolDefinitions },
      });

      const response = await bedrock.send(command);
      const responseContent: ContentBlock[] = response.output?.message?.content ?? [];

      // Append assistant message to conversation
      conversationMessages = [
        ...conversationMessages,
        { role: 'assistant' as const, content: responseContent },
      ];

      // If not a tool_use stop, we're done
      if (response.stopReason !== 'tool_use' || round >= MAX_TOOL_ROUNDS) break;

      // Process tool calls
      const toolResultBlocks: ContentBlock[] = [];

      for (const block of responseContent) {
        if (!block.toolUse) continue;

        const { toolUseId, name, input } = block.toolUse;
        const toolInput = (input ?? {}) as Record<string, unknown>;

        if (IMMEDIATE_TOOLS.has(name!)) {
          // Execute immediately (non-destructive tools)
          const result = await executeToolCall(name!, toolInput, user.id);
          toolResultBlocks.push({
            toolResult: {
              toolUseId: toolUseId!,
              content: [{ text: JSON.stringify(result.data) }],
            },
          });
        } else {
          // Confirmable tool — defer execution, return fake success
          const actionId = crypto.randomUUID();
          pendingActions.push({
            id: actionId,
            tool: name!,
            input: toolInput,
            summary: buildActionSummary(name!, toolInput),
          });
          toolResultBlocks.push({
            toolResult: {
              toolUseId: toolUseId!,
              content: [
                {
                  text: JSON.stringify({
                    status: 'pending_confirmation',
                    message: 'Action proposed to user for confirmation.',
                  }),
                },
              ],
            },
          });
        }
      }

      // Append tool results as user message
      conversationMessages = [
        ...conversationMessages,
        { role: 'user' as const, content: toolResultBlocks },
      ];
    }

    // Extract final text
    const lastAssistant = conversationMessages.filter((m) => m.role === 'assistant').pop();
    const assistantMessage =
      lastAssistant?.content?.find((b: ContentBlock) => 'text' in b && b.text)?.text ??
      "I've processed your request.";

    // Persist messages to database
    let resolvedSessionId = sessionId;

    if (!resolvedSessionId) {
      const userMsg = messages[messages.length - 1];
      const title = userMsg?.content?.slice(0, 60) || 'New Chat';
      const [session] = await db
        .insert(chatSessions)
        .values({ userId: user.id, title, goalId: goalId || null })
        .returning();
      resolvedSessionId = session.id;
    }

    const lastUserMsg = messages[messages.length - 1];
    if (lastUserMsg && resolvedSessionId) {
      await db.insert(chatMessages).values([
        {
          userId: user.id,
          sessionId: resolvedSessionId,
          goalId: goalId || null,
          role: 'user' as const,
          content: lastUserMsg.content,
        },
        {
          userId: user.id,
          sessionId: resolvedSessionId,
          goalId: goalId || null,
          role: 'assistant' as const,
          content: assistantMessage,
        },
      ]);

      await db
        .update(chatSessions)
        .set({ updatedAt: new Date() })
        .where(eq(chatSessions.id, resolvedSessionId));
    }

    // Fire-and-forget memory extraction
    const allMsgs = [...messages, { role: 'assistant', content: assistantMessage }];
    extractAndStoreMemories(user.id, allMsgs, goalId).catch(() => {});

    return Response.json({
      message: assistantMessage,
      sessionId: resolvedSessionId,
      pendingActions: pendingActions.length > 0 ? pendingActions : undefined,
    });
  } catch (error: unknown) {
    if (error instanceof AuthError)
      return Response.json({ error: error.message }, { status: error.status });
    console.error('AI Chat error:', error);
    const message = error instanceof Error ? error.message : 'AI request failed';
    return Response.json({ error: message }, { status: 500 });
  }
}

function buildActionSummary(tool: string, input: Record<string, unknown>): string {
  switch (tool) {
    case 'create_task':
      return `Create task: ${input.title}${input.deadline ? ` (deadline: ${input.deadline})` : ''}`;
    case 'create_goal':
      return `Create goal: ${input.title} (${input.category})`;
    case 'create_milestone':
      return `Add milestone: ${input.title}`;
    case 'create_event':
      return `Schedule: ${input.title} (${input.start} → ${input.end})`;
    case 'move_event':
      return `Reschedule event to ${input.newStart}`;
    default:
      return `${tool}: ${JSON.stringify(input)}`;
  }
}

function buildSystemPrompt({
  goalContext,
  aiMemory,
  calendarContext,
  tasksContext,
  semanticContext,
}: {
  goalContext?: string;
  aiMemory?: string;
  calendarContext?: string;
  tasksContext?: string;
  semanticContext?: string;
}) {
  let prompt = `You are Lotion, an AI life coach. You help the user achieve their life goals by providing actionable advice, breaking down big goals into steps, and keeping them accountable.

Your personality:
- Warm but direct — you don't sugarcoat, but you're supportive
- Action-oriented — always suggest concrete next steps
- Contextual — you reference the user's goals, tasks, and calendar
- Concise — keep responses focused and scannable (use bullet points, bold with **)
- Encouraging — celebrate wins, acknowledge effort

## Tools Available
You have tools to take actions on the user's behalf:
- **create_task** — when they ask you to add a to-do or action item
- **create_goal** — when they express a new ambition or objective
- **create_milestone** — when breaking a goal into checkpoints
- **create_event** — when they want to schedule or block time on their calendar
- **move_event** — when they want to reschedule something
- **save_memory** — when the user tells you something important to remember (preferences, life events, decisions, corrections)
- **search_knowledge** — when you need to look up past journals, notes, or memories

When you use creation/scheduling tools, the user will be asked to confirm before the action executes. Be specific in your tool inputs so the user can review exactly what will be created.

Do NOT use tools when:
- The user is just chatting or asking for advice
- You're unsure what they want — ask first
- The information is already in your context

After using tools, briefly mention what you proposed in your text response.`;

  if (aiMemory) {
    prompt += `\n\n## User's AI Memory Document\nThis is what you know about the user from past interactions:\n${aiMemory}`;
  }

  if (goalContext) {
    prompt += `\n\n## Current Goal Context\n${goalContext}`;
  }

  if (calendarContext) {
    prompt += `\n\n## Today's Calendar\n${calendarContext}`;
  }

  if (tasksContext) {
    prompt += `\n\n## Active Tasks\n${tasksContext}`;
  }

  if (semanticContext) {
    prompt += `\n\n## Relevant Context (from memory)\n${semanticContext}`;
  }

  return prompt;
}
