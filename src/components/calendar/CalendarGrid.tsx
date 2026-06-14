'use client';

import React, { useRef, useEffect, useMemo } from 'react';
import type { CalendarEvent } from '@/lib/store';
import { isSameDay, formatTime, isSameDayTz, minutesInDayTz, getUserTimezone } from '@/lib/utils';
import { getWeekDates } from '@/lib/utils';
import EventCard from './EventCard';
import {
  HOURS,
  DAYS_SHORT,
  HOUR_HEIGHT,
  type ViewMode,
  type DragState,
  type EventDragState,
  type ResizeState,
} from './types';

interface CalendarPreferences {
  timeGridStart: number;
  timeGridEnd: number;
  firstDayOfWeek: number;
  eventsPerDayLimit: number;
}

interface CalendarGridProps {
  currentDate: Date;
  viewMode: ViewMode;
  today: Date;
  currentTime: Date;
  events: CalendarEvent[];
  dragState: DragState;
  eventDragState: EventDragState;
  resizeState: ResizeState;
  preferences: CalendarPreferences;
  selectedEventId: string | null;
  onCellMouseDown: (date: Date, hour: number, e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onTaskDrop: (date: Date, hour: number, e: React.DragEvent) => void;
  onEventMouseDown: (event: CalendarEvent, e: React.MouseEvent) => void;
  onEventClick: (event: CalendarEvent, e: React.MouseEvent) => void;
  onEventDoubleClick: (event: CalendarEvent, e: React.MouseEvent) => void;
  onResizeStart: (event: CalendarEvent, edge: 'top' | 'bottom', e: React.MouseEvent) => void;
  onMonthDayClick: (date: Date) => void;
}

function getEventsOverlap(event1: CalendarEvent, event2: CalendarEvent) {
  const start1 = new Date(event1.start).getTime();
  const end1 = new Date(event1.end).getTime();
  const start2 = new Date(event2.start).getTime();
  const end2 = new Date(event2.end).getTime();
  return start1 < end2 && start2 < end1;
}

function getEventStyle(event: CalendarEvent) {
  const tz = getUserTimezone();
  const startMin = minutesInDayTz(event.start, tz);
  const endMin = minutesInDayTz(event.end, tz);
  // All-day events span the full day column
  if (event.allDay) {
    return { top: '0px', height: `${HOUR_HEIGHT}px`, backgroundColor: event.color };
  }
  const duration = Math.max(endMin - startMin, 30);
  return {
    top: `${(startMin / 60) * HOUR_HEIGHT}px`,
    height: `${(duration / 60) * HOUR_HEIGHT}px`,
    backgroundColor: event.color,
  };
}

function getEventLayout(event: CalendarEvent, dayEvents: CalendarEvent[]) {
  const overlapping = dayEvents.filter((e) => e.id !== event.id && getEventsOverlap(event, e));

  if (overlapping.length === 0) {
    return { left: '0.25rem', right: '0.25rem', zIndex: 10 };
  }

  const allEvents = [event, ...overlapping].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );

  const columns: CalendarEvent[][] = [];
  for (const evt of allEvents) {
    let placed = false;
    for (const column of columns) {
      const lastInColumn = column[column.length - 1];
      if (!getEventsOverlap(evt, lastInColumn)) {
        column.push(evt);
        placed = true;
        break;
      }
    }
    if (!placed) {
      columns.push([evt]);
    }
  }

