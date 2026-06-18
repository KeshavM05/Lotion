'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from 'react';
import { toast } from 'sonner';
import {
  goalsApi,
  tasksApi,
  taskListsApi,
  milestonesApi,
  journalApi,
  eventsApi,
  aiMemoryApi,
  knowledgeApi,
} from './api-client';
import { AsyncQueue } from './async-queue';

const errMsg = (e: unknown): string | undefined => (e instanceof Error ? e.message : undefined);

// ─── Types ───────────────────────────────────────────────

export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'cancelled';
export type GoalStatus = 'active' | 'paused' | 'completed' | 'abandoned';
export type GoalCategory = 'career' | 'business' | 'finance' | 'personal' | 'health' | 'creative';
export type ChatRole = 'user' | 'assistant';
export type EnergyLevel = 'low' | 'medium' | 'high';
export type TimePreference = 'morning' | 'afternoon' | 'evening' | 'anytime';

export const CATEGORY_COLORS: Record<GoalCategory, string> = {
  career: '#C17A72',
  business: '#f59e0b',
  finance: '#10b981',
  personal: '#ec4899',
  health: '#34d399',
  creative: '#f97316',
};

export const CATEGORY_LABELS: Record<GoalCategory, string> = {
  career: 'Career',
  business: 'Business',
  finance: 'Finance',
  personal: 'Personal',
  health: 'Health',
  creative: 'Creative',
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

export const ENERGY_LABELS: Record<EnergyLevel, string> = {
  low: 'Low Energy',
  medium: 'Medium Energy',
  high: 'High Energy',
};

export const TIME_PREFERENCE_LABELS: Record<TimePreference, string> = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
  anytime: 'Anytime',
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
  listId: string | null;
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

export interface TaskList {
  id: string;
  name: string;
  color: string;
  icon: string;
  order: number;
  archived: boolean;
  archivedAt: string | null;
  createdAt: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export const TAG_COLORS = [
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#10b981',
  '#14b8a6',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#6b7280',
];

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start: string;
  end: string;
  allDay: boolean;
  color: string;
  tagId: string | null;
  taskId: string | null;
  googleEventId?: string | null;
  source: 'local' | 'google' | 'outlook' | 'task';
  isRecurring?: boolean;
  recurrenceFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
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

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface JournalEntry {
  id: string;
  content: string;
  mood: 'great' | 'good' | 'okay' | 'bad' | 'terrible' | null;
  linkedGoalIds: string[];
  createdAt: string;
  updatedAt: string;
}

export type KBSourceStatus = 'pending' | 'processing' | 'ingested' | 'failed';
export type KBSourceType = 'article' | 'book' | 'podcast' | 'meeting' | 'note' | 'research';
export type WikiCategory = 'concept' | 'entity' | 'summary' | 'comparison' | 'synthesis';

export interface KnowledgeSource {
  id: string;
  title: string;
  content: string;
  sourceType: KBSourceType;
  status: KBSourceStatus;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface WikiPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  category: WikiCategory;
  linkedSourceIds: string[];
  linkedPageSlugs: string[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface WikiLogEntry {
  id: string;
  action: string;
  description: string;
  pagesAffected: string[];
  createdAt: string;
}

// ─── Event History (Undo/Redo) ───────────────────────────

const EVENT_HISTORY_LIMIT = 50;

type EventHistoryEntry =
  | { type: 'create'; eventId: string }
  | { type: 'update'; eventId: string; before: CalendarEvent }
  | { type: 'delete'; event: CalendarEvent };

// ─── Store Interface ─────────────────────────────────────

interface StoreContextType {
  // Data
  goals: Goal[];
  milestones: Milestone[];
  tasks: Task[];
  taskLists: TaskList[];
  events: CalendarEvent[];
  tags: Tag[];
  chatMessages: ChatMessage[];
  aiMemory: string;
  loading: boolean;

  // Init
  loadInitialData: () => Promise<void>;
  syncGoogleCalendar: () => Promise<{ synced: number } | null>;

  // Goals
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Goal>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;

  // Milestones
  addMilestone: (
    milestone: Omit<Milestone, 'id' | 'createdAt' | 'completed' | 'completedAt'>
  ) => Promise<Milestone>;
  updateMilestone: (id: string, updates: Partial<Milestone>) => Promise<void>;
  deleteMilestone: (id: string) => Promise<void>;

  // Tasks
  addTask: (
    task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completed' | 'completedAt'>
  ) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;

  // Task Lists
  addTaskList: (
    list: Omit<TaskList, 'id' | 'createdAt' | 'archived' | 'archivedAt'>
  ) => Promise<TaskList>;
  updateTaskList: (id: string, updates: Partial<TaskList>) => Promise<void>;
  deleteTaskList: (id: string) => Promise<void>;
  restoreTaskList: (id: string) => Promise<void>;

  // Events
  addEvent: (event: Omit<CalendarEvent, 'id' | 'createdAt'>) => Promise<CalendarEvent>;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;

  // Event Undo/Redo
  undoEventAction: () => void;
  redoEventAction: () => void;
  canUndoEvent: boolean;
  canRedoEvent: boolean;

  // Tags
  createTag: (name: string, color: string) => Tag;
  updateTag: (id: string, updates: Partial<Omit<Tag, 'id'>>) => void;
  deleteTag: (id: string) => void;

  // Chat
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'createdAt'>) => ChatMessage;
  getChatMessages: (goalId: string | null) => ChatMessage[];

  // Chat Sessions (AI Coach)
  chatSessions: ChatSession[];
  activeChatId: string | null;
  createChatSession: () => string;
  deleteChatSession: (id: string) => void;
  renameChatSession: (id: string, title: string) => void;
  setActiveChatId: (id: string | null) => void;
  addMessageToSession: (sessionId: string, role: ChatRole, content: string) => void;
  getActiveSessionMessages: () => ChatMessage[];

  // Journal
  journalEntries: JournalEntry[];
  addJournalEntry: (
    entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<JournalEntry>;
  updateJournalEntry: (id: string, updates: Partial<JournalEntry>) => Promise<void>;
  deleteJournalEntry: (id: string) => Promise<void>;

  // AI Memory
  setAiMemory: (memory: string) => Promise<void>;

  // Knowledge Base
  knowledgeSources: KnowledgeSource[];
  wikiPages: WikiPage[];
  wikiLog: WikiLogEntry[];
  loadKnowledgeBase: () => Promise<void>;
  addKnowledgeSource: (
    source: Omit<KnowledgeSource, 'id' | 'createdAt' | 'status'>
  ) => Promise<KnowledgeSource>;
  updateKnowledgeSource: (id: string, updates: Partial<KnowledgeSource>) => void;
  deleteKnowledgeSource: (id: string) => Promise<void>;
  addWikiPage: (page: Omit<WikiPage, 'id' | 'createdAt' | 'updatedAt'>) => WikiPage;
  updateWikiPage: (id: string, updates: Partial<WikiPage>) => void;
  deleteWikiPage: (id: string) => Promise<void>;
  addWikiLogEntry: (entry: Omit<WikiLogEntry, 'id' | 'createdAt'>) => void;
  ingestSource: (sourceId: string) => Promise<{ pages: WikiPage[]; mode: string }>;
  queryKnowledgeBase: (question: string) => Promise<{ answer: string; citations: string[] }>;
  lintKnowledgeBase: () => Promise<{
    report: string;
    issues: Array<{ type: string; description: string; page?: string }>;
    mode: string;
  }>;

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
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

// ─── Provider ────────────────────────────────────────────

export function StoreProvider({ children }: { children: ReactNode }) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [aiMemory, setAiMemoryState] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // ─── Concurrency guards ──────────────────────────────────

  // Fix (a): prevents concurrent loadInitialData() calls
  const initializedRef = useRef(false);
  const isInitializingRef = useRef(false);

  // Fix (b) / steps 3-4: per-entity operation queues
  const queueRef = useRef(new AsyncQueue());

  // Fix (c): AI memory debounce timer
  const aiMemoryDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fix (d): ref-mirrors of state for stable rollback snapshots.
  // Closures that capture state directly can hold stale values when multiple
  // operations are in-flight; refs always reflect the latest committed state.
  const goalsRef = useRef<Goal[]>([]);
  const milestonesRef = useRef<Milestone[]>([]);
  const tasksRef = useRef<Task[]>([]);
  const eventsRef = useRef<CalendarEvent[]>([]);
  const chatMessagesRef = useRef<ChatMessage[]>([]);
  const journalEntriesRef = useRef<JournalEntry[]>([]);
  const aiMemoryRef = useRef<string>('');

  // ─── Event undo/redo stacks ─────────────────────────────
  const eventUndoStackRef = useRef<EventHistoryEntry[]>([]);
  const eventRedoStackRef = useRef<EventHistoryEntry[]>([]);
  const [canUndoEvent, setCanUndoEvent] = useState(false);
  const [canRedoEvent, setCanRedoEvent] = useState(false);

  const pushEventUndo = useCallback((entry: EventHistoryEntry) => {
    eventUndoStackRef.current = [
      ...eventUndoStackRef.current.slice(-(EVENT_HISTORY_LIMIT - 1)),
      entry,
    ];
    eventRedoStackRef.current = [];
    setCanUndoEvent(true);
    setCanRedoEvent(false);
  }, []);

  useEffect(() => {
    goalsRef.current = goals;
  }, [goals]);
  useEffect(() => {
    milestonesRef.current = milestones;
  }, [milestones]);
  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);
  useEffect(() => {
    eventsRef.current = events;
  }, [events]);
  useEffect(() => {
    chatMessagesRef.current = chatMessages;
  }, [chatMessages]);
  useEffect(() => {
    journalEntriesRef.current = journalEntries;
  }, [journalEntries]);
  useEffect(() => {
    aiMemoryRef.current = aiMemory;
  }, [aiMemory]);

  // ─── Load Initial Data ───────────────────────────────────

  const loadInitialData = useCallback(async () => {
    // Fix (a): guard against both already-initialized and in-flight initialization
    if (initializedRef.current || isInitializingRef.current) return;
    isInitializingRef.current = true;

    try {
      setLoading(true);
      const [goalsData, tasksData, taskListsData, journalData, eventsData, memoryData] =
        await Promise.all([
          goalsApi.list(),
          tasksApi.list(),
          taskListsApi.list(),
          journalApi.list(),
          eventsApi.list(),
          aiMemoryApi.get(),
        ]);

      // Extract milestones from goals
      const allMilestones: Milestone[] = [];
      (goalsData as Array<Goal & { milestones?: Milestone[] }>).forEach((goal) => {
        if (goal.milestones && Array.isArray(goal.milestones)) {
          allMilestones.push(...goal.milestones);
        }
      });

      setGoals(goalsData);
      setMilestones(allMilestones);
      setTasks(tasksData);
      setTaskLists(taskListsData);
      setJournalEntries(journalData);
      setEvents(eventsData);
      setAiMemoryState(memoryData.memory || '');
      initializedRef.current = true;
    } catch (error) {
      console.error('Failed to load initial data:', error);
      toast.error('Failed to load data', { description: 'Please refresh the page.' });
    } finally {
      setLoading(false);
      isInitializingRef.current = false;
    }
  }, []);

  // ─── Goals ───────────────────────────────────────────

  const addGoal = useCallback(async (data: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const tempId = `temp-${crypto.randomUUID()}`;
    const tempGoal: Goal = {
      ...data,
      id: tempId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setGoals((prev) => [...prev, tempGoal]);

    return queueRef.current.enqueue('goals', async () => {
      try {
        const savedGoal = await goalsApi.create(data);
        setGoals((prev) => prev.map((g) => (g.id === tempId ? savedGoal : g)));
        return savedGoal;
      } catch (error) {
        // Fix (d): remove only the optimistic item, don't clobber concurrent changes
        setGoals((prev) => prev.filter((g) => g.id !== tempId));
        console.error('Failed to create goal:', error);
        toast.error('Failed to create goal', { description: errMsg(error) });
        throw error;
      }
    });
  }, []);

  const updateGoal = useCallback(async (id: string, updates: Partial<Goal>) => {
    // Fix (d): snapshot via ref before optimistic update
    const snapshot = goalsRef.current;
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updates, updatedAt: new Date().toISOString() } : g))
    );

    return queueRef.current.enqueue('goals', async () => {
      try {
        const updated = await goalsApi.update(id, updates);
        setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)));
      } catch (error) {
        setGoals(snapshot);
        console.error('Failed to update goal:', error);
        toast.error('Failed to update goal', { description: errMsg(error) });
        throw error;
      }
    });
  }, []);

  const deleteGoal = useCallback(async (id: string) => {
    // Fix (d): capture all affected slices via refs
    const snapshotGoals = goalsRef.current;
    const snapshotMilestones = milestonesRef.current;
    const snapshotTasks = tasksRef.current;
    const snapshotMessages = chatMessagesRef.current;

    setGoals((prev) => prev.filter((g) => g.id !== id));
    setMilestones((prev) => prev.filter((m) => m.goalId !== id));
    setTasks((prev) =>
      prev.map((t) => (t.goalId === id ? { ...t, goalId: null, milestoneId: null } : t))
    );
    setChatMessages((prev) => prev.filter((m) => m.goalId !== id));

    return queueRef.current.enqueue('goals', async () => {
      try {
        await goalsApi.delete(id);
      } catch (error) {
        setGoals(snapshotGoals);
        setMilestones(snapshotMilestones);
        setTasks(snapshotTasks);
        setChatMessages(snapshotMessages);
        console.error('Failed to delete goal:', error);
        toast.error('Failed to delete goal', { description: errMsg(error) });
        throw error;
      }
    });
  }, []);

  // ─── Milestones ──────────────────────────────────────

  const addMilestone = useCallback(
    async (data: Omit<Milestone, 'id' | 'createdAt' | 'completed' | 'completedAt'>) => {
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
        console.error('Failed to create milestone:', error);
        toast.error('Failed to create milestone', { description: errMsg(error) });
        throw error;
      }
    },
    []
  );

  const updateMilestone = useCallback(async (id: string, updates: Partial<Milestone>) => {
    const snapshot = milestonesRef.current;
    setMilestones((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));

    try {
      const updated = await milestonesApi.update(id, updates);
      setMilestones((prev) => prev.map((m) => (m.id === id ? updated : m)));
    } catch (error) {
      setMilestones(snapshot);
      console.error('Failed to update milestone:', error);
      toast.error('Failed to update milestone', { description: errMsg(error) });
      throw error;
    }
  }, []);

  const deleteMilestone = useCallback(async (id: string) => {
    const snapshotMilestones = milestonesRef.current;
    const snapshotTasks = tasksRef.current;

    setMilestones((prev) => prev.filter((m) => m.id !== id));
    setTasks((prev) => prev.map((t) => (t.milestoneId === id ? { ...t, milestoneId: null } : t)));

    try {
      await milestonesApi.delete(id);
    } catch (error) {
      setMilestones(snapshotMilestones);
      setTasks(snapshotTasks);
      console.error('Failed to delete milestone:', error);
      toast.error('Failed to delete milestone', { description: errMsg(error) });
      throw error;
    }
  }, []);

  // ─── Tasks ───────────────────────────────────────────

  const addTask = useCallback(
    async (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completed' | 'completedAt'>) => {
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

      return queueRef.current.enqueue('tasks', async () => {
        try {
          const savedTask = await tasksApi.create(data);
          setTasks((prev) => prev.map((t) => (t.id === tempId ? savedTask : t)));
          return savedTask;
        } catch (error: any) {
          setTasks((prev) => prev.filter((t) => t.id !== tempId));
          console.error('Failed to create task:', error);
          toast.error('Failed to create task', { description: error.message });
          throw error;
        }
      });
    },
    []
  );

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    const snapshot = tasksRef.current;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t))
    );

    return queueRef.current.enqueue('tasks', async () => {
      try {
        const updated = await tasksApi.update(id, updates);
        setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      } catch (error) {
        setTasks(snapshot);
        console.error('Failed to update task:', error);
        toast.error('Failed to update task', { description: errMsg(error) });
        throw error;
      }
    });
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    const snapshotTasks = tasksRef.current;
    const snapshotEvents = eventsRef.current;

    setTasks((prev) => prev.filter((t) => t.id !== id));
    setEvents((prev) => prev.filter((e) => e.taskId !== id));

    return queueRef.current.enqueue('tasks', async () => {
      try {
        await tasksApi.delete(id);
      } catch (error) {
        setTasks(snapshotTasks);
        setEvents(snapshotEvents);
        console.error('Failed to delete task:', error);
        toast.error('Failed to delete task', { description: errMsg(error) });
        throw error;
      }
    });
  }, []);

  // ─── Task Lists ────────────────────────────────────────

  const addTaskList = useCallback(
    async (list: Omit<TaskList, 'id' | 'createdAt' | 'archived' | 'archivedAt'>) => {
      try {
        const newList = await taskListsApi.create(list);
        setTaskLists((prev) => [...prev, newList]);
        return newList;
      } catch (error) {
        console.error('Failed to create task list:', error);
        toast.error('Failed to create task list', { description: errMsg(error) });
        throw error;
      }
    },
    []
  );

  const updateTaskList = useCallback(async (id: string, updates: Partial<TaskList>) => {
    try {
      setTaskLists((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
      await taskListsApi.update(id, updates);
    } catch (error) {
      console.error('Failed to update task list:', error);
      toast.error('Failed to update task list', { description: errMsg(error) });
    }
  }, []);

  const deleteTaskList = useCallback(async (id: string) => {
    try {
      setTaskLists((prev) => prev.filter((l) => l.id !== id));
      await taskListsApi.delete(id);
    } catch (error) {
      console.error('Failed to delete task list:', error);
      toast.error('Failed to delete task list', { description: errMsg(error) });
    }
  }, []);

  const restoreTaskList = useCallback(
    async (id: string) => {
      try {
        await updateTaskList(id, { archived: false, archivedAt: null });
      } catch (error) {
        toast.error('Failed to restore task list', { description: errMsg(error) });
      }
    },
    [updateTaskList]
  );

  // ─── Google Calendar mirror (fire-and-forget) ────────

  const googleMirror = useRef({
    async post(endpoint: string, body: unknown) {
      try {
        const { getAuthHeaders } = await import('@/lib/api-client');
        const headers = await getAuthHeaders();
        await fetch(`/api${endpoint}`, {
          method: 'POST',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } catch {
        // silent — Google sync is best-effort
      }
    },
    async patch(endpoint: string, body: unknown) {
      try {
        const { getAuthHeaders } = await import('@/lib/api-client');
        const headers = await getAuthHeaders();
        await fetch(`/api${endpoint}`, {
          method: 'PATCH',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } catch {
        // silent
      }
    },
    async del(endpoint: string) {
      try {
        const { getAuthHeaders } = await import('@/lib/api-client');
        const headers = await getAuthHeaders();
        await fetch(`/api${endpoint}`, { method: 'DELETE', headers });
      } catch {
        // silent
      }
    },
  });

  // ─── Events ──────────────────────────────────────────

  const addEvent = useCallback(
    async (data: Omit<CalendarEvent, 'id' | 'createdAt'>) => {
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

        pushEventUndo({ type: 'create', eventId: savedEvent.id });

        // Mirror to Google if connected (source=local means user-created)
        if (data.source === 'local') {
          googleMirror.current.post('/calendar/google/events', {
            title: savedEvent.title,
            description: savedEvent.description,
            start: savedEvent.start,
            end: savedEvent.end,
            allDay: savedEvent.allDay,
            localEventId: savedEvent.id,
          });
        }

        return savedEvent;
      } catch (error) {
        setEvents((prev) => prev.filter((e) => e.id !== tempId));
        console.error('Failed to create event:', error);
        toast.error('Failed to create event', { description: errMsg(error) });
        throw error;
      }
    },
    [pushEventUndo]
  );

  const updateEvent = useCallback(
    async (id: string, updates: Partial<CalendarEvent>) => {
      const snapshot = eventsRef.current;
      const before = snapshot.find((e) => e.id === id);
      setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));

      try {
        const updated = await eventsApi.update(id, updates);
        setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)));

        if (before) {
          pushEventUndo({ type: 'update', eventId: id, before });
        }

        // Mirror to Google if this event has a googleEventId
        const googleEventId =
          updated.googleEventId ?? snapshot.find((e) => e.id === id)?.googleEventId;
        if (googleEventId) {
          googleMirror.current.patch(`/calendar/google/events/${googleEventId}`, {
            title: updated.title,
            description: updated.description,
            start: updated.start,
            end: updated.end,
            allDay: updated.allDay,
          });
        }
      } catch (error) {
        setEvents(snapshot);
        console.error('Failed to update event:', error);
        toast.error('Failed to update event', { description: errMsg(error) });
        throw error;
      }
    },
    [pushEventUndo]
  );

  const deleteEvent = useCallback(
    async (id: string) => {
      const snapshot = eventsRef.current;
      const event = eventsRef.current.find((e) => e.id === id);
      setEvents((prev) => prev.filter((e) => e.id !== id));

      try {
        await eventsApi.delete(id);

        if (event) {
          pushEventUndo({ type: 'delete', event });
        }

        // Mirror delete to Google
        if (event?.googleEventId) {
          googleMirror.current.del(`/calendar/google/events/${event.googleEventId}`);
        }
      } catch (error) {
        setEvents(snapshot);
        console.error('Failed to delete event:', error);
        toast.error('Failed to delete event', { description: errMsg(error) });
        throw error;
      }
    },
    [pushEventUndo]
  );

  // ─── Event Undo/Redo ─────────────────────────────────

  const undoEventAction = useCallback(() => {
    const stack = eventUndoStackRef.current;
    if (stack.length === 0) return;

    const entry = stack[stack.length - 1];
    eventUndoStackRef.current = stack.slice(0, -1);
    setCanUndoEvent(eventUndoStackRef.current.length > 0);

    switch (entry.type) {
      case 'create': {
        const event = eventsRef.current.find((e) => e.id === entry.eventId);
        if (event) {
          setEvents((prev) => prev.filter((e) => e.id !== entry.eventId));
          eventsApi.delete(entry.eventId).catch(() => {});
          eventRedoStackRef.current = [...eventRedoStackRef.current, { type: 'delete', event }];
        }
        break;
      }
      case 'update': {
        const current = eventsRef.current.find((e) => e.id === entry.eventId);
        setEvents((prev) => prev.map((e) => (e.id === entry.eventId ? entry.before : e)));
        const { id: _id, createdAt: _ca, ...updateData } = entry.before;
        eventsApi.update(entry.eventId, updateData).catch(() => {});
        if (current) {
          eventRedoStackRef.current = [
            ...eventRedoStackRef.current,
            { type: 'update', eventId: entry.eventId, before: current },
          ];
        }
        break;
      }
      case 'delete': {
        const { id: _id, createdAt: _ca, ...createData } = entry.event;
        setEvents((prev) => [...prev, entry.event]);
        eventsApi
          .create(createData)
          .then((saved) => {
            setEvents((prev) => prev.map((e) => (e.id === entry.event.id ? saved : e)));
            eventRedoStackRef.current = eventRedoStackRef.current.map((r) => {
              if (r.type === 'create' && r.eventId === entry.event.id) {
                return { ...r, eventId: saved.id };
              }
              return r;
            });
          })
          .catch(() => {});
        eventRedoStackRef.current = [
          ...eventRedoStackRef.current,
          { type: 'create', eventId: entry.event.id },
        ];
        break;
      }
    }
    setCanRedoEvent(true);
    toast.success('Undone');
  }, []);

  const redoEventAction = useCallback(() => {
    const stack = eventRedoStackRef.current;
    if (stack.length === 0) return;

    const entry = stack[stack.length - 1];
    eventRedoStackRef.current = stack.slice(0, -1);
    setCanRedoEvent(eventRedoStackRef.current.length > 0);

    switch (entry.type) {
      case 'create': {
        const event = eventsRef.current.find((e) => e.id === entry.eventId);
        if (event) {
          setEvents((prev) => prev.filter((e) => e.id !== entry.eventId));
          eventsApi.delete(entry.eventId).catch(() => {});
          eventUndoStackRef.current = [...eventUndoStackRef.current, { type: 'delete', event }];
        }
        break;
      }
      case 'update': {
        const current = eventsRef.current.find((e) => e.id === entry.eventId);
        setEvents((prev) => prev.map((e) => (e.id === entry.eventId ? entry.before : e)));
        const { id: _id, createdAt: _ca, ...updateData } = entry.before;
        eventsApi.update(entry.eventId, updateData).catch(() => {});
        if (current) {
          eventUndoStackRef.current = [
            ...eventUndoStackRef.current,
            { type: 'update', eventId: entry.eventId, before: current },
          ];
        }
        break;
      }
      case 'delete': {
        const { id: _id, createdAt: _ca, ...createData } = entry.event;
        setEvents((prev) => [...prev, entry.event]);
        eventsApi
          .create(createData)
          .then((saved) => {
            setEvents((prev) => prev.map((e) => (e.id === entry.event.id ? saved : e)));
          })
          .catch(() => {});
        eventUndoStackRef.current = [
          ...eventUndoStackRef.current,
          { type: 'create', eventId: entry.event.id },
        ];
        break;
      }
    }
    setCanUndoEvent(true);
    toast.success('Redone');
  }, []);

  // ─── Tags ────────────────────────────────────────────

  const createTag = useCallback((name: string, color: string): Tag => {
    const tag: Tag = { id: crypto.randomUUID(), name, color };
    setTags((prev) => [...prev, tag]);
    return tag;
  }, []);

  const updateTag = useCallback((id: string, updates: Partial<Omit<Tag, 'id'>>) => {
    setTags((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }, []);

  const deleteTag = useCallback((id: string) => {
    setTags((prev) => prev.filter((t) => t.id !== id));
    setEvents((prev) => prev.map((e) => (e.tagId === id ? { ...e, tagId: null } : e)));
  }, []);

  // ─── Chat ────────────────────────────────────────────

  const addChatMessage = useCallback((data: Omit<ChatMessage, 'id' | 'createdAt'>) => {
    const msg: ChatMessage = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, msg]);
    return msg;
  }, []);

  const getChatMessages = useCallback(
    (goalId: string | null) => chatMessages.filter((m) => m.goalId === goalId),
    [chatMessages]
  );

  // ─── Chat Sessions (AI Coach) ───────────────────────────

  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatIdState] = useState<string | null>(null);

  const createChatSession = useCallback(() => {
    const id = crypto.randomUUID();
    const session: ChatSession = {
      id,
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setChatSessions((prev) => [session, ...prev]);
    setActiveChatIdState(id);
    return id;
  }, []);

  const deleteChatSession = useCallback((id: string) => {
    setChatSessions((prev) => prev.filter((s) => s.id !== id));
    setActiveChatIdState((curr) => (curr === id ? null : curr));
  }, []);

  const renameChatSession = useCallback((id: string, title: string) => {
    setChatSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title, updatedAt: new Date().toISOString() } : s))
    );
  }, []);

  const setActiveChatId = useCallback((id: string | null) => {
    setActiveChatIdState(id);
  }, []);

  const addMessageToSession = useCallback((sessionId: string, role: ChatRole, content: string) => {
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      goalId: null,
      role,
      content,
      createdAt: new Date().toISOString(),
    };
    setChatSessions((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s;
        const messages = [...s.messages, msg];
        const title =
          s.title === 'New Chat' && role === 'user'
            ? content.slice(0, 40) + (content.length > 40 ? '...' : '')
            : s.title;
        return { ...s, messages, title, updatedAt: new Date().toISOString() };
      })
    );
  }, []);

  const getActiveSessionMessages = useCallback(() => {
    if (!activeChatId) return [];
    const session = chatSessions.find((s) => s.id === activeChatId);
    return session?.messages ?? [];
  }, [activeChatId, chatSessions]);

  // ─── Journal ─────────────────────────────────────────

  const addJournalEntry = useCallback(
    async (data: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
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
        console.error('Failed to create journal entry:', error);
        toast.error('Failed to save journal entry', { description: errMsg(error) });
        throw error;
      }
    },
    []
  );

  const updateJournalEntry = useCallback(async (id: string, updates: Partial<JournalEntry>) => {
    const snapshot = journalEntriesRef.current;
    setJournalEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e))
    );

    try {
      const updated = await journalApi.update(id, updates);
      setJournalEntries((prev) => prev.map((e) => (e.id === id ? updated : e)));
    } catch (error) {
      setJournalEntries(snapshot);
      console.error('Failed to update journal entry:', error);
      toast.error('Failed to update journal entry', { description: errMsg(error) });
      throw error;
    }
  }, []);

  const deleteJournalEntry = useCallback(async (id: string) => {
    const snapshot = journalEntriesRef.current;
    setJournalEntries((prev) => prev.filter((e) => e.id !== id));

    try {
      await journalApi.delete(id);
    } catch (error) {
      setJournalEntries(snapshot);
      console.error('Failed to delete journal entry:', error);
      toast.error('Failed to delete journal entry', { description: errMsg(error) });
      throw error;
    }
  }, []);

  // ─── AI Memory ───────────────────────────────────────

  // Fix (c): debounce rapid AI memory writes by 300 ms.
  // The optimistic update is immediate so the UI stays responsive; only the
  // network call is deferred and deduplicated within the debounce window.
  const setAiMemory = useCallback(async (memory: string) => {
    setAiMemoryState(memory);

    return new Promise<void>((resolve, reject) => {
      if (aiMemoryDebounceRef.current) {
        clearTimeout(aiMemoryDebounceRef.current);
      }

      aiMemoryDebounceRef.current = setTimeout(async () => {
        aiMemoryDebounceRef.current = null;
        // Capture rollback value via ref at call time
        const snapshot = aiMemoryRef.current;

        try {
          await aiMemoryApi.update(memory);
          resolve();
        } catch (error) {
          setAiMemoryState(snapshot);
          console.error('Failed to update AI memory:', error);
          toast.error('Failed to save AI memory', { description: errMsg(error) });
          reject(error);
        }
      }, 300);
    });
  }, []);

  // ─── Knowledge Base ─────────────────────────────────

  const [knowledgeSources, setKnowledgeSources] = useState<KnowledgeSource[]>([]);
  const [wikiPages, setWikiPages] = useState<WikiPage[]>([]);
  const [wikiLog, setWikiLog] = useState<WikiLogEntry[]>([]);

  const loadKnowledgeBase = useCallback(async () => {
    try {
      const [sources, pages] = await Promise.all([
        knowledgeApi.listSources(),
        knowledgeApi.listPages(),
      ]);
      setKnowledgeSources(sources);
      setWikiPages(pages);
    } catch {
      // Non-fatal — KB data just won't be available
    }
  }, []);

  const addKnowledgeSource = useCallback(
    async (data: Omit<KnowledgeSource, 'id' | 'createdAt' | 'status'>) => {
      // Optimistic
      const tempId = `temp-${crypto.randomUUID()}`;
      const tempSource: KnowledgeSource = {
        ...data,
        id: tempId,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      setKnowledgeSources((prev) => [tempSource, ...prev]);

      try {
        const saved = await knowledgeApi.createSource(data);
        setKnowledgeSources((prev) => prev.map((s) => (s.id === tempId ? saved : s)));
        return saved;
      } catch (error) {
        setKnowledgeSources((prev) => prev.filter((s) => s.id !== tempId));
        toast.error('Failed to add source', { description: errMsg(error) });
        throw error;
      }
    },
    []
  );

  const updateKnowledgeSource = useCallback((id: string, updates: Partial<KnowledgeSource>) => {
    setKnowledgeSources((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  }, []);

  const deleteKnowledgeSource = useCallback(async (id: string) => {
    setKnowledgeSources((prev) => prev.filter((s) => s.id !== id));
    try {
      await knowledgeApi.deleteSource(id);
    } catch (error) {
      toast.error('Failed to delete source', { description: errMsg(error) });
    }
  }, []);

  const addWikiPage = useCallback((data: Omit<WikiPage, 'id' | 'createdAt' | 'updatedAt'>) => {
    const page: WikiPage = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setWikiPages((prev) => [page, ...prev]);
    return page;
  }, []);

  const updateWikiPage = useCallback((id: string, updates: Partial<WikiPage>) => {
    setWikiPages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p))
    );
  }, []);

  const deleteWikiPage = useCallback(async (id: string) => {
    setWikiPages((prev) => prev.filter((p) => p.id !== id));
    try {
      await knowledgeApi.deletePage(id);
    } catch (error) {
      toast.error('Failed to delete page', { description: errMsg(error) });
    }
  }, []);

  const addWikiLogEntry = useCallback((data: Omit<WikiLogEntry, 'id' | 'createdAt'>) => {
    const entry: WikiLogEntry = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setWikiLog((prev) => [entry, ...prev]);
  }, []);

  const ingestSource = useCallback(async (sourceId: string) => {
    setKnowledgeSources((prev) =>
      prev.map((s) => (s.id === sourceId ? { ...s, status: 'processing' as const } : s))
    );
    try {
      const result = await knowledgeApi.ingest(sourceId);
      setKnowledgeSources((prev) =>
        prev.map((s) => (s.id === sourceId ? { ...s, status: 'ingested' as const } : s))
      );
      // Add the new wiki pages to state
      setWikiPages((prev) => [...result.pages, ...prev]);
      return result;
    } catch (error) {
      setKnowledgeSources((prev) =>
        prev.map((s) => (s.id === sourceId ? { ...s, status: 'failed' as const } : s))
      );
      toast.error('Failed to ingest source', { description: errMsg(error) });
      throw error;
    }
  }, []);

  const queryKnowledgeBase = useCallback(
    async (question: string) => {
      try {
        const result = await knowledgeApi.query(question);
        addWikiLogEntry({
          action: 'query',
          description: `Query: "${question.slice(0, 80)}"`,
          pagesAffected: result.citations,
        });
        return result;
      } catch (error) {
        toast.error('Query failed', { description: errMsg(error) });
        throw error;
      }
    },
    [addWikiLogEntry]
  );

  const lintKnowledgeBase = useCallback(async () => {
    try {
      const result = await knowledgeApi.lint();
      addWikiLogEntry({
        action: 'lint',
        description: `Health check: ${result.issues.length} issue(s) found`,
        pagesAffected: result.issues.map((i) => i.page).filter(Boolean) as string[],
      });
      return result;
    } catch (error) {
      toast.error('Health check failed', { description: errMsg(error) });
      throw error;
    }
  }, [addWikiLogEntry]);

  // ─── Computed ────────────────────────────────────────

  const getGoalMilestones = useCallback(
    (goalId: string) =>
      milestones.filter((m) => m.goalId === goalId).sort((a, b) => a.order - b.order),
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
      return Math.round(
        (goalMilestones.filter((m) => m.completed).length / goalMilestones.length) * 100
      );
    },
    [milestones, tasks]
  );

  // ─── Auto-schedule ──────────────────────────────────

  const syncGoogleCalendar = useCallback(async () => {
    try {
      const { getAuthHeaders } = await import('@/lib/api-client');
      const headers = await getAuthHeaders();
      const res = await fetch('/api/calendar/google/events', { headers });
      if (!res.ok) return null;
      const data = await res.json();
      // Reload events from DB to pick up newly synced Google events
      const fresh = await eventsApi.list();
      setEvents(fresh);
      return { synced: data.synced ?? 0 };
    } catch {
      return null;
    }
  }, []);

  const autoSchedule = useCallback(async () => {
    try {
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const data = await tasksApi.autoSchedule(userTimezone);

      // Reload tasks to get the newly scheduled dates
      const [tasksData, eventsData] = await Promise.all([tasksApi.list(), eventsApi.list()]);
      setTasks(tasksData);
      setEvents(eventsData);

      // Create a toast or alert (optional)
      // alert(`Scheduled ${data.scheduledCount} tasks!`);
    } catch (error) {
      console.error('Auto-schedule failed:', error);
      toast.error('Failed to auto-schedule tasks', {
        description: 'Check the console for details.',
      });
    }
  }, []);

  return (
    <StoreContext.Provider
      value={{
        goals,
        milestones,
        tasks,
        taskLists,
        events,
        tags,
        journalEntries,
        chatMessages,
        aiMemory,
        loading,
        loadInitialData,
        addGoal,
        updateGoal,
        deleteGoal,
        addMilestone,
        updateMilestone,
        deleteMilestone,
        addTask,
        updateTask,
        deleteTask,
        addTaskList,
        updateTaskList,
        deleteTaskList,
        restoreTaskList,
        addEvent,
        updateEvent,
        deleteEvent,
        undoEventAction,
        redoEventAction,
        canUndoEvent,
        canRedoEvent,
        createTag,
        updateTag,
        deleteTag,
        addChatMessage,
        getChatMessages,
        chatSessions,
        activeChatId,
        createChatSession,
        deleteChatSession,
        renameChatSession,
        setActiveChatId,
        addMessageToSession,
        getActiveSessionMessages,
        addJournalEntry,
        updateJournalEntry,
        deleteJournalEntry,
        setAiMemory,
        getGoalProgress,
        getGoalMilestones,
        getGoalTasks,
        autoSchedule,
        syncGoogleCalendar,
        knowledgeSources,
        wikiPages,
        wikiLog,
        addKnowledgeSource,
        updateKnowledgeSource,
        deleteKnowledgeSource,
        addWikiPage,
        updateWikiPage,
        deleteWikiPage,
        addWikiLogEntry,
        loadKnowledgeBase,
        ingestSource,
        queryKnowledgeBase,
        lintKnowledgeBase,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}
