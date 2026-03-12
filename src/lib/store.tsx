"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

// ─── Types ───────────────────────────────────────────────

export type Priority = "low" | "medium" | "high" | "critical";
export type TaskStatus = "todo" | "in_progress" | "done" | "cancelled";
export type GoalStatus = "active" | "paused" | "completed" | "abandoned";
export type GoalCategory = "career" | "business" | "finance" | "personal" | "health" | "creative";
export type ChatRole = "user" | "assistant";

export const CATEGORY_COLORS: Record<GoalCategory, string> = {
  career: "#8b5cf6",
  business: "#f59e0b",
  finance: "#10b981",
  personal: "#ec4899",
  health: "#34d399",
  creative: "#f97316",
};

export const CATEGORY_LABELS: Record<GoalCategory, string> = {
  career: "Career",
  business: "Business",
  finance: "Finance",
  personal: "Personal",
  health: "Health",
  creative: "Creative",
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  priority: Priority;
  targetDate: string | null;
  color: string;
  status: GoalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  goalId: string;
  title: string;
  description: string;
  targetDate: string | null;
  completed: boolean;
  completedAt: string | null;
  order: number;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  goalId: string | null;
  milestoneId: string | null;
  durationMinutes: number;
  deadline: string | null;
  scheduledStart: string | null;
  scheduledEnd: string | null;
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start: string;
  end: string;
  allDay: boolean;
  color: string;
  taskId: string | null;
  source: "local" | "google" | "outlook";
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  goalId: string | null;
  role: ChatRole;
  content: string;
  createdAt: string;
}

// ─── Store Interface ─────────────────────────────────────

interface StoreContextType {
  // Data
  goals: Goal[];
  milestones: Milestone[];
  tasks: Task[];
  events: CalendarEvent[];
  chatMessages: ChatMessage[];
  aiMemory: string;

  // Goals
  addGoal: (goal: Omit<Goal, "id" | "createdAt" | "updatedAt">) => Goal;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;

  // Milestones
  addMilestone: (milestone: Omit<Milestone, "id" | "createdAt" | "completed" | "completedAt">) => Milestone;
  updateMilestone: (id: string, updates: Partial<Milestone>) => void;
  deleteMilestone: (id: string) => void;

  // Tasks
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt" | "completed" | "completedAt">) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;

  // Events
  addEvent: (event: Omit<CalendarEvent, "id" | "createdAt">) => CalendarEvent;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;

  // Chat
  addChatMessage: (message: Omit<ChatMessage, "id" | "createdAt">) => ChatMessage;
  getChatMessages: (goalId: string | null) => ChatMessage[];

  // AI Memory
  setAiMemory: (memory: string) => void;

  // Computed
  getGoalProgress: (goalId: string) => number;
  getGoalMilestones: (goalId: string) => Milestone[];
  getGoalTasks: (goalId: string) => Task[];

  // Auto-schedule
  autoSchedule: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

// ─── Provider ────────────────────────────────────────────

export function StoreProvider({ children }: { children: ReactNode }) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [aiMemory, setAiMemoryState] = useState<string>("");

  // ─── Goals ───────────────────────────────────────────

  const addGoal = useCallback((data: Omit<Goal, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const goal: Goal = { ...data, id: crypto.randomUUID(), createdAt: now, updatedAt: now };
    setGoals((prev) => [...prev, goal]);
    return goal;
  }, []);

