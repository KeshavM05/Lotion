'use client';

import React, { memo } from 'react';
import type { CalendarEvent } from '@/lib/store';
import { formatTime } from '@/lib/utils';

interface EventCardProps {
  event: CalendarEvent;
  isDragging: boolean;
  isResizing: boolean;
  isSelected: boolean;
  layout: {
    left: string;
    right?: string;
    width?: string;
    zIndex: number;
  };
  style: {
    top: string;
    height: string;
    backgroundColor: string;
  };
  onMouseDown: (e: React.MouseEvent) => void;
  onClick: (e: React.MouseEvent) => void;
  onDoubleClick: (e: React.MouseEvent) => void;
  onResizeStart: (edge: 'top' | 'bottom', e: React.MouseEvent) => void;
}

const EventCard = memo(function EventCard({
  event,
  isDragging,
  isResizing,
  isSelected,
  layout,
  style,
  onMouseDown,
  onClick,
  onDoubleClick,
  onResizeStart,
}: EventCardProps) {
  return (
    <div
      className={`absolute rounded-lg px-2 py-1.5 text-white text-xs font-medium overflow-hidden hover:z-20 shadow-lg border group ${
        isDragging ? 'opacity-50' : ''
      } ${isResizing ? 'select-none' : 'cursor-move'} ${
        isSelected ? 'ring-2 ring-white/80 border-white/50 brightness-[0.7]' : 'border-white/10'
      }`}
      style={{
        ...style,
        left: layout.left,
        right: layout.right,
        width: layout.width,
        zIndex: isSelected ? 30 : layout.zIndex,
        boxShadow: isSelected ? `0 2px 12px ${event.color}90` : `0 2px 8px ${event.color}60`,
      }}
      onMouseDown={onMouseDown}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      {/* Top resize handle */}
      <div
        className="resize-handle absolute top-0 left-0 right-0 h-1 cursor-ns-resize opacity-0 group-hover:opacity-100 bg-white/30 rounded-t-lg"
        onMouseDown={(e) => onResizeStart('top', e)}
      />
      <div className="font-semibold truncate">{event.title}</div>
      <div className="text-[10px] opacity-90 mt-0.5">{formatTime(new Date(event.start))}</div>
      {/* Bottom resize handle */}
      <div
        className="resize-handle absolute bottom-0 left-0 right-0 h-1 cursor-ns-resize opacity-0 group-hover:opacity-100 bg-white/30 rounded-b-lg"
        onMouseDown={(e) => onResizeStart('bottom', e)}
      />
    </div>
  );
});

export default EventCard;
