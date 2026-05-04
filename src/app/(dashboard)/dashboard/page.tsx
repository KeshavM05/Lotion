"use client";

import Link from "next/link";
import { useStore, CATEGORY_COLORS, CATEGORY_LABELS } from "@/lib/store";
import { ProgressRing } from "@/components/ui/progress-ring";
import { formatRelativeDate } from "@/lib/utils";

export default function DashboardPage() {
  const store = useStore();

  const activeGoals = store.goals.filter((g) => g.status === "active");
  const activeTasks = store.tasks.filter((t) => !t.completed);
  const completedTasks = store.tasks.filter((t) => t.completed);
  const todayEntries = store.journalEntries.filter(
    (e) => new Date(e.createdAt).toDateString() === new Date().toDateString()
  );
  const todayEvents = store.events.filter(
    (e) => new Date(e.start).toDateString() === new Date().toDateString()
  );

  // Streaks
  const journalDays = new Set(store.journalEntries.map((e) => new Date(e.createdAt).toDateString())).size;

  // Urgents
  const overdueTasks = activeTasks.filter(
    (t) => t.deadline && new Date(t.deadline) < new Date()
  );
  const upcomingDeadlines = activeTasks
    .filter((t) => t.deadline && new Date(t.deadline) > new Date())
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .slice(0, 5);

  return (
    <div className="flex h-full">
      {/* Main content */}
      <div className="flex-1 overflow-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Dashboard
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <MetricCard label="Active Goals" value={activeGoals.length.toString()} color="var(--accent)" />
          <MetricCard label="Tasks to Do" value={activeTasks.length.toString()} color="var(--warning)" />
          <MetricCard label="Today's Events" value={todayEvents.length.toString()} color="var(--info)" />
          <MetricCard label="Journal Entries" value={todayEntries.length.toString()} suffix="today" color="var(--success)" />
        </div>

        {/* Overdue alert */}
        {overdueTasks.length > 0 && (
          <div
            className="mb-8 p-4 rounded-xl flex items-start gap-3"
            style={{ background: "rgba(248,113,113,0.08)", borderLeft: "3px solid var(--danger)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2" className="mt-0.5 flex-shrink-0">
              <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
            </svg>
            <div>
              <div className="text-sm font-medium" style={{ color: "var(--danger)" }}>
                {overdueTasks.length} overdue task{overdueTasks.length > 1 ? "s" : ""}
              </div>
              <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                {overdueTasks.map((t) => t.title).join(", ")}
              </div>
            </div>
          </div>
        )}

        {/* Goals Overview */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Goals
            </h2>
            <Link href="/goals" className="text-xs font-medium transition-colors flex items-center gap-1" style={{ color: "var(--accent)" }}>
              View All
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            </Link>
          </div>
          {activeGoals.length === 0 ? (
            <EmptyCard message="No goals yet. Define your vision to get started." linkText="Create a goal" linkHref="/goals" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeGoals.slice(0, 4).map((goal) => {
                const progress = store.getGoalProgress(goal.id);
                return (
                  <Link key={goal.id} href={`/goals/${goal.id}`} className="glass p-4 flex items-center gap-4 group">
                    <ProgressRing progress={progress} size={44} strokeWidth={3} color={goal.color}>
                      <span className="text-[10px] font-bold" style={{ color: "var(--text-muted)" }}>{progress}%</span>
                    </ProgressRing>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate group-hover:text-white transition-colors" style={{ color: "var(--text-primary)" }}>
                        {goal.title}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: `${goal.color}15`, color: goal.color }}>
                          {CATEGORY_LABELS[goal.category]}
                        </span>
                        <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                          {store.getGoalTasks(goal.id).filter((t) => !t.completed).length} tasks
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Upcoming Deadlines */}
        {upcomingDeadlines.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Upcoming Deadlines
            </h2>
            <div className="space-y-1">
              {upcomingDeadlines.map((task) => {
                const goal = task.goalId ? store.goals.find((g) => g.id === task.goalId) : null;
                return (
                  <div key={task.id} className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
                    style={{ background: "transparent" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: goal?.color || "var(--accent)" }} />
                    <span className="text-sm flex-1" style={{ color: "var(--text-primary)" }}>{task.title}</span>
                    <span className="text-[11px]" style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>
                      {task.deadline ? formatRelativeDate(task.deadline) : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent Journal */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Recent Journal
            </h2>
            <Link href="/journal" className="text-xs font-medium flex items-center gap-1" style={{ color: "var(--accent)" }}>
              View All
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            </Link>
          </div>
          {store.journalEntries.length === 0 ? (
            <EmptyCard message="No journal entries yet. Start capturing your thoughts." linkText="Write entry" linkHref="/journal" />
          ) : (
            <div className="space-y-3">
              {store.journalEntries.slice(0, 3).map((entry) => (
                <div key={entry.id} className="glass-static p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px]" style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>
                      {new Date(entry.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                    </span>
                    {entry.mood && (
                      <span className="text-xs">{entry.mood === "great" ? "\u2728" : entry.mood === "good" ? "\u263a\ufe0f" : entry.mood === "okay" ? "\ud83d\ude10" : entry.mood === "bad" ? "\ud83d\ude1e" : "\ud83d\ude29"}</span>
                    )}
                  </div>
                  <p className="text-sm line-clamp-2 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {entry.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Context Sidebar */}
      <div
        className="w-[300px] border-l p-6 hidden xl:flex flex-col gap-6 overflow-auto"
        style={{ borderColor: "var(--border)", background: "rgba(0,0,0,0.2)" }}
      >
        {/* Stats */}
        <div className="glass-static p-5">
          <h3 className="text-[10px] font-bold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>
            Overview
          </h3>
          <div className="space-y-4">
            <StatRow label="Total Goals" value={store.goals.length.toString()} />
            <StatRow label="Tasks Completed" value={`${completedTasks.length}/${store.tasks.length}`} />
            <StatRow label="Journal Days" value={journalDays.toString()} />
            <StatRow label="AI Chats" value={store.chatMessages.length.toString()} />
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="glass-static p-5">
          <h3 className="text-[10px] font-bold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>
            Today&apos;s Schedule
          </h3>
          {todayEvents.length === 0 ? (
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>No events today</p>
          ) : (
            <div className="space-y-3">
              {todayEvents.slice(0, 5).map((event) => (
                <div key={event.id} className="flex items-start gap-3">
                  <div className="w-1 h-full rounded-full flex-shrink-0 mt-1" style={{ background: event.color, minHeight: "28px" }} />
                  <div>
                    <div className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{event.title}</div>
                    <div className="text-[10px]" style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>
                      {new Date(event.start).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                      {" - "}
                      {new Date(event.end).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="glass-static p-5">
          <h3 className="text-[10px] font-bold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>
            Quick Actions
          </h3>
          <div className="space-y-2">
            <Link href="/goals" className="flex items-center gap-2 text-xs py-2 px-3 rounded-lg transition-colors"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "var(--text-primary)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
              New Goal
            </Link>
            <Link href="/journal" className="flex items-center gap-2 text-xs py-2 px-3 rounded-lg transition-colors"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "var(--text-primary)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
              Journal Entry
            </Link>
            <Link href="/coach" className="flex items-center gap-2 text-xs py-2 px-3 rounded-lg transition-colors"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "var(--text-primary)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
              Talk to AI Coach
            </Link>
          </div>
        </div>

        {/* Keyboard shortcut hint */}
        <div className="text-center mt-auto">
          <div className="inline-flex items-center gap-2 text-[10px] px-3 py-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", color: "var(--text-muted)" }}>
            <kbd className="px-1 py-0.5 rounded text-[9px]" style={{ background: "rgba(255,255,255,0.06)" }}>Ctrl+K</kbd>
            Command Palette
            <span style={{ color: "var(--border)" }}>|</span>
            <kbd className="px-1 py-0.5 rounded text-[9px]" style={{ background: "rgba(255,255,255,0.06)" }}>Ctrl+Shift+J</kbd>
            Quick Capture
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, suffix, color }: { label: string; value: string; suffix?: string; color: string }) {
  return (
    <div className="glass p-5 transition-colors">
      <div className="text-3xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif", color }}>
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
        {label} {suffix && <span style={{ color: "var(--text-muted)" }}>{suffix}</span>}
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</span>
      <span className="text-sm font-semibold" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "var(--text-primary)" }}>
        {value}
      </span>
    </div>
  );
}

function EmptyCard({ message, linkText, linkHref }: { message: string; linkText: string; linkHref: string }) {
  return (
    <div className="glass-static p-8 text-center">
      <p className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>{message}</p>
      <Link href={linkHref} className="text-xs font-medium" style={{ color: "var(--accent)" }}>{linkText} &rarr;</Link>
    </div>
  );
}
