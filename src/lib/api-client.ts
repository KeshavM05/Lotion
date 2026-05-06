/**
 * API Client for Lotion backend
 * Provides typed functions for all CRUD operations
 */

import type {
  Goal,
  Milestone,
  Task,
  CalendarEvent,
  JournalEntry,
  ChatMessage,
} from "./store";

const API_BASE = "/api";

// Temporary: For MVP, we'll use a hardcoded user ID
// In production, this will come from Supabase auth session
const getUserId = () => {
  if (typeof window === "undefined") return null;
  // For now, use a consistent test user ID stored in localStorage
  let userId = localStorage.getItem("lotion_user_id");
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem("lotion_user_id", userId);
  }
  return userId;
};

// Initialize user in database (call once on app load)
export const initializeUser = async () => {
  const userId = getUserId();
  if (!userId) return null;

  try {
    const response = await fetch(`${API_BASE}/user/init`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    if (!response.ok) throw new Error("Failed to initialize user");
    return await response.json();
  } catch (error) {
    console.error("User initialization error:", error);
    return null;
  }
};

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const userId = getUserId();
  if (!userId) throw new Error("No user ID available");

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-user-id": userId,
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
