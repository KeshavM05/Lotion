"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useStore, type Priority, type TaskStatus, CATEGORY_COLORS, CATEGORY_LABELS, PRIORITY_LABELS } from "@/lib/store";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Modal } from "@/components/ui/modal";

type Tab = "milestones" | "tasks" | "chat";

export default function GoalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const store = useStore();
  const goalId = params.id as string;

  const goal = store.goals.find((g) => g.id === goalId);
  const [activeTab, setActiveTab] = useState<Tab>("milestones");

  // Milestone form
  const [msModalOpen, setMsModalOpen] = useState(false);
  const [msTitle, setMsTitle] = useState("");
  const [msDescription, setMsDescription] = useState("");
  const [msTargetDate, setMsTargetDate] = useState("");

  // Task form
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState<Priority>("medium");
  const [taskDuration, setTaskDuration] = useState(30);
  const [taskDeadline, setTaskDeadline] = useState("");
  const [taskMilestoneId, setTaskMilestoneId] = useState("");

  // Chat
  const [chatInput, setChatInput] = useState("");

  if (!goal) {
    return (
      <div className="flex items-center justify-center h-full" style={{ color: "var(--text-muted)" }}>
        <div className="text-center">
          <p className="text-lg mb-2">Goal not found</p>
          <Link href="/goals" className="text-sm" style={{ color: "var(--accent)" }}>
            Back to Vision Board
          </Link>
        </div>
      </div>
    );
  }

  const progress = store.getGoalProgress(goalId);
  const milestones = store.getGoalMilestones(goalId);
  const tasks = store.getGoalTasks(goalId);
  const chatMessages = store.getChatMessages(goalId);

  function addMilestone() {
    if (!msTitle.trim()) return;
    store.addMilestone({
      goalId,
      title: msTitle.trim(),
      description: msDescription.trim(),
      targetDate: msTargetDate ? new Date(msTargetDate).toISOString() : null,
      order: milestones.length,
    });
    setMsTitle("");
    setMsDescription("");
    setMsTargetDate("");
    setMsModalOpen(false);
  }

  function addTask() {
    if (!taskTitle.trim()) return;
    store.addTask({
      title: taskTitle.trim(),
      description: taskDescription.trim(),
      status: "todo",
      priority: taskPriority,
      goalId,
      milestoneId: taskMilestoneId || null,
      durationMinutes: taskDuration,
      deadline: taskDeadline ? new Date(taskDeadline).toISOString() : null,
      scheduledStart: null,
      scheduledEnd: null,
    });
    setTaskTitle("");
    setTaskDescription("");
    setTaskPriority("medium");
    setTaskDuration(30);
    setTaskDeadline("");
    setTaskMilestoneId("");
    setTaskModalOpen(false);
  }

  function sendChat() {
    if (!chatInput.trim()) return;
    store.addChatMessage({ goalId, role: "user", content: chatInput.trim() });
    const userMsg = chatInput.trim();
    setChatInput("");

    // Simulated AI response
    setTimeout(() => {
      store.addChatMessage({
        goalId,
        role: "assistant",
        content: `I see you're working on "${goal?.title}". That's a great goal! Based on your progress (${progress}% complete), here are some thoughts:\n\n• You have ${milestones.length} milestones and ${tasks.filter((t: { completed: boolean }) => !t.completed).length} active tasks\n• Consider breaking your next milestone into smaller, daily tasks\n• Would you like me to suggest a schedule for this week?\n\n*This is a demo response. Connect the Claude API for real coaching.*`,
      });
    }, 800);
  }

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "milestones", label: "Milestones", count: milestones.length },
    { key: "tasks", label: "Tasks", count: tasks.filter((t) => !t.completed).length },
    { key: "chat", label: "AI Coach", count: chatMessages.length },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-8 py-6 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2 mb-3">
          <Link
            href="/goals"
            className="text-xs font-medium transition-colors"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            Vision Board
          </Link>
          <span style={{ color: "var(--text-muted)" }}>/</span>
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{goal.title}</span>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span
                className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-md"
                style={{ background: `${goal.color}15`, color: goal.color }}
              >
                {CATEGORY_LABELS[goal.category]}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-muted)" }}>
                {PRIORITY_LABELS[goal.priority]}
              </span>
            </div>
            <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              {goal.title}
            </h1>
            {goal.description && (
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{goal.description}</p>
            )}
          </div>
          <ProgressRing progress={progress} size={72} strokeWidth={4} color={goal.color}>
            <span className="text-sm font-bold" style={{ color: "var(--text-secondary)" }}>{progress}%</span>
          </ProgressRing>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-5">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: activeTab === tab.key ? "var(--accent-soft)" : "transparent",
                color: activeTab === tab.key ? "var(--accent)" : "var(--text-muted)",
              }}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="ml-1.5 text-xs" style={{ opacity: 0.6 }}>{tab.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {/* Milestones Tab */}
        {activeTab === "milestones" && (
          <div className="p-8 max-w-3xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                {milestones.filter((m) => m.completed).length}/{milestones.length} milestones complete
              </h3>
              <button
                onClick={() => setMsModalOpen(true)}
                className="btn-glow px-4 py-2 rounded-xl text-xs font-medium"
              >
                + Add Milestone
              </button>
            </div>

            {milestones.length === 0 ? (
              <div className="glass-static p-8 text-center" style={{ color: "var(--text-muted)" }}>
                <p className="text-sm mb-1">No milestones yet</p>
                <p className="text-xs">Break this goal into milestones to track your progress</p>
              </div>
            ) : (
              <div className="space-y-3">
                {milestones.map((ms, idx) => (
                  <div key={ms.id} className="glass-static p-4 flex items-start gap-4">
                    {/* Timeline */}
                    <div className="flex flex-col items-center mt-0.5">
                      <button
                        onClick={() => store.updateMilestone(ms.id, {
                          completed: !ms.completed,
                          completedAt: !ms.completed ? new Date().toISOString() : null,
                        })}
                        className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                        style={{
                          borderColor: ms.completed ? goal.color : "var(--border)",
                          background: ms.completed ? goal.color : "transparent",
                        }}
                      >
                        {ms.completed && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        )}
                      </button>
                      {idx < milestones.length - 1 && (
                        <div className="w-0.5 flex-1 mt-2 min-h-[20px]" style={{ background: "var(--border)" }} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4
                        className="text-sm font-semibold"
                        style={{
                          color: ms.completed ? "var(--text-muted)" : "var(--text-primary)",
                          textDecoration: ms.completed ? "line-through" : "none",
                        }}
                      >
                        {ms.title}
                      </h4>
                      {ms.description && (
                        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{ms.description}</p>
                      )}
                      {ms.targetDate && (
                        <span className="text-[10px] mt-1 inline-block" style={{ color: "var(--text-muted)" }}>
                          Target: {new Date(ms.targetDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => store.deleteMilestone(ms.id)}
                      className="p-1 rounded transition-colors flex-shrink-0"
                      style={{ color: "var(--text-muted)", opacity: 0.4 }}
                      onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.color = "var(--danger)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.4"; e.currentTarget.style.color = "var(--text-muted)"; }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === "tasks" && (
          <div className="p-8 max-w-3xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                {tasks.filter((t) => t.completed).length}/{tasks.length} tasks complete
              </h3>
              <button
                onClick={() => setTaskModalOpen(true)}
                className="btn-glow px-4 py-2 rounded-xl text-xs font-medium"
              >
                + Add Task
              </button>
            </div>

            {tasks.length === 0 ? (
              <div className="glass-static p-8 text-center" style={{ color: "var(--text-muted)" }}>
                <p className="text-sm mb-1">No tasks yet</p>
                <p className="text-xs">Add tasks to make progress on this goal</p>
              </div>
            ) : (
              <div className="space-y-1">
                {tasks.filter((t) => !t.completed).map((task) => (
                  <div key={task.id} className="flex items-center gap-3 px-4 py-3 rounded-xl group transition-colors"
                    style={{ background: "transparent" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <button
                      onClick={() => store.updateTask(task.id, {
                        completed: true, status: "done", completedAt: new Date().toISOString(),
                      })}
                      className="w-5 h-5 rounded-full border-2 flex-shrink-0 transition-colors"
                      style={{ borderColor: "var(--border)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = goal.color)}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm" style={{ color: "var(--text-primary)" }}>{task.title}</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{task.durationMinutes}m</span>
                        {task.deadline && (
                          <span className="text-[10px]" style={{ color: new Date(task.deadline) < new Date() ? "var(--danger)" : "var(--text-muted)" }}>
                            {new Date(task.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        )}
                        {task.scheduledStart && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
                            Scheduled
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => store.deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded transition-all"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}

                {tasks.some((t) => t.completed) && (
                  <div className="pt-4 mt-4 border-t" style={{ borderColor: "var(--border)" }}>
                    <h4 className="text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>
                      Completed ({tasks.filter((t) => t.completed).length})
                    </h4>
                    {tasks.filter((t) => t.completed).map((task) => (
                      <div key={task.id} className="flex items-center gap-3 px-4 py-2">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: goal.color }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        </div>
                        <span className="text-sm line-through" style={{ color: "var(--text-muted)" }}>{task.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === "chat" && (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-auto p-8 space-y-4 max-w-3xl">
              {chatMessages.length === 0 && (
                <div className="text-center py-16" style={{ color: "var(--text-muted)" }}>
                  <svg width="40" height="40" className="mx-auto mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ opacity: 0.4 }}>
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                  <p className="text-sm mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "var(--text-secondary)" }}>
                    Chat with your AI Coach
                  </p>
                  <p className="text-xs">
                    Ask for advice, brainstorm strategies, or break down your next steps for &quot;{goal.title}&quot;
                  </p>
                </div>
              )}

              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className="max-w-[80%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap"
                    style={{
                      background: msg.role === "user" ? "var(--accent)" : "var(--bg-glass)",
                      color: msg.role === "user" ? "white" : "var(--text-primary)",
                      border: msg.role === "assistant" ? "1px solid var(--border)" : "none",
                      borderRadius: msg.role === "user"
                        ? "20px 20px 4px 20px"
                        : "20px 20px 20px 4px",
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat input */}
            <div className="p-4 border-t" style={{ borderColor: "var(--border)" }}>
              <div className="max-w-3xl mx-auto flex gap-3">
                <input
                  type="text"
                  placeholder={`Ask about "${goal.title}"...`}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendChat()}
                  className="input-glass flex-1"
                />
                <button
                  onClick={sendChat}
                  disabled={!chatInput.trim()}
                  className="btn-glow px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Milestone Modal */}
      <Modal open={msModalOpen} onClose={() => setMsModalOpen(false)} title="Add Milestone">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Milestone title"
            value={msTitle}
            onChange={(e) => setMsTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addMilestone()}
            autoFocus
            className="input-glass"
          />
          <textarea
            placeholder="Description (optional)"
            value={msDescription}
            onChange={(e) => setMsDescription(e.target.value)}
            rows={2}
            className="input-glass resize-none"
          />
          <div>
            <label className="text-xs mb-1 block" style={{ color: "var(--text-muted)" }}>Target Date</label>
            <input type="date" value={msTargetDate} onChange={(e) => setMsTargetDate(e.target.value)} className="input-glass w-full" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setMsModalOpen(false)} className="px-4 py-2 text-sm rounded-lg" style={{ color: "var(--text-secondary)" }}>Cancel</button>
            <button onClick={addMilestone} className="btn-glow px-5 py-2 rounded-xl text-sm font-medium">Add</button>
          </div>
        </div>
      </Modal>

      {/* Task Modal */}
      <Modal open={taskModalOpen} onClose={() => setTaskModalOpen(false)} title="Add Task">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Task title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            autoFocus
            className="input-glass"
          />
          <textarea
            placeholder="Description (optional)"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            rows={2}
            className="input-glass resize-none"
          />
          <div>
            <label className="text-xs mb-2 block" style={{ color: "var(--text-muted)" }}>Priority</label>
            <div className="flex gap-2">
              {(["low", "medium", "high", "critical"] as Priority[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setTaskPriority(p)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: taskPriority === p ? "var(--accent-soft)" : "rgba(255,255,255,0.03)",
                    color: taskPriority === p ? "var(--accent)" : "var(--text-muted)",
                    border: `1px solid ${taskPriority === p ? "rgba(139,92,246,0.3)" : "var(--border)"}`,
                  }}
                >
                  {PRIORITY_LABELS[p]}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs mb-1 block" style={{ color: "var(--text-muted)" }}>Duration</label>
              <select value={taskDuration} onChange={(e) => setTaskDuration(Number(e.target.value))} className="input-glass w-full">
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
                <option value={180}>3 hours</option>
              </select>
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: "var(--text-muted)" }}>Deadline</label>
              <input type="date" value={taskDeadline} onChange={(e) => setTaskDeadline(e.target.value)} className="input-glass w-full" />
            </div>
          </div>
          {milestones.length > 0 && (
            <div>
              <label className="text-xs mb-1 block" style={{ color: "var(--text-muted)" }}>Milestone</label>
              <select value={taskMilestoneId} onChange={(e) => setTaskMilestoneId(e.target.value)} className="input-glass w-full">
                <option value="">No milestone</option>
                {milestones.map((ms) => (
                  <option key={ms.id} value={ms.id}>{ms.title}</option>
                ))}
              </select>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setTaskModalOpen(false)} className="px-4 py-2 text-sm rounded-lg" style={{ color: "var(--text-secondary)" }}>Cancel</button>
            <button onClick={addTask} className="btn-glow px-5 py-2 rounded-xl text-sm font-medium">Add Task</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