  let columnIndex = 0;
  for (let i = 0; i < columns.length; i++) {
    if (columns[i].some((e) => e.id === event.id)) {
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

function getDragPreviewStyle(dragState: DragState) {
  if (!dragState.isDragging || !dragState.dragStart || !dragState.dragEnd) return null;

  const startMinutes = dragState.dragStart.hour * 60 + dragState.dragStart.minutes;
  const endMinutes = dragState.dragEnd.hour * 60 + dragState.dragEnd.minutes;
  const top = Math.min(startMinutes, endMinutes);
  const bottom = Math.max(startMinutes, endMinutes);
  const height = Math.max(bottom - top, 30);

  return {
    top: `${(top / 60) * HOUR_HEIGHT}px`,
    height: `${(height / 60) * HOUR_HEIGHT}px`,
  };
}

function getCurrentTimePosition(currentTime: Date) {
  const minutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  return (minutes / 60) * HOUR_HEIGHT;
}

function TimeLabel({ hour }: { hour: number }) {
  return (
    <div className="text-xs text-[#9CA3AF] font-['JetBrains_Mono'] -mt-2">
      {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
    </div>
  );
}

export default function CalendarGrid({
  currentDate,
  viewMode,
  today,
  currentTime,
  events,
  dragState,
  eventDragState,
  resizeState,
  preferences,
  selectedEventId,
  onCellMouseDown,
  onMouseUp,
  onMouseLeave,
  onMouseMove,
  onTaskDrop,
  onEventMouseDown,
  onEventClick,
  onEventDoubleClick,
  onResizeStart,
  onMonthDayClick,
}: CalendarGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Filter hours based on preferences
  const displayHours = useMemo(() => {
    const hours: number[] = [];
    for (let i = preferences.timeGridStart; i < preferences.timeGridEnd; i++) {
      hours.push(i);
    }
    return hours;
  }, [preferences.timeGridStart, preferences.timeGridEnd]);

  const weekDates = useMemo(
    () => getWeekDates(currentDate, preferences.firstDayOfWeek),
    [currentDate, preferences.firstDayOfWeek]
  );

  // Scroll to current time on mount / view change
  useEffect(() => {
    if (scrollRef.current && isSameDay(currentDate, today)) {
      const now = new Date();
      const currentHour = now.getHours();
      const scrollTo = (currentHour - 2) * HOUR_HEIGHT;
      scrollRef.current.scrollTop = Math.max(0, scrollTo);
    }
  }, [viewMode]);

  const shouldShowTimeIndicator =
    viewMode === 'week' && weekDates.some((date) => isSameDay(date, today));

  const dragPreviewStyle = getDragPreviewStyle(dragState);

  function renderEventCards(dayEvents: CalendarEvent[]) {
    return dayEvents.map((event) => {
      const isDragging =
        eventDragState.draggingEvent?.id === event.id && eventDragState.eventDragPosition !== null;
      const isResizing = resizeState.resizingEvent?.id === event.id;
      const isSelected = selectedEventId === event.id;
      const layout = getEventLayout(event, dayEvents);
      return (
        <EventCard
          key={event.id}
          event={event}
          isDragging={isDragging}
          isResizing={isResizing}
          isSelected={isSelected}
          layout={layout}
          style={getEventStyle(event)}
          onMouseDown={(e) => {
            const target = e.target as HTMLElement;
            if (target.classList.contains('resize-handle')) return;
            onEventMouseDown(event, e);
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (!isDragging && !isResizing) {
              onEventClick(event, e);
            }
          }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            if (!isDragging && !isResizing) {
              onEventDoubleClick(event, e);
            }
          }}
          onResizeStart={(edge, e) => onResizeStart(event, edge, e)}
        />
      );
    });
  }

  if (viewMode === 'week') {
    return (
      <div className="flex-1 glass-card rounded-2xl overflow-hidden flex flex-col">
        {/* Week Header */}
        <div className="border-b border-white/10">
          <div className="grid grid-cols-[60px_repeat(7,1fr)]">
            <div className="h-16 border-r border-white/5"></div>
            {weekDates.map((date, i) => {
              const isToday = isSameDay(date, today);
              return (
                <div
                  key={i}
                  className="h-16 border-r border-white/5 last:border-r-0 px-3 flex flex-col items-center justify-center"
                >
                  <div
                    className={`text-xs uppercase tracking-wider font-medium ${
                      isToday ? 'text-[#C17A72]' : 'text-[#9CA3AF]'
                    }`}
                  >
                    {DAYS_SHORT[date.getDay()]}
                  </div>
                  <div
                    className={`text-2xl font-['Playfair_Display'] mt-1 ${
                      isToday
                        ? 'w-10 h-10 rounded-full bg-[#C17A72] text-white flex items-center justify-center'
                        : 'text-[#F5F5F5]'
                    }`}
                  >
                    {date.getDate()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* All-day section */}
        <div className="border-b border-white/10">
          <div className="grid grid-cols-[60px_repeat(7,1fr)]">
            {/* All-day label */}
            <div className="border-r border-white/5 text-right pr-3 py-2 flex items-start justify-end">
              <span className="text-xs text-[#9CA3AF]">all-day</span>
            </div>
            {/* All-day event columns */}
            {weekDates.map((date, dayIdx) => {
              const allDayEvents = events.filter((e) => e.allDay && isSameDayTz(e.start, date));
              return (
                <div
                  key={`allday-${dayIdx}`}
                  className="relative border-r border-white/5 last:border-r-0 min-h-[32px] py-1 px-1"
                >
                  {allDayEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`text-xs font-medium text-white px-2 py-1 rounded mb-1 cursor-pointer hover:brightness-110 transition-all truncate ${
                        selectedEventId === event.id ? 'ring-2 ring-white/60 brightness-90' : ''
                      }`}
                      style={{ backgroundColor: event.color }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event, e);
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onEventDoubleClick(event, e);
                      }}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Time Grid */}
        <div
          className="flex-1 overflow-auto"
          ref={scrollRef}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onMouseMove={onMouseMove}
        >
          <div className="relative min-h-full select-none">
            <div className="grid grid-cols-[60px_repeat(7,1fr)]">
              {displayHours.map((hour) => (
                <div key={`row-${hour}`} className="contents">
                  <div
                    className="relative border-r border-white/5 text-right pr-3 py-2"
                    style={{ height: HOUR_HEIGHT }}
                  >
                    <TimeLabel hour={hour} />
                  </div>
                  {weekDates.map((date, dayIdx) => (
                    <div
                      key={`cell-${hour}-${dayIdx}`}
                      className="relative border-r border-t border-white/5 last:border-r-0 hover:bg-[#C17A72]/5 transition-colors cursor-crosshair group"
                      style={{ height: HOUR_HEIGHT }}
                      onMouseDown={(e) => {
                        if (!eventDragState.draggingEvent && !resizeState.resizingEvent) {
                          onCellMouseDown(date, hour, e);
                        }
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => onTaskDrop(date, hour, e)}
                    >
                      <div className="absolute top-1/2 left-0 right-0 h-px bg-white/5"></div>
                      {hour === displayHours[0] &&
                        renderEventCards(
                          events.filter((e) => !e.allDay && isSameDayTz(e.start, date))
                        )}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Current Time Indicator */}
            {shouldShowTimeIndicator && (
              <div
                className="absolute left-0 right-0 z-30 pointer-events-none"
                style={{ top: `${getCurrentTimePosition(currentTime)}px` }}
              >
                <div className="relative">
                  <div className="absolute left-0 w-full h-[2px] bg-[#ef4444] shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                  <div className="absolute left-14 w-3 h-3 rounded-full bg-[#ef4444] -mt-1.5 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                </div>
              </div>
            )}

            {/* Drag Preview */}
            {dragState.isDragging &&
              dragState.dragStart &&
              dragState.dragEnd &&
              dragPreviewStyle && (
                <div
                  className="absolute pointer-events-none z-20"
                  style={{
                    ...dragPreviewStyle,
                    left: `calc(60px + ${weekDates.findIndex((d) =>
                      isSameDay(d, dragState.dragEnd!.date)
                    )} * ((100% - 60px) / 7))`,
                    width: `calc((100% - 60px) / 7)`,
                  }}
                >
                  <div className="mx-1 h-full bg-[#C17A72]/30 border-2 border-[#C17A72] rounded-lg backdrop-blur-sm"></div>
                </div>
              )}

            {/* Event Drag Preview */}
            {eventDragState.draggingEvent && eventDragState.eventDragPosition && (
              <div
                className="absolute pointer-events-none z-30"
                style={{
                  top: `${(eventDragState.eventDragPosition.time / 60) * HOUR_HEIGHT}px`,
                  left: `calc(60px + ${weekDates.findIndex((d) =>
                    isSameDay(d, eventDragState.eventDragPosition!.date)
                  )} * ((100% - 60px) / 7))`,
                  width: `calc((100% - 60px) / 7)`,
                  height: `${
                    ((new Date(eventDragState.draggingEvent.end).getTime() -
                      new Date(eventDragState.draggingEvent.start).getTime()) /
                      (60 * 60 * 1000)) *
                    HOUR_HEIGHT
                  }px`,
                }}
              >
                <div
                  className="mx-1 h-full rounded-lg border-2 border-dashed backdrop-blur-sm flex items-center justify-center text-white text-xs font-medium px-2"
                  style={{
                    backgroundColor: `${eventDragState.draggingEvent.color}40`,
                    borderColor: eventDragState.draggingEvent.color,
                  }}
                >
                  <div className="truncate">{eventDragState.draggingEvent.title}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === 'day') {
    return (
      <div className="flex-1 glass-card rounded-2xl overflow-hidden flex flex-col">
        {/* Day View Header */}
        <div className="border-b border-white/10">
          <div className="h-16 px-3 flex items-center justify-center border-r border-white/5">
            <div>
              <div
                className={`text-xs uppercase tracking-wider font-medium ${
                  isSameDay(currentDate, today) ? 'text-[#C17A72]' : 'text-[#9CA3AF]'
                }`}
              >
                {DAYS_SHORT[currentDate.getDay()]}
              </div>
              <div
                className={`text-2xl font-['Playfair_Display'] mt-1 ${
                  isSameDay(currentDate, today)
                    ? 'w-10 h-10 rounded-full bg-[#C17A72] text-white flex items-center justify-center mx-auto'
                    : 'text-[#F5F5F5] text-center'
                }`}
              >
                {currentDate.getDate()}
              </div>
            </div>
          </div>
        </div>

        {/* All-day section for day view */}
        <div className="border-b border-white/10">
          <div className="grid grid-cols-[60px_1fr]">
            {/* All-day label */}
            <div className="border-r border-white/5 text-right pr-3 py-2 flex items-start justify-end">
              <span className="text-xs text-[#9CA3AF]">all-day</span>
            </div>
            {/* All-day events column */}
            <div className="relative border-r border-white/5 min-h-[32px] py-1 px-1">
              {events
                .filter((e) => e.allDay && isSameDayTz(e.start, currentDate))
                .map((event) => (
                  <div
                    key={event.id}
                    className={`text-xs font-medium text-white px-2 py-1 rounded mb-1 cursor-pointer hover:brightness-110 transition-all truncate ${
                      selectedEventId === event.id ? 'ring-2 ring-white/60 brightness-90' : ''
                    }`}
                    style={{ backgroundColor: event.color }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event, e);
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onEventDoubleClick(event, e);
                    }}
                  >
                    {event.title}
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Day View Grid */}
        <div
          className="flex-1 overflow-auto"
          ref={scrollRef}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onMouseMove={onMouseMove}
        >
          <div className="relative min-h-full select-none">
            <div className="grid grid-cols-[60px_1fr]">
              {displayHours.map((hour) => (
                <div key={`row-${hour}`} className="contents">
                  <div
                    className="relative border-r border-white/5 text-right pr-3 py-2"
                    style={{ height: HOUR_HEIGHT }}
                  >
                    <TimeLabel hour={hour} />
                  </div>
                  <div
                    key={`cell-${hour}`}
                    className="relative border-r border-t border-white/5 hover:bg-[#C17A72]/5 transition-colors cursor-crosshair group"
                    style={{ height: HOUR_HEIGHT }}
                    onMouseDown={(e) => {
                      if (!eventDragState.draggingEvent && !resizeState.resizingEvent) {
                        onCellMouseDown(currentDate, hour, e);
                      }
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => onTaskDrop(currentDate, hour, e)}
                  >
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-white/5"></div>
                    {hour === displayHours[0] &&
                      renderEventCards(
                        events.filter((e) => !e.allDay && isSameDayTz(e.start, currentDate))
                      )}
                  </div>
                </div>
              ))}
            </div>

            {/* Current Time Indicator for Day View */}
            {isSameDay(currentDate, today) && (
              <div
                className="absolute left-0 right-0 z-30 pointer-events-none"
                style={{ top: `${getCurrentTimePosition(currentTime)}px` }}
              >
                <div className="relative">
                  <div className="absolute left-0 w-full h-[2px] bg-[#ef4444] shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                  <div className="absolute left-14 w-3 h-3 rounded-full bg-[#ef4444] -mt-1.5 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                </div>
              </div>
            )}

            {/* Drag Preview for Day View */}
            {dragState.isDragging &&
              dragState.dragStart &&
              dragPreviewStyle &&
              isSameDay(dragState.dragStart.date, currentDate) && (
                <div
                  className="absolute pointer-events-none z-20"
                  style={{ ...dragPreviewStyle, left: '60px', right: '0' }}
                >
                  <div className="mx-1 h-full bg-[#C17A72]/30 border-2 border-[#C17A72] rounded-lg backdrop-blur-sm"></div>
                </div>
              )}

            {/* Event Drag Preview for Day View */}
            {eventDragState.draggingEvent &&
              eventDragState.eventDragPosition &&
              isSameDay(eventDragState.eventDragPosition.date, currentDate) && (
                <div
                  className="absolute pointer-events-none z-30"
                  style={{
                    top: `${(eventDragState.eventDragPosition.time / 60) * HOUR_HEIGHT}px`,
                    left: '60px',
                    right: '0',
                    height: `${
                      ((new Date(eventDragState.draggingEvent.end).getTime() -
                        new Date(eventDragState.draggingEvent.start).getTime()) /
                        (60 * 60 * 1000)) *
                      HOUR_HEIGHT
                    }px`,
                  }}
                >
                  <div
                    className="mx-1 h-full rounded-lg border-2 border-dashed backdrop-blur-sm flex items-center justify-center text-white text-xs font-medium px-2"
                    style={{
                      backgroundColor: `${eventDragState.draggingEvent.color}40`,
                      borderColor: eventDragState.draggingEvent.color,
                    }}
                  >
                    <div className="truncate">{eventDragState.draggingEvent.title}</div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    );
  }

  // Month view
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  const endDate = new Date(lastDay);
  endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

  const days: Date[] = [];
  const current = new Date(startDate);
  while (current <= endDate) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return (
    <div className="flex-1 glass-card rounded-2xl overflow-hidden flex flex-col">
      {/* Month View Header */}
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
          {days.map((date) => {
            const isCurrentMonth = date.getMonth() === currentDate.getMonth();
            const isToday = isSameDay(date, today);
            const dayEvents = events.filter((e) => isSameDayTz(e.start, date));

            return (
              <div
                key={date.toISOString()}
                className={`min-h-[120px] border-r border-b border-white/5 last:border-r-0 p-2 hover:bg-white/5 transition-colors ${
                  !isCurrentMonth ? 'bg-white/[0.02]' : ''
                }`}
                onClick={() => onMonthDayClick(date)}
              >
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
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className={`text-[10px] px-1.5 py-0.5 rounded truncate cursor-pointer hover:opacity-80 transition-opacity ${
                        selectedEventId === event.id ? 'ring-2 ring-white/60 brightness-90' : ''
                      }`}
                      style={{
                        backgroundColor: `${event.color}40`,
                        borderLeft: `2px solid ${event.color}`,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event, e);
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onEventDoubleClick(event, e);
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
          })}
        </div>
      </div>
    </div>
  );
}
