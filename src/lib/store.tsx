"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { goalsApi, tasksApi, milestonesApi, journalApi, eventsApi, aiMemoryApi } from "./api-client";

// ─── Types ───────────────────────────────────────────────

export type Priority = "low" | "medium" | "high" | "critical";
export type TaskStatus = "todo" | "in_progress" | "done" | "cancelled";
export type GoalStatus = "active" | "paused" | "completed" | "abandoned";
export type GoalCategory = "career" | "business" | "finance" | "personal" | "health" | "creative";
export type ChatRole = "user" | "assistant";
export type EnergyLevel = "low" | "medium" | "high";
export type TimePreference = "morning" | "afternoon" | "evening" | "anytime";

export const CATEGORY_COLORS: Record<GoalCategory, string> = {
  career: "#C17A72",
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

export const ENERGY_LABELS: Record<EnergyLevel, string> = {
  low: "Low Energy",
  medium: "Medium Energy",
  high: "High Energy",
};

export const TIME_PREFERENCE_LABELS: Record<TimePreference, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  anytime: "Anytime",
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
  energyLevel?: EnergyLevel;
  timePreference?: TimePreference;
  tags?: string[];
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
  isRecurring?: boolean;
  recurrenceFrequency?: "daily" | "weekly" | "monthly" | "yearly";
  recurrenceInterval?: number;
  recurrenceEndDate?: string | null;
  recurrenceDaysOfWeek?: number[]; // 0=Sun, 1=Mon, etc
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  goalId: string | null;
  role: ChatRole;
  content: string;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  content: string;
  mood: "great" | "good" | "okay" | "bad" | "terrible" | null;
  linkedGoalIds: string[];
  createdAt: string;
  updatedAt: string;
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
  loading: boolean;

  // Init
  loadInitialData: () => Promise<void>;

  // Goals
  addGoal: (goal: Omit<Goal, "id" | "createdAt" | "updatedAt">) => Promise<Goal>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;

  // Milestones
  addMilestone: (milestone: Omit<Milestone, "id" | "createdAt" | "completed" | "completedAt">) => Promise<Milestone>;
  updateMilestone: (id: string, updates: Partial<Milestone>) => Promise<void>;
  deleteMilestone: (id: string) => Promise<void>;

  // Tasks
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt" | "completed" | "completedAt">) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;

  // Events
  addEvent: (event: Omit<CalendarEvent, "id" | "createdAt">) => Promise<CalendarEvent>;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;

  // Chat
  addChatMessage: (message: Omit<ChatMessage, "id" | "createdAt">) => ChatMessage;
  getChatMessages: (goalId: string | null) => ChatMessage[];

  // Journal
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: Omit<JournalEntry, "id" | "createdAt" | "updatedAt">) => Promise<JournalEntry>;
  updateJournalEntry: (id: string, updates: Partial<JournalEntry>) => Promise<void>;
  deleteJournalEntry: (id: string) => Promise<void>;

  // AI Memory
  setAiMemory: (memory: string) => Promise<void>;

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
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [aiMemory, setAiMemoryState] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // ─── Load Initial Data ───────────────────────────────────

  const loadInitialData = useCallback(async () => {
    if (initialized) return;

    try {
      setLoading(true);
      const [goalsData, tasksData, journalData, eventsData, memoryData] = await Promise.all([
        goalsApi.list(),
        tasksApi.list(),
        journalApi.list(),
        eventsApi.list(),
        aiMemoryApi.get(),
      ]);

      // Extract milestones from goals
      const allMilestones: Milestone[] = [];
      goalsData.forEach((goal: any) => {
        if (goal.milestones && Array.isArray(goal.milestones)) {
          allMilestones.push(...goal.milestones);
        }
      });

      setGoals(goalsData);
      setMilestones(allMilestones);
      setTasks(tasksData);
      setJournalEntries(journalData);
      setEvents(eventsData);
      setAiMemoryState(memoryData.memory || "");
      setInitialized(true);
    } catch (error) {
      console.error("Failed to load initial data:", error);
    } finally {
      setLoading(false);
    }
  }, [initialized]);

  // ─── Goals ───────────────────────────────────────────

  const addGoal = useCallback(async (data: Omit<Goal, "id" | "createdAt" | "updatedAt">) => {
    const tempId = `temp-${crypto.randomUUID()}`;
    const tempGoal: Goal = {
      ...data,
      id: tempId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setGoals((prev) => [...prev, tempGoal]);

    try {
      const savedGoal = await goalsApi.create(data);
      setGoals((prev) => prev.map((g) => (g.id === tempId ? savedGoal : g)));
      return savedGoal;
    } catch (error) {
      setGoals((prev) => prev.filter((g) => g.id !== tempId));
      console.error("Failed to create goal:", error);
      throw error;
    }
  }, []);

  const updateGoal = useCallback(async (id: string, updates: Partial<Goal>) => {
    const oldGoals = goals;
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updates, updatedAt: new Date().toISOString() } : g))
    );

    try {
      const updated = await goalsApi.update(id, updates);
      setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)));
    } catch (error) {
      setGoals(oldGoals);
      console.error("Failed to update goal:", error);
      throw error;
    }
  }, [goals]);

  const deleteGoal = useCallback(async (id: string) => {
    const oldGoals = goals;
    const oldMilestones = milestones;
    const oldTasks = tasks;
    const oldMessages = chatMessages;

    setGoals((prev) => prev.filter((g) => g.id !== id));
    setMilestones((prev) => prev.filter((m) => m.goalId !== id));
    setTasks((prev) => prev.map((t) => (t.goalId === id ? { ...t, goalId: null, milestoneId: null } : t)));
    setChatMessages((prev) => prev.filter((m) => m.goalId !== id));

    try {
      await goalsApi.delete(id);
    } catch (error) {
      setGoals(oldGoals);
      setMilestones(oldMilestones);
      setTasks(oldTasks);
      setChatMessages(oldMessages);
      console.error("Failed to delete goal:", error);
      throw error;
    }
  }, [goals, milestones, tasks, chatMessages]);

  // ─── Milestones ──────────────────────────────────────

  const addMilestone = useCallback(async (data: Omit<Milestone, "id" | "createdAt" | "completed" | "completedAt">) => {
    const tempId = `temp-${crypto.randomUUID()}`;
    const tempMilestone: Milestone = {
      ...data,
      id: tempId,
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
    };
    setMilestones((prev) => [...prev, tempMilestone]);

    try {
      const savedMilestone = await milestonesApi.create(data);
      setMilestones((prev) => prev.map((m) => (m.id === tempId ? savedMilestone : m)));
      return savedMilestone;
    } catch (error) {
      setMilestones((prev) => prev.filter((m) => m.id !== tempId));
      console.error("Failed to create milestone:", error);
      throw error;
    }
  }, []);

  const updateMilestone = useCallback(async (id: string, updates: Partial<Milestone>) => {
    const oldMilestones = milestones;
    setMilestones((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));

    try {
      const updated = await milestonesApi.update(id, updates);
      setMilestones((prev) => prev.map((m) => (m.id === id ? updated : m)));
    } catch (error) {
      setMilestones(oldMilestones);
      console.error("Failed to update milestone:", error);
      throw error;
    }
  }, [milestones]);

  const deleteMilestone = useCallback(async (id: string) => {
    const oldMilestones = milestones;
    const oldTasks = tasks;

    setMilestones((prev) => prev.filter((m) => m.id !== id));
    setTasks((prev) => prev.map((t) => (t.milestoneId === id ? { ...t, milestoneId: null } : t)));

    try {
      await milestonesApi.delete(id);
    } catch (error) {
      setMilestones(oldMilestones);
      setTasks(oldTasks);
      console.error("Failed to delete milestone:", error);
      throw error;
    }
  }, [milestones, tasks]);

  // ─── Tasks ───────────────────────────────────────────

  const addTask = useCallback(async (data: Omit<Task, "id" | "createdAt" | "updatedAt" | "completed" | "completedAt">) => {
    const tempId = `temp-${crypto.randomUUID()}`;
    const tempTask: Task = {
      ...data,
      id: tempId,
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, tempTask]);

    try {
      const savedTask = await tasksApi.create(data);
      setTasks((prev) => prev.map((t) => (t.id === tempId ? savedTask : t)));
      return savedTask;
    } catch (error) {
      setTasks((prev) => prev.filter((t) => t.id !== tempId));
      console.error("Failed to create task:", error);
      throw error;
    }
  }, []);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    const oldTasks = tasks;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t))
    );

    try {
      const updated = await tasksApi.update(id, updates);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (error) {
      setTasks(oldTasks);
      console.error("Failed to update task:", error);
      throw error;
    }
  }, [tasks]);

  const deleteTask = useCallback(async (id: string) => {
    const oldTasks = tasks;
    const oldEvents = events;

    setTasks((prev) => prev.filter((t) => t.id !== id));
    setEvents((prev) => prev.filter((e) => e.taskId !== id));

    try {
      await tasksApi.delete(id);
    } catch (error) {
      setTasks(oldTasks);
      setEvents(oldEvents);
      console.error("Failed to delete task:", error);
      throw error;
    }
  }, [tasks, events]);

  // ─── Events ──────────────────────────────────────────

  const addEvent = useCallback(async (data: Omit<CalendarEvent, "id" | "createdAt">) => {
    const tempId = `temp-${crypto.randomUUID()}`;
    const tempEvent: CalendarEvent = {
      ...data,
      id: tempId,
      createdAt: new Date().toISOString(),
    };
    setEvents((prev) => [...prev, tempEvent]);

    try {
      const savedEvent = await eventsApi.create(data);
      setEvents((prev) => prev.map((e) => (e.id === tempId ? savedEvent : e)));
      return savedEvent;
    } catch (error) {
      setEvents((prev) => prev.filter((e) => e.id !== tempId));
      console.error("Failed to create event:", error);
      throw error;
    }
  }, []);

  const updateEvent = useCallback(async (id: string, updates: Partial<CalendarEvent>) => {
    const oldEvents = events;
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));

    try {
      const updated = await eventsApi.update(id, updates);
      setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)));
    } catch (error) {
      setEvents(oldEvents);
      console.error("Failed to update event:", error);
      throw error;
    }
  }, [events]);

  const deleteEvent = useCallback(async (id: string) => {
    const oldEvents = events;
    setEvents((prev) => prev.filter((e) => e.id !== id));

    try {
      await eventsApi.delete(id);
    } catch (error) {
      setEvents(oldEvents);
      console.error("Failed to delete event:", error);
      throw error;
    }
  }, [events]);

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

  // ─── Journal ─────────────────────────────────────────

  const addJournalEntry = useCallback(async (data: Omit<JournalEntry, "id" | "createdAt" | "updatedAt">) => {
    const tempId = `temp-${crypto.randomUUID()}`;
    const tempEntry: JournalEntry = {
      ...data,
      id: tempId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setJournalEntries((prev) => [tempEntry, ...prev]);

    try {
      const savedEntry = await journalApi.create(data);
      setJournalEntries((prev) => prev.map((e) => (e.id === tempId ? savedEntry : e)));
      return savedEntry;
    } catch (error) {
      setJournalEntries((prev) => prev.filter((e) => e.id !== tempId));
      console.error("Failed to create journal entry:", error);
      throw error;
    }
  }, []);

  const updateJournalEntry = useCallback(async (id: string, updates: Partial<JournalEntry>) => {
    const oldEntries = journalEntries;
    setJournalEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e))
    );

    try {
      const updated = await journalApi.update(id, updates);
      setJournalEntries((prev) => prev.map((e) => (e.id === id ? updated : e)));
    } catch (error) {
      setJournalEntries(oldEntries);
      console.error("Failed to update journal entry:", error);
      throw error;
    }
  }, [journalEntries]);

  const deleteJournalEntry = useCallback(async (id: string) => {
    const oldEntries = journalEntries;
    setJournalEntries((prev) => prev.filter((e) => e.id !== id));

    try {
      await journalApi.delete(id);
    } catch (error) {
      setJournalEntries(oldEntries);
      console.error("Failed to delete journal entry:", error);
      throw error;
    }
  }, [journalEntries]);

  // ─── AI Memory ───────────────────────────────────────

  const setAiMemory = useCallback(async (memory: string) => {
    const oldMemory = aiMemory;
    setAiMemoryState(memory);

    try {
      await aiMemoryApi.update(memory);
    } catch (error) {
      setAiMemoryState(oldMemory);
      console.error("Failed to update AI memory:", error);
      throw error;
    }
  }, [aiMemory]);

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
    // Configuration
    const WORK_START = 9; // 9 AM
    const WORK_END = 18; // 6 PM
    const BUFFER_MINUTES = 5; // Smart buffer between tasks
    const BUFFER_MS = BUFFER_MINUTES * 60 * 1000;

    // Energy level time windows
    const ENERGY_WINDOWS = {
      high: { start: 9, end: 12 }, // Morning: 9 AM - 12 PM
      medium: { start: 12, end: 16 }, // Afternoon: 12 PM - 4 PM
      low: { start: 16, end: 18 }, // Late afternoon/evening: 4 PM - 6 PM
    };

    // Time preference windows
    const TIME_WINDOWS = {
      morning: { start: 9, end: 12 },
      afternoon: { start: 12, end: 16 },
      evening: { start: 16, end: 18 },
      anytime: { start: 9, end: 18 },
    };

    const unscheduled = tasks
      .filter((t) => !t.completed && !t.scheduledStart)
      .sort((a, b) => {
        // Sort by deadline first (urgency)
        const da = a.deadline ? new Date(a.deadline).getTime() : Infinity;
        const db = b.deadline ? new Date(b.deadline).getTime() : Infinity;
        if (da !== db) return da - db;

        // Then by priority
        const pw = { critical: 4, high: 3, medium: 2, low: 1 };
        if (pw[b.priority] !== pw[a.priority]) return pw[b.priority] - pw[a.priority];

        // Then prefer tasks with specific time preferences
        if (a.timePreference !== "anytime" && b.timePreference === "anytime") return -1;
        if (a.timePreference === "anytime" && b.timePreference !== "anytime") return 1;

        return 0;
      });

    if (unscheduled.length === 0) return;

    // Build busy slots with buffer time
    const busySlots = [
      ...events.map((e) => ({
        start: new Date(e.start).getTime(),
        end: new Date(e.end).getTime() + BUFFER_MS, // Add buffer after events
      })),
      ...tasks
        .filter((t) => t.scheduledStart && t.scheduledEnd && !t.completed)
        .map((t) => ({
          start: new Date(t.scheduledStart!).getTime(),
          end: new Date(t.scheduledEnd!).getTime() + BUFFER_MS, // Add buffer after scheduled tasks
        })),
    ].sort((a, b) => a.start - b.start);

    const now = new Date();
    const cursor = new Date(now);
    cursor.setMinutes(0, 0, 0);

    // Start from next available hour
    if (cursor.getHours() < WORK_START) {
      cursor.setHours(WORK_START);
    } else if (cursor.getHours() >= WORK_END) {
      cursor.setDate(cursor.getDate() + 1);
      cursor.setHours(WORK_START);
    }

    const updates: { id: string; start: string; end: string }[] = [];

    // Helper: Check if time slot matches task preferences
    const matchesPreferences = (task: Task, slotStartTime: number): boolean => {
      const hour = new Date(slotStartTime).getHours();

      // Check time preference
      const timePref = task.timePreference || "anytime";
      const timeWindow = TIME_WINDOWS[timePref];
      if (hour < timeWindow.start || hour >= timeWindow.end) {
        return false;
      }

      // Check energy level preference
      const energyLevel = task.energyLevel || "medium";
      const energyWindow = ENERGY_WINDOWS[energyLevel];

      // Ideal: task energy matches time window
      // Acceptable: within anytime window
      const isIdealTime = hour >= energyWindow.start && hour < energyWindow.end;
      const isAcceptableTime = hour >= WORK_START && hour < WORK_END;

      // Prefer ideal time, but accept any time if needed
      return isIdealTime || isAcceptableTime;
    };

    // First pass: Try to schedule tasks in their preferred time windows
    for (const task of unscheduled) {
      const duration = (task.durationMinutes || 30) * 60 * 1000;
      let scheduled = false;
      let attempts = 0;
      const maxDaysAhead = 14; // Look up to 2 weeks ahead

      const searchCursor = new Date(cursor);

      while (!scheduled && attempts < maxDaysAhead * 10) {
        const day = searchCursor.getDay();

        // Skip weekends
        if (day === 0 || day === 6) {
          searchCursor.setDate(searchCursor.getDate() + (day === 0 ? 1 : 2));
          searchCursor.setHours(WORK_START, 0, 0, 0);
          attempts++;
          continue;
        }

        const slotStart = searchCursor.getTime();
        const slotEnd = slotStart + duration;
        const endHour = new Date(slotEnd).getHours() + new Date(slotEnd).getMinutes() / 60;

        // Check if slot exceeds work hours or crosses day boundary
        if (endHour > WORK_END || new Date(slotEnd).getDate() !== searchCursor.getDate()) {
          searchCursor.setDate(searchCursor.getDate() + 1);
          searchCursor.setHours(WORK_START, 0, 0, 0);
          attempts++;
          continue;
        }

        // Check if slot matches task preferences
        if (!matchesPreferences(task, slotStart)) {
          // Move to next potential slot
          searchCursor.setMinutes(searchCursor.getMinutes() + 30);
          if (searchCursor.getHours() >= WORK_END) {
            searchCursor.setDate(searchCursor.getDate() + 1);
            searchCursor.setHours(WORK_START, 0, 0, 0);
          }
          attempts++;
          continue;
        }

        // Check for conflicts
        const conflict = busySlots.find((s) => slotStart < s.end && slotEnd > s.start);

        if (!conflict) {
          // Schedule the task
          updates.push({
            id: task.id,
            start: new Date(slotStart).toISOString(),
            end: new Date(slotEnd).toISOString(),
          });

          // Add to busy slots with buffer
          busySlots.push({ start: slotStart, end: slotEnd + BUFFER_MS });
          busySlots.sort((a, b) => a.start - b.start);

          scheduled = true;
        } else {
          // Move cursor to end of conflict
          searchCursor.setTime(conflict.end);
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
        goals, milestones, tasks, events, chatMessages, journalEntries, aiMemory, loading,
        loadInitialData,
        addGoal, updateGoal, deleteGoal,
        addMilestone, updateMilestone, deleteMilestone,
        addTask, updateTask, deleteTask,
        addEvent, updateEvent, deleteEvent,
        addChatMessage, getChatMessages,
        addJournalEntry, updateJournalEntry, deleteJournalEntry,
        setAiMemory,
        getGoalProgress, getGoalMilestones, getGoalTasks,
        autoSchedule,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}
