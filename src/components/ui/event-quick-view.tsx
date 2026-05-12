"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarEvent } from "@/lib/store";
import { formatTime } from "@/lib/utils";

interface EventQuickViewProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  anchorElement: HTMLElement | null;
}

export function EventQuickView({
  event,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  anchorElement,
}: EventQuickViewProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !anchorElement || !popoverRef.current) return;

    const updatePosition = () => {
      const anchorRect = anchorElement.getBoundingClientRect();
      const popoverRect = popoverRef.current!.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let top = anchorRect.bottom + 8;
      let left = anchorRect.left;

      // Adjust if popover goes off right edge
      if (left + popoverRect.width > viewportWidth - 16) {
        left = viewportWidth - popoverRect.width - 16;
      }

      // Adjust if popover goes off bottom edge
      if (top + popoverRect.height > viewportHeight - 16) {
        top = anchorRect.top - popoverRect.height - 8;
      }

      // Ensure minimum distance from edges
      left = Math.max(16, left);
      top = Math.max(16, top);

      setPosition({ top, left });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, anchorElement]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        anchorElement &&
        !anchorElement.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose, anchorElement]);

  if (!isOpen || !event) return null;

  const start = new Date(event.start);
  const end = new Date(event.end);
  const duration = Math.round((end.getTime() - start.getTime()) / (60 * 1000));
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  return (
    <div
      ref={popoverRef}
      className="fixed z-50 w-80 glass-card rounded-xl shadow-2xl border border-white/10 overflow-hidden"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {/* Color bar */}
      <div className="h-1" style={{ backgroundColor: event.color }} />

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-base font-['Playfair_Display'] font-semibold text-[#F5F5F5] mb-3">
          {event.title}
        </h3>

        {/* Time */}
        <div className="flex items-center gap-2 text-sm text-[#9CA3AF] mb-2">
          <span className="material-symbols-outlined text-base">schedule</span>
          <div>
            <div>
              {formatTime(start)} - {formatTime(end)}
            </div>
            <div className="text-xs">
              {hours > 0 && `${hours}h `}
              {minutes > 0 && `${minutes}m`}
            </div>
          </div>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 text-sm text-[#9CA3AF] mb-3">
          <span className="material-symbols-outlined text-base">calendar_today</span>
          <span>
            {start.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Recurrence */}
        {event.isRecurring && (
          <div className="flex items-center gap-2 text-sm text-[#C17A72] mb-3 bg-[#C17A72]/10 rounded-lg px-3 py-2">
            <span className="material-symbols-outlined text-base">refresh</span>
            <span className="capitalize">
              Repeats{" "}
              {event.recurrenceInterval && event.recurrenceInterval > 1
                ? `every ${event.recurrenceInterval} `
                : ""}
              {event.recurrenceFrequency || "weekly"}
              {event.recurrenceEndDate &&
                ` until ${new Date(event.recurrenceEndDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}`}
            </span>
          </div>
        )}

        {/* Description */}
        {event.description && (
          <div className="mb-3 pb-3 border-b border-white/5">
            <p className="text-xs text-[#BEC6DF] leading-relaxed">
              {event.description}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#F5F5F5] text-sm font-medium transition-colors"
          >
            <span className="material-symbols-outlined text-base">edit</span>
            Edit
          </button>
          <button
            onClick={onDelete}
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-red-400 text-sm font-medium transition-colors"
          >
            <span className="material-symbols-outlined text-base">delete</span>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
