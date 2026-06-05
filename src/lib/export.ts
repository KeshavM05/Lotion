import type { Goal, Milestone, Task, TaskList, CalendarEvent, ChatMessage, JournalEntry } from "./store";

// ─── Markdown Export ─────────────────────────────────────

export function exportGoalsMarkdown(
  goals: Goal[],
  milestones: Milestone[],
  tasks: Task[]
): string {
  let md = "# Goals & Vision Board\n\n";
  md += `_Exported on ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}_\n\n`;
  md += `**Total Goals:** ${goals.length} | **Active:** ${goals.filter((g) => g.status === "active").length} | **Completed:** ${goals.filter((g) => g.status === "completed").length}\n\n---\n\n`;

  for (const goal of goals) {
    const gMilestones = milestones.filter((m) => m.goalId === goal.id);
    const gTasks = tasks.filter((t) => t.goalId === goal.id);
    const completedTasks = gTasks.filter((t) => t.completed).length;
    const completedMs = gMilestones.filter((m) => m.completed).length;

    md += `## ${goal.title}\n\n`;
    md += `| Field | Value |\n|---|---|\n`;
    md += `| Category | ${goal.category} |\n`;
    md += `| Priority | ${goal.priority} |\n`;
    md += `| Status | ${goal.status} |\n`;
    if (goal.targetDate)
      md += `| Target Date | ${new Date(goal.targetDate).toLocaleDateString()} |\n`;
    md += `| Created | ${new Date(goal.createdAt).toLocaleDateString()} |\n`;
    md += "\n";
    if (goal.description) md += `> ${goal.description}\n\n`;

    if (gMilestones.length > 0) {
      md += `### Milestones (${completedMs}/${gMilestones.length})\n\n`;
      for (const ms of gMilestones) {
        md += `- [${ms.completed ? "x" : " "}] **${ms.title}**`;
        if (ms.targetDate)
          md += ` _(due ${new Date(ms.targetDate).toLocaleDateString()})_`;
        if (ms.description) md += `\n  ${ms.description}`;
        md += "\n";
      }
      md += "\n";
    }

    if (gTasks.length > 0) {
      md += `### Tasks (${completedTasks}/${gTasks.length} complete)\n\n`;
      const pending = gTasks.filter((t) => !t.completed);
      const done = gTasks.filter((t) => t.completed);
      for (const t of pending) {
        md += `- [ ] ${t.title}`;
        md += ` _(${t.priority} priority, ${t.durationMinutes}m)_`;
        if (t.deadline)
          md += ` — due ${new Date(t.deadline).toLocaleDateString()}`;
        md += "\n";
      }
      for (const t of done) {
        md += `- [x] ~~${t.title}~~`;
        if (t.completedAt)
          md += ` _(completed ${new Date(t.completedAt).toLocaleDateString()})_`;
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
    ? `# AI Coach Chat: ${goalTitle}\n\n`
    : "# AI Coach Chat\n\n";
  md += `_Exported on ${new Date().toLocaleDateString()}_\n\n`;
  md += `**Messages:** ${messages.length}\n\n---\n\n`;

  for (const msg of messages) {
    const time = new Date(msg.createdAt).toLocaleString();
    const role = msg.role === "user" ? "**You**" : "**AI Coach**";
    md += `### ${role} — ${time}\n\n${msg.content}\n\n---\n\n`;
  }

  return md;
}

export function exportJournalMarkdown(
  entries: JournalEntry[],
  goals: Goal[]
): string {
  let md = "# Journal\n\n";
  md += `_Exported on ${new Date().toLocaleDateString()}_\n\n`;
  md += `**Entries:** ${entries.length}\n\n---\n\n`;

  for (const entry of entries) {
    const date = new Date(entry.createdAt).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const time = new Date(entry.createdAt).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });

    md += `## ${date} at ${time}\n\n`;
    if (entry.mood) md += `**Mood:** ${entry.mood}\n\n`;
    md += `${entry.content}\n\n`;

    if (entry.linkedGoalIds.length > 0) {
      const linked = entry.linkedGoalIds
        .map((id) => goals.find((g) => g.id === id)?.title)
        .filter(Boolean);
      if (linked.length > 0)
        md += `**Related goals:** ${linked.join(", ")}\n\n`;
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
      summary: {
        goals: data.goals.length,
        milestones: data.milestones.length,
        tasks: data.tasks.length,
        events: data.events.length,
        chatMessages: data.chatMessages.length,
        journalEntries: data.journalEntries.length,
      },
      ...data,
    },
    null,
    2
  );
}

export function exportCalendarJSON(events: CalendarEvent[]): string {
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      version: "1.0",
      totalEvents: events.length,
      events: events.map((e) => ({
        id: e.id,
        title: e.title,
        description: e.description || "",
        start: e.start,
        end: e.end,
        allDay: e.allDay,
        color: e.color,
        source: e.source,
        isRecurring: e.isRecurring || false,
        recurrenceFrequency: e.recurrenceFrequency || null,
        recurrenceInterval: e.recurrenceInterval || null,
        recurrenceEndDate: e.recurrenceEndDate || null,
        taskId: e.taskId,
        createdAt: e.createdAt,
      })),
    },
    null,
    2
  );
}

