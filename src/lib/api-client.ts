/**
 * API Client for Lotion backend
 * Provides typed functions for all CRUD operations
 */

import { supabase } from "./supabase";
import type {
  Goal,
  Milestone,
  Task,
  TaskList,
  CalendarEvent,
  JournalEntry,
  ChatMessage,
} from "./store";

const API_BASE = "/api";

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  // Get Supabase session token
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session.access_token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
};

// ─── Goals ───────────────────────────────────────────────

export const goalsApi = {
  list: async (): Promise<Goal[]> => {
    return apiRequest("/goals");
  },

  get: async (id: string): Promise<Goal & { milestones: Milestone[]; tasks: Task[] }> => {
    return apiRequest(`/goals/${id}`);
  },

  create: async (data: Omit<Goal, "id" | "createdAt" | "updatedAt">): Promise<Goal> => {
    return apiRequest("/goals", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<Goal>): Promise<Goal> => {
    return apiRequest(`/goals/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest(`/goals/${id}`, { method: "DELETE" });
  },
};

// ─── Tasks ───────────────────────────────────────────────

export const tasksApi = {
  list: async (): Promise<Task[]> => {
    return apiRequest("/tasks");
  },

  create: async (data: Omit<Task, "id" | "createdAt" | "updatedAt" | "completed" | "completedAt">): Promise<Task> => {
    return apiRequest("/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<Task>): Promise<Task> => {
    return apiRequest(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest(`/tasks/${id}`, { method: "DELETE" });
  },

  autoSchedule: async (): Promise<{ message: string; scheduledCount: number }> => {
    return apiRequest("/tasks/auto-schedule", { method: "POST" });
  },
};

// ─── Task Lists ──────────────────────────────────────────

export const taskListsApi = {
  list: async (): Promise<TaskList[]> => {
    return apiRequest("/task-lists");
  },

  create: async (data: Omit<TaskList, "id" | "createdAt">): Promise<TaskList> => {
    return apiRequest("/task-lists", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<TaskList>): Promise<TaskList> => {
    return apiRequest(`/task-lists/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest(`/task-lists/${id}`, { method: "DELETE" });
  },
};

// ─── Milestones ──────────────────────────────────────────

export const milestonesApi = {
  create: async (data: Omit<Milestone, "id" | "createdAt" | "completed" | "completedAt">): Promise<Milestone> => {
    return apiRequest("/milestones", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<Milestone>): Promise<Milestone> => {
    return apiRequest(`/milestones/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest(`/milestones/${id}`, { method: "DELETE" });
  },
};

// ─── Journal ─────────────────────────────────────────────

export const journalApi = {
  list: async (): Promise<JournalEntry[]> => {
    return apiRequest("/journal");
  },

  create: async (data: Omit<JournalEntry, "id" | "createdAt" | "updatedAt">): Promise<JournalEntry> => {
    return apiRequest("/journal", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<JournalEntry>): Promise<JournalEntry> => {
    return apiRequest(`/journal/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest(`/journal/${id}`, { method: "DELETE" });
  },
};

// ─── Calendar Events ─────────────────────────────────────

export const eventsApi = {
  list: async (start?: string, end?: string): Promise<CalendarEvent[]> => {
    const params = new URLSearchParams();
    if (start) params.set("start", start);
    if (end) params.set("end", end);
    const query = params.toString() ? `?${params.toString()}` : "";
    return apiRequest(`/events${query}`);
  },

  create: async (data: Omit<CalendarEvent, "id" | "createdAt">): Promise<CalendarEvent> => {
    return apiRequest("/events", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<CalendarEvent>): Promise<CalendarEvent> => {
    return apiRequest(`/events/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest(`/events/${id}`, { method: "DELETE" });
  },
};

// ─── AI Memory ───────────────────────────────────────────

export const aiMemoryApi = {
  get: async (): Promise<{ memory: string }> => {
    return apiRequest("/user/memory");
  },

  update: async (memory: string): Promise<{ memory: string }> => {
    return apiRequest("/user/memory", {
      method: "PATCH",
      body: JSON.stringify({ memory }),
    });
  },
};

// ─── AI Chat ─────────────────────────────────────────────

export const aiChatApi = {
  send: async (params: {
    messages: ChatMessage[];
    goalContext?: string;
    aiMemory?: string;
    calendarContext?: string;
    tasksContext?: string;
  }): Promise<{ message: string }> => {
    return apiRequest("/ai/chat", {
      method: "POST",
      body: JSON.stringify(params),
    });
  },
};

// ─── User Initialization ─────────────────────────────────

export const initializeUser = async (): Promise<void> => {
  return apiRequest("/user/init", { method: "POST" });
};
