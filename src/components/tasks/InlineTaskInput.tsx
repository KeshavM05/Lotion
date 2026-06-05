'use client';

import { useState, useRef, useEffect } from 'react';
import { type Priority } from '@/lib/store';

interface InlineTaskInputProps {
  goalId?: string | null;
  onSave: (task: {
    title: string;
    priority: Priority;
    deadline: string | null;
    goalId: string | null;
  }) => void;
  goals?: { id: string; title: string; color: string; status?: string }[];
}

const PRIORITY_COLORS: Record<Priority, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#3b82f6',
};

export function InlineTaskInput({ goalId, onSave, goals = [] }: InlineTaskInputProps) {
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [deadline, setDeadline] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState(goalId ?? '');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (expanded) inputRef.current?.focus();
  }, [expanded]);

  useEffect(() => {
    if (!expanded) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        handleCancel();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

  function handleCancel() {
    setExpanded(false);
    setTitle('');
    setPriority('medium');
    setDeadline('');
    setSelectedGoalId(goalId ?? '');
  }

  function handleSubmit() {
    if (!title.trim()) {
      handleCancel();
      return;
    }
    onSave({
      title: title.trim(),
      priority,
      deadline: deadline ? new Date(deadline).toISOString() : null,
      goalId: selectedGoalId || null,
    });
    setTitle('');
    setPriority('medium');
    setDeadline('');
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  }

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="flex items-center gap-2 w-full max-w-3xl px-4 py-2.5 rounded-xl text-[#6B7280] hover:text-[#9CA3AF] hover:bg-white/[0.02] transition-all group"
      >
        <span className="material-symbols-outlined text-base opacity-50 group-hover:opacity-70">
          add
        </span>
        <span className="text-sm">Add task</span>
      </button>
    );
  }

  return (
    <div
      ref={containerRef}
      className="max-w-3xl rounded-xl border border-[#C17A72]/30 bg-[#1F2D47]/80 backdrop-blur-sm overflow-hidden"
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <span className="w-5 h-5 rounded-full border-2 border-white/10 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Task name"
          className="flex-1 bg-transparent text-sm text-[#F5F5F5] placeholder-[#6B7280] focus:outline-none"
        />
        <button
          onClick={handleSubmit}
          disabled={!title.trim()}
          className="w-6 h-6 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
          style={{ background: title.trim() ? '#C17A72' : 'rgba(255,255,255,0.05)' }}
        >
          <span className="material-symbols-outlined text-xs text-white">check</span>
        </button>
      </div>

      <div className="flex items-center gap-2 px-4 pb-3 border-t border-white/5 pt-2">
        <div className="flex items-center gap-1">
          {(['low', 'medium', 'high', 'critical'] as Priority[]).map((p) => (
            <button
              key={p}
              onClick={() => setPriority(p)}
              title={p}
              className="w-5 h-5 rounded-full border-2 transition-all"
              style={{
                borderColor: PRIORITY_COLORS[p],
                background: priority === p ? PRIORITY_COLORS[p] : 'transparent',
                opacity: priority === p ? 1 : 0.4,
              }}
            />
          ))}
        </div>

        <div className="h-3 w-px bg-white/10" />

        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-xs text-[#6B7280]">event</span>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="bg-transparent text-xs text-[#9CA3AF] focus:outline-none cursor-pointer w-28"
          />
        </div>

        {goals.length > 0 && (
          <>
            <div className="h-3 w-px bg-white/10" />
            <select
              value={selectedGoalId}
              onChange={(e) => setSelectedGoalId(e.target.value)}
              className="bg-transparent text-xs text-[#9CA3AF] focus:outline-none cursor-pointer"
            >
              <option value="">No goal</option>
              {goals.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title}
                </option>
              ))}
            </select>
          </>
        )}

        <div className="flex-1" />

        <button
          onClick={handleCancel}
          className="text-xs text-[#6B7280] hover:text-[#9CA3AF] transition-colors"
        >
          Esc
        </button>
      </div>
    </div>
  );
}
