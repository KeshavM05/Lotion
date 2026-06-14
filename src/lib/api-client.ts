/**
 * API Client for Lotion backend
 * Provides typed functions for all CRUD operations
 */

import { supabase } from './supabase';
import type {
  Goal,
  Milestone,
  Task,
  TaskList,
  CalendarEvent,
  JournalEntry,
  ChatMessage,
} from './store';

const API_BASE = '/api';

/** Seconds before expiry at which we proactively refresh (5 minutes). */
const REFRESH_THRESHOLD_SECONDS = 5 * 60;

/**
 * Returns fresh Authorization headers, proactively refreshing the token
 * if it is expiring within REFRESH_THRESHOLD_SECONDS.
 *
 * Throws if there is no session or if a required refresh fails.
 */
export const getAuthHeaders = async (): Promise<Record<string, string>> => {
  let {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) throw new Error('Not authenticated');

  // Proactive refresh: if token expires in less than 5 minutes, refresh now.
  const expiresAt = session.expires_at; // Unix timestamp (seconds)
  if (expiresAt !== undefined) {
    const secondsUntilExpiry = expiresAt - Math.floor(Date.now() / 1000);
    if (secondsUntilExpiry < REFRESH_THRESHOLD_SECONDS) {
      const { data, error } = await supabase.auth.refreshSession();
      if (error || !data.session) {
        // Refresh failed — redirect to login.
        if (typeof window !== 'undefined') {
          window.location.href = '/auth';
        }
        throw new Error('Session refresh failed; redirecting to login.');
      }
      session = data.session;
    }
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session.access_token}`,
  };
};

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  let headers = await getAuthHeaders();

  const doFetch = () =>
    fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

  let response = await doFetch();

  // On 401, attempt a token refresh and retry the request once.
  if (response.status === 401) {
    const { data, error } = await supabase.auth.refreshSession();

    if (error || !data.session) {
      // Refresh failed — redirect to login.
      if (typeof window !== 'undefined') {
        window.location.href = '/auth';
      }
      throw new Error('Session expired. Please log in again.');
    }

    // Rebuild headers with the new token and retry.
    headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${data.session.access_token}`,
    };
    response = await doFetch();
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
};

// ─── Goals ───────────────────────────────────────────────

