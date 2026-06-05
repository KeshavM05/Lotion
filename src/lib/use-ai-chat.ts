'use client';

import { useState, useCallback } from 'react';
import { useStore } from './store';
import { getAuthHeaders } from './api-client';

interface UseAiChatOptions {
  goalId: string | null;
}

export function useAiChat({ goalId }: UseAiChatOptions) {
  const store = useStore();
  const [isLoading, setIsLoading] = useState(false);

  const messages = store.getChatMessages(goalId);

  const buildContext = useCallback(() => {
    // Goal context
    let goalContext: string | undefined;
    if (goalId) {
      const goal = store.goals.find((g) => g.id === goalId);
      if (goal) {
        const milestones = store.getGoalMilestones(goalId);
        const tasks = store.getGoalTasks(goalId);
        const progress = store.getGoalProgress(goalId);
        goalContext = `Goal: "${goal.title}" (${goal.category}, ${goal.priority} priority, ${progress}% complete)
Description: ${goal.description || 'None'}
Target: ${goal.targetDate ? new Date(goal.targetDate).toLocaleDateString() : 'No target date'}
Milestones (${milestones.filter((m) => m.completed).length}/${milestones.length} done):
${milestones.map((m) => `  ${m.completed ? '[x]' : '[ ]'} ${m.title}`).join('\n') || '  None'}
Tasks (${tasks.filter((t) => t.completed).length}/${tasks.length} done):
${tasks.map((t) => `  ${t.completed ? '[x]' : '[ ]'} ${t.title} (${t.priority}, ${t.durationMinutes}m${t.deadline ? `, due ${new Date(t.deadline).toLocaleDateString()}` : ''})`).join('\n') || '  None'}`;
      }
    }

    // All goals summary
    const goalsOverview = store.goals
      .filter((g) => g.status === 'active')
      .map((g) => `- ${g.title} (${g.category}, ${store.getGoalProgress(g.id)}% complete)`)
      .join('\n');

    // Tasks context
    const activeTasks = store.tasks.filter((t) => !t.completed);
    const tasksContext =
      activeTasks.length > 0
        ? activeTasks
            .slice(0, 15)
            .map((t) => {
              const goal = t.goalId ? store.goals.find((g) => g.id === t.goalId) : null;
              return `- ${t.title} (${t.priority}${goal ? `, goal: ${goal.title}` : ''}${t.deadline ? `, due ${new Date(t.deadline).toLocaleDateString()}` : ''})`;
            })
            .join('\n')
        : undefined;

    // Calendar context
    const today = new Date();
    const todayEvents = store.events.filter((e) => {
      const d = new Date(e.start);
      return d.toDateString() === today.toDateString();
    });
    const calendarContext =
      todayEvents.length > 0
        ? todayEvents
            .map((e) => {
              const start = new Date(e.start).toLocaleTimeString([], {
                hour: 'numeric',
                minute: '2-digit',
              });
              const end = new Date(e.end).toLocaleTimeString([], {
                hour: 'numeric',
                minute: '2-digit',
              });
              return `- ${e.title} (${start} - ${end})`;
            })
            .join('\n')
        : undefined;

    // Overall context if no specific goal
    if (!goalContext && goalsOverview) {
      goalContext = `User's active goals:\n${goalsOverview}`;
    }

    return {
      goalContext,
      aiMemory: store.aiMemory || undefined,
      calendarContext,
      tasksContext,
    };
  }, [goalId, store]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      store.addChatMessage({ goalId, role: 'user', content: content.trim() });
      setIsLoading(true);

      try {
        const context = buildContext();
        const allMessages = [
          ...messages.map((m) => ({ role: m.role, content: m.content })),
          { role: 'user' as const, content: content.trim() },
        ];

        const authHeaders = await getAuthHeaders();
        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { ...authHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: allMessages, ...context }),
        });

        const data = await res.json();

        if (data.error) {
          // Fallback to simulated response if API not configured
          store.addChatMessage({
            goalId,
            role: 'assistant',
            content: data.error.includes('not configured')
              ? getFallbackResponse(content, goalId, store)
              : `Sorry, something went wrong: ${data.error}`,
          });
        } else {
          store.addChatMessage({ goalId, role: 'assistant', content: data.message });
        }
      } catch {
        store.addChatMessage({
          goalId,
          role: 'assistant',
          content: getFallbackResponse(content, goalId, store),
        });
      } finally {
        setIsLoading(false);
      }
    },
    [goalId, messages, isLoading, store, buildContext]
  );

  return { messages, sendMessage, isLoading };
}

function getFallbackResponse(
  _userMessage: string,
  goalId: string | null,
  store: ReturnType<typeof useStore>
) {
  if (goalId) {
    const goal = store.goals.find((g) => g.id === goalId);
    const progress = goal ? store.getGoalProgress(goalId) : 0;
    const tasks = store.getGoalTasks(goalId);
    const milestones = store.getGoalMilestones(goalId);
    return `Here's where you stand on **"${goal?.title}"** (${progress}% complete):

- **${milestones.filter((m) => m.completed).length}/${milestones.length}** milestones done
- **${tasks.filter((t) => t.completed).length}/${tasks.length}** tasks completed
- **${tasks.filter((t) => !t.completed).length}** tasks remaining

**Next steps I'd suggest:**
${
  tasks.filter((t) => !t.completed).length > 0
    ? tasks
        .filter((t) => !t.completed)
        .slice(0, 3)
        .map((t) => `• Focus on "${t.title}" (${t.durationMinutes}m)`)
        .join('\n')
    : '• Add some tasks to make progress on this goal'
}

*Add your AWS credentials to .env.local for real AI coaching via Bedrock.*`;
  }

  const activeGoals = store.goals.filter((g) => g.status === 'active');
  const totalTasks = store.tasks.filter((t) => !t.completed).length;
  return `Here's your overview:

**${activeGoals.length} active goals:**
${activeGoals.map((g) => `• ${g.title} — ${store.getGoalProgress(g.id)}%`).join('\n') || "• No goals yet — let's set some!"}

**${totalTasks} tasks** waiting for you.

What would you like to work on? I can help you:
• Break a goal into milestones and tasks
• Plan your week around your priorities
• Brainstorm strategies for any goal

*Add your AWS credentials to .env.local for real AI coaching via Bedrock.*`;
}
