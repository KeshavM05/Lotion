'use client';

import { useState } from 'react';
import {
  type Task,
  type Goal,
  type Priority,
  type EnergyLevel,
  type TimePreference,
  PRIORITY_LABELS,
  ENERGY_LABELS,
  TIME_PREFERENCE_LABELS,
} from '@/lib/store';

interface InlineTaskDetailProps {
  task: Task;
  goals: Goal[];
  onSave: (updates: Partial<Task>) => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
}

export function InlineTaskDetail({
  task,
  goals,
  onSave,
  onCancel,
  onDelete,
}: InlineTaskDetailProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? '');
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [duration, setDuration] = useState(task.durationMinutes);
  const [deadline, setDeadline] = useState(task.deadline ? task.deadline.split('T')[0] : '');
  const [goalId, setGoalId] = useState(task.goalId ?? '');
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>(task.energyLevel ?? 'medium');
  const [timePreference, setTimePreference] = useState<TimePreference>(
    task.timePreference ?? 'anytime'
  );
  const [tags, setTags] = useState<string[]>(task.tags ?? []);
  const [tagInput, setTagInput] = useState('');

  function handleSave() {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      description: description.trim(),
      priority,
      durationMinutes: duration,
      deadline: deadline ? new Date(deadline).toISOString() : null,
      goalId: goalId || null,
      energyLevel,
      timePreference,
      tags,
    });
  }

  function addTag() {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  }

  return (
    <div
      className="overflow-hidden transition-all duration-200"
      style={{ animation: 'expandIn 0.18s ease' }}
    >
      <style>{`
        @keyframes expandIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        className="mx-4 mb-2 rounded-xl border border-white/10 p-4 flex flex-col gap-3"
        style={{ background: '#1F2D47' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          autoFocus
          className="input-glass text-sm font-medium"
          placeholder="Task title"
        />

        {/* Description */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          placeholder="Description (optional)"
          className="input-glass resize-none text-sm"
        />

        {/* Priority */}
        <div>
          <label className="text-xs mb-1.5 block text-[#9CA3AF]">Priority</label>
          <div className="flex gap-2 flex-wrap">
            {(['low', 'medium', 'high', 'critical'] as Priority[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: priority === p ? 'rgba(193,122,114,0.18)' : 'rgba(255,255,255,0.03)',
                  color: priority === p ? '#C17A72' : '#9CA3AF',
                  border: `1px solid ${priority === p ? 'rgba(193,122,114,0.3)' : 'rgba(255,255,255,0.08)'}`,
                }}
              >
                {PRIORITY_LABELS[p]}
              </button>
            ))}
          </div>
        </div>

        {/* Duration + Deadline */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs mb-1 block text-[#9CA3AF]">Duration</label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="input-glass w-full text-sm"
            >
              <option value={15}>15 min</option>
              <option value={30}>30 min</option>
              <option value={45}>45 min</option>
              <option value={60}>1 hour</option>
              <option value={90}>1.5 hours</option>
              <option value={120}>2 hours</option>
            </select>
          </div>
          <div>
            <label className="text-xs mb-1 block text-[#9CA3AF]">Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="input-glass w-full text-sm"
            />
          </div>
        </div>

        {/* Goal */}
        {goals.length > 0 && (
          <div>
            <label className="text-xs mb-1 block text-[#9CA3AF]">Goal</label>
            <select
              value={goalId}
              onChange={(e) => setGoalId(e.target.value)}
              className="input-glass w-full text-sm"
            >
              <option value="">No goal</option>
              {goals
                .filter((g) => g.status === 'active')
                .map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title}
                  </option>
                ))}
            </select>
          </div>
        )}

        {/* Energy + Time Preference */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs mb-1 block text-[#9CA3AF]">Energy Level</label>
            <select
              value={energyLevel}
              onChange={(e) => setEnergyLevel(e.target.value as EnergyLevel)}
              className="input-glass w-full text-sm"
            >
              {(['low', 'medium', 'high'] as EnergyLevel[]).map((level) => (
                <option key={level} value={level}>
                  {ENERGY_LABELS[level]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs mb-1 block text-[#9CA3AF]">Time Preference</label>
            <select
              value={timePreference}
              onChange={(e) => setTimePreference(e.target.value as TimePreference)}
              className="input-glass w-full text-sm"
            >
              {(['morning', 'afternoon', 'evening', 'anytime'] as TimePreference[]).map((time) => (
                <option key={time} value={time}>
                  {TIME_PREFERENCE_LABELS[time]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="text-xs mb-1 block text-[#9CA3AF]">Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 bg-[#C17A72]/20 text-[#C17A72] rounded text-xs"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => setTags(tags.filter((t) => t !== tag))}
                  className="hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-xs">close</span>
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && tagInput.trim()) {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="Add tag..."
              className="input-glass flex-1 text-xs"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#9CA3AF] hover:text-white transition-colors text-xs"
            >
              <span className="material-symbols-outlined text-sm">add</span>
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-1 border-t border-white/10">
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            className="px-3 py-2 text-xs rounded-lg text-[#ef4444] hover:bg-red-500/10 transition-colors"
          >
            Delete
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs rounded-lg text-[#9CA3AF] hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="btn-glow px-5 py-2 rounded-xl text-xs font-medium"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
