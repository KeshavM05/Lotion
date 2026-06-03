"use client";

import { useState, useEffect, useRef } from "react";
import { useStore, type CalendarEvent } from "@/lib/store";
import { Modal } from "@/components/ui/modal";
import { EventQuickView } from "@/components/ui/event-quick-view";
import { getWeekDates, isSameDay, formatTime, toLocalDatetimeString } from "@/lib/utils";
import { usePageHeader } from "@/lib/page-header-context";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAYS_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const HOUR_HEIGHT = 60;
const COLORS = ["#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444"];

type ViewMode = "day" | "week" | "month";

// Helper Components
function TaskSection({ title, count, icon, color, children }: { title: string; count: number; icon: string; color: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="material-symbols-outlined text-sm" style={{ color }}>
          {icon}
        </span>
        <h4 className="text-xs font-['Space_Grotesk'] font-semibold text-[#9CA3AF] uppercase tracking-wider">
          {title}
        </h4>
        <span className="text-[10px] text-[#9CA3AF]">({count})</span>
      </div>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
}

function TaskItem({ task, store, onDragStart, onDragEnd }: { task: any; store: any; onDragStart: (task: any, e: React.DragEvent) => void; onDragEnd: () => void }) {
  return (
    <div
      draggable={!task.completed}
      onDragStart={(e) => onDragStart(task, e)}
      onDragEnd={onDragEnd}
      className={`flex items-start gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors group ${
        !task.completed ? 'cursor-grab active:cursor-grabbing' : ''
      }`}
    >
      <button
        onClick={() => store.updateTask(task.id, { completed: !task.completed })}
        className="mt-0.5 flex-shrink-0"
      >
        <span
          className={`material-symbols-outlined text-base transition-colors ${
            task.completed ? 'text-[#C17A72]' : 'text-[#9CA3AF] hover:text-[#C17A72]'
          }`}
          style={task.completed ? { fontVariationSettings: "'FILL' 1" } : {}}
        >
          {task.completed ? 'check_circle' : 'radio_button_unchecked'}
        </span>
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-['Space_Grotesk'] ${task.completed ? 'line-through text-[#9CA3AF]' : 'text-[#F5F5F5]'}`}>
          {task.title}
        </p>
        {task.deadline && (
          <p className="text-[10px] text-[#9CA3AF] mt-0.5">
            {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
        )}
      </div>
      {!task.completed && (
        <span className="material-symbols-outlined text-sm text-[#9CA3AF] opacity-0 group-hover:opacity-100 transition-opacity">
          drag_indicator
        </span>
      )}
    </div>
  );
}

export default function CalendarPage() {
  const store = useStore();
  const { setPageControls } = usePageHeader();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [taskSidebarCollapsed, setTaskSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const scrollRef = useRef<HTMLDivElement>(null);

  // Task creation state
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskFormTitle, setTaskFormTitle] = useState("");
  const [taskFormDeadline, setTaskFormDeadline] = useState("");
  const [taskFormEnergy, setTaskFormEnergy] = useState<"high" | "medium" | "low">("medium");

  // Quick view state
  const [quickViewEvent, setQuickViewEvent] = useState<CalendarEvent | null>(null);
  const [quickViewAnchor, setQuickViewAnchor] = useState<HTMLElement | null>(null);

  // Drag-to-create state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ date: Date; hour: number; minutes: number } | null>(null);
  const [dragEnd, setDragEnd] = useState<{ date: Date; hour: number; minutes: number } | null>(null);

  // Event drag-to-move state
  const [draggingEvent, setDraggingEvent] = useState<CalendarEvent | null>(null);
  const [eventDragOffset, setEventDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [eventDragPosition, setEventDragPosition] = useState<{ date: Date; time: number } | null>(null);

  // Event resize state
  const [resizingEvent, setResizingEvent] = useState<CalendarEvent | null>(null);
  const [resizeEdge, setResizeEdge] = useState<'top' | 'bottom' | null>(null);
  const [resizeOriginalStart, setResizeOriginalStart] = useState<Date | null>(null);
  const [resizeOriginalEnd, setResizeOriginalEnd] = useState<Date | null>(null);

  // Task drag state
  const [draggingTask, setDraggingTask] = useState<any | null>(null);

  const weekDates = getWeekDates(currentDate);
  const today = new Date();

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  // Set header controls
  useEffect(() => {
    setPageControls(
      <div className="flex items-center justify-between w-full">
        {/* Month/Year Display */}
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-['Playfair_Display'] text-white">
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateDate("prev")}
              className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-[#9CA3AF] hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>
            <button
              onClick={() => navigateDate("today")}
              className="px-3 py-1.5 rounded-lg text-sm font-medium border border-white/10 text-[#F5F5F5] hover:bg-white/5 transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => navigateDate("next")}
              className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-[#9CA3AF] hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => store.autoSchedule()}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white shadow-lg hover:shadow-xl transition-all mr-2"
          >
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            Auto-Schedule
          </button>
          {(["day", "week", "month"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                viewMode === mode
                  ? "bg-[#C17A72] text-white"
                  : "border border-white/10 text-[#9CA3AF] hover:text-white hover:bg-white/5"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
    );

    return () => setPageControls(null);
  }, [currentDate, viewMode, setPageControls]);

  // Scroll to current time on mount
  useEffect(() => {
    if (scrollRef.current && isSameDay(currentDate, today)) {
      const now = new Date();
      const currentHour = now.getHours();
      const scrollTo = (currentHour - 2) * HOUR_HEIGHT; // Scroll to 2 hours before current time
      scrollRef.current.scrollTop = Math.max(0, scrollTo);
    }
  }, []);

  // Task organization
  const overdueTasks = store.tasks.filter(t => !t.completed && t.deadline && new Date(t.deadline) < today);
  const todayTasks = store.tasks.filter(t => !t.completed && t.deadline && isSameDay(new Date(t.deadline), today));
  const tomorrowTasks = store.tasks.filter(t => {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return !t.completed && t.deadline && isSameDay(new Date(t.deadline), tomorrow);
  });
  const upcomingTasks = store.tasks.filter(t => {
    if (!t.deadline || t.completed) return false;
    const deadline = new Date(t.deadline);
    const twoDaysOut = new Date(today);
    twoDaysOut.setDate(twoDaysOut.getDate() + 2);
    return deadline > twoDaysOut;
  });

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formStart, setFormStart] = useState("");
  const [formEnd, setFormEnd] = useState("");
  const [formColor, setFormColor] = useState("#8b5cf6");
  const [formIsRecurring, setFormIsRecurring] = useState(false);
  const [formRecurrenceFrequency, setFormRecurrenceFrequency] = useState<"daily" | "weekly" | "monthly" | "yearly">("weekly");
  const [formRecurrenceInterval, setFormRecurrenceInterval] = useState(1);
  const [formRecurrenceEndDate, setFormRecurrenceEndDate] = useState("");
  const [formRecurrenceDaysOfWeek, setFormRecurrenceDaysOfWeek] = useState<number[]>([]);

  function openEdit(event: CalendarEvent) {
    setEditingEvent(event);
    setFormTitle(event.title);
    setFormDescription(event.description);
    setFormStart(toLocalDatetimeString(new Date(event.start)));
    setFormEnd(toLocalDatetimeString(new Date(event.end)));
    setFormColor(event.color);
    setFormIsRecurring(event.isRecurring || false);
    setFormRecurrenceFrequency(event.recurrenceFrequency || "weekly");
    setFormRecurrenceInterval(event.recurrenceInterval || 1);
    setFormRecurrenceEndDate(event.recurrenceEndDate ? new Date(event.recurrenceEndDate).toISOString().split('T')[0] : "");
    setFormRecurrenceDaysOfWeek(event.recurrenceDaysOfWeek || []);
    setModalOpen(true);
  }

  function handleSave() {
    if (!formTitle.trim()) return;
    const data: any = {
      title: formTitle.trim(),
      description: formDescription.trim(),
      start: new Date(formStart).toISOString(),
      end: new Date(formEnd).toISOString(),
      color: formColor,
      isRecurring: formIsRecurring,
    };

    if (formIsRecurring) {
      data.recurrenceFrequency = formRecurrenceFrequency;
      data.recurrenceInterval = formRecurrenceInterval;
      data.recurrenceEndDate = formRecurrenceEndDate ? new Date(formRecurrenceEndDate).toISOString() : null;
      data.recurrenceDaysOfWeek = formRecurrenceFrequency === "weekly" ? formRecurrenceDaysOfWeek : [];
    }

    if (editingEvent) {
      store.updateEvent(editingEvent.id, data);
    } else {
      store.addEvent({ ...data, allDay: false, taskId: null, source: "local" });
    }
    setModalOpen(false);
  }

  function handleSaveTask() {
    if (!taskFormTitle.trim()) return;
    
    store.addTask({
      title: taskFormTitle.trim(),
      description: "",
      status: "todo",
      priority: "medium",
      goalId: null,
      milestoneId: null,
      durationMinutes: 30,
      deadline: taskFormDeadline ? new Date(taskFormDeadline).toISOString() : null,
      scheduledStart: null,
      scheduledEnd: null,
      energyLevel: taskFormEnergy,
      timePreference: "anytime",
      tags: [],
    });
    
    setTaskModalOpen(false);
    setTaskFormTitle("");
    setTaskFormDeadline("");
  }

  function handleDelete() {
    if (editingEvent) {
      store.deleteEvent(editingEvent.id);
      setModalOpen(false);
    }
  }

  function getEventsForDay(date: Date) {
    return store.events.filter((e) => isSameDay(new Date(e.start), date));
  }

  function getEventStyle(event: CalendarEvent) {
    const start = new Date(event.start);
    const end = new Date(event.end);
    const startMin = start.getHours() * 60 + start.getMinutes();
    const endMin = end.getHours() * 60 + end.getMinutes();
    const duration = Math.max(endMin - startMin, 30);
    return {
      top: `${(startMin / 60) * HOUR_HEIGHT}px`,
      height: `${(duration / 60) * HOUR_HEIGHT}px`,
      backgroundColor: event.color,
    };
  }

  // Check if two events overlap
  function eventsOverlap(event1: CalendarEvent, event2: CalendarEvent) {
    const start1 = new Date(event1.start).getTime();
    const end1 = new Date(event1.end).getTime();
    const start2 = new Date(event2.start).getTime();
    const end2 = new Date(event2.end).getTime();
    return start1 < end2 && start2 < end1;
  }

  // Calculate event layout for overlapping events
  function getEventLayout(event: CalendarEvent, dayEvents: CalendarEvent[]) {
    // Find all events that overlap with this event
    const overlapping = dayEvents.filter(e =>
      e.id !== event.id && eventsOverlap(event, e)
    );

    if (overlapping.length === 0) {
      return { left: '0.25rem', right: '0.25rem', zIndex: 10 };
    }

    // Sort all overlapping events including current by start time
    const allEvents = [event, ...overlapping].sort((a, b) =>
      new Date(a.start).getTime() - new Date(b.start).getTime()
    );

    // Calculate columns
    const columns: CalendarEvent[][] = [];
    for (const evt of allEvents) {
      let placed = false;
      for (const column of columns) {
        const lastInColumn = column[column.length - 1];
        if (!eventsOverlap(evt, lastInColumn)) {
          column.push(evt);
          placed = true;
          break;
        }
      }
      if (!placed) {
        columns.push([evt]);
      }
    }

    // Find which column this event is in
    let columnIndex = 0;
    for (let i = 0; i < columns.length; i++) {
      if (columns[i].some(e => e.id === event.id)) {
        columnIndex = i;
        break;
      }
    }

    const totalColumns = columns.length;
    const width = `calc(${100 / totalColumns}% - 0.5rem)`;
    const left = `calc(${(columnIndex * 100) / totalColumns}% + 0.25rem)`;

    return {
      left,
      width,
      right: 'auto',
      zIndex: 10 + columnIndex,
    };
  }

  const navigateDate = (direction: "prev" | "next" | "today") => {
    if (direction === "today") {
      setCurrentDate(new Date());
    } else {
      const d = new Date(currentDate);
      if (viewMode === "day") {
        d.setDate(d.getDate() + (direction === "next" ? 1 : -1));
      } else if (viewMode === "week") {
        d.setDate(d.getDate() + (direction === "next" ? 7 : -7));
      } else {
        d.setMonth(d.getMonth() + (direction === "next" ? 1 : -1));
      }
      setCurrentDate(d);
    }
  };

  // Drag-to-create handlers
  function handleDragStart(date: Date, hour: number, e: React.MouseEvent) {
    // Prevent text selection
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const minutes = Math.round((y / HOUR_HEIGHT) * 60);
    setIsDragging(true);
    setDragStart({ date, hour, minutes });
    setDragEnd({ date, hour, minutes });
  }

  function handleDragEnd() {
    if (!isDragging || !dragStart || !dragEnd) return;
    setIsDragging(false);

    // Calculate start and end times
    const startMinutes = dragStart.hour * 60 + dragStart.minutes;
    const endMinutes = dragEnd.hour * 60 + dragEnd.minutes;

    const start = new Date(dragStart.date);
    start.setHours(Math.floor(Math.min(startMinutes, endMinutes) / 60));
    start.setMinutes(Math.min(startMinutes, endMinutes) % 60);
    start.setSeconds(0);
    start.setMilliseconds(0);

    const end = new Date(dragStart.date);
    end.setHours(Math.floor(Math.max(startMinutes, endMinutes) / 60));
    end.setMinutes(Math.max(startMinutes, endMinutes) % 60);
    end.setSeconds(0);
    end.setMilliseconds(0);

    // Ensure minimum 30 minutes
    if (end.getTime() - start.getTime() < 30 * 60 * 1000) {
      end.setTime(start.getTime() + 30 * 60 * 1000);
    }

    setDragStart(null);
    setDragEnd(null);
    openCreate(start, end);
  }

  // Event drag-to-move handlers
  function handleEventDragStart(event: CalendarEvent, e: React.MouseEvent) {
    e.stopPropagation();
    setDraggingEvent(event);
    const eventEl = e.currentTarget.getBoundingClientRect();
    setEventDragOffset({
      x: e.clientX - eventEl.left,
      y: e.clientY - eventEl.top,
    });
  }

  function handleEventDragMove(date: Date, hour: number, minutes: number) {
    if (!draggingEvent) return;
    const totalMinutes = hour * 60 + minutes;

    setEventDragPosition({
      date,
      time: totalMinutes,
    });
  }

  function handleEventDragEnd() {
    if (!draggingEvent || !eventDragPosition) {
      setDraggingEvent(null);
      setEventDragPosition(null);
      return;
    }

    // Calculate duration
    const originalStart = new Date(draggingEvent.start);
    const originalEnd = new Date(draggingEvent.end);
    const duration = originalEnd.getTime() - originalStart.getTime();

    // Create new start time
    const newStart = new Date(eventDragPosition.date);
    newStart.setHours(Math.floor(eventDragPosition.time / 60));
    newStart.setMinutes(eventDragPosition.time % 60);
    newStart.setSeconds(0);
    newStart.setMilliseconds(0);

    // Create new end time (maintain duration)
    const newEnd = new Date(newStart.getTime() + duration);

    // Update event
    store.updateEvent(draggingEvent.id, {
      start: newStart.toISOString(),
      end: newEnd.toISOString(),
    });

    setDraggingEvent(null);
    setEventDragPosition(null);
  }

  // Event resize handlers
  function handleResizeStart(event: CalendarEvent, edge: 'top' | 'bottom', e: React.MouseEvent) {
    e.stopPropagation();
    setResizingEvent(event);
    setResizeEdge(edge);
    setResizeOriginalStart(new Date(event.start));
    setResizeOriginalEnd(new Date(event.end));
  }

  function handleResizeMove(date: Date, hour: number, minutes: number) {
    if (!resizingEvent || !resizeEdge || !resizeOriginalStart || !resizeOriginalEnd) return;
    const totalMinutes = hour * 60 + minutes;

    const newTime = new Date(date);
    newTime.setHours(Math.floor(totalMinutes / 60));
    newTime.setMinutes(totalMinutes % 60);
    newTime.setSeconds(0);
    newTime.setMilliseconds(0);

    if (resizeEdge === 'top') {
      // Ensure minimum 15 minutes
      if (resizeOriginalEnd.getTime() - newTime.getTime() >= 15 * 60 * 1000) {
        store.updateEvent(resizingEvent.id, {
          start: newTime.toISOString(),
        });
      }
    } else {
      // Ensure minimum 15 minutes
      if (newTime.getTime() - resizeOriginalStart.getTime() >= 15 * 60 * 1000) {
        store.updateEvent(resizingEvent.id, {
          end: newTime.toISOString(),
        });
      }
    }
  }

  function handleResizeEnd() {
    setResizingEvent(null);
    setResizeEdge(null);
    setResizeOriginalStart(null);
    setResizeOriginalEnd(null);
  }

  // Task drag handlers
  function handleTaskDragStart(task: any, e: React.DragEvent) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.id);
    setDraggingTask(task);
  }

  function handleTaskDragEnd() {
    setDraggingTask(null);
  }

  function handleTaskDrop(date: Date, hour: number, e: React.DragEvent) {
    e.preventDefault();
    if (!draggingTask) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const minutes = hour * 60 + Math.round((y / HOUR_HEIGHT) * 60);

    const start = new Date(date);
    start.setHours(Math.floor(minutes / 60));
    start.setMinutes(minutes % 60);
    start.setSeconds(0);
    start.setMilliseconds(0);

    // Default 1-hour duration
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    // Create event from task
    store.addEvent({
      title: draggingTask.title,
      description: `Task: ${draggingTask.title}`,
      start: start.toISOString(),
      end: end.toISOString(),
      color: '#10b981',
      allDay: false,
      taskId: draggingTask.id,
      source: 'local',
    });

    setDraggingTask(null);
  }

  function openCreate(start?: Date, end?: Date) {
    const s = start || new Date();
    const e = end || new Date(s.getTime() + 60 * 60 * 1000);
    setEditingEvent(null);
    setFormTitle("");
    setFormDescription("");
    setFormStart(toLocalDatetimeString(s));
    setFormEnd(toLocalDatetimeString(e));
    setFormColor("#8b5cf6");
    setModalOpen(true);
  }

  // Get drag preview style
  function getDragPreviewStyle() {
    if (!isDragging || !dragStart || !dragEnd) return null;

    const startMinutes = dragStart.hour * 60 + dragStart.minutes;
    const endMinutes = dragEnd.hour * 60 + dragEnd.minutes;
    const top = Math.min(startMinutes, endMinutes);
    const bottom = Math.max(startMinutes, endMinutes);
    const height = Math.max(bottom - top, 30); // Minimum 30 minutes

    return {
      top: `${(top / 60) * HOUR_HEIGHT}px`,
      height: `${(height / 60) * HOUR_HEIGHT}px`,
    };
  }

  // Get current time position for indicator
  function getCurrentTimePosition() {
    const now = currentTime;
    const minutes = now.getHours() * 60 + now.getMinutes();
    return (minutes / 60) * HOUR_HEIGHT;
  }

  const shouldShowTimeIndicator = viewMode === "week" && weekDates.some(date => isSameDay(date, today));

  return (
    <div className="flex h-full gap-4">
      {/* Task Sidebar */}
      <div
        className={`flex-shrink-0 transition-all duration-300 ${taskSidebarCollapsed ? 'w-16' : 'w-80'} flex flex-col`}
      >
        <div className="glass-card rounded-2xl p-4 h-full overflow-hidden flex flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between mb-4">
            {!taskSidebarCollapsed && (
              <h3 className="text-lg font-['Space_Grotesk'] font-bold text-[#F5F5F5]">Tasks</h3>
            )}
            <button
              onClick={() => setTaskSidebarCollapsed(!taskSidebarCollapsed)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-[#9CA3AF] transition-colors"
            >
              <span className="material-symbols-outlined text-lg">
                {taskSidebarCollapsed ? 'chevron_right' : 'chevron_left'}
              </span>
            </button>
          </div>

          {/* Task Lists */}
          {!taskSidebarCollapsed && (
            <div className="flex-1 overflow-y-auto space-y-4">
              {/* Overdue */}
              {overdueTasks.length > 0 && (
                <TaskSection title="Overdue" count={overdueTasks.length} icon="error" color="#ef4444">
                  {overdueTasks.map(task => (
                    <TaskItem key={task.id} task={task} store={store} onDragStart={handleTaskDragStart} onDragEnd={handleTaskDragEnd} />
                  ))}
                </TaskSection>
              )}

              {/* Due Today */}
              <TaskSection title="Due today" count={todayTasks.length} icon="today" color="#f59e0b">
                {todayTasks.map(task => (
                  <TaskItem key={task.id} task={task} store={store} onDragStart={handleTaskDragStart} onDragEnd={handleTaskDragEnd} />
                ))}
              </TaskSection>

              {/* Due Tomorrow */}
              {tomorrowTasks.length > 0 && (
                <TaskSection title="Due tomorrow" count={tomorrowTasks.length} icon="event" color="#3b82f6">
                  {tomorrowTasks.map(task => (
                    <TaskItem key={task.id} task={task} store={store} onDragStart={handleTaskDragStart} onDragEnd={handleTaskDragEnd} />
                  ))}
                </TaskSection>
              )}

              {/* Upcoming */}
              {upcomingTasks.length > 0 && (
                <TaskSection title="Upcoming" count={upcomingTasks.length} icon="schedule" color="#9CA3AF">
                  {upcomingTasks.slice(0, 5).map(task => (
                    <TaskItem key={task.id} task={task} store={store} onDragStart={handleTaskDragStart} onDragEnd={handleTaskDragEnd} />
                  ))}
                </TaskSection>
              )}
              {/* Add Task Button */}
              <button
                onClick={() => setTaskModalOpen(true)}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-white/20 text-[#9CA3AF] hover:text-white hover:border-white/40 hover:bg-white/5 transition-all"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                <span className="text-sm font-medium">Add Task</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Calendar */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Calendar Grid */}
        <div className="flex-1 glass-card rounded-2xl overflow-hidden flex flex-col">
          {viewMode === "week" && (
            <>
              {/* Week View */}
              <div className="border-b border-white/10">
                <div className="grid grid-cols-[60px_repeat(7,1fr)]">
                  {/* Empty corner */}
                  <div className="h-16 border-r border-white/5"></div>
                  {/* Day headers */}
                  {weekDates.map((date, i) => {
                    const isToday = isSameDay(date, today);
                    return (
                      <div
                        key={i}
                        className="h-16 border-r border-white/5 last:border-r-0 px-3 flex flex-col items-center justify-center"
                      >
                        <div className={`text-xs uppercase tracking-wider font-medium ${isToday ? 'text-[#C17A72]' : 'text-[#9CA3AF]'}`}>
                          {DAYS_SHORT[date.getDay()]}
                        </div>
                        <div
                          className={`text-2xl font-['Playfair_Display'] mt-1 ${
                            isToday
                              ? "w-10 h-10 rounded-full bg-[#C17A72] text-white flex items-center justify-center"
                              : "text-[#F5F5F5]"
                          }`}
                        >
                          {date.getDate()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Time Grid */}
              <div
                className="flex-1 overflow-auto"
                ref={scrollRef}
                onMouseUp={() => {
                  handleDragEnd();
                  handleEventDragEnd();
                  handleResizeEnd();
                }}
                onMouseLeave={() => {
                  handleDragEnd();
                  handleEventDragEnd();
                  handleResizeEnd();
                }}
                onMouseMove={(e) => {
                  if (isDragging || draggingEvent || resizingEvent) {
                    const scrollContainer = scrollRef.current;
                    if (!scrollContainer) return;

                    const rect = scrollContainer.getBoundingClientRect();
                    const x = e.clientX - rect.left + scrollContainer.scrollLeft;
                    const y = e.clientY - rect.top + scrollContainer.scrollTop;

                    // Calculate which day column (skip 60px time column)
                    if (x > 60) {
                      const columnWidth = (rect.width - 60) / 7;
                      const dayIndex = Math.floor((x - 60) / columnWidth);
                      if (dayIndex >= 0 && dayIndex < 7) {
                        const date = weekDates[dayIndex];
                        const hour = Math.floor(y / HOUR_HEIGHT);
                        const minutes = Math.round((y % HOUR_HEIGHT) / HOUR_HEIGHT * 60);

                        if (isDragging && dragStart) {
                          setDragEnd({ date: dragStart.date, hour, minutes });
                        } else if (draggingEvent) {
                          handleEventDragMove(date, hour, minutes);
                        } else if (resizingEvent) {
                          handleResizeMove(date, hour, minutes);
                        }
                      }
                    }
                  }
                }}
              >
                <div className="relative min-h-full select-none">
                  <div className="grid grid-cols-[60px_repeat(7,1fr)]">
                    {HOURS.map((hour) => (
                      <div key={`row-${hour}`} className="contents">
                        {/* Time label */}
                        <div
                          className="relative border-r border-white/5 text-right pr-3 py-2"
                          style={{ height: HOUR_HEIGHT }}
                        >
                          <div className="text-xs text-[#9CA3AF] font-['JetBrains_Mono'] -mt-2">
                            {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                          </div>
                        </div>
                        {/* Day columns */}
                        {weekDates.map((date, dayIdx) => (
                          <div
                            key={`cell-${hour}-${dayIdx}`}
                            className="relative border-r border-t border-white/5 last:border-r-0 hover:bg-[#C17A72]/5 transition-colors cursor-crosshair group"
                            style={{ height: HOUR_HEIGHT }}
                            onMouseDown={(e) => {
                              if (!draggingEvent && !resizingEvent) {
                                handleDragStart(date, hour, e);
                              }
                            }}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleTaskDrop(date, hour, e)}
                          >
                            {/* 30-minute line */}
                            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/5"></div>

                            {/* Events for this hour */}
                            {hour === 0 &&
                              (() => {
                                const dayEvents = getEventsForDay(date);
                                return dayEvents.map((event) => {
                                  const isDragging = draggingEvent?.id === event.id;
                                  const isResizing = resizingEvent?.id === event.id;
                                  const layout = getEventLayout(event, dayEvents);
                                  return (
                                    <div
                                      key={event.id}
                                      className={`absolute rounded-lg px-2 py-1.5 text-white text-xs font-medium overflow-hidden hover:z-20 shadow-lg border border-white/10 group ${
                                        isDragging ? 'opacity-50' : ''
                                      } ${isResizing ? 'select-none' : 'cursor-move'}`}
                                      style={{
                                        ...getEventStyle(event),
                                        left: layout.left,
                                        right: layout.right,
                                        width: layout.width,
                                        zIndex: layout.zIndex,
                                        boxShadow: `0 2px 8px ${event.color}60`,
                                      }}
                                      onMouseDown={(e) => {
                                        // Check if clicking on resize handle
                                        const target = e.target as HTMLElement;
                                        if (target.classList.contains('resize-handle')) return;
                                        handleEventDragStart(event, e);
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (!isDragging && !isResizing) {
                                          setQuickViewEvent(event);
                                          setQuickViewAnchor(e.currentTarget as HTMLElement);
                                        }
                                      }}
                                    >
                                      {/* Top resize handle */}
                                      <div
                                        className="resize-handle absolute top-0 left-0 right-0 h-1 cursor-ns-resize opacity-0 group-hover:opacity-100 bg-white/30 rounded-t-lg"
                                        onMouseDown={(e) => handleResizeStart(event, 'top', e)}
                                      />
                                      <div className="font-semibold truncate">{event.title}</div>
                                      <div className="text-[10px] opacity-90 mt-0.5">
                                        {formatTime(new Date(event.start))}
                                      </div>
                                      {/* Bottom resize handle */}
                                      <div
                                        className="resize-handle absolute bottom-0 left-0 right-0 h-1 cursor-ns-resize opacity-0 group-hover:opacity-100 bg-white/30 rounded-b-lg"
                                        onMouseDown={(e) => handleResizeStart(event, 'bottom', e)}
                                      />
                                    </div>
                                  );
                                });
                              })()}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* Current Time Indicator */}
                  {shouldShowTimeIndicator && (
                    <div
                      className="absolute left-0 right-0 z-30 pointer-events-none"
                      style={{ top: `${getCurrentTimePosition()}px` }}
                    >
                      <div className="relative">
                        <div className="absolute left-0 w-full h-[2px] bg-[#ef4444] shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                        <div className="absolute left-14 w-3 h-3 rounded-full bg-[#ef4444] -mt-1.5 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                      </div>
                    </div>
                  )}

                  {/* Drag Preview */}
                  {isDragging && dragStart && dragEnd && getDragPreviewStyle() && (
                    <div
                      className="absolute pointer-events-none z-20"
                      style={{
                        ...getDragPreviewStyle(),
                        left: `calc(60px + ${weekDates.findIndex(d => isSameDay(d, dragEnd.date))} * ((100% - 60px) / 7))`,
                        width: `calc((100% - 60px) / 7)`,
                      }}
                    >
                      <div className="mx-1 h-full bg-[#C17A72]/30 border-2 border-[#C17A72] rounded-lg backdrop-blur-sm"></div>
                    </div>
                  )}

                  {/* Event Drag Preview */}
                  {draggingEvent && eventDragPosition && (
                    <div
                      className="absolute pointer-events-none z-30"
                      style={{
                        top: `${(eventDragPosition.time / 60) * HOUR_HEIGHT}px`,
                        left: `calc(60px + ${weekDates.findIndex(d => isSameDay(d, eventDragPosition.date))} * ((100% - 60px) / 7))`,
                        width: `calc((100% - 60px) / 7)`,
                        height: `${((new Date(draggingEvent.end).getTime() - new Date(draggingEvent.start).getTime()) / (60 * 60 * 1000)) * HOUR_HEIGHT}px`,
                      }}
                    >
                      <div
                        className="mx-1 h-full rounded-lg border-2 border-dashed backdrop-blur-sm flex items-center justify-center text-white text-xs font-medium px-2"
                        style={{
                          backgroundColor: `${draggingEvent.color}40`,
                          borderColor: draggingEvent.color,
                        }}
                      >
                        <div className="truncate">{draggingEvent.title}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {viewMode === "day" && (
            <>
              {/* Day View Header */}
              <div className="border-b border-white/10">
                <div className="h-16 px-3 flex items-center justify-center border-r border-white/5">
                  <div>
                    <div className={`text-xs uppercase tracking-wider font-medium ${
                      isSameDay(currentDate, today) ? 'text-[#C17A72]' : 'text-[#9CA3AF]'
                    }`}>
                      {DAYS_SHORT[currentDate.getDay()]}
                    </div>
                    <div
                      className={`text-2xl font-['Playfair_Display'] mt-1 ${
                        isSameDay(currentDate, today)
                          ? "w-10 h-10 rounded-full bg-[#C17A72] text-white flex items-center justify-center mx-auto"
                          : "text-[#F5F5F5] text-center"
                      }`}
                    >
                      {currentDate.getDate()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Day View Grid */}
              <div
                className="flex-1 overflow-auto"
                ref={scrollRef}
                onMouseUp={() => {
                  handleDragEnd();
                  handleEventDragEnd();
                  handleResizeEnd();
                }}
                onMouseLeave={() => {
                  handleDragEnd();
                  handleEventDragEnd();
                  handleResizeEnd();
                }}
                onMouseMove={(e) => {
                  if (isDragging || draggingEvent || resizingEvent) {
                    const scrollContainer = scrollRef.current;
                    if (!scrollContainer) return;

                    const rect = scrollContainer.getBoundingClientRect();
                    const y = e.clientY - rect.top + scrollContainer.scrollTop;

                    const hour = Math.floor(y / HOUR_HEIGHT);
                    const minutes = Math.round((y % HOUR_HEIGHT) / HOUR_HEIGHT * 60);

                    if (isDragging && dragStart) {
                      setDragEnd({ date: currentDate, hour, minutes });
                    } else if (draggingEvent) {
                      handleEventDragMove(currentDate, hour, minutes);
                    } else if (resizingEvent) {
                      handleResizeMove(currentDate, hour, minutes);
                    }
                  }
                }}
              >
                <div className="relative min-h-full select-none">
                  <div className="grid grid-cols-[60px_1fr]">
                    {HOURS.map((hour) => (
                      <div key={`row-${hour}`} className="contents">
                        {/* Time label */}
                        <div
                          className="relative border-r border-white/5 text-right pr-3 py-2"
                          style={{ height: HOUR_HEIGHT }}
                        >
                          <div className="text-xs text-[#9CA3AF] font-['JetBrains_Mono'] -mt-2">
                            {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                          </div>
                        </div>
                        {/* Day column */}
                        <div
                          key={`cell-${hour}`}
                          className="relative border-r border-t border-white/5 hover:bg-[#C17A72]/5 transition-colors cursor-crosshair group"
                          style={{ height: HOUR_HEIGHT }}
                          onMouseDown={(e) => {
                            if (!draggingEvent && !resizingEvent) {
                              handleDragStart(currentDate, hour, e);
                            }
                          }}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => handleTaskDrop(currentDate, hour, e)}
                        >
                          {/* 30-minute line */}
                          <div className="absolute top-1/2 left-0 right-0 h-px bg-white/5"></div>

                          {/* Events for this hour */}
                          {hour === 0 &&
                            (() => {
                              const dayEvents = getEventsForDay(currentDate);
                              return dayEvents.map((event) => {
                                const isDragging = draggingEvent?.id === event.id;
                                const isResizing = resizingEvent?.id === event.id;
                                const layout = getEventLayout(event, dayEvents);
                                return (
                                  <div
                                    key={event.id}
                                    className={`absolute rounded-lg px-2 py-1.5 text-white text-xs font-medium overflow-hidden hover:z-20 shadow-lg border border-white/10 group ${
                                      isDragging ? 'opacity-50' : ''
                                    } ${isResizing ? 'select-none' : 'cursor-move'}`}
                                    style={{
                                      ...getEventStyle(event),
                                      left: layout.left,
                                      right: layout.right,
                                      width: layout.width,
                                      zIndex: layout.zIndex,
                                      boxShadow: `0 2px 8px ${event.color}60`,
                                    }}
                                    onMouseDown={(e) => {
                                      const target = e.target as HTMLElement;
                                      if (target.classList.contains('resize-handle')) return;
                                      handleEventDragStart(event, e);
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (!isDragging && !isResizing) {
                                        setQuickViewEvent(event);
                                        setQuickViewAnchor(e.currentTarget as HTMLElement);
                                      }
                                    }}
                                  >
                                    <div
                                      className="resize-handle absolute top-0 left-0 right-0 h-1 cursor-ns-resize opacity-0 group-hover:opacity-100 bg-white/30 rounded-t-lg"
                                      onMouseDown={(e) => handleResizeStart(event, 'top', e)}
                                    />
                                    <div className="font-semibold truncate">{event.title}</div>
                                    <div className="text-[10px] opacity-90 mt-0.5">
                                      {formatTime(new Date(event.start))}
                                    </div>
                                    <div
                                      className="resize-handle absolute bottom-0 left-0 right-0 h-1 cursor-ns-resize opacity-0 group-hover:opacity-100 bg-white/30 rounded-b-lg"
                                      onMouseDown={(e) => handleResizeStart(event, 'bottom', e)}
                                    />
                                  </div>
                                );
                              });
                            })()}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Current Time Indicator for Day View */}
                  {isSameDay(currentDate, today) && (
                    <div
                      className="absolute left-0 right-0 z-30 pointer-events-none"
                      style={{ top: `${getCurrentTimePosition()}px` }}
                    >
                      <div className="relative">
                        <div className="absolute left-0 w-full h-[2px] bg-[#ef4444] shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                        <div className="absolute left-14 w-3 h-3 rounded-full bg-[#ef4444] -mt-1.5 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                      </div>
                    </div>
                  )}

                  {/* Drag Preview for Day View */}
                  {isDragging && dragStart && getDragPreviewStyle() && isSameDay(dragStart.date, currentDate) && (
                    <div
                      className="absolute pointer-events-none z-20"
                      style={{
                        ...getDragPreviewStyle(),
                        left: '60px',
                        right: '0',
                      }}
                    >
                      <div className="mx-1 h-full bg-[#C17A72]/30 border-2 border-[#C17A72] rounded-lg backdrop-blur-sm"></div>
                    </div>
                  )}

                  {/* Event Drag Preview for Day View */}
                  {draggingEvent && eventDragPosition && isSameDay(eventDragPosition.date, currentDate) && (
                    <div
                      className="absolute pointer-events-none z-30"
                      style={{
                        top: `${(eventDragPosition.time / 60) * HOUR_HEIGHT}px`,
                        left: '60px',
                        right: '0',
                        height: `${((new Date(draggingEvent.end).getTime() - new Date(draggingEvent.start).getTime()) / (60 * 60 * 1000)) * HOUR_HEIGHT}px`,
                      }}
                    >
                      <div
                        className="mx-1 h-full rounded-lg border-2 border-dashed backdrop-blur-sm flex items-center justify-center text-white text-xs font-medium px-2"
                        style={{
                          backgroundColor: `${draggingEvent.color}40`,
                          borderColor: draggingEvent.color,
                        }}
                      >
                        <div className="truncate">{draggingEvent.title}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {viewMode === "month" && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Month View Header - Days of Week */}
              <div className="grid grid-cols-7 border-b border-white/10">
                {DAYS_SHORT.map((day) => (
                  <div
                    key={day}
                    className="px-3 py-3 text-center text-xs uppercase tracking-wider font-medium text-[#9CA3AF] border-r border-white/5 last:border-r-0"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Month View Grid */}
              <div className="flex-1 overflow-auto">
                <div className="grid grid-cols-7 auto-rows-fr min-h-full">
                  {(() => {
                    // Get first day of month
                    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                    // Get last day of month
                    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

                    // Calculate start date (beginning of week containing first day)
                    const startDate = new Date(firstDay);
                    startDate.setDate(startDate.getDate() - firstDay.getDay());

                    // Calculate end date (end of week containing last day)
                    const endDate = new Date(lastDay);
                    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

                    // Generate array of dates
                    const days = [];
                    const current = new Date(startDate);
                    while (current <= endDate) {
                      days.push(new Date(current));
                      current.setDate(current.getDate() + 1);
                    }

                    return days.map((date) => {
                      const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                      const isToday = isSameDay(date, today);
                      const dayEvents = getEventsForDay(date);

                      return (
                        <div
                          key={date.toISOString()}
                          className={`min-h-[120px] border-r border-b border-white/5 last:border-r-0 p-2 hover:bg-white/5 transition-colors ${
                            !isCurrentMonth ? 'bg-white/[0.02]' : ''
                          }`}
                          onClick={() => {
                            setCurrentDate(date);
                            setViewMode('day');
                          }}
                        >
                          {/* Date number */}
                          <div className="flex items-center justify-between mb-1">
                            <div
                              className={`text-sm font-['JetBrains_Mono'] ${
                                isToday
                                  ? 'w-6 h-6 rounded-full bg-[#C17A72] text-white flex items-center justify-center text-xs'
                                  : isCurrentMonth
                                  ? 'text-[#F5F5F5]'
                                  : 'text-[#6B7280]'
                              }`}
                            >
                              {date.getDate()}
                            </div>
                          </div>

                          {/* Events */}
                          <div className="space-y-1">
                            {dayEvents.slice(0, 3).map((event) => (
                              <div
                                key={event.id}
                                className="text-[10px] px-1.5 py-0.5 rounded truncate cursor-pointer hover:opacity-80 transition-opacity"
                                style={{
                                  backgroundColor: `${event.color}40`,
                                  borderLeft: `2px solid ${event.color}`,
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setQuickViewEvent(event);
                                  setQuickViewAnchor(e.currentTarget as HTMLElement);
                                }}
                              >
                                <span className="font-medium text-white">
                                  {!event.allDay && formatTime(new Date(event.start)) + ' '}
                                  {event.title}
                                </span>
                              </div>
                            ))}
                            {dayEvents.length > 3 && (
                              <div className="text-[10px] text-[#9CA3AF] px-1.5">
                                +{dayEvents.length - 3} more
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal */}
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingEvent ? "Edit Event" : "New Event"}>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Event title"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              autoFocus
              className="input-glass text-base"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            />
            <textarea
              placeholder="Description (optional)"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              rows={2}
              className="input-glass resize-none"
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs mb-1 block" style={{ color: "var(--text-muted)" }}>Start</label>
                <input type="datetime-local" value={formStart} onChange={(e) => setFormStart(e.target.value)} className="input-glass w-full" />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "var(--text-muted)" }}>End</label>
                <input type="datetime-local" value={formEnd} onChange={(e) => setFormEnd(e.target.value)} className="input-glass w-full" />
              </div>
            </div>
            <div>
              <label className="text-xs mb-2 block" style={{ color: "var(--text-muted)" }}>Color</label>
              <div className="flex gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setFormColor(c)}
                    className="w-7 h-7 rounded-full transition-all"
                    style={{
                      backgroundColor: c,
                      transform: formColor === c ? "scale(1.15)" : "scale(1)",
                      boxShadow: formColor === c ? `0 0 0 2px var(--bg-primary), 0 0 0 4px ${c}` : "none",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Recurrence Section */}
            <div className="border-t border-white/10 pt-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                  Repeat
                </label>
                <button
                  type="button"
                  onClick={() => setFormIsRecurring(!formIsRecurring)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    formIsRecurring ? "bg-[#C17A72]" : "bg-white/10"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      formIsRecurring ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {formIsRecurring && (
                <div className="space-y-3 pl-1">
                  {/* Frequency & Interval */}
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-xs mb-1 block text-[#9CA3AF]">Every</label>
                      <input
                        type="number"
                        min="1"
                        value={formRecurrenceInterval}
                        onChange={(e) => setFormRecurrenceInterval(Math.max(1, parseInt(e.target.value) || 1))}
                        className="input-glass w-full text-sm"
                      />
                    </div>
                    <div className="flex-[2]">
                      <label className="text-xs mb-1 block text-[#9CA3AF]">Frequency</label>
                      <select
                        value={formRecurrenceFrequency}
                        onChange={(e) => setFormRecurrenceFrequency(e.target.value as any)}
                        className="input-glass w-full text-sm cursor-pointer"
                      >
                        <option value="daily">Day(s)</option>
                        <option value="weekly">Week(s)</option>
                        <option value="monthly">Month(s)</option>
                        <option value="yearly">Year(s)</option>
                      </select>
                    </div>
                  </div>

                  {/* Days of Week (only for weekly) */}
                  {formRecurrenceFrequency === "weekly" && (
                    <div>
                      <label className="text-xs mb-2 block text-[#9CA3AF]">Repeat on</label>
                      <div className="flex gap-1">
                        {DAYS_SHORT.map((day, index) => {
                          const isSelected = formRecurrenceDaysOfWeek.includes(index);
                          return (
                            <button
                              key={index}
                              type="button"
                              onClick={() => {
                                setFormRecurrenceDaysOfWeek(
                                  isSelected
                                    ? formRecurrenceDaysOfWeek.filter((d) => d !== index)
                                    : [...formRecurrenceDaysOfWeek, index].sort()
                                );
                              }}
                              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                                isSelected
                                  ? "bg-[#C17A72]/20 text-[#C17A72] border border-[#C17A72]/30"
                                  : "bg-white/5 text-[#9CA3AF] hover:bg-white/10"
                              }`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* End Date */}
                  <div>
                    <label className="text-xs mb-1 block text-[#9CA3AF]">End date (optional)</label>
                    <input
                      type="date"
                      value={formRecurrenceEndDate}
                      onChange={(e) => setFormRecurrenceEndDate(e.target.value)}
                      className="input-glass w-full text-sm"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              {editingEvent ? (
                <button onClick={handleDelete} className="px-3 py-2 text-sm rounded-lg" style={{ color: "var(--danger)" }}>Delete</button>
              ) : <div />}
              <div className="flex gap-2">
                <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm rounded-lg" style={{ color: "var(--text-secondary)" }}>Cancel</button>
                <button onClick={handleSave} className="btn-glow px-5 py-2 rounded-xl text-sm font-medium">
                  {editingEvent ? "Save" : "Create"}
                </button>
              </div>
            </div>
          </div>
        </Modal>

        {/* Task Modal */}
        <Modal open={taskModalOpen} onClose={() => setTaskModalOpen(false)} title="New Task">
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Task title"
              value={taskFormTitle}
              onChange={(e) => setTaskFormTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveTask()}
              autoFocus
              className="input-glass text-base"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            />
            
            <div>
              <label className="text-xs mb-1 block" style={{ color: "var(--text-muted)" }}>Deadline</label>
              <input 
                type="date" 
                value={taskFormDeadline} 
                onChange={(e) => setTaskFormDeadline(e.target.value)} 
                className="input-glass w-full" 
              />
            </div>

            <div>
              <label className="text-xs mb-1 block" style={{ color: "var(--text-muted)" }}>Energy Required</label>
              <select 
                value={taskFormEnergy}
                onChange={(e) => setTaskFormEnergy(e.target.value as any)}
                className="input-glass w-full text-sm"
              >
                <option value="high">High Energy</option>
                <option value="medium">Medium Energy</option>
                <option value="low">Low Energy</option>
              </select>
            </div>

            <div className="flex justify-end pt-4">
              <div className="flex gap-2">
                <button onClick={() => setTaskModalOpen(false)} className="px-4 py-2 text-sm rounded-lg" style={{ color: "var(--text-secondary)" }}>Cancel</button>
                <button onClick={handleSaveTask} className="btn-glow px-5 py-2 rounded-xl text-sm font-medium">
                  Create Task
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </div>

      {/* Quick View */}
      <EventQuickView
        event={quickViewEvent}
        isOpen={!!quickViewEvent}
        onClose={() => {
          setQuickViewEvent(null);
          setQuickViewAnchor(null);
        }}
        onEdit={() => {
          if (quickViewEvent) {
            openEdit(quickViewEvent);
            setQuickViewEvent(null);
            setQuickViewAnchor(null);
          }
        }}
        onDelete={() => {
          if (quickViewEvent) {
            if (confirm("Are you sure you want to delete this event?")) {
              store.deleteEvent(quickViewEvent.id);
              setQuickViewEvent(null);
              setQuickViewAnchor(null);
            }
          }
        }}
        anchorElement={quickViewAnchor}
      />
    </div>
  );
}
