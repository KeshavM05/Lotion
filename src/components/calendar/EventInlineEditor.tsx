'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { CalendarEvent } from '@/lib/store';

interface EventInlineEditorProps {
  event: CalendarEvent;
  onSave: (title: string, description: string) => void;
  onCancel: () => void;
  onDelete: () => void;
}

export default function EventInlineEditor({
  event,
  onSave,
  onCancel,
  onDelete,
}: EventInlineEditorProps) {
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description || '');
  const [showNotes, setShowNotes] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Focus title input on mount
    titleInputRef.current?.focus();
    titleInputRef.current?.select();

    // Click outside to save
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        handleSave();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSave = () => {
    if (title.trim()) {
      onSave(title.trim(), description.trim());
    } else {
      onCancel();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-50 flex flex-col bg-[#1F2D47] border border-[#C17A72] rounded-lg shadow-lg"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="flex-1 flex flex-col p-2 gap-2">
        {/* Title input */}
        <input
          ref={titleInputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add title"
          className="bg-transparent border-none outline-none text-white font-medium text-sm placeholder-[#9CA3AF]"
        />

        {/* Notes toggle button */}
        {!showNotes && (
          <button
            onClick={() => setShowNotes(true)}
            className="text-xs text-[#9CA3AF] hover:text-white text-left flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">notes</span>
            Notes
          </button>
        )}

        {/* Notes textarea */}
        {showNotes && (
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add notes..."
            className="flex-1 bg-transparent border-none outline-none text-white text-xs placeholder-[#9CA3AF] resize-none"
            rows={2}
          />
        )}
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-between border-t border-white/10 px-2 py-1.5">
        <button
          onClick={() => {
            if (confirm('Delete this event?')) {
              onDelete();
            }
          }}
          className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">delete</span>
          Delete
        </button>

        <div className="flex items-center gap-2">
          <button onClick={onCancel} className="text-xs text-[#9CA3AF] hover:text-white px-2 py-1">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="text-xs bg-[#C17A72] hover:bg-[#C17A72]/80 text-white px-3 py-1 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
