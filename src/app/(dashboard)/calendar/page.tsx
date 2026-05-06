"use client";

import { useState, useRef, useCallback } from "react";
import { useStore, type CalendarEvent } from "@/lib/store";
import { Modal } from "@/components/ui/modal";
import { getWeekDates, isSameDay, formatTime, toLocalDatetimeString } from "@/lib/utils";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOUR_HEIGHT = 64;
const COLORS = ["#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444"];

export default function CalendarPage() {
  const store = useStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const weekDates = getWeekDates(currentDate);
  const today = new Date();

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formStart, setFormStart] = useState("");
  const [formEnd, setFormEnd] = useState("");
  const [formColor, setFormColor] = useState("#8b5cf6");

  function openCreate(start?: Date) {
    const s = start || new Date();
    const e = new Date(s.getTime() + 60 * 60 * 1000);
    setEditingEvent(null);
    setFormTitle("");
    setFormDescription("");
    setFormStart(toLocalDatetimeString(s));
    setFormEnd(toLocalDatetimeString(e));
    setFormColor("#8b5cf6");
    setModalOpen(true);
  }

  function openEdit(event: CalendarEvent) {
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
    const data = {
      title: formTitle.trim(),
      description: formDescription.trim(),
      start: new Date(formStart).toISOString(),
      end: new Date(formEnd).toISOString(),
      color: formColor,
    };
    if (editingEvent) {
      store.updateEvent(editingEvent.id, data);
    } else {
      store.addEvent({ ...data, allDay: false, taskId: null, source: "local" });
    }
    setModalOpen(false);
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
    const duration = Math.max(endMin - startMin, 15);
    return {
      top: `${(startMin / 60) * HOUR_HEIGHT}px`,
      height: `${(duration / 60) * HOUR_HEIGHT}px`,
      backgroundColor: event.color,
    };
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-['Space_Grotesk'] font-bold text-[#F5F5F5]">Calendar</h1>
          <p className="text-[#9CA3AF] font-['JetBrains_Mono'] text-xs uppercase tracking-widest">
            {currentDate.toLocaleDateString("en-US", { month: "long", day: "numeric" })} — {new Date(currentDate.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { const d = new Date(currentDate); d.setDate(d.getDate() - 7); setCurrentDate(d); }}
            className="p-2 rounded-lg hover:bg-white/5 text-[#9CA3AF]"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 rounded-lg hover:bg-white/5 text-[#F5F5F5] font-medium border border-white/10"
          >
            Today
          </button>
          <button
            onClick={() => { const d = new Date(currentDate); d.setDate(d.getDate() + 7); setCurrentDate(d); }}
            className="p-2 rounded-lg hover:bg-white/5 text-[#9CA3AF]"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-[60px_repeat(7,1fr)] min-w-[800px]">
          {/* Day headers */}
          <div className="sticky top-0 z-20 border-b" style={{ background: "var(--bg-primary)", borderColor: "var(--border)" }} />
          {weekDates.map((date, i) => {
            const isToday = isSameDay(date, today);
            return (
              <div
                key={i}
                className="sticky top-0 z-20 border-b border-l px-2 py-3 text-center"
                style={{ background: "var(--bg-primary)", borderColor: "var(--border)" }}
              >
                <div className="text-[10px] uppercase tracking-wider" style={{ color: isToday ? "var(--accent)" : "var(--text-muted)" }}>
                  {DAYS[date.getDay()]}
                </div>
                <div
                  className={`text-lg font-semibold mt-0.5 ${isToday ? "w-8 h-8 rounded-full flex items-center justify-center mx-auto" : ""}`}
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    background: isToday ? "var(--accent)" : "transparent",
                    color: isToday ? "white" : "var(--text-primary)",
                  }}
                >
                  {date.getDate()}
                </div>
              </div>
            );
          })}

          {/* Time slots */}
          {HOURS.map((hour) => (
            <div key={`row-${hour}`} className="contents">
              <div
                className="text-[10px] text-right pr-3 -mt-2 relative"
                style={{ height: HOUR_HEIGHT, color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}
              >
                {hour === 0 ? "" : `${hour % 12 || 12} ${hour < 12 ? "AM" : "PM"}`}
              </div>
              {weekDates.map((date, dayIdx) => (
                <div
                  key={`cell-${hour}-${dayIdx}`}
                  className="border-l border-b relative cursor-pointer transition-colors"
                  style={{ height: HOUR_HEIGHT, borderColor: "var(--border)" }}
                  onClick={() => {
                    const d = new Date(date);
                    d.setHours(hour, 0, 0, 0);
                    openCreate(d);
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(193, 122, 114, 0.03)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {hour === 0 &&
                    getEventsForDay(date).map((event) => (
                      <div
                        key={event.id}
                        className="absolute left-1 right-1 rounded-lg px-2.5 py-1.5 text-white text-xs font-medium overflow-hidden cursor-pointer z-10 transition-shadow"
                        style={{
                          ...getEventStyle(event),
                          boxShadow: `0 2px 8px ${event.color}40`,
                        }}
                        onClick={(e) => { e.stopPropagation(); openEdit(event); }}
                        onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 4px 16px ${event.color}60`)}
                        onMouseLeave={(e) => (e.currentTarget.style.boxShadow = `0 2px 8px ${event.color}40`)}
                      >
                        <div className="truncate font-semibold">{event.title}</div>
                        <div className="text-[10px] opacity-75 mt-0.5">{formatTime(new Date(event.start))}</div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          ))}
        </div>
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
    </div>
  );
}
