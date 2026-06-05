'use client';

import { useState, useMemo } from 'react';
import { useStore, type JournalEntry } from '@/lib/store';
import { RichTextEditor } from '@/components/journal/RichTextEditor';

const MOODS = [
  { value: 'great', emoji: '✨', label: 'Great' },
  { value: 'good', emoji: '☺️', label: 'Good' },
  { value: 'okay', emoji: '😐', label: 'Okay' },
  { value: 'bad', emoji: '😞', label: 'Bad' },
  { value: 'terrible', emoji: '😩', label: 'Terrible' },
] as const;

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export default function JournalPage() {
  const store = useStore();

  const [isWriting, setIsWriting] = useState(false);
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<JournalEntry['mood']>(null);
  const [linkedGoals, setLinkedGoals] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMood, setFilterMood] = useState<JournalEntry['mood'] | 'all'>('all');

  function startNew() {
    setEditingId(null);
    setContent('');
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

  function cancelEdit() {
    setIsWriting(false);
    setEditingId(null);
    setContent('');
    setMood(null);
    setLinkedGoals([]);
  }

  async function save() {
    const text = stripHtml(content);
    if (!text.trim()) return;
    if (editingId) {
      await store.updateJournalEntry(editingId, { content, mood, linkedGoalIds: linkedGoals });
    } else {
      await store.addJournalEntry({ content, mood, linkedGoalIds: linkedGoals });
    }
    cancelEdit();
  }

  function toggleGoal(goalId: string) {
    setLinkedGoals((prev) =>
      prev.includes(goalId) ? prev.filter((id) => id !== goalId) : [...prev, goalId]
    );
  }

  const filteredEntries = useMemo(() => {
    return store.journalEntries.filter((e) => {
      if (filterMood !== 'all' && e.mood !== filterMood) return false;
      if (searchQuery.trim()) {
        const text = stripHtml(e.content).toLowerCase();
        if (!text.includes(searchQuery.toLowerCase())) return false;
      }
      return true;
    });
  }, [store.journalEntries, searchQuery, filterMood]);

  const today = new Date().toDateString();
  const todayEntries = filteredEntries.filter(
    (e) => new Date(e.createdAt).toDateString() === today
  );
  const pastEntries = filteredEntries.filter((e) => new Date(e.createdAt).toDateString() !== today);

  const grouped: Record<string, JournalEntry[]> = {};
  pastEntries.forEach((entry) => {
    const key = new Date(entry.createdAt).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(entry);
  });

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-['Space_Grotesk'] font-bold text-[#F5F5F5]">Journal</h1>
          {!isWriting && (
            <button
              onClick={startNew}
              className="btn-glow px-5 py-2.5 rounded-xl text-sm font-medium"
            >
              + New Entry
            </button>
          )}
        </div>

        {!isWriting && store.journalEntries.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[180px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-sm text-[#9CA3AF]">
                search
              </span>
              <input
                type="text"
                placeholder="Search entries…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-glass w-full pl-9 py-2 text-sm"
              />
            </div>
            <select
              value={filterMood ?? 'all'}
              onChange={(e) =>
                setFilterMood(
                  e.target.value === 'all' ? 'all' : (e.target.value as JournalEntry['mood'])
                )
              }
              className="input-glass py-2 text-sm"
            >
              <option value="all">All moods</option>
              {MOODS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.emoji} {m.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-2xl mx-auto">
          {isWriting && (
            <div className="glass-static p-6 mb-8 animate-in">
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="What's on your mind? How was your day? What did you accomplish?"
                autoFocus
              />

              <div className="mt-4 pt-4 border-t border-white/10">
                <label className="text-xs mb-2 block text-[#9CA3AF]">How are you feeling?</label>
                <div className="flex gap-2 flex-wrap">
                  {MOODS.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setMood(mood === m.value ? null : m.value)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all"
                      style={{
                        background:
                          mood === m.value ? 'var(--accent-soft)' : 'rgba(255,255,255,0.03)',
                        color: mood === m.value ? 'var(--accent)' : 'var(--text-muted)',
                        border: `1px solid ${mood === m.value ? 'rgba(193,122,114,0.3)' : 'var(--border)'}`,
                      }}
                    >
                      <span>{m.emoji}</span> {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {store.goals.filter((g) => g.status === 'active').length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <label className="text-xs mb-2 block text-[#9CA3AF]">Related goals</label>
                  <div className="flex gap-2 flex-wrap">
                    {store.goals
                      .filter((g) => g.status === 'active')
                      .map((goal) => (
                        <button
                          key={goal.id}
                          onClick={() => toggleGoal(goal.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all"
                          style={{
                            background: linkedGoals.includes(goal.id)
                              ? `${goal.color}20`
                              : 'rgba(255,255,255,0.03)',
                            color: linkedGoals.includes(goal.id) ? goal.color : 'var(--text-muted)',
                            border: `1px solid ${linkedGoals.includes(goal.id) ? `${goal.color}40` : 'var(--border)'}`,
                          }}
                        >
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ background: goal.color }}
                          />
                          {goal.title}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 text-sm rounded-lg"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  disabled={!stripHtml(content).trim()}
                  className="btn-glow px-5 py-2 rounded-xl text-sm font-medium disabled:opacity-30"
                >
                  {editingId ? 'Update' : 'Save Entry'}
                </button>
              </div>
            </div>
          )}

          {todayEntries.length > 0 && (
            <div className="mb-8">
              <h3
                className="text-xs font-medium uppercase tracking-wider mb-3"
                style={{ color: 'var(--text-muted)' }}
              >
                Today
              </h3>
              <div className="relative pl-6 ml-2">
                <div
                  className="absolute left-0 top-0 bottom-0 w-px"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                />
                {todayEntries.map((entry) => (
                  <EntryCard key={entry.id} entry={entry} store={store} onEdit={startEdit} />
                ))}
              </div>
            </div>
          )}

          {Object.entries(grouped).map(([date, entries]) => (
            <div key={date} className="mb-8">
              <h3
                className="text-xs font-medium uppercase tracking-wider mb-3"
                style={{ color: 'var(--text-muted)' }}
              >
                {date}
              </h3>
              <div className="relative pl-6 ml-2">
                <div
                  className="absolute left-0 top-0 bottom-0 w-px"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                />
                {entries.map((entry) => (
                  <EntryCard key={entry.id} entry={entry} store={store} onEdit={startEdit} />
                ))}
              </div>
            </div>
          ))}

          {filteredEntries.length === 0 && store.journalEntries.length > 0 && !isWriting && (
            <div className="text-center py-12 text-[#9CA3AF]">
              <span className="material-symbols-outlined text-3xl block mb-2 opacity-40">
                search_off
              </span>
              <p className="text-sm">No entries match your search</p>
            </div>
          )}

          {store.journalEntries.length === 0 && !isWriting && (
            <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>
              <svg
                width="40"
                height="40"
                className="mx-auto mb-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                style={{ opacity: 0.4 }}
              >
                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              <p
                className="text-sm mb-1"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  color: 'var(--text-secondary)',
                }}
              >
                Start journaling
              </p>
              <p className="text-xs">
                Your entries feed into your AI coach for personalized guidance
              </p>
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
  const time = new Date(entry.createdAt).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
  const isHtml = entry.content.trimStart().startsWith('<');

  return (
    <div className="relative pb-6 group cursor-pointer" onClick={() => onEdit(entry)}>
      <div
        className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full border-2 transition-colors z-10"
        style={{ background: 'var(--bg-secondary)', borderColor: 'rgba(255,255,255,0.15)' }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)')}
      />

      <div
        className="rounded-xl p-4 transition-all"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-hover)';
          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
          (e.currentTarget as HTMLElement).style.transform = 'translateX(4px)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)';
          (e.currentTarget as HTMLElement).style.transform = 'translateX(0)';
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[10px] font-medium text-[#9CA3AF]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {time}
            </span>
            {moodEmoji && <span className="text-sm">{moodEmoji}</span>}
            {entry.linkedGoalIds.map((gid) => {
              const goal = store.goals.find((g) => g.id === gid);
              if (!goal) return null;
              return (
                <span
                  key={gid}
                  className="text-[10px] px-1.5 py-0.5 rounded"
                  style={{ background: `${goal.color}15`, color: goal.color }}
                >
                  #{goal.title}
                </span>
              );
            })}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              store.deleteJournalEntry(entry.id);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 rounded transition-all text-[#9CA3AF] hover:text-white"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isHtml ? (
          <div
            className="text-sm leading-relaxed journal-entry-preview"
            dangerouslySetInnerHTML={{ __html: entry.content }}
          />
        ) : (
          <p
            className="text-sm whitespace-pre-wrap leading-relaxed"
            style={{ color: 'var(--text-primary)' }}
          >
            {entry.content}
          </p>
        )}
      </div>
    </div>
  );
}