// ─── CSV Export ──────────────────────────────────────────

function csvEscape(val: string | null | undefined): string {
  if (val === null || val === undefined) return "";
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportTasksCSV(
  tasks: Task[],
  taskLists: TaskList[],
  goals: Goal[]
): string {
  const headers = [
    "Title",
    "Status",
    "Priority",
    "Due Date",
    "Duration (min)",
    "List",
    "Goal",
    "Completed",
    "Completed At",
    "Created At",
  ];
  const rows = tasks.map((t) => {
    const list = taskLists.find((l) => l.id === t.listId);
    const goal = goals.find((g) => g.id === t.goalId);
    return [
      csvEscape(t.title),
      csvEscape(t.status),
      csvEscape(t.priority),
      csvEscape(t.deadline ? new Date(t.deadline).toLocaleDateString() : ""),
      csvEscape(String(t.durationMinutes)),
      csvEscape(list?.name ?? ""),
      csvEscape(goal?.title ?? ""),
      csvEscape(t.completed ? "Yes" : "No"),
      csvEscape(
        t.completedAt ? new Date(t.completedAt).toLocaleDateString() : ""
      ),
      csvEscape(new Date(t.createdAt).toLocaleDateString()),
    ].join(",");
  });
  return [headers.join(","), ...rows].join("\n");
}

// ─── PDF Export (print-based) ────────────────────────────

export function exportPDF(data: {
  goals: Goal[];
  milestones: Milestone[];
  tasks: Task[];
  journalEntries: JournalEntry[];
  aiMemory: string;
}) {
  const { goals, milestones, tasks, journalEntries, aiMemory } = data;
  const date = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const goalsHtml = goals
    .map((goal) => {
      const gMs = milestones.filter((m) => m.goalId === goal.id);
      const gTasks = tasks.filter((t) => t.goalId === goal.id);
      const progress =
        gMs.length > 0
          ? Math.round(
              (gMs.filter((m) => m.completed).length / gMs.length) * 100
            )
          : gTasks.length > 0
            ? Math.round(
                (gTasks.filter((t) => t.completed).length / gTasks.length) *
                  100
              )
            : 0;

      const msHtml =
        gMs.length > 0
          ? `<ul>${gMs
              .map(
                (m) =>
                  `<li class="${m.completed ? "done" : ""}">${m.completed ? "&#x2713;" : "&#x25CB;"} ${m.title}${m.targetDate ? ` <span class="meta">(${new Date(m.targetDate).toLocaleDateString()})</span>` : ""}</li>`
              )
              .join("")}</ul>`
          : "";

      const tasksHtml =
        gTasks.length > 0
          ? `<ul>${gTasks
              .map(
                (t) =>
                  `<li class="${t.completed ? "done" : ""}">${t.completed ? "&#x2713;" : "&#x25CB;"} ${t.title} <span class="meta">${t.priority} &middot; ${t.durationMinutes}m${t.deadline ? ` &middot; due ${new Date(t.deadline).toLocaleDateString()}` : ""}</span></li>`
              )
              .join("")}</ul>`
          : "";

      return `
      <div class="goal-block">
        <div class="goal-header">
          <div>
            <span class="goal-category">${goal.category}</span>
            <h2>${goal.title}</h2>
            ${goal.description ? `<p class="goal-desc">${goal.description}</p>` : ""}
          </div>
          <div class="progress-badge">${progress}%</div>
        </div>
        <div class="goal-meta">
          <span>Priority: <strong>${goal.priority}</strong></span>
          <span>Status: <strong>${goal.status}</strong></span>
          ${goal.targetDate ? `<span>Target: <strong>${new Date(goal.targetDate).toLocaleDateString()}</strong></span>` : ""}
        </div>
        ${gMs.length > 0 ? `<h3>Milestones (${gMs.filter((m) => m.completed).length}/${gMs.length})</h3>${msHtml}` : ""}
        ${gTasks.length > 0 ? `<h3>Tasks (${gTasks.filter((t) => t.completed).length}/${gTasks.length})</h3>${tasksHtml}` : ""}
      </div>`;
    })
    .join("");

  const journalHtml =
    journalEntries.length > 0
      ? journalEntries
          .slice(0, 20)
          .map((e) => {
            const d = new Date(e.createdAt).toLocaleDateString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            });
            return `<div class="journal-entry"><div class="entry-date">${d}${e.mood ? ` &mdash; ${e.mood}` : ""}</div><p>${e.content.replace(/\n/g, "<br>")}</p></div>`;
          })
          .join("")
      : "<p><em>No journal entries.</em></p>";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Lotion Export &mdash; ${date}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Georgia, serif; color: #1a1a2e; background: #fff; padding: 40px; max-width: 900px; margin: 0 auto; }
    h1 { font-size: 2rem; margin-bottom: 4px; color: #1a1a2e; }
    .subtitle { color: #666; font-size: 0.9rem; margin-bottom: 32px; font-family: Arial, sans-serif; }
    h2 { font-size: 1.3rem; margin: 0 0 4px; color: #1a1a2e; }
    h3 { font-size: 0.85rem; font-family: Arial, sans-serif; text-transform: uppercase; letter-spacing: 0.05em; color: #555; margin: 12px 0 6px; }
    .goal-block { border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin-bottom: 20px; page-break-inside: avoid; }
    .goal-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
    .goal-category { font-size: 0.7rem; font-family: Arial, sans-serif; text-transform: uppercase; letter-spacing: 0.08em; background: #f0ede8; color: #7a5c56; padding: 2px 8px; border-radius: 4px; display: inline-block; margin-bottom: 4px; }
    .goal-desc { color: #555; font-size: 0.9rem; margin-top: 4px; font-style: italic; }
    .goal-meta { display: flex; gap: 16px; font-size: 0.8rem; font-family: Arial, sans-serif; color: #666; margin-bottom: 8px; }
    .progress-badge { font-size: 1.1rem; font-weight: bold; color: #c17a72; white-space: nowrap; font-family: Arial, sans-serif; }
    ul { list-style: none; padding: 0; }
    li { font-size: 0.85rem; font-family: Arial, sans-serif; padding: 3px 0; color: #333; display: flex; gap: 6px; align-items: baseline; }
    li.done { color: #999; text-decoration: line-through; }
    .meta { color: #999; font-size: 0.75rem; }
    .section-title { font-size: 1.5rem; font-family: Georgia, serif; margin: 32px 0 16px; border-bottom: 1px solid #e0e0e0; padding-bottom: 8px; }
    .journal-entry { margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #f0f0f0; page-break-inside: avoid; }
    .entry-date { font-size: 0.8rem; font-family: Arial, sans-serif; color: #c17a72; font-weight: bold; margin-bottom: 4px; }
    .journal-entry p { font-size: 0.9rem; line-height: 1.6; color: #333; }
    .memory-block { background: #fafaf8; border-left: 3px solid #c17a72; padding: 16px; font-size: 0.85rem; font-family: Arial, sans-serif; line-height: 1.7; white-space: pre-wrap; color: #333; }
    .stats { display: flex; gap: 24px; margin-bottom: 32px; }
    .stat { text-align: center; }
    .stat-num { font-size: 1.6rem; font-weight: bold; color: #c17a72; font-family: Arial, sans-serif; }
    .stat-label { font-size: 0.75rem; font-family: Arial, sans-serif; color: #888; text-transform: uppercase; letter-spacing: 0.05em; }
    @media print { body { padding: 20px; } .goal-block { border-color: #ccc; } }
  </style>
</head>
<body>
  <h1>Lotion &mdash; Life Export</h1>
  <p class="subtitle">Generated on ${date}</p>
  <div class="stats">
    <div class="stat"><div class="stat-num">${goals.length}</div><div class="stat-label">Goals</div></div>
    <div class="stat"><div class="stat-num">${tasks.length}</div><div class="stat-label">Tasks</div></div>
    <div class="stat"><div class="stat-num">${journalEntries.length}</div><div class="stat-label">Journal Entries</div></div>
    <div class="stat"><div class="stat-num">${goals.filter((g) => g.status === "completed").length}</div><div class="stat-label">Completed Goals</div></div>
  </div>
  <h2 class="section-title">Goals &amp; Vision Board</h2>
  ${goalsHtml || "<p><em>No goals yet.</em></p>"}
  <h2 class="section-title">Journal${journalEntries.length > 20 ? " (latest 20)" : ""}</h2>
  ${journalHtml}
  ${aiMemory ? `<h2 class="section-title">AI Memory</h2><div class="memory-block">${aiMemory}</div>` : ""}
</body>
</html>`;

  const win = window.open("", "_blank");
  if (!win) {
    throw new Error("Popup blocked. Please allow popups for this site.");
  }
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 500);
}

// ─── Download Helper ─────────────────────────────────────

export function downloadFile(
  content: string,
  filename: string,
  type: string
) {
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
