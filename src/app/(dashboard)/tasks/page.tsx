"use client";

import { useState } from "react";
import { useStore, type Task, type Priority, type TaskStatus } from "@/lib/store";
import { Modal } from "@/components/ui/modal";
import { formatRelativeDate, toLocalDatetimeString } from "@/lib/utils";

const priorityConfig: Record<Priority, { color: string; bg: string; label: string }> = {
  urgent: { color: "text-red-600", bg: "bg-red-500", label: "Urgent" },
  high: { color: "text-orange-600", bg: "bg-orange-500", label: "High" },
  medium: { color: "text-yellow-600", bg: "bg-yellow-500", label: "Medium" },
  low: { color: "text-blue-600", bg: "bg-blue-500", label: "Low" },
};

const statusLabels: Record<TaskStatus, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
  cancelled: "Cancelled",
};

type FilterTab = "all" | "today" | "upcoming" | "completed";

export default function TasksPage() {
  const store = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPriority, setFormPriority] = useState<Priority>("medium");
  const [formStatus, setFormStatus] = useState<TaskStatus>("todo");
  const [formDuration, setFormDuration] = useState(30);
  const [formDeadline, setFormDeadline] = useState("");
  const [formProjectId, setFormProjectId] = useState<string>("");

  function openCreateModal() {
    setEditingTask(null);
    setFormTitle("");
    setFormDescription("");
    setFormPriority("medium");
    setFormStatus("todo");
    setFormDuration(30);
    setFormDeadline("");
    setFormProjectId("");
    setModalOpen(true);
  }

  function openEditModal(task: Task) {
    setEditingTask(task);
    setFormTitle(task.title);
    setFormDescription(task.description);
    setFormPriority(task.priority);
    setFormStatus(task.status);
    setFormDuration(task.durationMinutes);
    setFormDeadline(task.deadline ? toLocalDatetimeString(new Date(task.deadline)) : "");
    setFormProjectId(task.projectId || "");
    setModalOpen(true);
  }

  function handleSave() {
    if (!formTitle.trim()) return;
    if (editingTask) {
      store.updateTask(editingTask.id, {
        title: formTitle.trim(),
        description: formDescription.trim(),
        priority: formPriority,
        status: formStatus,
        durationMinutes: formDuration,
        deadline: formDeadline ? new Date(formDeadline).toISOString() : null,
        projectId: formProjectId || null,
        completed: formStatus === "done",
        completedAt: formStatus === "done" ? new Date().toISOString() : null,
      });
    } else {
      store.addTask({
        title: formTitle.trim(),
        description: formDescription.trim(),
        priority: formPriority,
        status: formStatus,
        durationMinutes: formDuration,
        deadline: formDeadline ? new Date(formDeadline).toISOString() : null,
        projectId: formProjectId || null,
        scheduledStart: null,
        scheduledEnd: null,
      });
    }
    setModalOpen(false);
  }

  function handleDelete() {
    if (editingTask) {
      store.deleteTask(editingTask.id);
      setModalOpen(false);
    }
  }

  function toggleComplete(task: Task) {
    const nowCompleted = !task.completed;
    store.updateTask(task.id, {
      completed: nowCompleted,
      status: nowCompleted ? "done" : "todo",
      completedAt: nowCompleted ? new Date().toISOString() : null,
    });
  }

  // Filter tasks
  const now = new Date();
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  const filteredTasks = store.tasks.filter((t) => {
    switch (activeTab) {
      case "all":
        return !t.completed;
      case "today":
        return (
          !t.completed &&
          t.deadline &&
          new Date(t.deadline) <= todayEnd
        );
      case "upcoming":
        return !t.completed && t.deadline && new Date(t.deadline) > todayEnd;
      case "completed":
        return t.completed;
    }
  });

  // Sort: urgent first, then by deadline
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const pw = { urgent: 4, high: 3, medium: 2, low: 1 };
    if (pw[b.priority] !== pw[a.priority]) return pw[b.priority] - pw[a.priority];
    const da = a.deadline ? new Date(a.deadline).getTime() : Infinity;
    const db = b.deadline ? new Date(b.deadline).getTime() : Infinity;
    return da - db;
  });

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "All", count: store.tasks.filter((t) => !t.completed).length },
    {
      key: "today",
      label: "Today",
      count: store.tasks.filter((t) => !t.completed && t.deadline && new Date(t.deadline) <= todayEnd).length,
    },
    {
      key: "upcoming",
      label: "Upcoming",
      count: store.tasks.filter((t) => !t.completed && t.deadline && new Date(t.deadline) > todayEnd).length,
    },
    { key: "completed", label: "Completed", count: store.tasks.filter((t) => t.completed).length },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] shrink-0">
        <div className="flex items-center gap-6">
          <h2 className="text-xl font-semibold">Tasks</h2>
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  activeTab === tab.key
                    ? "bg-[var(--accent)] font-medium"
                    : "text-[var(--muted)] hover:bg-[var(--accent)]"
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-1.5 text-xs text-[var(--muted)]">{tab.count}</span>
                )}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--primary-hover)] transition-colors"
        >
          + Add task
        </button>
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-auto px-6 py-4">
        {sortedTasks.length === 0 ? (
          <div className="text-center py-16 text-[var(--muted)]">
            <div className="text-4xl mb-3">
              {activeTab === "completed" ? (
                <svg className="w-12 h-12 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              ) : (
                <svg className="w-12 h-12 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              )}
            </div>
            <p className="text-lg mb-1">
              {activeTab === "completed" ? "No completed tasks" : "No tasks"}
            </p>
            <p className="text-sm">
              {activeTab === "completed"
                ? "Complete a task to see it here"
                : "Click \"+ Add task\" to create one"}
            </p>
          </div>
        ) : (
          <div className="space-y-1 max-w-3xl">
            {sortedTasks.map((task) => {
              const project = task.projectId
                ? store.projects.find((p) => p.id === task.projectId)
                : null;
              const isOverdue =
                task.deadline && !task.completed && new Date(task.deadline) < now;

              return (
                <div
                  key={task.id}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[var(--accent)] transition-colors group cursor-pointer"
                  onClick={() => openEditModal(task)}
                >
                  {/* Checkbox */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleComplete(task);
                    }}
                    className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                      task.completed
                        ? "border-[var(--primary)] bg-[var(--primary)]"
                        : "border-[var(--border)] hover:border-[var(--primary)]"
                    }`}
                  >
                    {task.completed && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm ${
                          task.completed ? "line-through text-[var(--muted)]" : ""
                        }`}
                      >
                        {task.title}
                      </span>
                      {task.scheduledStart && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--primary)]/10 text-[var(--primary)]">
                          Scheduled
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {project && (
                        <span className="flex items-center gap-1 text-xs text-[var(--muted)]">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: project.color }}
                          />
                          {project.name}
                        </span>
                      )}
                      {task.deadline && (
                        <span
                          className={`text-xs ${
                            isOverdue ? "text-red-500 font-medium" : "text-[var(--muted)]"
                          }`}
                        >
                          {formatRelativeDate(task.deadline)}
                        </span>
                      )}
                      <span className="text-xs text-[var(--muted)]">
                        {task.durationMinutes}m
                      </span>
                    </div>
                  </div>

                  {/* Priority */}
                  <span
                    className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${priorityConfig[task.priority].bg}`}
                  />

                  {/* Delete */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      store.deleteTask(task.id);
                    }}
                    className="text-[var(--muted)] opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all flex-shrink-0"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Task modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTask ? "Edit Task" : "New Task"}
      >
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Task title"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            autoFocus
            className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm"
          />
          <textarea
            placeholder="Description (optional)"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            rows={2}
            className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm resize-none"
          />

          {/* Priority */}
          <div>
            <label className="text-xs text-[var(--muted)] mb-2 block">Priority</label>
            <div className="flex gap-2">
              {(["low", "medium", "high", "urgent"] as Priority[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setFormPriority(p)}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                    formPriority === p
                      ? `${priorityConfig[p].bg} text-white`
                      : "bg-[var(--accent)] text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {priorityConfig[p].label}
                </button>
              ))}
            </div>
          </div>

          {/* Status (only when editing) */}
          {editingTask && (
            <div>
              <label className="text-xs text-[var(--muted)] mb-2 block">Status</label>
              <div className="flex gap-2">
                {(["todo", "in_progress", "done"] as TaskStatus[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setFormStatus(s)}
                    className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                      formStatus === s
                        ? "bg-[var(--foreground)] text-[var(--background)]"
                        : "bg-[var(--accent)] text-[var(--muted)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {statusLabels[s]}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {/* Duration */}
            <div>
              <label className="text-xs text-[var(--muted)] mb-1 block">Duration (min)</label>
              <select
                value={formDuration}
                onChange={(e) => setFormDuration(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm"
              >
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
                <option value={180}>3 hours</option>
                <option value={240}>4 hours</option>
              </select>
            </div>

            {/* Deadline */}
            <div>
              <label className="text-xs text-[var(--muted)] mb-1 block">Deadline</label>
              <input
                type="datetime-local"
                value={formDeadline}
                onChange={(e) => setFormDeadline(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm"
              />
            </div>
          </div>

          {/* Project */}
          {store.projects.length > 0 && (
            <div>
              <label className="text-xs text-[var(--muted)] mb-1 block">Project</label>
              <select
                value={formProjectId}
                onChange={(e) => setFormProjectId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm"
              >
                <option value="">No project</option>
                {store.projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            {editingTask ? (
              <button
                onClick={handleDelete}
                className="px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                Delete
              </button>
            ) : (
              <div />
            )}
            <div className="flex gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm rounded-lg hover:bg-[var(--accent)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-colors"
              >
                {editingTask ? "Save" : "Create"}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
