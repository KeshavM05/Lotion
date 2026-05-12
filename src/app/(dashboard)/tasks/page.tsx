"use client";

import { useState } from "react";
import { useStore, type Task, type Priority, type TaskStatus, PRIORITY_LABELS, CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/store";
import { Modal } from "@/components/ui/modal";
import { formatRelativeDate } from "@/lib/utils";
import { usePageHeader } from "@/lib/page-header-context";
import { useEffect } from "react";

type FilterTab = "all" | "today" | "upcoming" | "completed";
type ViewMode = "list" | "board";

const PRIORITY_DOTS: Record<Priority, string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#eab308",
  low: "#3b82f6",
};

export default function TasksPage() {
  const store = useStore();
  const { setPageControls } = usePageHeader();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

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

  // Set page header controls
  useEffect(() => {
    setPageControls(
      <div className="flex items-center justify-between w-full">
        {/* Tabs */}
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-[#C17A72]/20 text-[#C17A72] border border-[#C17A72]/30"
                  : "text-[#9CA3AF] hover:text-white hover:bg-white/5"
              }`}
            >
              {tab.label}
              {tab.count > 0 && <span className="ml-1.5 opacity-60">{tab.count}</span>}
            </button>
          ))}
        </div>

        {/* View Mode & Add Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                viewMode === "list"
                  ? "bg-[#C17A72] text-white"
                  : "text-[#9CA3AF] hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-sm">view_list</span>
            </button>
            <button
              onClick={() => setViewMode("board")}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                viewMode === "board"
                  ? "bg-[#C17A72] text-white"
                  : "text-[#9CA3AF] hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-sm">view_kanban</span>
            </button>
          </div>
          <button onClick={openCreate} className="btn-glow px-4 py-2 rounded-xl text-sm font-medium">
            <span className="material-symbols-outlined text-base mr-1">add</span>
            New Task
          </button>
        </div>
      </div>
    );

    return () => setPageControls(null);
  }, [activeTab, viewMode, tabs, setPageControls]);

  // Drag handlers for board view
  function handleDragStart(task: Task, e: React.DragEvent) {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedTask(task);
  }

  function handleDragEnd() {
    setDraggedTask(null);
  }

  function handleDrop(newStatus: TaskStatus, e: React.DragEvent) {
    e.preventDefault();
    if (!draggedTask) return;

    store.updateTask(draggedTask.id, {
      status: newStatus,
      completed: newStatus === "done",
      completedAt: newStatus === "done" ? new Date().toISOString() : null,
    });
    setDraggedTask(null);
  }

  return (
    <div className="flex flex-col h-full">
      {/* List View */}
      {viewMode === "list" && (
        <div className="flex-1 overflow-auto">
          {sorted.length === 0 ? (
            <div className="text-center py-20 text-[#9CA3AF]">
              <span className="material-symbols-outlined text-4xl mb-3 block opacity-40">task_alt</span>
              <p className="text-sm font-['Playfair_Display'] text-[#BEC6DF]">
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
                    className="flex items-center gap-3 px-4 py-3 rounded-xl group cursor-pointer transition-colors hover:bg-white/[0.02]"
                    onClick={() => openEdit(task)}
                  >
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleComplete(task); }}
                      className="w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors"
                      style={{
                        borderColor: task.completed ? "#C17A72" : "rgba(255,255,255,0.1)",
                        background: task.completed ? "#C17A72" : "transparent",
                      }}
                    >
                      {task.completed && (
                        <span className="material-symbols-outlined text-xs text-white" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <span className={`text-sm ${task.completed ? "line-through text-[#9CA3AF]" : "text-[#F5F5F5]"}`}>
                        {task.title}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        {goal && (
                          <span className="flex items-center gap-1 text-[10px] text-[#9CA3AF]">
                            <span className="w-2 h-2 rounded-full" style={{ background: goal.color }} />
                            {goal.title}
                          </span>
                        )}
                        {task.deadline && (
                          <span className={`text-[10px] ${overdue ? "text-[#ef4444]" : "text-[#9CA3AF]"}`}>
                            {formatRelativeDate(task.deadline)}
                          </span>
                        )}
                        <span className="text-[10px] text-[#9CA3AF] font-['JetBrains_Mono']">
                          {task.durationMinutes}m
                        </span>
                        {task.scheduledStart && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#C17A72]/20 text-[#C17A72]">
                            Scheduled
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: PRIORITY_DOTS[task.priority] }} />
                    <button
                      onClick={(e) => { e.stopPropagation(); store.deleteTask(task.id); }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded transition-all text-[#9CA3AF] hover:text-[#ef4444]"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Board View */}
      {viewMode === "board" && (
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-3 gap-4 h-full">
            {(["todo", "in_progress", "done"] as const).map((status) => {
              const statusTasks = store.tasks.filter((t) => t.status === status);
              const statusLabels: Record<typeof status, string> = { todo: "To Do", in_progress: "In Progress", done: "Done" };
              const statusColors: Record<typeof status, string> = { todo: "#6B7280", in_progress: "#f59e0b", done: "#10b981" };

              return (
                <div
                  key={status}
                  className="flex flex-col glass-card rounded-2xl overflow-hidden"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(status, e)}
                >
                  {/* Column Header */}
                  <div className="px-4 py-3 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ background: statusColors[status] }} />
                        <h3 className="text-sm font-['Space_Grotesk'] font-semibold text-[#F5F5F5]">
                          {statusLabels[status]}
                        </h3>
                      </div>
                      <span className="text-xs text-[#9CA3AF] font-['JetBrains_Mono']">
                        {statusTasks.length}
                      </span>
                    </div>
                  </div>

                  {/* Column Tasks */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {statusTasks.length === 0 ? (
                      <div className="text-center py-8 text-[#6B7280] text-xs">
                        No tasks
                      </div>
                    ) : (
                      statusTasks.map((task) => {
                        const goal = task.goalId ? store.goals.find((g) => g.id === task.goalId) : null;
                        const overdue = task.deadline && !task.completed && new Date(task.deadline) < now;
                        const isDragging = draggedTask?.id === task.id;

                        return (
                          <div
                            key={task.id}
                            draggable
                            onDragStart={(e) => handleDragStart(task, e)}
                            onDragEnd={handleDragEnd}
                            className={`glass-card rounded-lg p-3 cursor-grab active:cursor-grabbing transition-all ${
                              isDragging ? "opacity-50" : "hover:bg-white/[0.02]"
                            }`}
                            onClick={() => openEdit(task)}
                          >
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h4 className="text-sm text-[#F5F5F5] font-medium flex-1">
                                {task.title}
                              </h4>
                              <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: PRIORITY_DOTS[task.priority] }} />
                            </div>

                            {task.description && (
                              <p className="text-xs text-[#9CA3AF] mb-2 line-clamp-2">
                                {task.description}
                              </p>
                            )}

                            <div className="flex items-center gap-2 flex-wrap">
                              {goal && (
                                <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded bg-white/5 text-[#9CA3AF]">
                                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: goal.color }} />
                                  {goal.title}
                                </span>
                              )}
                              {task.deadline && (
                                <span className={`text-[10px] px-2 py-1 rounded ${
                                  overdue ? "bg-red-500/20 text-red-400" : "bg-white/5 text-[#9CA3AF]"
                                }`}>
                                  {formatRelativeDate(task.deadline)}
                                </span>
                              )}
                              <span className="text-[10px] px-2 py-1 rounded bg-white/5 text-[#9CA3AF] font-['JetBrains_Mono']">
                                {task.durationMinutes}m
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
                    border: `1px solid ${formPriority === p ? "rgba(193,122,114,0.3)" : "var(--border)"}`,
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
