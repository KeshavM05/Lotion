'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { CalendarEvent } from '@/lib/store';
import { formatTime, toLocalDatetimeString } from '@/lib/utils';

interface EventPopoverEditorProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  anchorElement: HTMLElement | null;
  onClose: () => void;
  onSave: (data: {
    title: string;
    description: string;
    start: string;
    end: string;
    color: string;
    allDay: boolean;
  }) => void;
  onDelete: () => void;
}

const COLORS = [
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Green', value: '#10b981' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Red', value: '#ef4444' },
];

export function EventPopoverEditor({
  event,
  isOpen,
  anchorElement,
  onClose,
  onSave,
  onDelete,
}: EventPopoverEditorProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [color, setColor] = useState('#8b5cf6');
  const [allDay, setAllDay] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const popoverRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || '');
      setStart(toLocalDatetimeString(new Date(event.start)));
      setEnd(toLocalDatetimeString(new Date(event.end)));
      setColor(event.color);
      setAllDay(event.allDay || false);
      setShowNotes(!!event.description);
    }
  }, [event]);

  useEffect(() => {
    if (!isOpen || !anchorElement || !popoverRef.current) return;

    const updatePosition = () => {
      const anchorRect = anchorElement.getBoundingClientRect();
      const popoverRect = popoverRef.current!.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Try to position to the right of the event
      let left = anchorRect.right + 8;
      let top = anchorRect.top;

      // If it goes off the right edge, position to the left
      if (left + popoverRect.width > viewportWidth - 16) {
        left = anchorRect.left - popoverRect.width - 8;
      }

      // If still off screen, center it
      if (left < 16) {
        left = Math.max(16, (viewportWidth - popoverRect.width) / 2);
      }

      // Adjust vertical position if needed
      if (top + popoverRect.height > viewportHeight - 16) {
        top = Math.max(16, viewportHeight - popoverRect.height - 16);
      }

      setPosition({ top, left });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, anchorElement]);

  useEffect(() => {
    if (!isOpen) return;

    // Focus title input
    titleInputRef.current?.focus();
    titleInputRef.current?.select();

    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        anchorElement &&
        !anchorElement.contains(e.target as Node)
      ) {
        handleSave();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, anchorElement]);

  const handleSave = () => {
    if (!title.trim()) {
      onClose();
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      start,
      end,
      color,
      allDay,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
      e.preventDefault();
      handleSave();
    }
  };

  if (!isOpen || !event) return null;

  const startDate = new Date(event.start);
  const endDate = new Date(event.end);

  return (
    <div
      ref={popoverRef}
      className="fixed z-[100] w-80 bg-[#1A2744] rounded-xl shadow-2xl border border-white/10"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onKeyDown={handleKeyDown}
    >
      {/* Color bar */}
      <div className="h-1 rounded-t-xl" style={{ backgroundColor: color }} />

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <input
          ref={titleInputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add title"
          className="w-full bg-transparent border-none outline-none text-white font-semibold text-base placeholder-[#9CA3AF]"
        />

        {/* Notes button/textarea */}
        {!showNotes ? (
          <button
            onClick={() => setShowNotes(true)}
            className="text-xs text-[#9CA3AF] hover:text-white flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">notes</span>
            Notes
          </button>
        ) : (
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add notes..."
            rows={2}
            className="w-full bg-[#1F2D47] border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder-[#9CA3AF] focus:outline-none focus:border-[#C17A72] resize-none"
          />
        )}

        {/* Tag and color */}
        <div className="relative">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="text-xs text-[#9CA3AF] hover:text-white flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">palette</span>
            Tag and color
          </button>
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 flex gap-1 bg-[#1F2D47] border border-white/10 rounded-lg p-2 shadow-xl z-10">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => {
                    setColor(c.value);
                    setShowColorPicker(false);
                  }}
                  className={`w-6 h-6 rounded-full transition-all ${
                    color === c.value ? 'ring-2 ring-white scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
          )}
        </div>

        {/* All-day toggle */}
        <div className="flex items-center justify-between py-2 border-t border-white/5">
          <span className="text-xs text-[#9CA3AF]">all-day</span>
          <button
            onClick={() => setAllDay(!allDay)}
            className={`relative w-9 h-5 rounded-full transition-colors ${
              allDay ? 'bg-[#C17A72]' : 'bg-white/10'
            }`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                allDay ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Times */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#9CA3AF] w-12">starts</span>
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="flex-1 bg-[#1F2D47] border border-white/10 rounded px-2 py-1 text-white focus:outline-none focus:border-[#C17A72]"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#9CA3AF] w-12">ends</span>
            <input
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="flex-1 bg-[#1F2D47] border border-white/10 rounded px-2 py-1 text-white focus:outline-none focus:border-[#C17A72]"
            />
          </div>
        </div>

        {/* Timezone */}
        <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
          <span className="material-symbols-outlined text-sm">public</span>
          <span>
            {startDate
              .toLocaleString('en-US', {
                timeZoneName: 'short',
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              })
              .split(', ')[2] || 'America/Toronto'}
          </span>
        </div>

        {/* Repeat (placeholder) */}
        <div className="text-xs text-[#9CA3AF] flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">refresh</span>
          No repeat
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-white/10 px-4 py-3">
        <button onClick={() => onDelete()} className="text-xs text-red-400 hover:text-red-300">
          Delete
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="text-xs text-[#9CA3AF] hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="text-xs bg-[#C17A72] hover:bg-[#C17A72]/80 text-white px-4 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