export const goalsApi = {
  list: async (): Promise<Goal[]> => {
    return apiRequest('/goals');
  },

  get: async (id: string): Promise<Goal & { milestones: Milestone[]; tasks: Task[] }> => {
    return apiRequest(`/goals/${id}`);
  },

  create: async (data: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Goal> => {
    return apiRequest('/goals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<Goal>): Promise<Goal> => {
    return apiRequest(`/goals/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest(`/goals/${id}`, { method: 'DELETE' });
  },
};

// ─── Tasks ───────────────────────────────────────────────

export const tasksApi = {
  list: async (): Promise<Task[]> => {
    return apiRequest('/tasks');
  },

  create: async (
    data: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completed' | 'completedAt'>
  ): Promise<Task> => {
    return apiRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<Task>): Promise<Task> => {
    return apiRequest(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest(`/tasks/${id}`, { method: 'DELETE' });
  },

  autoSchedule: async (timezone?: string): Promise<{ message: string; scheduledCount: number }> => {
    return apiRequest('/tasks/auto-schedule', {
      method: 'POST',
      body: JSON.stringify({ timezone }),
    });
  },
};

// ─── Task Lists ──────────────────────────────────────────

export const taskListsApi = {
  list: async (): Promise<TaskList[]> => {
    return apiRequest('/task-lists');
  },

  create: async (
    data: Omit<TaskList, 'id' | 'createdAt' | 'archived' | 'archivedAt'>
  ): Promise<TaskList> => {
    return apiRequest('/task-lists', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<TaskList>): Promise<TaskList> => {
    return apiRequest(`/task-lists/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest(`/task-lists/${id}`, { method: 'DELETE' });
  },
};

// ─── Milestones ──────────────────────────────────────────

export const milestonesApi = {
  create: async (
    data: Omit<Milestone, 'id' | 'createdAt' | 'completed' | 'completedAt'>
  ): Promise<Milestone> => {
    return apiRequest('/milestones', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<Milestone>): Promise<Milestone> => {
    return apiRequest(`/milestones/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest(`/milestones/${id}`, { method: 'DELETE' });
  },
};

// ─── Journal ─────────────────────────────────────────────

export const journalApi = {
  list: async (): Promise<JournalEntry[]> => {
    return apiRequest('/journal');
  },

  create: async (
    data: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<JournalEntry> => {
    return apiRequest('/journal', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<JournalEntry>): Promise<JournalEntry> => {
    return apiRequest(`/journal/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest(`/journal/${id}`, { method: 'DELETE' });
  },
};

// ─── Calendar Events ─────────────────────────────────────

export const eventsApi = {
  list: async (start?: string, end?: string): Promise<CalendarEvent[]> => {
    const params = new URLSearchParams();
    if (start) params.set('start', start);
    if (end) params.set('end', end);
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest(`/events${query}`);
  },

  create: async (data: Omit<CalendarEvent, 'id' | 'createdAt'>): Promise<CalendarEvent> => {
    return apiRequest('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<CalendarEvent>): Promise<CalendarEvent> => {
    return apiRequest(`/events/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest(`/events/${id}`, { method: 'DELETE' });
  },
};

// ─── AI Memory ───────────────────────────────────────────

export const aiMemoryApi = {
  get: async (): Promise<{ memory: string }> => {
    return apiRequest('/user/memory');
  },

  update: async (memory: string): Promise<{ memory: string }> => {
    return apiRequest('/user/memory', {
      method: 'PATCH',
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
    return apiRequest('/ai/chat', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },
};

// ─── Knowledge Base ─────────────────────────────────────

import type { KnowledgeSource, WikiPage } from './store';

export const knowledgeApi = {
  listSources: async (): Promise<KnowledgeSource[]> => {
    return apiRequest('/knowledge/sources');
  },

  createSource: async (data: {
    title: string;
    content: string;
    sourceType: string;
    metadata?: Record<string, unknown>;
  }): Promise<KnowledgeSource> => {
    return apiRequest('/knowledge/sources', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  deleteSource: async (id: string): Promise<void> => {
    return apiRequest(`/knowledge/sources/${id}`, { method: 'DELETE' });
  },

  listPages: async (): Promise<WikiPage[]> => {
    return apiRequest('/knowledge/wiki');
  },

  updatePage: async (id: string, data: Partial<WikiPage>): Promise<WikiPage> => {
    return apiRequest(`/knowledge/wiki/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deletePage: async (id: string): Promise<void> => {
    return apiRequest(`/knowledge/wiki/${id}`, { method: 'DELETE' });
  },

  ingest: async (sourceId: string): Promise<{ pages: WikiPage[]; mode: string }> => {
    return apiRequest('/knowledge/ingest', {
      method: 'POST',
      body: JSON.stringify({ sourceId }),
    });
  },

  query: async (question: string): Promise<{ answer: string; citations: string[] }> => {
    return apiRequest('/knowledge/query', {
      method: 'POST',
      body: JSON.stringify({ question }),
    });
  },

  lint: async (): Promise<{
    report: string;
    issues: Array<{ type: string; description: string; page?: string }>;
    mode: string;
  }> => {
    return apiRequest('/knowledge/lint', { method: 'POST' });
  },
};

// ─── User Initialization ─────────────────────────────────

export const initializeUser = async (): Promise<void> => {
  return apiRequest('/user/init', { method: 'POST' });
};

// ─── Generic client ──────────────────────────────────────

export const apiClient = {
  get: (endpoint: string) => apiRequest(endpoint, { method: 'GET' }),
  post: (endpoint: string, body?: unknown) =>
    apiRequest(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  patch: (endpoint: string, body?: unknown) =>
    apiRequest(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (endpoint: string) => apiRequest(endpoint, { method: 'DELETE' }),
};
