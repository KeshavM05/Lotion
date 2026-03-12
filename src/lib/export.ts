import type { Goal, Milestone, Task, CalendarEvent, ChatMessage, JournalEntry } from "./store";

// ─── Markdown Export ─────────────────────────────────────

export function exportGoalsMarkdown(
  goals: Goal[],
  milestones: Milestone[],
  tasks: Task[]
): string {
  let md = "# Goals & Vision Board\n\n";
  md += `_Exported on ${new Date().toLocaleDateString()}_\n\n---\n\n`;

  for (const goal of goals) {
    const gMilestones = milestones.filter((m) => m.goalId === goal.id);
    const gTasks = tasks.filter((t) => t.goalId === goal.id);
    const completedTasks = gTasks.filter((t) => t.completed).length;

    md += `## ${goal.title}\n\n`;
    md += `- **Category:** ${goal.category}\n`;
    md += `- **Priority:** ${goal.priority}\n`;
    md += `- **Status:** ${goal.status}\n`;
    if (goal.targetDate) md += `- **Target:** ${new Date(goal.targetDate).toLocaleDateString()}\n`;
    if (goal.description) md += `\n${goal.description}\n`;
    md += "\n";

    if (gMilestones.length > 0) {
      md += "### Milestones\n\n";
      for (const ms of gMilestones) {
        md += `- [${ms.completed ? "x" : " "}] ${ms.title}`;
        if (ms.targetDate) md += ` _(${new Date(ms.targetDate).toLocaleDateString()})_`;
        md += "\n";
      }
      md += "\n";
    }

    if (gTasks.length > 0) {
      md += `### Tasks (${completedTasks}/${gTasks.length})\n\n`;
      for (const t of gTasks) {
        md += `- [${t.completed ? "x" : " "}] ${t.title}`;
        md += ` _(${t.priority}, ${t.durationMinutes}m)_`;
        if (t.deadline) md += ` due ${new Date(t.deadline).toLocaleDateString()}`;
        md += "\n";
      }
      md += "\n";
    }

    md += "---\n\n";
  }

  return md;
}

export function exportChatMarkdown(
  messages: ChatMessage[],
  goalTitle?: string
): string {
  let md = goalTitle
    ? `# Chat: ${goalTitle}\n\n`
    : "# AI Coach Chat\n\n";
  md += `_Exported on ${new Date().toLocaleDateString()}_\n\n---\n\n`;

  for (const msg of messages) {
    const time = new Date(msg.createdAt).toLocaleString();
    const role = msg.role === "user" ? "**You**" : "**AI Coach**";
    md += `${role} _(${time})_\n\n${msg.content}\n\n---\n\n`;
  }

  return md;
}

export function exportJournalMarkdown(entries: JournalEntry[], goals: Goal[]): string {
  let md = "# Journal\n\n";
  md += `_Exported on ${new Date().toLocaleDateString()}_\n\n---\n\n`;

  for (const entry of entries) {
    const date = new Date(entry.createdAt).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const time = new Date(entry.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

    md += `## ${date} at ${time}\n\n`;
    if (entry.mood) md += `**Mood:** ${entry.mood}\n\n`;
    md += `${entry.content}\n\n`;

    if (entry.linkedGoalIds.length > 0) {
      const linked = entry.linkedGoalIds
        .map((id) => goals.find((g) => g.id === id)?.title)
        .filter(Boolean);
      if (linked.length > 0) md += `**Related goals:** ${linked.join(", ")}\n\n`;
    }

    md += "---\n\n";
  }

  return md;
}

// ─── JSON Export ─────────────────────────────────────────

export function exportAllJSON(data: {
  goals: Goal[];
  milestones: Milestone[];
  tasks: Task[];
  events: CalendarEvent[];
  chatMessages: ChatMessage[];
  journalEntries: JournalEntry[];
  aiMemory: string;
}): string {
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      version: "1.0",
      ...data,
    },
    null,
    2
  );
}

// ─── Download Helper ─────────────────────────────────────

export function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
