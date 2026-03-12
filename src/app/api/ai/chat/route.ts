import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";
import { NextRequest } from "next/server";

const bedrock = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: process.env.AWS_ACCESS_KEY_ID
    ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      }
    : undefined,
});

const MODEL_ID = "us.anthropic.claude-sonnet-4-20250514-v1:0";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, goalContext, aiMemory, calendarContext, tasksContext } = body;

    if (!process.env.AWS_ACCESS_KEY_ID) {
      return Response.json(
        { error: "AWS credentials not configured" },
        { status: 500 }
      );
    }

    const systemPrompt = buildSystemPrompt({
      goalContext,
      aiMemory,
      calendarContext,
      tasksContext,
    });

    const command = new ConverseCommand({
      modelId: MODEL_ID,
      system: [{ text: systemPrompt }],
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
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
    console.error("AI Chat error:", error);
    const message = error instanceof Error ? error.message : "AI request failed";
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
  let prompt = `You are Motion, an AI life coach. You help the user achieve their life goals by providing actionable advice, breaking down big goals into steps, and keeping them accountable.

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
