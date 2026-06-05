import { BedrockRuntimeClient, ConverseCommand } from '@aws-sdk/client-bedrock-runtime';
import { NextRequest } from 'next/server';
import { env } from '@/lib/env';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { validateBody } from '@/lib/api-middleware';
import { chatRequestSchema } from '@/lib/validation/schemas';
import { requireAuth } from '@/lib/auth-server';

// Bedrock client is null when AWS credentials are not configured (AI gracefully degraded)
const _accessKeyId = env.AWS_ACCESS_KEY_ID;
const _secretAccessKey = env.AWS_SECRET_ACCESS_KEY;
const bedrock =
  _accessKeyId && _secretAccessKey
    ? new BedrockRuntimeClient({
        region: env.AWS_REGION,
        credentials: { accessKeyId: _accessKeyId, secretAccessKey: _secretAccessKey },
      })
    : null;

const MODEL_ID = 'us.anthropic.claude-sonnet-4-20250514-v1:0';

export async function POST(request: NextRequest) {
  // Require authentication
  try {
    await requireAuth(request);
  } catch (error) {
    if (error instanceof Response) return error;
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Rate limiting — key by IP (or forwarded header in prod)
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'anonymous';

  const rateCheck = checkRateLimit(`ai:${ip}`, RATE_LIMITS.ai);
  if (!rateCheck.allowed) {
    return Response.json(
      {
        error: 'Too many requests',
        retryAfterMs: rateCheck.retryAfterMs,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil(rateCheck.retryAfterMs / 1000)),
        },
      }
    );
  }

  if (!bedrock) {
    return Response.json({ error: 'AI not configured' }, { status: 503 });
  }

  // Validate request body
  const { data, error } = await validateBody(request, chatRequestSchema);
  if (error) return error;

  try {
    const { messages, goalContext, aiMemory, calendarContext, tasksContext } = data;

    const systemPrompt = buildSystemPrompt({
      goalContext,
      aiMemory,
      calendarContext,
      tasksContext,
    });

    const command = new ConverseCommand({
      modelId: MODEL_ID,
      system: [{ text: systemPrompt }],
      messages: messages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: [{ text: m.content }],
      })),
      inferenceConfig: {
        maxTokens: 1024,
        temperature: 0.7,
      },
    });

    const response = await bedrock.send(command);
    const assistantMessage =
      response.output?.message?.content?.[0]?.text || "I couldn't generate a response.";

    return Response.json({ message: assistantMessage });
  } catch (error: unknown) {
    if (error instanceof Response) throw error;
    console.error('AI Chat error:', error);
    const message = error instanceof Error ? error.message : 'AI request failed';
    return Response.json({ error: message }, { status: 500 });
  }
}

function buildSystemPrompt({
  goalContext,
  aiMemory,
  calendarContext,
  tasksContext,
}: {
  goalContext?: string;
  aiMemory?: string;
  calendarContext?: string;
  tasksContext?: string;
}) {
  let prompt = `You are Lotion, an AI life coach. You help the user achieve their life goals by providing actionable advice, breaking down big goals into steps, and keeping them accountable.

Your personality:
- Warm but direct — you don't sugarcoat, but you're supportive
- Action-oriented — always suggest concrete next steps
- Contextual — you reference the user's goals, tasks, and calendar
- Concise — keep responses focused and scannable (use bullet points, bold with **)
- Encouraging — celebrate wins, acknowledge effort

You can suggest:
- Creating new tasks or milestones
- Scheduling focus blocks on the calendar
- Adjusting priorities based on deadlines
- Breaking down vague goals into specific actions
- Weekly planning and daily priorities

Always be specific to the user's actual goals and situation. Never give generic advice when you have context.`;

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

  return prompt;
}
