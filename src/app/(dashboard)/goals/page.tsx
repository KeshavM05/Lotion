"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore, type Goal, type GoalCategory, type Priority, CATEGORY_COLORS, CATEGORY_LABELS, PRIORITY_LABELS } from "@/lib/store";
import { Modal } from "@/components/ui/modal";
import { ProgressRing } from "@/components/ui/progress-ring";

const CATEGORIES: GoalCategory[] = ["career", "business", "finance", "personal", "health", "creative"];
const PRIORITIES: Priority[] = ["low", "medium", "high", "critical"];

export default function GoalsPage() {
  const store = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [filterCategory, setFilterCategory] = useState<GoalCategory | "all">("all");

  // Form
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState<GoalCategory>("career");
  const [formPriority, setFormPriority] = useState<Priority>("medium");
  const [formTargetDate, setFormTargetDate] = useState("");

  function openCreate() {
    setEditingGoal(null);
    setFormTitle("");
    setFormDescription("");
    setFormCategory("career");
    setFormPriority("medium");
    setFormTargetDate("");
    setModalOpen(true);
  }

  function openEdit(goal: Goal) {
    setEditingGoal(goal);
    setFormTitle(goal.title);
    setFormDescription(goal.description);
    setFormCategory(goal.category);
    setFormPriority(goal.priority);
    setFormTargetDate(goal.targetDate ? goal.targetDate.split("T")[0] : "");
    setModalOpen(true);
  }

  function handleSave() {
    if (!formTitle.trim()) return;
    const data = {
      title: formTitle.trim(),
      description: formDescription.trim(),
      category: formCategory,
      priority: formPriority,
      targetDate: formTargetDate ? new Date(formTargetDate).toISOString() : null,
      color: CATEGORY_COLORS[formCategory],
      status: "active" as const,
    };
    if (editingGoal) {
      store.updateGoal(editingGoal.id, data);
    } else {
      store.addGoal(data);
    }
    setModalOpen(false);
  }

  function handleDelete() {
    if (editingGoal) {
      store.deleteGoal(editingGoal.id);
      setModalOpen(false);
    }
  }

  const activeGoals = store.goals.filter((g) => g.status === "active");
  const filteredGoals = filterCategory === "all"
    ? activeGoals
    : activeGoals.filter((g) => g.category === filterCategory);
  const completedGoals = store.goals.filter((g) => g.status === "completed");

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-8 py-6 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Vision Board
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              {activeGoals.length} active goal{activeGoals.length !== 1 ? "s" : ""} guiding your journey
            </p>
          </div>
          <button onClick={openCreate} className="btn-glow px-5 py-2.5 rounded-xl text-sm font-medium">
            + New Goal
          </button>
        </div>

        {/* Category filters */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilterCategory("all")}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background: filterCategory === "all" ? "var(--accent-soft)" : "transparent",
              color: filterCategory === "all" ? "var(--accent)" : "var(--text-muted)",
              border: `1px solid ${filterCategory === "all" ? "rgba(139,92,246,0.3)" : "var(--border)"}`,
            }}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5"
              style={{
                background: filterCategory === cat ? `${CATEGORY_COLORS[cat]}15` : "transparent",
                color: filterCategory === cat ? CATEGORY_COLORS[cat] : "var(--text-muted)",
                border: `1px solid ${filterCategory === cat ? `${CATEGORY_COLORS[cat]}40` : "var(--border)"}`,
              }}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: CATEGORY_COLORS[cat] }} />
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Goals Grid */}
      <div className="flex-1 overflow-auto p-8">
        {filteredGoals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24" style={{ color: "var(--text-muted)" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-4" style={{ opacity: 0.4 }}>
              <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
            </svg>
            <p className="text-lg mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "var(--text-secondary)" }}>
              No goals yet
            </p>
            <p className="text-sm">Define your vision and let AI help you get there</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children max-w-6xl">
            {filteredGoals.map((goal) => {
              const progress = store.getGoalProgress(goal.id);
              const milestones = store.getGoalMilestones(goal.id);
              const tasks = store.getGoalTasks(goal.id);
              const completedTasks = tasks.filter((t) => t.completed).length;

              return (
                <Link
                  key={goal.id}
                  href={`/goals/${goal.id}`}
                  className="glass group cursor-pointer transition-all duration-200"
                  style={{ padding: 0, overflow: "hidden" }}
                >
                  {/* Color bar */}
                  <div className="h-1" style={{ background: goal.color }} />

                  <div className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0 mr-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-md"
                            style={{ background: `${goal.color}15`, color: goal.color }}
                          >
                            {CATEGORY_LABELS[goal.category]}
                          </span>
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded"
                            style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-muted)" }}
                          >
                            {PRIORITY_LABELS[goal.priority]}
                          </span>
                        </div>
                        <h3
                          className="text-base font-semibold truncate"
                          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "var(--text-primary)" }}
                        >
                          {goal.title}
                        </h3>
                        {goal.description && (
                          <p className="text-xs mt-1 line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                            {goal.description}
                          </p>
                        )}
                      </div>
                      <ProgressRing progress={progress} size={52} strokeWidth={3} color={goal.color}>
                        <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                          {progress}%
                        </span>
                      </ProgressRing>
                    </div>

                    {/* Milestones preview */}
                    {milestones.length > 0 && (
                      <div className="mb-3 space-y-1.5">
                        {milestones.slice(0, 3).map((ms) => (
                          <div key={ms.id} className="flex items-center gap-2">
                            <div
                              className="w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                              style={{
                                borderColor: ms.completed ? goal.color : "var(--border)",
                                background: ms.completed ? goal.color : "transparent",
                              }}
                            >
                              {ms.completed && (
                                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                  <path d="M20 6L9 17l-5-5" />
                                </svg>
                              )}
                            </div>
                            <span
                              className="text-xs truncate"
                              style={{
                                color: ms.completed ? "var(--text-muted)" : "var(--text-secondary)",
                                textDecoration: ms.completed ? "line-through" : "none",
                              }}
                            >
                              {ms.title}
                            </span>
                          </div>
                        ))}
                        {milestones.length > 3 && (
                          <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                            +{milestones.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                      <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                        {tasks.length > 0
                          ? `${completedTasks}/${tasks.length} tasks`
                          : "No tasks yet"}
                      </span>
                      {goal.targetDate && (
                        <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                          {new Date(goal.targetDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Completed goals */}
        {completedGoals.length > 0 && (
          <div className="mt-10 max-w-6xl">
            <h3 className="text-sm font-medium mb-3" style={{ color: "var(--text-muted)" }}>
              Completed ({completedGoals.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedGoals.map((goal) => (
                <div key={goal.id} className="glass-static p-4" style={{ opacity: 0.6 }}>
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2">
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
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingGoal ? "Edit Goal" : "New Goal"}>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="What do you want to achieve?"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
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
            <label className="text-xs mb-2 block" style={{ color: "var(--text-muted)" }}>Category</label>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFormCategory(cat)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: formCategory === cat ? `${CATEGORY_COLORS[cat]}20` : "rgba(255,255,255,0.03)",
                    color: formCategory === cat ? CATEGORY_COLORS[cat] : "var(--text-muted)",
                    border: `1px solid ${formCategory === cat ? `${CATEGORY_COLORS[cat]}40` : "var(--border)"}`,
                  }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ background: CATEGORY_COLORS[cat] }} />
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="text-xs mb-2 block" style={{ color: "var(--text-muted)" }}>Priority</label>
            <div className="flex gap-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  onClick={() => setFormPriority(p)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: formPriority === p ? "var(--accent-soft)" : "rgba(255,255,255,0.03)",
                    color: formPriority === p ? "var(--accent)" : "var(--text-muted)",
                    border: `1px solid ${formPriority === p ? "rgba(139,92,246,0.3)" : "var(--border)"}`,
                  }}
                >
                  {PRIORITY_LABELS[p]}
                </button>
              ))}
            </div>
          </div>

          {/* Target date */}
          <div>
            <label className="text-xs mb-1 block" style={{ color: "var(--text-muted)" }}>Target Date</label>
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
                className="px-3 py-2 text-sm rounded-lg transition-colors"
                style={{ color: "var(--danger)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(248,113,113,0.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                Delete Goal
              </button>
            ) : (
              <div />
            )}
            <div className="flex gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm rounded-lg transition-colors"
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                Cancel
              </button>
              <button onClick={handleSave} className="btn-glow px-5 py-2 rounded-xl text-sm font-medium">
                {editingGoal ? "Save" : "Create Goal"}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
