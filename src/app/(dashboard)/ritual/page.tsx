"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore, type Priority, CATEGORY_LABELS, CATEGORY_COLORS, type GoalCategory } from "@/lib/store";

type Step = 1 | 2 | 3;

export default function WeeklyRitualPage() {
  const router = useRouter();
  const store = useStore();
  const [step, setStep] = useState<Step>(1);

  // Step 1: Reflect on goals
  const [goalNotes, setGoalNotes] = useState<Record<string, string>>({});

  // Step 2: Set top 3 priorities
  const [priorities, setPriorities] = useState([
    { title: "", category: "career" as GoalCategory, goalId: "" },
    { title: "", category: "personal" as GoalCategory, goalId: "" },
    { title: "", category: "health" as GoalCategory, goalId: "" },
  ]);

  // Step 3: Schedule
  const [focusHours, setFocusHours] = useState(2);

  const activeGoals = store.goals.filter((g) => g.status === "active");

  function handleComplete() {
    // Create tasks from priorities — track how many were actually created
    const tasksCreated = priorities.filter((p) => p.title.trim()).length;
    priorities.forEach((p) => {
      if (!p.title.trim()) return;
      store.addTask({
        title: p.title.trim(),
        description: "Created from Weekly Ritual",
        status: "todo",
        priority: "high",
        goalId: p.goalId || null,
        milestoneId: null,
        durationMinutes: 60,
        deadline: getEndOfWeek(),
        scheduledStart: null,
        scheduledEnd: null,
        listId: null,
      });
    });

    // Add journal entry only when there is actual content to record
    const goalReflections = Object.entries(goalNotes).filter(([, note]) => note.trim());
    const priorityLines = priorities.filter((p) => p.title.trim());
    const hasContent = goalReflections.length > 0 || priorityLines.length > 0;

    if (hasContent) {
      store.addJournalEntry({
        content: `## Weekly Ritual - ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" })}\n\n**Goal reflections:**\n${goalReflections
          .map(([goalId, note]) => {
            const goal = store.goals.find((g) => g.id === goalId);
            return `- **${goal?.title}**: ${note}`;
          })
          .join("\n")}\n\n**Top 3 priorities this week:**\n${priorityLines.map((p, i) => `${i + 1}. ${p.title}`).join("\n")}`,
        mood: null,
        linkedGoalIds: goalReflections.map(([id]) => id),
      });
    }

    // Auto-schedule only when at least one priority task was created
    if (tasksCreated > 0) {
      store.autoSchedule();
    }

    router.push("/dashboard");
  }

  function getEndOfWeek() {
    const d = new Date();
    // Target Friday (day 5); if today is Saturday (6) or Sunday (0), go to next Friday
    const day = d.getDay();
    const daysUntilFriday = day <= 5 ? 5 - day : 5 + (7 - day);
    d.setDate(d.getDate() + daysUntilFriday);
    d.setHours(23, 59, 59, 999);
    return d.toISOString();
  }

  const stepLabels = ["Reflect", "Prioritize", "Commit"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.9)", backdropFilter: "blur(8px)" }}>
      <div
        className="w-full max-w-4xl h-full max-h-[850px] mx-4 rounded-2xl overflow-hidden flex flex-col"
        style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}
      >
        {/* Header */}
        <div className="px-10 py-8 border-b flex items-start justify-between shrink-0" style={{ borderColor: "var(--border)" }}>
          <div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Your Weekly Ritual
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} — 15 minutes to set intentions
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="p-2 rounded-lg transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 shrink-0" style={{ background: "rgba(255,255,255,0.05)" }}>
          <div className="h-full transition-all duration-500" style={{ width: `${(step / 3) * 100}%`, background: "var(--accent)" }} />
        </div>

        {/* Step tabs */}
        <div className="px-10 py-3 border-b flex items-center gap-8 shrink-0" style={{ borderColor: "rgba(255,255,255,0.03)" }}>
          {stepLabels.map((label, i) => (
            <button
              key={label}
              onClick={() => (i + 1 <= step ? setStep((i + 1) as Step) : null)}
              className="text-sm font-medium pb-1 border-b-2 transition-all"
              style={{
                borderColor: step === i + 1 ? "var(--accent)" : "transparent",
                color: step === i + 1 ? "var(--text-primary)" : i + 1 < step ? "var(--text-secondary)" : "var(--text-muted)",
                cursor: i + 1 <= step ? "pointer" : "default",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-10">
          {/* Step 1: Reflect */}
          {step === 1 && (
            <div className="max-w-2xl mx-auto animate-in">
              <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Reflect on Your Goals
              </h2>
              <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
                How did each goal progress this week? What blockers did you face?
              </p>

              {activeGoals.length === 0 ? (
                <div className="glass-static p-8 text-center">
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>No active goals. Create some first!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeGoals.map((goal) => {
                    const progress = store.getGoalProgress(goal.id);
                    return (
                      <div key={goal.id} className="glass-static p-5" style={{ borderLeft: `3px solid ${goal.color}` }}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{goal.title}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: `${goal.color}15`, color: goal.color }}>
                              {progress}%
                            </span>
                          </div>
                          <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                            {CATEGORY_LABELS[goal.category]}
                          </span>
                        </div>
                        <textarea
                          placeholder="How did this goal progress? Any blockers?"
                          value={goalNotes[goal.id] || ""}
                          onChange={(e) => setGoalNotes({ ...goalNotes, [goal.id]: e.target.value })}
                          rows={2}
                          className="w-full bg-transparent border-none outline-none resize-none text-sm leading-relaxed"
                          style={{ color: "var(--text-secondary)" }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Prioritize */}
          {step === 2 && (
            <div className="max-w-2xl mx-auto animate-in">
              <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Set Your Top 3
              </h2>
              <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
                What matters most this week? These become your focus tasks.
              </p>

              <div className="space-y-5">
                {priorities.map((p, idx) => (
                  <div key={idx} className="glass-static p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                        style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
                      >
                        {idx + 1}
                      </div>
                      <select
                        value={p.goalId}
                        onChange={(e) => {
                          const newPriorities = [...priorities];
                          newPriorities[idx].goalId = e.target.value;
                          if (e.target.value) {
                            const goal = store.goals.find((g) => g.id === e.target.value);
                            if (goal) newPriorities[idx].category = goal.category;
                          }
                          setPriorities(newPriorities);
                        }}
                        className="input-glass text-xs flex-1"
                      >
                        <option value="">Link to a goal (optional)</option>
                        {activeGoals.map((g) => (
                          <option key={g.id} value={g.id}>{g.title}</option>
                        ))}
                      </select>
                    </div>
                    <input
                      type="text"
                      placeholder={idx === 0 ? "e.g., Ship the landing page" : idx === 1 ? "e.g., Plan content for next week" : "e.g., Run 3 times this week"}
                      value={p.title}
                      onChange={(e) => {
                        const newPriorities = [...priorities];
                        newPriorities[idx].title = e.target.value;
                        setPriorities(newPriorities);
                      }}
                      className="w-full bg-transparent border-none outline-none text-base"
                      style={{ color: "var(--text-primary)" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Commit */}
          {step === 3 && (
            <div className="max-w-2xl mx-auto animate-in">
              <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Execution Commitment
              </h2>
              <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
                Review your plan and commit to this week.
              </p>

              {/* Priorities summary */}
              <div className="glass-static p-5 mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>
                  Your Priorities This Week
                </h3>
                <div className="space-y-3">
                  {priorities.filter((p) => p.title.trim()).map((p, idx) => {
                    const goal = p.goalId ? store.goals.find((g) => g.id === p.goalId) : null;
                    return (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: goal?.color || "var(--accent)" }} />
                        <span className="text-sm" style={{ color: "var(--text-primary)" }}>{p.title}</span>
                        {goal && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded ml-auto" style={{ background: `${goal.color}15`, color: goal.color }}>
                            {goal.title}
                          </span>
                        )}
                      </div>
                    );
                  })}
                  {priorities.every((p) => !p.title.trim()) && (
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>No priorities set — go back and add some.</p>
                  )}
                </div>
              </div>

              {/* Focus blocks */}
              <div className="glass-static p-5" style={{ borderLeft: "3px solid var(--accent)" }}>
                <h3 className="text-sm font-medium mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
                    <rect width="18" height="18" x="3" y="4" rx="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
                  Suggested Focus Blocks
                </h3>
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
                    <div key={day} className="text-center p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)" }}>
                      <div className="text-[10px] mb-1" style={{ color: "var(--text-muted)" }}>{day}</div>
                      <div className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>9-{9 + focusHours}am</div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>Focus hours/day:</span>
                  <input
                    type="range"
                    min={1}
                    max={4}
                    value={focusHours}
                    onChange={(e) => setFocusHours(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium" style={{ color: "var(--accent)", fontFamily: "'JetBrains Mono', monospace" }}>
                    {focusHours}h
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-10 py-6 border-t flex items-center justify-between shrink-0" style={{ borderColor: "var(--border)" }}>
          <button
            onClick={() => step > 1 ? setStep((step - 1) as Step) : router.push("/dashboard")}
            className="text-sm flex items-center gap-2 transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
            {step === 1 ? "Exit" : "Back"}
          </button>
          <button
            onClick={() => step < 3 ? setStep((step + 1) as Step) : handleComplete()}
            className="btn-glow px-8 py-3 rounded-xl text-sm font-medium flex items-center gap-2 transition-all hover:scale-105"
          >
            {step === 3 ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                Complete Ritual
              </>
            ) : (
              <>
                Next Step
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
