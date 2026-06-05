'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  useStore,
  type Goal,
  type GoalCategory,
  type Priority,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  PRIORITY_LABELS,
} from '@/lib/store';
import { useGoals, useCreateGoal, useUpdateGoal, useDeleteGoal } from '@/lib/hooks/useGoals';
import { Modal } from '@/components/ui/modal';
import { ProgressRing } from '@/components/ui/progress-ring';
import { usePageHeader } from '@/lib/page-header-context';

const CATEGORIES: GoalCategory[] = [
  'career',
  'business',
  'finance',
  'personal',
  'health',
  'creative',
];
const PRIORITIES: Priority[] = ['low', 'medium', 'high', 'critical'];

export default function GoalsPage() {
  const { data: goals = [] } = useGoals();
  const createGoalMutation = useCreateGoal();
  const updateGoalMutation = useUpdateGoal();
  const deleteGoalMutation = useDeleteGoal();
  const store = useStore();
  const { setPageControls } = usePageHeader();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [filterCategory, setFilterCategory] = useState<GoalCategory | 'all'>('all');
  const [loading, setLoading] = useState(false);

  // Form
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState<GoalCategory>('career');
  const [formPriority, setFormPriority] = useState<Priority>('medium');
  const [formTargetDate, setFormTargetDate] = useState('');

  function openCreate() {
    setEditingGoal(null);
    setFormTitle('');
    setFormDescription('');
    setFormCategory('career');
    setFormPriority('medium');
    setFormTargetDate('');
    setModalOpen(true);
  }

  function openEdit(goal: Goal) {
    setEditingGoal(goal);
    setFormTitle(goal.title);
    setFormDescription(goal.description);
    setFormCategory(goal.category);
    setFormPriority(goal.priority);
    setFormTargetDate(goal.targetDate ? goal.targetDate.split('T')[0] : '');
    setModalOpen(true);
  }

  async function handleSave() {
    if (!formTitle.trim() || loading) return;

    setLoading(true);
    try {
      const data = {
        title: formTitle.trim(),
        description: formDescription.trim(),
        category: formCategory,
        priority: formPriority,
        targetDate: formTargetDate ? new Date(formTargetDate).toISOString() : null,
        color: CATEGORY_COLORS[formCategory],
        status: 'active' as const,
      };

      if (editingGoal) {
        await updateGoalMutation.mutateAsync({ id: editingGoal.id, updates: data });
      } else {
        await createGoalMutation.mutateAsync(data);
      }

      setModalOpen(false);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!editingGoal || loading) return;

    if (
      !confirm(
        'Are you sure you want to delete this goal? This will also remove all associated milestones and unlink tasks.'
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      await deleteGoalMutation.mutateAsync(editingGoal.id);
      setModalOpen(false);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  const activeGoals = goals.filter((g) => g.status === 'active');
  const filteredGoals =
    filterCategory === 'all'
      ? activeGoals
      : activeGoals.filter((g) => g.category === filterCategory);
  const completedGoals = goals.filter((g) => g.status === 'completed');

  // Set header controls
  useEffect(() => {
    setPageControls(
      <div className="flex items-center justify-between w-full">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-['Space_Grotesk'] tracking-wide border transition-all ${
              filterCategory === 'all'
                ? 'border-[#C17A72] text-[#C17A72] bg-[#C17A72]/10'
                : 'border-white/10 text-[#9CA3AF] hover:border-white/20 hover:text-[#F5F5F5]'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-['Space_Grotesk'] tracking-wide border transition-all ${
                filterCategory === cat
                  ? 'border-[#C17A72] text-[#C17A72] bg-[#C17A72]/10'
                  : 'border-white/10 text-[#9CA3AF] hover:border-white/20 hover:text-[#F5F5F5]'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={openCreate}
            className="btn-glow px-4 py-1.5 rounded-xl text-sm font-medium flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">add</span>
            New Goal
          </button>
        </div>
      </div>
    );

    return () => setPageControls(null);
  }, [filterCategory, setPageControls]);

  return (
    <div className="flex flex-col h-full">
      {/* Goals Grid */}
      <div className="flex-1 overflow-auto">
        {filteredGoals.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-24"
            style={{ color: 'var(--text-muted)' }}
          >
            <span className="material-symbols-outlined text-5xl opacity-20 mb-4">
              auto_awesome_motion
            </span>
            <p
              className="text-lg mb-1"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: 'var(--text-secondary)',
              }}
            >
              No goals yet
            </p>
            <p className="text-sm">Define your vision and let AI help you get there</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGoals.map((goal) => {
              const progress = store.getGoalProgress(goal.id);
              const milestones = store.getGoalMilestones(goal.id);
              const tasks = store.getGoalTasks(goal.id);

              return (
                <Link
                  key={goal.id}
                  href={`/goals/${goal.id}`}
                  className="glass-card p-8 rounded-2xl flex flex-col justify-between group hover:border-[#C17A72]/30 transition-all duration-500 hover:-translate-y-1"
                >
                  {/* Header with Progress Ring */}
                  <div className="flex justify-between items-start mb-12">
                    <div className="relative w-24 h-24">
                      <ProgressRing progress={progress} size={96} strokeWidth={6} color="#C17A72">
                        <span className="font-['JetBrains_Mono'] text-lg text-[#F5F5F5]">
                          {progress}%
                        </span>
                      </ProgressRing>
                    </div>
                    <span className="text-xs font-['Space_Grotesk'] tracking-widest text-[#9CA3AF] uppercase">
                      {CATEGORY_LABELS[goal.category]} •{' '}
                      {goal.targetDate
                        ? new Date(goal.targetDate)
                            .toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                            .toUpperCase()
                        : 'ONGOING'}
                    </span>
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-2xl font-['Playfair_Display'] text-[#F5F5F5] mb-2">
                      {goal.title}
                    </h3>
                    {goal.description && (
                      <p className="text-[#9CA3AF] text-sm font-['Space_Grotesk'] mb-6 leading-relaxed line-clamp-2">
                        {goal.description}
                      </p>
                    )}

                    {/* Milestones */}
                    {milestones.length > 0 && (
                      <div className="space-y-3">
                        {milestones.slice(0, 3).map((ms) => (
                          <div key={ms.id} className="flex items-center gap-3 text-xs">
                            <span
                              className={`material-symbols-outlined text-sm ${
                                ms.completed ? 'text-[#C17A72]' : 'text-[#BEC6DF]'
                              }`}
                              style={ms.completed ? { fontVariationSettings: "'FILL' 1" } : {}}
                            >
                              {ms.completed ? 'check_circle' : 'radio_button_unchecked'}
                            </span>
                            <span className={ms.completed ? 'text-[#9CA3AF]' : 'text-[#BEC6DF]'}>
                              {ms.title}
                            </span>
                          </div>
                        ))}
                        {milestones.length > 3 && (
                          <span className="text-[10px] text-[#9CA3AF]">
                            +{milestones.length - 3} more milestones
                          </span>
                        )}
                      </div>
                    )}
                    {tasks.length > 0 && milestones.length === 0 && (
                      <div className="text-xs text-[#9CA3AF]">
                        {tasks.filter((t) => t.completed).length}/{tasks.length} tasks completed
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Completed goals */}
        {completedGoals.length > 0 && (
          <div className="mt-10 max-w-6xl">
            <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-muted)' }}>
              Completed ({completedGoals.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedGoals.map((goal) => (
                <div key={goal.id} className="glass-static p-4" style={{ opacity: 0.6 }}>
                  <div className="flex items-center gap-2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--success)"
                      strokeWidth="2"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium">{goal.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingGoal ? 'Edit Goal' : 'New Goal'}
      >
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="What do you want to achieve?"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            autoFocus
            className="input-glass text-base"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          />
          <textarea
            placeholder="Why is this important to you? (optional)"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            rows={3}
            className="input-glass resize-none"
          />

          {/* Category */}
          <div>
            <label className="text-xs mb-2 block" style={{ color: 'var(--text-muted)' }}>
              Category
            </label>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFormCategory(cat)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background:
                      formCategory === cat ? `${CATEGORY_COLORS[cat]}20` : 'rgba(255,255,255,0.03)',
                    color: formCategory === cat ? CATEGORY_COLORS[cat] : 'var(--text-muted)',
                    border: `1px solid ${formCategory === cat ? `${CATEGORY_COLORS[cat]}40` : 'var(--border)'}`,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: CATEGORY_COLORS[cat] }}
                  />
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="text-xs mb-2 block" style={{ color: 'var(--text-muted)' }}>
              Priority
            </label>
            <div className="flex gap-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  onClick={() => setFormPriority(p)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background:
                      formPriority === p ? 'var(--accent-soft)' : 'rgba(255,255,255,0.03)',
                    color: formPriority === p ? 'var(--accent)' : 'var(--text-muted)',
                    border: `1px solid ${formPriority === p ? 'rgba(193,122,114,0.3)' : 'var(--border)'}`,
                  }}
                >
                  {PRIORITY_LABELS[p]}
                </button>
              ))}
            </div>
          </div>

          {/* Target date */}
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>
              Target Date
            </label>
            <input
              type="date"
              value={formTargetDate}
              onChange={(e) => setFormTargetDate(e.target.value)}
              className="input-glass w-full"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            {editingGoal ? (
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-3 py-2 text-sm rounded-lg transition-colors disabled:opacity-50"
                style={{ color: 'var(--danger)' }}
                onMouseEnter={(e) =>
                  !loading && (e.currentTarget.style.background = 'rgba(248,113,113,0.1)')
                }
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                {loading ? 'Deleting...' : 'Delete Goal'}
              </button>
            ) : (
              <div />
            )}
            <div className="flex gap-2">
              <button
                onClick={() => setModalOpen(false)}
                disabled={loading}
                className="px-4 py-2 text-sm rounded-lg transition-colors disabled:opacity-50"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) =>
                  !loading && (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')
                }
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading || !formTitle.trim()}
                className="btn-glow px-5 py-2 rounded-xl text-sm font-medium disabled:opacity-50"
              >
                {loading ? 'Saving...' : editingGoal ? 'Save' : 'Create Goal'}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
