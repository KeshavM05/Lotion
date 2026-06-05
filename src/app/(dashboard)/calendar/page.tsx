'use client';

import React, { useReducer, useEffect, useCallback, useMemo } from 'react';
import { useStore, type CalendarEvent } from '@/lib/store';
import { Modal } from '@/components/ui/modal';
import { EventQuickView } from '@/components/ui/event-quick-view';
import { isSameDay, toLocalDatetimeStringTz, getWeekDates } from '@/lib/utils';
import { usePageHeader } from '@/lib/page-header-context';

import CalendarHeader from '@/components/calendar/CalendarHeader';
import CalendarGrid from '@/components/calendar/CalendarGrid';
import EventModal from '@/components/calendar/EventModal';
import TaskSidebar from '@/components/calendar/TaskSidebar';

import {
  HOUR_HEIGHT,
  type ViewMode,
  type DragState,
  type EventDragState,
  type ResizeState,
  type ViewMenuPreferences,
  type EventFormState,
} from '@/components/calendar/types';

// ─── State Shape ─────────────────────────────────────────────────────────────

interface CalendarState {
  currentDate: Date;
  viewMode: ViewMode;
  currentTime: Date;

  // Sidebar
  taskSidebarCollapsed: boolean;
  viewMenuPreferences: ViewMenuPreferences;

  // Modals
  modalOpen: boolean;
  editingEvent: CalendarEvent | null;
  taskModalOpen: boolean;
  newListModalOpen: boolean;
  newListForm: { name: string; color: string; icon: string };
  taskFormTitle: string;
  taskFormDeadline: string;
  taskFormEnergy: 'high' | 'medium' | 'low';

  // Quick view
  quickViewEvent: CalendarEvent | null;
  quickViewAnchor: HTMLElement | null;

  // Event form
  form: EventFormState;

  // Drag-to-create
  drag: DragState;

  // Event drag-to-move
  eventDrag: EventDragState;

  // Event resize
  resize: ResizeState;

  // Task drag
  draggingTask: any | null;
}

// ─── Actions ─────────────────────────────────────────────────────────────────

type Action =
  | { type: 'TICK' }
  | { type: 'SET_VIEW'; mode: ViewMode }
  | { type: 'SET_DATE'; date: Date }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'PATCH_VIEW_PREFS'; patch: Partial<ViewMenuPreferences> }
  | { type: 'OPEN_MODAL'; editingEvent?: CalendarEvent; form?: Partial<EventFormState> }
  | { type: 'CLOSE_MODAL' }
  | { type: 'PATCH_FORM'; patch: Partial<EventFormState> }
  | { type: 'OPEN_TASK_MODAL' }
  | { type: 'CLOSE_TASK_MODAL' }
  | {
      type: 'PATCH_TASK_FORM';
      patch: Partial<Pick<CalendarState, 'taskFormTitle' | 'taskFormDeadline' | 'taskFormEnergy'>>;
    }
  | { type: 'OPEN_NEW_LIST_MODAL' }
  | { type: 'CLOSE_NEW_LIST_MODAL' }
  | { type: 'PATCH_NEW_LIST_FORM'; patch: Partial<CalendarState['newListForm']> }
  | { type: 'SET_QUICK_VIEW'; event: CalendarEvent | null; anchor: HTMLElement | null }
  | { type: 'DRAG_START'; date: Date; hour: number; minutes: number }
  | { type: 'DRAG_MOVE'; date: Date; hour: number; minutes: number }
  | { type: 'DRAG_END' }
  | { type: 'EVENT_DRAG_START'; event: CalendarEvent; offset: { x: number; y: number } }
  | { type: 'EVENT_DRAG_MOVE'; date: Date; time: number }
  | { type: 'EVENT_DRAG_END' }
  | { type: 'RESIZE_START'; event: CalendarEvent; edge: 'top' | 'bottom' }
  | { type: 'RESIZE_END' }
  | { type: 'TASK_DRAG_START'; task: any }
  | { type: 'TASK_DRAG_END' };

// ─── Defaults ────────────────────────────────────────────────────────────────