  const updateGoal = useCallback((id: string, updates: Partial<Goal>) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updates, updatedAt: new Date().toISOString() } : g))
    );
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    setMilestones((prev) => prev.filter((m) => m.goalId !== id));
    setTasks((prev) => prev.map((t) => (t.goalId === id ? { ...t, goalId: null, milestoneId: null } : t)));
    setChatMessages((prev) => prev.filter((m) => m.goalId !== id));
  }, []);

  // ─── Milestones ──────────────────────────────────────

  const addMilestone = useCallback((data: Omit<Milestone, "id" | "createdAt" | "completed" | "completedAt">) => {
    const ms: Milestone = {
      ...data,
      id: crypto.randomUUID(),
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
    };
    setMilestones((prev) => [...prev, ms]);
    return ms;
  }, []);

  const updateMilestone = useCallback((id: string, updates: Partial<Milestone>) => {
    setMilestones((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  }, []);

  const deleteMilestone = useCallback((id: string) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
    setTasks((prev) => prev.map((t) => (t.milestoneId === id ? { ...t, milestoneId: null } : t)));
  }, []);

  // ─── Tasks ───────────────────────────────────────────

  const addTask = useCallback((data: Omit<Task, "id" | "createdAt" | "updatedAt" | "completed" | "completedAt">) => {
    const now = new Date().toISOString();
    const task: Task = { ...data, id: crypto.randomUUID(), completed: false, completedAt: null, createdAt: now, updatedAt: now };
    setTasks((prev) => [...prev, task]);
    return task;
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t))
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setEvents((prev) => prev.filter((e) => e.taskId !== id));
  }, []);

  // ─── Events ──────────────────────────────────────────

  const addEvent = useCallback((data: Omit<CalendarEvent, "id" | "createdAt">) => {
    const event: CalendarEvent = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    setEvents((prev) => [...prev, event]);
    return event;
  }, []);

  const updateEvent = useCallback((id: string, updates: Partial<CalendarEvent>) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  // ─── Chat ────────────────────────────────────────────

  const addChatMessage = useCallback((data: Omit<ChatMessage, "id" | "createdAt">) => {
    const msg: ChatMessage = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    setChatMessages((prev) => [...prev, msg]);
    return msg;
  }, []);

  const getChatMessages = useCallback(
    (goalId: string | null) => chatMessages.filter((m) => m.goalId === goalId),
    [chatMessages]
  );

  // ─── AI Memory ───────────────────────────────────────

  const setAiMemory = useCallback((memory: string) => {
    setAiMemoryState(memory);
  }, []);

  // ─── Computed ────────────────────────────────────────

  const getGoalMilestones = useCallback(
    (goalId: string) => milestones.filter((m) => m.goalId === goalId).sort((a, b) => a.order - b.order),
    [milestones]
  );

  const getGoalTasks = useCallback(
    (goalId: string) => tasks.filter((t) => t.goalId === goalId),
    [tasks]
  );

  const getGoalProgress = useCallback(
    (goalId: string) => {
      const goalMilestones = milestones.filter((m) => m.goalId === goalId);
      if (goalMilestones.length === 0) {
        const goalTasks = tasks.filter((t) => t.goalId === goalId);
        if (goalTasks.length === 0) return 0;
        return Math.round((goalTasks.filter((t) => t.completed).length / goalTasks.length) * 100);
      }
      return Math.round((goalMilestones.filter((m) => m.completed).length / goalMilestones.length) * 100);
    },
    [milestones, tasks]
  );

  // ─── Auto-schedule ──────────────────────────────────

  const autoSchedule = useCallback(() => {
    const unscheduled = tasks
      .filter((t) => !t.completed && !t.scheduledStart)
      .sort((a, b) => {
        const pw = { critical: 4, high: 3, medium: 2, low: 1 };
        const da = a.deadline ? new Date(a.deadline).getTime() : Infinity;
        const db = b.deadline ? new Date(b.deadline).getTime() : Infinity;
        if (da !== db) return da - db;
        return pw[b.priority] - pw[a.priority];
      });

    if (unscheduled.length === 0) return;

    const busySlots = [
      ...events.map((e) => ({ start: new Date(e.start).getTime(), end: new Date(e.end).getTime() })),
      ...tasks
        .filter((t) => t.scheduledStart && t.scheduledEnd && !t.completed)
        .map((t) => ({ start: new Date(t.scheduledStart!).getTime(), end: new Date(t.scheduledEnd!).getTime() })),
    ].sort((a, b) => a.start - b.start);

    const now = new Date();
    const cursor = new Date(now);
    cursor.setMinutes(0, 0, 0);
    if (cursor.getHours() < 9) cursor.setHours(9);
    if (cursor.getHours() >= 18) {
      cursor.setDate(cursor.getDate() + 1);
      cursor.setHours(9);
    }

    const updates: { id: string; start: string; end: string }[] = [];

    for (const task of unscheduled) {
      const duration = (task.durationMinutes || 30) * 60 * 1000;
      let scheduled = false;
      let attempts = 0;

      while (!scheduled && attempts < 100) {
        const day = cursor.getDay();
        if (day === 0 || day === 6) {
          cursor.setDate(cursor.getDate() + (day === 0 ? 1 : 2));
          cursor.setHours(9, 0, 0, 0);
          attempts++;
          continue;
        }

        const slotStart = cursor.getTime();
        const slotEnd = slotStart + duration;
        const endHour = new Date(slotEnd).getHours() + new Date(slotEnd).getMinutes() / 60;

        if (endHour > 18 || new Date(slotEnd).getDate() !== cursor.getDate()) {
          cursor.setDate(cursor.getDate() + 1);
          cursor.setHours(9, 0, 0, 0);
          attempts++;
          continue;
        }

        const conflict = busySlots.find((s) => slotStart < s.end && slotEnd > s.start);
        if (!conflict) {
          updates.push({ id: task.id, start: new Date(slotStart).toISOString(), end: new Date(slotEnd).toISOString() });
          busySlots.push({ start: slotStart, end: slotEnd });
          busySlots.sort((a, b) => a.start - b.start);
          cursor.setTime(slotEnd);
          scheduled = true;
        } else {
          cursor.setTime(conflict.end);
          attempts++;
        }
      }
    }

    if (updates.length > 0) {
      setTasks((prev) =>
        prev.map((t) => {
          const u = updates.find((x) => x.id === t.id);
          return u ? { ...t, scheduledStart: u.start, scheduledEnd: u.end, updatedAt: new Date().toISOString() } : t;
        })
      );
      const newEvents: CalendarEvent[] = updates.map((u) => {
        const task = tasks.find((t) => t.id === u.id)!;
        const goal = task.goalId ? goals.find((g) => g.id === task.goalId) : null;
        return {
          id: crypto.randomUUID(),
          title: task.title,
          description: "",
          start: u.start,
          end: u.end,
          allDay: false,
          color: goal?.color || "#8b5cf6",
          taskId: task.id,
          source: "local" as const,
          createdAt: new Date().toISOString(),
        };
      });
      setEvents((prev) => [...prev, ...newEvents]);
    }
  }, [tasks, events, goals]);

  return (
    <StoreContext.Provider
      value={{
        goals, milestones, tasks, events, chatMessages, aiMemory,
        addGoal, updateGoal, deleteGoal,
        addMilestone, updateMilestone, deleteMilestone,
        addTask, updateTask, deleteTask,
        addEvent, updateEvent, deleteEvent,
        addChatMessage, getChatMessages,
        setAiMemory,
        getGoalProgress, getGoalMilestones, getGoalTasks,
        autoSchedule,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}
