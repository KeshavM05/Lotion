'use client';

import { useState } from 'react';
import {
  useStore,
  type Task,
  type Priority,
  type EnergyLevel,
  type TimePreference,
  PRIORITY_LABELS,
  ENERGY_LABELS,
  TIME_PREFERENCE_LABELS,
} from '@/lib/store';
import { Modal } from '@/components/ui/modal';

interface TaskModalProps {
  open: boolean;
  editingTask: Task | null;
  initialValues: {
    title: string;
    description: string;
    priority: Priority;
    duration: number;
    deadline: string;
    goalId: string;
    energyLevel: EnergyLevel;
    timePreference: TimePreference;
    tags: string[];
  };
  onClose: () => void;
  onSaved: () => void;
}

export function TaskModal({ open, editingTask, initialValues, onClose, onSaved }: TaskModalProps) {
  const store = useStore();

  const [formTitle, setFormTitle] = useState(initialValues.title);
  const [formDescription, setFormDescription] = useState(initialValues.description);
  const [formPriority, setFormPriority] = useState<Priority>(initialValues.priority);
  const [formDuration, setFormDuration] = useState(initialValues.duration);
  const [formDeadline, setFormDeadline] = useState(initialValues.deadline);
  const [formGoalId, setFormGoalId] = useState(initialValues.goalId);
  const [formEnergyLevel, setFormEnergyLevel] = useState<EnergyLevel>(initialValues.energyLevel);
  const [formTimePreference, setFormTimePreference] = useState<TimePreference>(
    initialValues.timePreference
  );
  const [formTags, setFormTags] = useState<string[]>(initialValues.tags);
  const [tagInput, setTagInput] = useState('');

  // Sync form fields when initialValues change (driven by parent opening the modal)
  // This pattern is intentional — parent resets via key prop or by re-mounting
  // We use useEffect to track changes when editingTask changes
  // (handled by parent unmounting/remounting via key={editingTask?.id ?? "new"})

  function handleSave() {
    if (!formTitle.trim()) return;
    const data = {
      title: formTitle.trim(),
      description: formDescription.trim(),
      priority: formPriority,
      durationMinutes: formDuration,
      deadline: formDeadline ? new Date(formDeadline).toISOString() : null,
      goalId: formGoalId || null,
      energyLevel: formEnergyLevel,
      timePreference: formTimePreference,
      tags: formTags,
    };
    if (editingTask) {
      store.updateTask(editingTask.id, data);
    } else {
      store.addTask({
        ...data,
        status: 'todo',
        milestoneId: null,
        listId: null,
        scheduledStart: null,
        scheduledEnd: null,
      });
    }
    onSaved();
  }

  function addTag() {
    if (tagInput.trim() && !formTags.includes(tagInput.trim())) {
      setFormTags([...formTags, tagInput.trim()]);
      setTagInput('');
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={editingTask ? 'Edit Task' : 'New Task'}>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Task title"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          autoFocus
          className="input-glass"
        />
        <textarea
          placeholder="Description (optional)"
          value={formDescription}
          onChange={(e) => setFormDescription(e.target.value)}
          rows={2}
          className="input-glass resize-none"
        />
        <div>
          <label className="text-xs mb-2 block" style={{ color: 'var(--text-muted)' }}>
            Priority
          </label>
          <div className="flex gap-2">
            {(['low', 'medium', 'high', 'critical'] as Priority[]).map((p) => (
              <button
                key={p}
                onClick={() => setFormPriority(p)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: formPriority === p ? 'var(--accent-soft)' : 'rgba(255,255,255,0.03)',
                  color: formPriority === p ? 'var(--accent)' : 'var(--text-muted)',
                  border: `1px solid ${formPriority === p ? 'rgba(193,122,114,0.3)' : 'var(--border)'}`,
                }}
              >
                {PRIORITY_LABELS[p]}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>
              Duration
            </label>
            <select
              value={formDuration}
              onChange={(e) => setFormDuration(Number(e.target.value))}
              className="input-glass w-full"
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
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>
              Deadline
            </label>
            <input
              type="date"
              value={formDeadline}
              onChange={(e) => setFormDeadline(e.target.value)}
              className="input-glass w-full"
            />
          </div>
        </div>
        {store.goals.length > 0 && (
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>
              Goal
            </label>
            <select
              value={formGoalId}
              onChange={(e) => setFormGoalId(e.target.value)}
              className="input-glass w-full"
            >
              <option value="">No goal</option>
              {store.goals
                .filter((g) => g.status === 'active')
                .map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title}
                  </option>
                ))}
            </select>
          </div>
        )}

        {/* Advanced Fields */}
        <div className="border-t border-white/10 pt-4">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>
                Energy Level
              </label>
              <select
                value={formEnergyLevel}
                onChange={(e) => setFormEnergyLevel(e.target.value as EnergyLevel)}
                className="input-glass w-full"
              >
                {(['low', 'medium', 'high'] as EnergyLevel[]).map((level) => (
                  <option key={level} value={level}>
                    {ENERGY_LABELS[level]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>
                Time Preference
              </label>
              <select
                value={formTimePreference}
                onChange={(e) => setFormTimePreference(e.target.value as TimePreference)}
                className="input-glass w-full"
              >
                {(['morning', 'afternoon', 'evening', 'anytime'] as TimePreference[]).map(
                  (time) => (
                    <option key={time} value={time}>
                      {TIME_PREFERENCE_LABELS[time]}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-[#C17A72]/20 text-[#C17A72] rounded text-xs"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => setFormTags(formTags.filter((t) => t !== tag))}
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
        </div>

        <div className="flex items-center justify-between pt-2">
          {editingTask ? (
            <button
              onClick={() => {
                store.deleteTask(editingTask.id);
                onSaved();
              }}
              className="px-3 py-2 text-sm rounded-lg"
              style={{ color: 'var(--danger)' }}
            >
              Delete
            </button>
          ) : (
            <div />
          )}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg"
              style={{ color: 'var(--text-secondary)' }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="btn-glow px-5 py-2 rounded-xl text-sm font-medium"
            >
              {editingTask ? 'Save' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