const defaultForm: EventFormState = {
  title: '',
  description: '',
  start: '',
  end: '',
  color: '#8b5cf6',
  isRecurring: false,
  recurrenceFrequency: 'weekly',
  recurrenceInterval: 1,
  recurrenceEndDate: '',
  recurrenceDaysOfWeek: [],
};

const defaultViewPrefs: ViewMenuPreferences = {
  manageDueDates: true,
  showScheduledTasks: false,
  enableDueToday: true,
  enableDueTomorrow: true,
  enableDueSoon: true,
  hiddenLists: [],
};

const initialState: CalendarState = {
  currentDate: new Date(),
  viewMode: 'week',
  currentTime: new Date(),
  taskSidebarCollapsed: false,
  viewMenuPreferences: defaultViewPrefs,
  modalOpen: false,
  editingEvent: null,
  taskModalOpen: false,
  newListModalOpen: false,
  newListForm: { name: '', color: '#8b5cf6', icon: 'circle' },
  taskFormTitle: '',
  taskFormDeadline: '',
  taskFormEnergy: 'medium',
  quickViewEvent: null,
  quickViewAnchor: null,
  form: defaultForm,
  drag: { isDragging: false, dragStart: null, dragEnd: null },
  eventDrag: { draggingEvent: null, eventDragOffset: { x: 0, y: 0 }, eventDragPosition: null },
  resize: {
    resizingEvent: null,
    resizeEdge: null,
    resizeOriginalStart: null,
    resizeOriginalEnd: null,
  },
  draggingTask: null,
};

// ─── Reducer ─────────────────────────────────────────────────────────────────

