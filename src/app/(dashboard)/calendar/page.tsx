"use client";

import { useState, useRef, useCallback } from "react";
import { useStore, type CalendarEvent } from "@/lib/store";
import { Modal } from "@/components/ui/modal";
import { getWeekDates, isSameDay, formatTime, toLocalDatetimeString } from "@/lib/utils";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOUR_HEIGHT = 64;

export default function CalendarPage() {
  const store = useStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [newEventStart, setNewEventStart] = useState<Date | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Drag-to-create state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ day: number; hour: number } | null>(null);
  const [dragEnd, setDragEnd] = useState<{ day: number; hour: number } | null>(null);

  const weekDates = getWeekDates(currentDate);
  const today = new Date();

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formStart, setFormStart] = useState("");
  const [formEnd, setFormEnd] = useState("");
  const [formColor, setFormColor] = useState("#6366f1");

  const COLORS = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444"];

  function openCreateModal(start?: Date) {
    const s = start || new Date();
    const e = new Date(s.getTime() + 60 * 60 * 1000);
    setEditingEvent(null);
    setFormTitle("");
    setFormDescription("");
    setFormStart(toLocalDatetimeString(s));
    setFormEnd(toLocalDatetimeString(e));
    setFormColor("#6366f1");
    setModalOpen(true);
  }

  function openEditModal(event: CalendarEvent) {
    setEditingEvent(event);
    setFormTitle(event.title);
    setFormDescription(event.description);
    setFormStart(toLocalDatetimeString(new Date(event.start)));
    setFormEnd(toLocalDatetimeString(new Date(event.end)));
    setFormColor(event.color);
    setModalOpen(true);
  }

  function handleSave() {
    if (!formTitle.trim()) return;
    if (editingEvent) {
      store.updateEvent(editingEvent.id, {
        title: formTitle.trim(),
        description: formDescription.trim(),
        start: new Date(formStart).toISOString(),
        end: new Date(formEnd).toISOString(),
        color: formColor,
      });
    } else {
      store.addEvent({
        title: formTitle.trim(),
        description: formDescription.trim(),
        start: new Date(formStart).toISOString(),
        end: new Date(formEnd).toISOString(),
        allDay: false,
        color: formColor,
        taskId: null,
      });
    }
    setModalOpen(false);
  }

  function handleDelete() {
    if (editingEvent) {
      store.deleteEvent(editingEvent.id);
      setModalOpen(false);
    }
  }

  function handleCellClick(dayIdx: number, hour: number) {
    const date = new Date(weekDates[dayIdx]);
    date.setHours(hour, 0, 0, 0);
    openCreateModal(date);
  }

  // Drag to create
  const handleMouseDown = useCallback((dayIdx: number, hour: number) => {
    setIsDragging(true);
    setDragStart({ day: dayIdx, hour });
    setDragEnd({ day: dayIdx, hour: hour + 1 });
  }, []);

  const handleMouseMove = useCallback(
    (dayIdx: number, hour: number) => {
      if (isDragging && dragStart && dayIdx === dragStart.day) {
        setDragEnd({ day: dayIdx, hour: Math.max(hour + 1, dragStart.hour + 1) });
      }
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging && dragStart && dragEnd) {
      const startDate = new Date(weekDates[dragStart.day]);
      startDate.setHours(dragStart.hour, 0, 0, 0);
      const endDate = new Date(weekDates[dragEnd.day]);
      endDate.setHours(dragEnd.hour, 0, 0, 0);
      openCreateModal(startDate);
      setFormEnd(toLocalDatetimeString(endDate));
    }
    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
  }, [isDragging, dragStart, dragEnd, weekDates]);

  // Get events for a specific day
  function getEventsForDay(date: Date) {
    return store.events.filter((e) => {
      const eventStart = new Date(e.start);
      return isSameDay(eventStart, date);
    });
  }

  // Position an event on the grid
  function getEventStyle(event: CalendarEvent) {
    const start = new Date(event.start);
    const end = new Date(event.end);
    const startMinutes = start.getHours() * 60 + start.getMinutes();
    const endMinutes = end.getHours() * 60 + end.getMinutes();
    const durationMinutes = Math.max(endMinutes - startMinutes, 15);

    return {
      top: `${(startMinutes / 60) * HOUR_HEIGHT}px`,
      height: `${(durationMinutes / 60) * HOUR_HEIGHT}px`,
      backgroundColor: event.color,
    };
  }

  // Drag selection overlay
  function getDragStyle() {
    if (!dragStart || !dragEnd) return null;
    const startHour = Math.min(dragStart.hour, dragEnd.hour);
    const endHour = Math.max(dragStart.hour, dragEnd.hour);
    return {
      top: `${startHour * HOUR_HEIGHT}px`,
      height: `${(endHour - startHour) * HOUR_HEIGHT}px`,
    };
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">
            {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                const d = new Date(currentDate);
                d.setDate(d.getDate() - 7);
                setCurrentDate(d);
              }}
              className="p-1.5 rounded hover:bg-[var(--accent)] transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 text-sm rounded hover:bg-[var(--accent)] transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => {
                const d = new Date(currentDate);
                d.setDate(d.getDate() + 7);
                setCurrentDate(d);
              }}
              className="p-1.5 rounded hover:bg-[var(--accent)] transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>
        </div>
        <button
          onClick={() => openCreateModal()}
          className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--primary-hover)] transition-colors"
        >
          + New event
        </button>
      </div>

      {/* Calendar grid */}
      <div className="flex-1 overflow-auto" ref={gridRef} onMouseUp={handleMouseUp}>
        <div className="grid grid-cols-[60px_repeat(7,1fr)] min-w-[800px]">
          {/* Day headers */}
          <div className="sticky top-0 z-20 bg-[var(--background)] border-b border-[var(--border)]" />
          {weekDates.map((date, i) => {
            const isToday = isSameDay(date, today);
            return (
              <div
                key={i}
                className="sticky top-0 z-20 bg-[var(--background)] border-b border-l border-[var(--border)] px-2 py-3 text-center"
              >
                <div className={`text-xs ${isToday ? "text-[var(--primary)]" : "text-[var(--muted)]"}`}>
                  {DAYS[date.getDay()]}
                </div>
                <div
                  className={`text-lg font-semibold mt-0.5 ${
                    isToday
                      ? "bg-[var(--primary)] text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto"
                      : ""
                  }`}
                >
                  {date.getDate()}
                </div>
              </div>
            );
          })}

          {/* Time grid */}
          {HOURS.map((hour) => (
            <div key={`row-${hour}`} className="contents">
              <div className="text-xs text-[var(--muted)] text-right pr-2 -mt-2 relative" style={{ height: HOUR_HEIGHT }}>
                {hour === 0 ? "" : `${hour % 12 || 12} ${hour < 12 ? "AM" : "PM"}`}
              </div>
              {weekDates.map((date, dayIdx) => (
                <div
                  key={`cell-${hour}-${dayIdx}`}
                  className="border-l border-b border-[var(--border)] relative cursor-pointer hover:bg-[var(--accent)]/30 transition-colors"
                  style={{ height: HOUR_HEIGHT }}
                  onClick={() => handleCellClick(dayIdx, hour)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleMouseDown(dayIdx, hour);
                  }}
                  onMouseMove={() => handleMouseMove(dayIdx, hour)}
                >
                  {/* Events */}
                  {hour === 0 &&
                    getEventsForDay(date).map((event) => (
                      <div
                        key={event.id}
                        className="absolute left-0.5 right-0.5 rounded-md px-2 py-1 text-white text-xs font-medium overflow-hidden cursor-pointer z-10 shadow-sm hover:shadow-md transition-shadow"
                        style={getEventStyle(event)}
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(event);
                        }}
                      >
                        <div className="truncate">{event.title}</div>
                        <div className="text-[10px] opacity-80">
                          {formatTime(new Date(event.start))}
                        </div>
                      </div>
                    ))}

                  {/* Drag selection */}
                  {isDragging &&
                    dragStart &&
                    dragEnd &&
                    dragStart.day === dayIdx &&
                    hour === 0 && (
                      <div
                        className="absolute left-0.5 right-0.5 bg-[var(--primary)]/30 border-2 border-[var(--primary)] rounded-md z-5"
                        style={getDragStyle()!}
                      />
                    )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Current time indicator */}
        {weekDates.some((d) => isSameDay(d, today)) && (
          <div
            className="absolute pointer-events-none"
            style={{
              left: `calc(60px + ${weekDates.findIndex((d) => isSameDay(d, today))} * ((100% - 60px) / 7))`,
              top: `${56 + (today.getHours() * 60 + today.getMinutes()) / 60 * HOUR_HEIGHT}px`,
              width: `calc((100% - 60px) / 7)`,
            }}
          >
            <div className="flex items-center">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full -ml-1" />
              <div className="flex-1 h-0.5 bg-red-500" />
            </div>
          </div>
        )}
      </div>

      {/* Event modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingEvent ? "Edit Event" : "New Event"}
      >
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Event title"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            autoFocus
            className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm"
          />
          <textarea
            placeholder="Description (optional)"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            rows={2}
            className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm resize-none"
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[var(--muted)] mb-1 block">Start</label>
              <input
                type="datetime-local"
                value={formStart}
                onChange={(e) => setFormStart(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--muted)] mb-1 block">End</label>
              <input
                type="datetime-local"
                value={formEnd}
                onChange={(e) => setFormEnd(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-[var(--muted)] mb-2 block">Color</label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setFormColor(c)}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    formColor === c ? "scale-110 ring-2 ring-offset-2 ring-[var(--foreground)]" : ""
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            {editingEvent ? (
              <button
                onClick={handleDelete}
                className="px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                Delete
              </button>
            ) : (
              <div />
            )}
            <div className="flex gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm rounded-lg hover:bg-[var(--accent)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-colors"
              >
                {editingEvent ? "Save" : "Create"}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
