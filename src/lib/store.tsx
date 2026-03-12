"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

// Types
export type Priority = "low" | "medium" | "high" | "urgent";
export type TaskStatus = "todo" | "in_progress" | "done" | "cancelled";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  projectId: string | null;
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
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: string;
}

interface StoreContextType {
  tasks: Task[];
  events: CalendarEvent[];
  projects: Project[];
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt" | "completed" | "completedAt">) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addEvent: (event: Omit<CalendarEvent, "id" | "createdAt">) => CalendarEvent;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  addProject: (project: Omit<Project, "id" | "createdAt">) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  autoSchedule: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const addTask = useCallback((taskData: Omit<Task, "id" | "createdAt" | "updatedAt" | "completed" | "completedAt">) => {
    const now = new Date().toISOString();
    const task: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      completed: false,
      completedAt: null,
      createdAt: now,
      updatedAt: now,
    };
    setTasks((prev) => [...prev, task]);
    return task;
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
      )
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setEvents((prev) => prev.filter((e) => e.taskId !== id));
  }, []);

  const addEvent = useCallback((eventData: Omit<CalendarEvent, "id" | "createdAt">) => {
    const event: CalendarEvent = {
      ...eventData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setEvents((prev) => [...prev, event]);
    return event;
  }, []);

  const updateEvent = useCallback((id: string, updates: Partial<CalendarEvent>) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const addProject = useCallback((projectData: Omit<Project, "id" | "createdAt">) => {
    const project: Project = {
      ...projectData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setProjects((prev) => [...prev, project]);
    return project;
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setTasks((prev) =>
      prev.map((t) => (t.projectId === id ? { ...t, projectId: null } : t))
    );
  }, []);

  const autoSchedule = useCallback(() => {
    const unscheduledTasks = tasks
      .filter((t) => !t.completed && !t.scheduledStart)
      .sort((a, b) => {
        const priorityWeight = { urgent: 4, high: 3, medium: 2, low: 1 };
        const deadlineA = a.deadline ? new Date(a.deadline).getTime() : Infinity;
        const deadlineB = b.deadline ? new Date(b.deadline).getTime() : Infinity;
        if (deadlineA !== deadlineB) return deadlineA - deadlineB;
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      });

    if (unscheduledTasks.length === 0) return;

    // Collect busy times from existing events and scheduled tasks
    const busySlots = events.map((e) => ({
      start: new Date(e.start).getTime(),
      end: new Date(e.end).getTime(),
    }));

    tasks
      .filter((t) => t.scheduledStart && t.scheduledEnd && !t.completed)
      .forEach((t) => {
        busySlots.push({
          start: new Date(t.scheduledStart!).getTime(),
          end: new Date(t.scheduledEnd!).getTime(),
        });
      });

    busySlots.sort((a, b) => a.start - b.start);

    // Schedule tasks into free slots (9 AM - 6 PM, weekdays)
    const now = new Date();
    let cursor = new Date(now);
    cursor.setMinutes(0, 0, 0);
    if (cursor.getHours() < 9) cursor.setHours(9);
    if (cursor.getHours() >= 18) {
      cursor.setDate(cursor.getDate() + 1);
      cursor.setHours(9);
    }

    const newUpdates: { id: string; start: string; end: string }[] = [];

    for (const task of unscheduledTasks) {
      const duration = (task.durationMinutes || 30) * 60 * 1000;
      let scheduled = false;
      let attempts = 0;

      while (!scheduled && attempts < 100) {
        // Skip weekends
        const day = cursor.getDay();
        if (day === 0 || day === 6) {
          cursor.setDate(cursor.getDate() + (day === 0 ? 1 : 2));
          cursor.setHours(9, 0, 0, 0);
          attempts++;
          continue;
        }

        const slotStart = cursor.getTime();
        const slotEnd = slotStart + duration;

        // Check if we're past working hours
        const endHour = new Date(slotEnd).getHours() + new Date(slotEnd).getMinutes() / 60;
        if (endHour > 18 || new Date(slotEnd).getDate() !== cursor.getDate()) {
          cursor.setDate(cursor.getDate() + 1);
          cursor.setHours(9, 0, 0, 0);
          attempts++;
          continue;
        }

        // Check for conflicts
        const hasConflict = busySlots.some(
          (slot) => slotStart < slot.end && slotEnd > slot.start
        );

        if (!hasConflict) {
          newUpdates.push({
            id: task.id,
            start: new Date(slotStart).toISOString(),
            end: new Date(slotEnd).toISOString(),
          });
          busySlots.push({ start: slotStart, end: slotEnd });
          busySlots.sort((a, b) => a.start - b.start);
          cursor = new Date(slotEnd);
          scheduled = true;
        } else {
          // Jump to end of conflicting slot
          const conflicting = busySlots.find(
            (slot) => slotStart < slot.end && slotEnd > slot.start
          );
          if (conflicting) {
            cursor = new Date(conflicting.end);
          } else {
            cursor = new Date(cursor.getTime() + 15 * 60 * 1000);
          }
          attempts++;
        }
      }
    }

    // Apply updates
    if (newUpdates.length > 0) {
      setTasks((prev) =>
        prev.map((t) => {
          const update = newUpdates.find((u) => u.id === t.id);
          if (update) {
            return {
              ...t,
              scheduledStart: update.start,
              scheduledEnd: update.end,
              updatedAt: new Date().toISOString(),
            };
          }
          return t;
        })
      );

      // Create calendar events for scheduled tasks
      const newEvents: CalendarEvent[] = newUpdates.map((u) => {
        const task = tasks.find((t) => t.id === u.id)!;
        return {
          id: crypto.randomUUID(),
          title: task.title,
          description: "",
          start: u.start,
          end: u.end,
          allDay: false,
          color: getTaskColor(task.priority),
          taskId: task.id,
          createdAt: new Date().toISOString(),
        };
      });
      setEvents((prev) => [...prev, ...newEvents]);
    }
  }, [tasks, events]);

  return (
    <StoreContext.Provider
      value={{
        tasks,
        events,
        projects,
        addTask,
        updateTask,
        deleteTask,
        addEvent,
        updateEvent,
        deleteEvent,
        addProject,
        updateProject,
        deleteProject,
        autoSchedule,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

function getTaskColor(priority: Priority): string {
  switch (priority) {
    case "urgent": return "#ef4444";
    case "high": return "#f97316";
    case "medium": return "#eab308";
    case "low": return "#3b82f6";
  }
}