function reducer(state: CalendarState, action: Action): CalendarState {
  switch (action.type) {
    case 'TICK':
      return { ...state, currentTime: new Date() };

    case 'SET_VIEW': {
      const d = new Date(state.currentDate);
      return { ...state, viewMode: action.mode, currentDate: d };
    }

    case 'SET_DATE':
      return { ...state, currentDate: action.date };

    case 'TOGGLE_SIDEBAR':
      return { ...state, taskSidebarCollapsed: !state.taskSidebarCollapsed };

    case 'PATCH_VIEW_PREFS':
      return { ...state, viewMenuPreferences: { ...state.viewMenuPreferences, ...action.patch } };

    case 'OPEN_MODAL':
      return {
        ...state,
        modalOpen: true,
        editingEvent: action.editingEvent ?? null,
        form: { ...defaultForm, ...(action.form ?? {}) },
      };

    case 'CLOSE_MODAL':
      return { ...state, modalOpen: false };

    case 'PATCH_FORM':
      return { ...state, form: { ...state.form, ...action.patch } };

    case 'OPEN_TASK_MODAL':
      return { ...state, taskModalOpen: true };

    case 'CLOSE_TASK_MODAL':
      return { ...state, taskModalOpen: false, taskFormTitle: '', taskFormDeadline: '' };

    case 'PATCH_TASK_FORM':
      return { ...state, ...action.patch };

    case 'OPEN_NEW_LIST_MODAL':
      return { ...state, newListModalOpen: true };

    case 'CLOSE_NEW_LIST_MODAL':
      return {
        ...state,
        newListModalOpen: false,
        newListForm: { name: '', color: '#8b5cf6', icon: 'circle' },
      };

    case 'PATCH_NEW_LIST_FORM':
      return { ...state, newListForm: { ...state.newListForm, ...action.patch } };

    case 'SET_QUICK_VIEW':
      return { ...state, quickViewEvent: action.event, quickViewAnchor: action.anchor };

    case 'DRAG_START':
      return {
        ...state,
        drag: {
          isDragging: true,
          dragStart: { date: action.date, hour: action.hour, minutes: action.minutes },
          dragEnd: { date: action.date, hour: action.hour, minutes: action.minutes },
        },
      };

    case 'DRAG_MOVE':
      if (!state.drag.isDragging || !state.drag.dragStart) return state;
      return {
        ...state,
        drag: {
          ...state.drag,
          dragEnd: { date: state.drag.dragStart.date, hour: action.hour, minutes: action.minutes },
        },
      };

    case 'DRAG_END':
      return { ...state, drag: { isDragging: false, dragStart: null, dragEnd: null } };

    case 'EVENT_DRAG_START':
      return {
        ...state,
        eventDrag: {
          draggingEvent: action.event,
          eventDragOffset: action.offset,
          eventDragPosition: null,
        },
      };

    case 'EVENT_DRAG_MOVE':
      if (!state.eventDrag.draggingEvent) return state;
      return {
        ...state,
        eventDrag: {
          ...state.eventDrag,
          eventDragPosition: { date: action.date, time: action.time },
        },
      };

    case 'EVENT_DRAG_END':
      return {
        ...state,
        eventDrag: {
          draggingEvent: null,
          eventDragOffset: { x: 0, y: 0 },
          eventDragPosition: null,
        },
      };

    case 'RESIZE_START':
      return {
        ...state,
        resize: {
          resizingEvent: action.event,
          resizeEdge: action.edge,
          resizeOriginalStart: new Date(action.event.start),
          resizeOriginalEnd: new Date(action.event.end),
        },
      };

    case 'RESIZE_END':
      return {
        ...state,
        resize: {
          resizingEvent: null,
          resizeEdge: null,
          resizeOriginalStart: null,
          resizeOriginalEnd: null,
        },
      };

    case 'TASK_DRAG_START':
      return { ...state, draggingTask: action.task };

    case 'TASK_DRAG_END':
      return { ...state, draggingTask: null };

    default:
      return state;
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CalendarPage() {
  const store = useStore();
  const { setPageControls } = usePageHeader();
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    currentDate,
    viewMode,
    currentTime,
    taskSidebarCollapsed,
    viewMenuPreferences,
    modalOpen,
    editingEvent,
    form,
    taskModalOpen,
    taskFormTitle,
    taskFormDeadline,
    taskFormEnergy,
    newListModalOpen,
    newListForm,
    quickViewEvent,
    quickViewAnchor,
    drag,
    eventDrag,
    resize,
    draggingTask,
  } = state;

  // Tick every minute
  useEffect(() => {
    const timer = setInterval(() => dispatch({ type: 'TICK' }), 60000);
    return () => clearInterval(timer);
  }, []);

  // Page header controls
  useEffect(() => {
    setPageControls(
      <CalendarHeader
        currentDate={currentDate}
        viewMode={viewMode}
        onNavigate={navigateDate}
        onViewChange={(mode) => dispatch({ type: 'SET_VIEW', mode })}
      />
    );
    return () => setPageControls(null);
  }, [currentDate, viewMode]);

  // ── Helpers ─────────────────────────────────────────────────────────────────

  function navigateDate(direction: 'prev' | 'next' | 'today') {
    if (direction === 'today') {
      dispatch({ type: 'SET_DATE', date: new Date() });
    } else {
      const d = new Date(currentDate);
      if (viewMode === 'day') d.setDate(d.getDate() + (direction === 'next' ? 1 : -1));
      else if (viewMode === 'week') d.setDate(d.getDate() + (direction === 'next' ? 7 : -7));
      else d.setMonth(d.getMonth() + (direction === 'next' ? 1 : -1));
      dispatch({ type: 'SET_DATE', date: d });
    }
  }

  function getEventsForDisplay(): CalendarEvent[] {
    const regularEvents = store.events;
    const scheduledTasksAsEvents: CalendarEvent[] = store.tasks
      .filter((t) => !t.completed && t.scheduledStart && t.scheduledEnd)
      .map((t) => ({
        id: t.id,
        title: `[Task] ${t.title}`,
        description: t.description || '',
        start: t.scheduledStart as string,
        end: t.scheduledEnd as string,
        color: '#10b981',
        allDay: false,
        source: 'task' as const,
        taskId: t.id,
        isRecurring: false,
        createdAt: t.createdAt,
      }));
    return [...regularEvents, ...scheduledTasksAsEvents];
  }

  function openCreate(start?: Date, end?: Date) {
    const s = start || new Date();
    const e = end || new Date(s.getTime() + 60 * 60 * 1000);
    dispatch({
      type: 'OPEN_MODAL',
      form: {
        title: '',
        description: '',
        start: toLocalDatetimeStringTz(s),
        end: toLocalDatetimeStringTz(e),
        color: '#8b5cf6',
        isRecurring: false,
        recurrenceFrequency: 'weekly',
        recurrenceInterval: 1,
        recurrenceEndDate: '',
        recurrenceDaysOfWeek: [],
      },
    });
  }

  function openEdit(event: CalendarEvent) {
    dispatch({
      type: 'OPEN_MODAL',
      editingEvent: event,
      form: {
        title: event.title,
        description: event.description,
        start: toLocalDatetimeStringTz(new Date(event.start)),
        end: toLocalDatetimeStringTz(new Date(event.end)),
        color: event.color,
        isRecurring: event.isRecurring || false,
        recurrenceFrequency: event.recurrenceFrequency || 'weekly',
        recurrenceInterval: event.recurrenceInterval || 1,
        recurrenceEndDate: event.recurrenceEndDate
          ? new Date(event.recurrenceEndDate).toISOString().split('T')[0]
          : '',
        recurrenceDaysOfWeek: event.recurrenceDaysOfWeek || [],
      },
    });
  }

  function handleSave() {
    if (!form.title.trim()) return;
    const data: any = {
      title: form.title.trim(),
      description: form.description.trim(),
      start: new Date(form.start).toISOString(),
      end: new Date(form.end).toISOString(),
      color: form.color,
      isRecurring: form.isRecurring,
    };
    if (form.isRecurring) {
      data.recurrenceFrequency = form.recurrenceFrequency;
      data.recurrenceInterval = form.recurrenceInterval;
      data.recurrenceEndDate = form.recurrenceEndDate
        ? new Date(form.recurrenceEndDate).toISOString()
        : null;
      data.recurrenceDaysOfWeek =
        form.recurrenceFrequency === 'weekly' ? form.recurrenceDaysOfWeek : [];
    }

    if (editingEvent) {
      if (editingEvent.source === 'task') {
        store.updateTask(editingEvent.id, {
          title: data.title,
          description: data.description,
          scheduledStart: data.start,
          scheduledEnd: data.end,
        });
      } else {
        store.updateEvent(editingEvent.id, data);
      }
    } else {
      store.addEvent({ ...data, allDay: false, taskId: null, source: 'local' });
    }
    dispatch({ type: 'CLOSE_MODAL' });
  }

  function handleDelete() {
    if (!editingEvent) return;
    if (editingEvent.source === 'task') {
      store.updateTask(editingEvent.id, { scheduledStart: null, scheduledEnd: null });
    } else {
      store.deleteEvent(editingEvent.id);
    }
    dispatch({ type: 'CLOSE_MODAL' });
  }

  function handleSaveTask() {
    if (!taskFormTitle.trim()) return;
    store.addTask({
      title: taskFormTitle.trim(),
      description: '',
      status: 'todo',
      priority: 'medium',
      goalId: null,
      milestoneId: null,
      durationMinutes: 30,
      deadline: taskFormDeadline ? new Date(taskFormDeadline).toISOString() : null,
      scheduledStart: null,
      scheduledEnd: null,
      energyLevel: taskFormEnergy,
      timePreference: 'anytime',
      tags: [],
      listId: null,
    });
    dispatch({ type: 'CLOSE_TASK_MODAL' });
  }

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListForm.name.trim()) return;
    try {
      await store.addTaskList({
        name: newListForm.name,
        color: newListForm.color,
        icon: newListForm.icon,
        order: store.taskLists.length,
      });
      dispatch({ type: 'CLOSE_NEW_LIST_MODAL' });
    } catch {
      alert('Failed to create list');
    }
  };

  // ── Grid interaction handlers ────────────────────────────────────────────────

  const handleCellMouseDown = useCallback((date: Date, hour: number, e: React.MouseEvent) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const minutes = Math.round((y / HOUR_HEIGHT) * 60);
    dispatch({ type: 'DRAG_START', date, hour, minutes });
  }, []);

  const handleMouseUp = useCallback(() => {
    if (drag.isDragging && drag.dragStart && drag.dragEnd) {
      const startMinutes = drag.dragStart.hour * 60 + drag.dragStart.minutes;
      const endMinutes = drag.dragEnd.hour * 60 + drag.dragEnd.minutes;

      const start = new Date(drag.dragStart.date);
      start.setHours(Math.floor(Math.min(startMinutes, endMinutes) / 60));
      start.setMinutes(Math.min(startMinutes, endMinutes) % 60);
      start.setSeconds(0);
      start.setMilliseconds(0);

      const end = new Date(drag.dragStart.date);
      end.setHours(Math.floor(Math.max(startMinutes, endMinutes) / 60));
      end.setMinutes(Math.max(startMinutes, endMinutes) % 60);
      end.setSeconds(0);
      end.setMilliseconds(0);

      if (end.getTime() - start.getTime() < 30 * 60 * 1000) {
        end.setTime(start.getTime() + 30 * 60 * 1000);
      }

      dispatch({ type: 'DRAG_END' });
      openCreate(start, end);
    } else {
      dispatch({ type: 'DRAG_END' });
    }

    if (eventDrag.draggingEvent && eventDrag.eventDragPosition) {
      const originalStart = new Date(eventDrag.draggingEvent.start);
      const originalEnd = new Date(eventDrag.draggingEvent.end);
      const duration = originalEnd.getTime() - originalStart.getTime();

      const newStart = new Date(eventDrag.eventDragPosition.date);
      newStart.setHours(Math.floor(eventDrag.eventDragPosition.time / 60));
      newStart.setMinutes(eventDrag.eventDragPosition.time % 60);
      newStart.setSeconds(0);
      newStart.setMilliseconds(0);

      const newEnd = new Date(newStart.getTime() + duration);

      if (eventDrag.draggingEvent.source === 'task') {
        store.updateTask(eventDrag.draggingEvent.id, {
          scheduledStart: newStart.toISOString(),
          scheduledEnd: newEnd.toISOString(),
        });
      } else {
        store.updateEvent(eventDrag.draggingEvent.id, {
          start: newStart.toISOString(),
          end: newEnd.toISOString(),
        });
      }
    }
    dispatch({ type: 'EVENT_DRAG_END' });
    dispatch({ type: 'RESIZE_END' });
  }, [drag, eventDrag, store]);

  const handleGridMouseMove = useCallback(
    (e: React.MouseEvent, isWeekView: boolean, weekDates: Date[]) => {
      if (!drag.isDragging && !eventDrag.draggingEvent && !resize.resizingEvent) return;

      const scrollContainer = e.currentTarget as HTMLDivElement;
      const rect = scrollContainer.getBoundingClientRect();
      const scrollTop = scrollContainer.scrollTop;
      const y = e.clientY - rect.top + scrollTop;

      if (isWeekView) {
        const x = e.clientX - rect.left + scrollContainer.scrollLeft;
        if (x <= 60) return;
        const columnWidth = (rect.width - 60) / 7;
        const dayIndex = Math.floor((x - 60) / columnWidth);
        if (dayIndex < 0 || dayIndex >= 7) return;
        const date = weekDates[dayIndex];
        const hour = Math.floor(y / HOUR_HEIGHT);
        const minutes = Math.round(((y % HOUR_HEIGHT) / HOUR_HEIGHT) * 60);

        if (drag.isDragging)
          dispatch({ type: 'DRAG_MOVE', date: drag.dragStart!.date, hour, minutes });
        else if (eventDrag.draggingEvent)
          dispatch({ type: 'EVENT_DRAG_MOVE', date, time: hour * 60 + minutes });
        else if (resize.resizingEvent) handleResizeMove(date, hour, minutes);
      } else {
        const hour = Math.floor(y / HOUR_HEIGHT);
        const minutes = Math.round(((y % HOUR_HEIGHT) / HOUR_HEIGHT) * 60);

        if (drag.isDragging) dispatch({ type: 'DRAG_MOVE', date: currentDate, hour, minutes });
        else if (eventDrag.draggingEvent)
          dispatch({ type: 'EVENT_DRAG_MOVE', date: currentDate, time: hour * 60 + minutes });
        else if (resize.resizingEvent) handleResizeMove(currentDate, hour, minutes);
      }
    },
    [drag, eventDrag, resize, currentDate]
  );

  function handleResizeMove(date: Date, hour: number, minutes: number) {
    if (
      !resize.resizingEvent ||
      !resize.resizeEdge ||
      !resize.resizeOriginalStart ||
      !resize.resizeOriginalEnd
    )
      return;
    const totalMinutes = hour * 60 + minutes;
    const newTime = new Date(date);
    newTime.setHours(Math.floor(totalMinutes / 60));
    newTime.setMinutes(totalMinutes % 60);
    newTime.setSeconds(0);
    newTime.setMilliseconds(0);

    if (resize.resizeEdge === 'top') {
      if (resize.resizeOriginalEnd.getTime() - newTime.getTime() >= 15 * 60 * 1000) {
        if (resize.resizingEvent.source === 'task') {
          store.updateTask(resize.resizingEvent.id, { scheduledStart: newTime.toISOString() });
        } else {
          store.updateEvent(resize.resizingEvent.id, { start: newTime.toISOString() });
        }
      }
    } else {
      if (newTime.getTime() - resize.resizeOriginalStart.getTime() >= 15 * 60 * 1000) {
        if (resize.resizingEvent.source === 'task') {
          store.updateTask(resize.resizingEvent.id, { scheduledEnd: newTime.toISOString() });
        } else {
          store.updateEvent(resize.resizingEvent.id, { end: newTime.toISOString() });
        }
      }
    }
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

    const end = new Date(start.getTime() + 60 * 60 * 1000);

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
    dispatch({ type: 'TASK_DRAG_END' });
  }

  // ─── Computed ─────────────────────────────────────────────────────────────

  const allEvents = getEventsForDisplay();

  const weekDates: Date[] = useMemo(() => getWeekDates(currentDate), [currentDate]);

  const weekMouseMove = useCallback(
    (e: React.MouseEvent) => handleGridMouseMove(e, true, weekDates),
    [handleGridMouseMove, weekDates]
  );
  const dayMouseMove = useCallback(
    (e: React.MouseEvent) => handleGridMouseMove(e, false, []),
    [handleGridMouseMove]
  );

  return (
    <div className="flex h-full gap-4">
      {/* Task Sidebar */}
      <TaskSidebar
        collapsed={taskSidebarCollapsed}
        onToggleCollapse={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
        onAddTask={() => dispatch({ type: 'OPEN_TASK_MODAL' })}
        onDragStart={(task, e) => {
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', task.id);
          dispatch({ type: 'TASK_DRAG_START', task });
        }}
        onDragEnd={() => dispatch({ type: 'TASK_DRAG_END' })}
        viewMenuPreferences={viewMenuPreferences}
        onViewMenuPreferencesChange={(patch) => dispatch({ type: 'PATCH_VIEW_PREFS', patch })}
        onAddList={() => dispatch({ type: 'OPEN_NEW_LIST_MODAL' })}
      />

      {/* Calendar Grid */}
      <div className="flex-1 flex flex-col min-w-0">
        <CalendarGrid
          currentDate={currentDate}
          viewMode={viewMode}
          today={new Date()}
          currentTime={currentTime}
          events={allEvents}
          dragState={drag}
          eventDragState={eventDrag}
          resizeState={resize}
          onCellMouseDown={handleCellMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={viewMode === 'week' ? weekMouseMove : dayMouseMove}
          onTaskDrop={handleTaskDrop}
          onEventMouseDown={(event, e) => {
            e.stopPropagation();
            const eventEl = e.currentTarget.getBoundingClientRect();
            dispatch({
              type: 'EVENT_DRAG_START',
              event,
              offset: { x: e.clientX - eventEl.left, y: e.clientY - eventEl.top },
            });
          }}
          onEventClick={(event, e) => {
            dispatch({ type: 'SET_QUICK_VIEW', event, anchor: e.currentTarget as HTMLElement });
          }}
          onResizeStart={(event, edge, e) => {
            e.stopPropagation();
            dispatch({ type: 'RESIZE_START', event, edge });
          }}
          onMonthDayClick={(date) => {
            dispatch({ type: 'SET_DATE', date });
            dispatch({ type: 'SET_VIEW', mode: 'day' });
          }}
        />

        {/* Event Modal */}
        <EventModal
          open={modalOpen}
          editingEvent={editingEvent}
          form={form}
          onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
          onSave={handleSave}
          onDelete={handleDelete}
          onFormChange={(patch) => dispatch({ type: 'PATCH_FORM', patch })}
        />

        {/* New Task List Modal */}
        {newListModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="glass-card rounded-2xl w-full max-w-md p-6 border border-white/10 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-6">New Task List</h2>
              <form onSubmit={handleCreateList} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#9CA3AF] mb-1">Name</label>
                  <input
                    type="text"
                    autoFocus
                    required
                    value={newListForm.name}
                    onChange={(e) =>
                      dispatch({ type: 'PATCH_NEW_LIST_FORM', patch: { name: e.target.value } })
                    }
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#C17A72]"
                    placeholder="e.g., Groceries, Project X"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#9CA3AF] mb-1">Color</label>
                    <input
                      type="color"
                      value={newListForm.color}
                      onChange={(e) =>
                        dispatch({ type: 'PATCH_NEW_LIST_FORM', patch: { color: e.target.value } })
                      }
                      className="w-full h-10 rounded-xl cursor-pointer bg-transparent border-0 p-0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#9CA3AF] mb-1">Icon</label>
                    <select
                      value={newListForm.icon}
                      onChange={(e) =>
                        dispatch({ type: 'PATCH_NEW_LIST_FORM', patch: { icon: e.target.value } })
                      }
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#C17A72]"
                    >
                      <option value="circle">Circle</option>
                      <option value="inbox">Inbox</option>
                      <option value="work">Work</option>
                      <option value="home">Home</option>
                      <option value="school">School</option>
                      <option value="star">Star</option>
                      <option value="favorite">Heart</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-8">
                  <button
                    type="button"
                    onClick={() => dispatch({ type: 'CLOSE_NEW_LIST_MODAL' })}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-[#9CA3AF] hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newListForm.name.trim()}
                    className="px-4 py-2 rounded-xl text-sm font-medium bg-white text-black hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    Create List
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Task Modal */}
        <Modal
          open={taskModalOpen}
          onClose={() => dispatch({ type: 'CLOSE_TASK_MODAL' })}
          title="New Task"
        >
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Task title"
              value={taskFormTitle}
              onChange={(e) =>
                dispatch({ type: 'PATCH_TASK_FORM', patch: { taskFormTitle: e.target.value } })
              }
              onKeyDown={(e) => e.key === 'Enter' && handleSaveTask()}
              autoFocus
              className="input-glass text-base"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            />
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>
                Deadline
              </label>
              <input
                type="date"
                value={taskFormDeadline}
                onChange={(e) =>
                  dispatch({ type: 'PATCH_TASK_FORM', patch: { taskFormDeadline: e.target.value } })
                }
                className="input-glass w-full"
              />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>
                Energy Required
              </label>
              <select
                value={taskFormEnergy}
                onChange={(e) =>
                  dispatch({
                    type: 'PATCH_TASK_FORM',
                    patch: { taskFormEnergy: e.target.value as any },
                  })
                }
                className="input-glass w-full text-sm"
              >
                <option value="high">High Energy</option>
                <option value="medium">Medium Energy</option>
                <option value="low">Low Energy</option>
              </select>
            </div>
            <div className="flex justify-end pt-4">
              <div className="flex gap-2">
                <button
                  onClick={() => dispatch({ type: 'CLOSE_TASK_MODAL' })}
                  className="px-4 py-2 text-sm rounded-lg"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTask}
                  className="btn-glow px-5 py-2 rounded-xl text-sm font-medium"
                >
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
        onClose={() => dispatch({ type: 'SET_QUICK_VIEW', event: null, anchor: null })}
        onEdit={() => {
          if (quickViewEvent) {
            openEdit(quickViewEvent);
            dispatch({ type: 'SET_QUICK_VIEW', event: null, anchor: null });
          }
        }}
        onDelete={() => {
          if (quickViewEvent) {
            if (confirm('Are you sure you want to delete this event?')) {
              store.deleteEvent(quickViewEvent.id);
              dispatch({ type: 'SET_QUICK_VIEW', event: null, anchor: null });
            }
          }
        }}
        anchorElement={quickViewAnchor}
      />
    </div>
  );
}
