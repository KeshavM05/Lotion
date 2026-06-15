'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { CalendarEvent, Tag } from '@/lib/store';
import { TAG_COLORS } from '@/lib/store';
import { toLocalDatetimeString } from '@/lib/utils';

interface EventPopoverEditorProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  anchorElement: HTMLElement | null;
  mode?: 'create' | 'edit';
  tags: Tag[];
  onClose: () => void;
  onSave: (data: {
    title: string;
    description: string;
    start: string;
    end: string;
    color: string;
    allDay: boolean;
    tagId: string | null;
  }) => void;
  onDelete: () => void;
  onCreateTag: (name: string, color: string) => Tag;
  onUpdateTag: (id: string, updates: Partial<Omit<Tag, 'id'>>) => void;
  onDeleteTag: (id: string) => void;
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
  mode = 'edit',
  tags,
  onClose,
  onSave,
  onDelete,
  onCreateTag,
  onUpdateTag,
  onDeleteTag,
}: EventPopoverEditorProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [color, setColor] = useState('#8b5cf6');
  const [allDay, setAllDay] = useState(false);
  const [tagId, setTagId] = useState<string | null>(null);

  const [tagDropdownOpen, setTagDropdownOpen] = useState(false);
  const [tagFilter, setTagFilter] = useState('');
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [editTagName, setEditTagName] = useState('');
  const [editTagColor, setEditTagColor] = useState('');

  const [position, setPosition] = useState({ top: 0, left: 0 });

  const popoverRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const saveRef = useRef<() => void>(() => {});
  const tagInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (event && isOpen) {
      setTitle(event.title);
      setDescription(event.description || '');
      setStart(toLocalDatetimeString(new Date(event.start)));
      setEnd(toLocalDatetimeString(new Date(event.end)));
      setColor(event.color);
      setAllDay(event.allDay || false);
      setTagId(event.tagId || null);
      setTagDropdownOpen(false);
      setTagFilter('');
      setEditingTag(null);
    }
  }, [event?.id, isOpen]);

  useEffect(() => {
    if (!isOpen || !anchorElement || !popoverRef.current) return;

    const updatePosition = () => {
      const anchorRect = anchorElement.getBoundingClientRect();
      const popoverRect = popoverRef.current!.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let left = anchorRect.right + 8;
      let top = anchorRect.top;

      if (left + popoverRect.width > viewportWidth - 16) {
        left = anchorRect.left - popoverRect.width - 8;
      }

      if (left < 16) {
        left = Math.max(16, (viewportWidth - popoverRect.width) / 2);
      }

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

  const hasChanges = () => {
    if (!event) return false;
    const origStart = toLocalDatetimeString(new Date(event.start));
    const origEnd = toLocalDatetimeString(new Date(event.end));
    return (
      title.trim() !== (event.title || '') ||
      description.trim() !== (event.description || '') ||
      start !== origStart ||
      end !== origEnd ||
      color !== event.color ||
      allDay !== (event.allDay || false) ||
      tagId !== (event.tagId || null)
    );
  };

  useEffect(() => {
    saveRef.current = handleSave;
  });

  useEffect(() => {
    if (!isOpen) return;

    titleInputRef.current?.focus();
    titleInputRef.current?.select();

    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        anchorElement &&
        !anchorElement.contains(e.target as Node)
      ) {
        if (mode === 'create') {
          onClose();
        } else {
          saveRef.current();
        }
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
  }, [isOpen, anchorElement, mode]);

  const handleSave = () => {
    if (!title.trim()) {
      onClose();
      return;
    }

    if (mode === 'edit' && !hasChanges()) {
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
      tagId,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
      e.preventDefault();
      handleSave();
    }
  };

  const assignedTag = tags.find((t) => t.id === tagId) || null;

  const filteredTags = tags.filter((t) => t.name.toLowerCase().includes(tagFilter.toLowerCase()));

  const showCreateOption =
    tagFilter.trim() && !tags.some((t) => t.name.toLowerCase() === tagFilter.toLowerCase());

  const handleSelectTag = (id: string) => {
    setTagId(id);
    const tag = tags.find((t) => t.id === id);
    if (tag) setColor(tag.color);
    setTagDropdownOpen(false);
    setTagFilter('');
  };

  const handleCreateAndAssign = () => {
    const newTag = onCreateTag(
      tagFilter.trim(),
      TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)]
    );
    setTagId(newTag.id);
    setColor(newTag.color);
    setTagDropdownOpen(false);
    setTagFilter('');
  };

  const handleRemoveTag = () => {
    setTagId(null);
    setEditingTag(null);
  };

  const handleDeleteTagGlobally = () => {
    if (editingTag) {
      onDeleteTag(editingTag.id);
      if (tagId === editingTag.id) setTagId(null);
      setEditingTag(null);
    }
  };

  if (!isOpen || !event) return null;

  const startDate = new Date(event.start);

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

        {/* Notes textarea */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add notes..."
          rows={2}
          className="w-full bg-transparent border border-transparent rounded-lg px-3 py-2 text-white text-xs placeholder-[#9CA3AF] focus:outline-none focus:bg-[#1F2D47] focus:border-[#C17A72] resize-none transition-colors"
        />

        {/* Inline Tag Picker */}
        <div className="relative">
          {editingTag ? (
            <div className="bg-[#1F2D47] border border-white/10 rounded-lg p-3 space-y-2">
              <input
                type="text"
                value={editTagName}
                onChange={(e) => setEditTagName(e.target.value)}
                onBlur={() => {
                  if (editTagName.trim() && editTagName !== editingTag.name) {
                    onUpdateTag(editingTag.id, { name: editTagName.trim() });
                  }
                }}
                className="w-full bg-transparent border border-white/10 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-[#C17A72]"
              />
              <div className="flex gap-1 flex-wrap">
                {TAG_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setEditTagColor(c);
                      onUpdateTag(editingTag.id, { color: c });
                      if (tagId === editingTag.id) setColor(c);
                    }}
                    className={`w-5 h-5 rounded-full transition-all ${
                      editTagColor === c ? 'ring-2 ring-white scale-110' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleRemoveTag}
                  className="text-xs text-[#9CA3AF] hover:text-white"
                >
                  Remove tag
                </button>
                <button
                  onClick={handleDeleteTagGlobally}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Delete tag
                </button>
                <button
                  onClick={() => setEditingTag(null)}
                  className="text-xs text-[#9CA3AF] hover:text-white ml-auto"
                >
                  Done
                </button>
              </div>
            </div>
          ) : assignedTag ? (
            <button
              onClick={() => {
                setEditingTag(assignedTag);
                setEditTagName(assignedTag.name);
                setEditTagColor(assignedTag.color);
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-white border border-white/10 hover:border-white/20 transition-colors"
              style={{ backgroundColor: assignedTag.color + '33' }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: assignedTag.color }}
              />
              {assignedTag.name}
            </button>
          ) : (
            <div className="relative">
              <div className="flex items-center gap-1.5 bg-transparent border border-white/10 rounded-lg px-2.5 py-1.5 focus-within:border-[#C17A72] transition-colors">
                <span className="material-symbols-outlined text-sm text-[#9CA3AF]">sell</span>
                <input
                  ref={tagInputRef}
                  type="text"
                  value={tagFilter}
                  onChange={(e) => {
                    setTagFilter(e.target.value);
                    if (!tagDropdownOpen) setTagDropdownOpen(true);
                  }}
                  onFocus={() => setTagDropdownOpen(true)}
                  placeholder="Add tag..."
                  className="flex-1 bg-transparent border-none outline-none text-white text-xs placeholder-[#9CA3AF]"
                />
              </div>
              {tagDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#1F2D47] border border-white/10 rounded-lg p-1.5 shadow-xl z-10 max-h-40 overflow-y-auto">
                  {filteredTags.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleSelectTag(t.id)}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/5 text-left"
                    >
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: t.color }}
                      />
                      <span className="text-xs text-white truncate">{t.name}</span>
                    </button>
                  ))}
                  {showCreateOption && (
                    <button
                      onClick={handleCreateAndAssign}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/5 text-left"
                    >
                      <span className="material-symbols-outlined text-sm text-[#C17A72]">add</span>
                      <span className="text-xs text-[#C17A72]">New: {tagFilter.trim()}</span>
                    </button>
                  )}
                  {filteredTags.length === 0 && !showCreateOption && (
                    <div className="px-2 py-1.5 text-xs text-[#9CA3AF]">No tags yet</div>
                  )}
                </div>
              )}
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
