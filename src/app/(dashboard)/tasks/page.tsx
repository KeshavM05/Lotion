"use client";

import { useState } from "react";
import { useStore, type Task, type Priority, type TaskStatus, PRIORITY_LABELS, CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/store";
import { Modal } from "@/components/ui/modal";
import { formatRelativeDate } from "@/lib/utils";

type FilterTab = "all" | "today" | "upcoming" | "completed";

const PRIORITY_DOTS: Record<Priority, string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#eab308",
  low: "#3b82f6",
};

export default function TasksPage() {
  const store = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  // Form
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPriority, setFormPriority] = useState<Priority>("medium");
  const [formDuration, setFormDuration] = useState(30);
  const [formDeadline, setFormDeadline] = useState("");
  const [formGoalId, setFormGoalId] = useState("");

  function openCreate() {
    setEditingTask(null);
    setFormTitle(""); setFormDescription(""); setFormPriority("medium");
    setFormDuration(30); setFormDeadline(""); setFormGoalId("");
    setModalOpen(true);
  }

  function openEdit(task: Task) {
    setEditingTask(task);
    setFormTitle(task.title); setFormDescription(task.description);
    setFormPriority(task.priority); setFormDuration(task.durationMinutes);
    setFormDeadline(task.deadline ? task.deadline.split("T")[0] : "");
    setFormGoalId(task.goalId || "");
    setModalOpen(true);
  }

  function handleSave() {
    if (!formTitle.trim()) return;
    const data = {
      title: formTitle.trim(),
      description: formDescription.trim(),
      priority: formPriority,
      durationMinutes: formDuration,
      deadline: formDeadline ? new Date(formDeadline).toISOString() : null,
      goalId: formGoalId || null,
    };
    if (editingTask) {
      store.updateTask(editingTask.id, data);
    } else {
      store.addTask({ ...data, status: "todo", milestoneId: null, scheduledStart: null, scheduledEnd: null });
    }
    setModalOpen(false);
  }

  function toggleComplete(task: Task) {
    const done = !task.completed;
    store.updateTask(task.id, {
      completed: done, status: done ? "done" : "todo",
      completedAt: done ? new Date().toISOString() : null,
    });
  }

  const now = new Date();
  const todayEnd = new Date(now); todayEnd.setHours(23, 59, 59, 999);

  const filtered = store.tasks.filter((t) => {
    switch (activeTab) {
      case "all": return !t.completed;
      case "today": return !t.completed && t.deadline && new Date(t.deadline) <= todayEnd;
      case "upcoming": return !t.completed && t.deadline && new Date(t.deadline) > todayEnd;
      case "completed": return t.completed;
    }
  });

  const sorted = [...filtered].sort((a, b) => {
    const pw = { critical: 4, high: 3, medium: 2, low: 1 };
    if (pw[b.priority] !== pw[a.priority]) return pw[b.priority] - pw[a.priority];
    const da = a.deadline ? new Date(a.deadline).getTime() : Infinity;
    const db = b.deadline ? new Date(b.deadline).getTime() : Infinity;
    return da - db;
  });

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "All", count: store.tasks.filter((t) => !t.completed).length },
    { key: "today", label: "Today", count: store.tasks.filter((t) => !t.completed && t.deadline && new Date(t.deadline) <= todayEnd).length },
    { key: "upcoming", label: "Upcoming", count: store.tasks.filter((t) => !t.completed && t.deadline && new Date(t.deadline) > todayEnd).length },
    { key: "completed", label: "Done", count: store.tasks.filter((t) => t.completed).length },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-8 py-6 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Tasks</h1>
          <button onClick={openCreate} className="btn-glow px-5 py-2.5 rounded-xl text-sm font-medium">+ Add Task</button>
        </div>
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: activeTab === tab.key ? "var(--accent-soft)" : "transparent",
                color: activeTab === tab.key ? "var(--accent)" : "var(--text-muted)",
              }}
            >
              {tab.label}
              {tab.count > 0 && <span className="ml-1.5" style={{ opacity: 0.6 }}>{tab.count}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto px-8 py-6">
        {sorted.length === 0 ? (
          <div className="text-center py-20" style={{ color: "var(--text-muted)" }}>
            <svg width="40" height="40" className="mx-auto mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ opacity: 0.4 }}>
              <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
            <p className="text-sm" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "var(--text-secondary)" }}>
              {activeTab === "completed" ? "No completed tasks" : "No tasks yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-1 max-w-3xl">
            {sorted.map((task) => {
              const goal = task.goalId ? store.goals.find((g) => g.id === task.goalId) : null;
              const overdue = task.deadline && !task.completed && new Date(task.deadline) < now;

              return (
                <div
                  key={task.id}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl group cursor-pointer transition-colors"
                  onClick={() => openEdit(task)}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleComplete(task); }}
                    className="w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors"
                    style={{
                      borderColor: task.completed ? "var(--accent)" : "var(--border)",
                      background: task.completed ? "var(--accent)" : "transparent",
                    }}
                  >
                    {task.completed && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm" style={{
                      color: task.completed ? "var(--text-muted)" : "var(--text-primary)",
                      textDecoration: task.completed ? "line-through" : "none",
                    }}>{task.title}</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      {goal && (
                        <span className="flex items-center gap-1 text-[10px]" style={{ color: "var(--text-muted)" }}>
                          <span className="w-2 h-2 rounded-full" style={{ background: goal.color }} />
                          {goal.title}
                        </span>
                      )}
                      {task.deadline && (
                        <span className="text-[10px]" style={{ color: overdue ? "var(--danger)" : "var(--text-muted)" }}>
                          {formatRelativeDate(task.deadline)}
                        </span>
                      )}
                      <span className="text-[10px]" style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>
                        {task.durationMinutes}m
                      </span>
                      {task.scheduledStart && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
                          Scheduled
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: PRIORITY_DOTS[task.priority] }} />
                  <button
                    onClick={(e) => { e.stopPropagation(); store.deleteTask(task.id); }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded transition-all"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingTask ? "Edit Task" : "New Task"}>
        <div className="flex flex-col gap-4">
          <input type="text" placeholder="Task title" value={formTitle} onChange={(e) => setFormTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()} autoFocus className="input-glass" />
          <textarea placeholder="Description (optional)" value={formDescription} onChange={(e) => setFormDescription(e.target.value)}
            rows={2} className="input-glass resize-none" />
          <div>
            <label className="text-xs mb-2 block" style={{ color: "var(--text-muted)" }}>Priority</label>
            <div className="flex gap-2">
              {(["low", "medium", "high", "critical"] as Priority[]).map((p) => (
                <button key={p} onClick={() => setFormPriority(p)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: formPriority === p ? "var(--accent-soft)" : "rgba(255,255,255,0.03)",
                    color: formPriority === p ? "var(--accent)" : "var(--text-muted)",
                    border: `1px solid ${formPriority === p ? "rgba(139,92,246,0.3)" : "var(--border)"}`,
                  }}>{PRIORITY_LABELS[p]}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs mb-1 block" style={{ color: "var(--text-muted)" }}>Duration</label>
              <select value={formDuration} onChange={(e) => setFormDuration(Number(e.target.value))} className="input-glass w-full">
                <option value={15}>15 min</option><option value={30}>30 min</option><option value={45}>45 min</option>
                <option value={60}>1 hour</option><option value={90}>1.5 hours</option><option value={120}>2 hours</option>
              </select>
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: "var(--text-muted)" }}>Deadline</label>
              <input type="date" value={formDeadline} onChange={(e) => setFormDeadline(e.target.value)} className="input-glass w-full" />
            </div>
          </div>
          {store.goals.length > 0 && (
            <div>
              <label className="text-xs mb-1 block" style={{ color: "var(--text-muted)" }}>Goal</label>
              <select value={formGoalId} onChange={(e) => setFormGoalId(e.target.value)} className="input-glass w-full">
                <option value="">No goal</option>
                {store.goals.filter((g) => g.status === "active").map((g) => (
                  <option key={g.id} value={g.id}>{g.title}</option>
                ))}
              </select>
            </div>
          )}
          <div className="flex items-center justify-between pt-2">
            {editingTask ? (
              <button onClick={() => { store.deleteTask(editingTask.id); setModalOpen(false); }}
                className="px-3 py-2 text-sm rounded-lg" style={{ color: "var(--danger)" }}>Delete</button>
            ) : <div />}
            <div className="flex gap-2">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm rounded-lg" style={{ color: "var(--text-secondary)" }}>Cancel</button>
              <button onClick={handleSave} className="btn-glow px-5 py-2 rounded-xl text-sm font-medium">{editingTask ? "Save" : "Create"}</button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
