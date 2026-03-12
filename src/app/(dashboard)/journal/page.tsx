"use client";

import { useState } from "react";
import { useStore, type JournalEntry, CATEGORY_LABELS } from "@/lib/store";

const MOODS = [
  { value: "great", emoji: "\u2728", label: "Great" },
  { value: "good", emoji: "\u263a\ufe0f", label: "Good" },
  { value: "okay", emoji: "\ud83d\ude10", label: "Okay" },
  { value: "bad", emoji: "\ud83d\ude1e", label: "Bad" },
  { value: "terrible", emoji: "\ud83d\ude29", label: "Terrible" },
] as const;

export default function JournalPage() {
  const store = useStore();
  const [isWriting, setIsWriting] = useState(false);
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<JournalEntry["mood"]>(null);
  const [linkedGoals, setLinkedGoals] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  function startNew() {
    setEditingId(null);
    setContent("");
    setMood(null);
    setLinkedGoals([]);
    setIsWriting(true);
  }

  function startEdit(entry: JournalEntry) {
    setEditingId(entry.id);
    setContent(entry.content);
    setMood(entry.mood);
    setLinkedGoals(entry.linkedGoalIds);
    setIsWriting(true);
  }

  function save() {
    if (!content.trim()) return;
    if (editingId) {
      store.updateJournalEntry(editingId, {
        content: content.trim(),
        mood,
        linkedGoalIds: linkedGoals,
      });
    } else {
      store.addJournalEntry({
        content: content.trim(),
        mood,
        linkedGoalIds: linkedGoals,
      });
    }
    setIsWriting(false);
    setContent("");
    setMood(null);
    setLinkedGoals([]);
    setEditingId(null);
  }

  function toggleGoal(goalId: string) {
    setLinkedGoals((prev) =>
      prev.includes(goalId) ? prev.filter((id) => id !== goalId) : [...prev, goalId]
    );
  }

  const today = new Date().toDateString();
  const todayEntries = store.journalEntries.filter(
    (e) => new Date(e.createdAt).toDateString() === today
  );
  const pastEntries = store.journalEntries.filter(
    (e) => new Date(e.createdAt).toDateString() !== today
  );

  // Group past entries by date
  const grouped: Record<string, JournalEntry[]> = {};
  pastEntries.forEach((entry) => {
    const key = new Date(entry.createdAt).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(entry);
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-8 py-6 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Journal
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              Reflect on your day. Your entries help the AI coach understand you better.
            </p>
          </div>
          {!isWriting && (
            <button onClick={startNew} className="btn-glow px-5 py-2.5 rounded-xl text-sm font-medium">
              + New Entry
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-2xl mx-auto">
          {/* Writing area */}
          {isWriting && (
            <div className="glass-static p-6 mb-8 animate-in">
              <textarea
                placeholder="What's on your mind? How was your day? What did you accomplish?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                autoFocus
                rows={6}
                className="w-full bg-transparent border-none outline-none resize-none text-sm leading-relaxed"
                style={{ color: "var(--text-primary)" }}
              />

              {/* Mood */}
              <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                <label className="text-xs mb-2 block" style={{ color: "var(--text-muted)" }}>
                  How are you feeling?
                </label>
                <div className="flex gap-2">
                  {MOODS.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setMood(mood === m.value ? null : m.value)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all"
                      style={{
                        background: mood === m.value ? "var(--accent-soft)" : "rgba(255,255,255,0.03)",
                        color: mood === m.value ? "var(--accent)" : "var(--text-muted)",
                        border: `1px solid ${mood === m.value ? "rgba(139,92,246,0.3)" : "var(--border)"}`,
                      }}
                    >
                      <span>{m.emoji}</span> {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Link to goals */}
              {store.goals.filter((g) => g.status === "active").length > 0 && (
                <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                  <label className="text-xs mb-2 block" style={{ color: "var(--text-muted)" }}>
                    Related goals
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {store.goals
                      .filter((g) => g.status === "active")
                      .map((goal) => (
                        <button
                          key={goal.id}
                          onClick={() => toggleGoal(goal.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all"
                          style={{
                            background: linkedGoals.includes(goal.id) ? `${goal.color}20` : "rgba(255,255,255,0.03)",
                            color: linkedGoals.includes(goal.id) ? goal.color : "var(--text-muted)",
                            border: `1px solid ${linkedGoals.includes(goal.id) ? `${goal.color}40` : "var(--border)"}`,
                          }}
                        >
                          <span className="w-2 h-2 rounded-full" style={{ background: goal.color }} />
                          {goal.title}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => { setIsWriting(false); setEditingId(null); }}
                  className="px-4 py-2 text-sm rounded-lg"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  disabled={!content.trim()}
                  className="btn-glow px-5 py-2 rounded-xl text-sm font-medium disabled:opacity-30"
                >
                  {editingId ? "Update" : "Save Entry"}
                </button>
              </div>
            </div>
          )}

          {/* Today */}
          {todayEntries.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
                Today
              </h3>
              <div className="space-y-3">
                {todayEntries.map((entry) => (
                  <EntryCard key={entry.id} entry={entry} store={store} onEdit={startEdit} />
                ))}
              </div>
            </div>
          )}

          {/* Past entries */}
          {Object.entries(grouped).map(([date, entries]) => (
            <div key={date} className="mb-8">
              <h3 className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
                {date}
              </h3>
              <div className="space-y-3">
                {entries.map((entry) => (
                  <EntryCard key={entry.id} entry={entry} store={store} onEdit={startEdit} />
                ))}
              </div>
            </div>
          ))}

          {/* Empty state */}
          {store.journalEntries.length === 0 && !isWriting && (
            <div className="text-center py-20" style={{ color: "var(--text-muted)" }}>
              <svg width="40" height="40" className="mx-auto mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ opacity: 0.4 }}>
                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              <p className="text-sm mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "var(--text-secondary)" }}>
                Start journaling
              </p>
              <p className="text-xs">Your entries feed into your AI coach for personalized guidance</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EntryCard({
  entry,
  store,
  onEdit,
}: {
  entry: JournalEntry;
  store: ReturnType<typeof useStore>;
  onEdit: (entry: JournalEntry) => void;
}) {
  const moodEmoji = MOODS.find((m) => m.value === entry.mood)?.emoji;
  const time = new Date(entry.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  return (
    <div className="glass-static p-5 group cursor-pointer" onClick={() => onEdit(entry)}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px]" style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>
            {time}
          </span>
          {moodEmoji && <span className="text-sm">{moodEmoji}</span>}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); store.deleteJournalEntry(entry.id); }}
          className="opacity-0 group-hover:opacity-100 p-1 rounded transition-all"
          style={{ color: "var(--text-muted)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
      <p className="text-sm whitespace-pre-wrap leading-relaxed" style={{ color: "var(--text-primary)" }}>
        {entry.content}
      </p>
      {entry.linkedGoalIds.length > 0 && (
        <div className="flex gap-1.5 mt-3 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
          {entry.linkedGoalIds.map((gid) => {
            const goal = store.goals.find((g) => g.id === gid);
            if (!goal) return null;
            return (
              <span
                key={gid}
                className="text-[10px] px-2 py-0.5 rounded-md"
                style={{ background: `${goal.color}15`, color: goal.color }}
              >
                {goal.title}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
