'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { MONTHS, type ViewMode } from './types';

interface CalendarHeaderProps {
  currentDate: Date;
  viewMode: ViewMode;
  onNavigate: (direction: 'prev' | 'next' | 'today') => void;
  onViewChange: (mode: ViewMode) => void;
}

export default function CalendarHeader({
  currentDate,
  viewMode,
  onNavigate,
  onViewChange,
}: CalendarHeaderProps) {
  const store = useStore();

  return (
    <div className="flex items-center justify-between w-full">
      {/* Month/Year Display + Navigation */}
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-['Playfair_Display'] text-white">
          {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('prev')}
            className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-[#9CA3AF] hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-lg">chevron_left</span>
          </button>
          <button
            onClick={() => onNavigate('today')}
            className="px-3 py-1.5 rounded-lg text-sm font-medium border border-white/10 text-[#F5F5F5] hover:bg-white/5 transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => onNavigate('next')}
            className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-[#9CA3AF] hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-lg">chevron_right</span>
          </button>
        </div>
      </div>

      {/* View Mode Switcher + Auto-Schedule */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => store.autoSchedule()}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white shadow-lg hover:shadow-xl transition-all mr-2"
        >
          <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
          Auto-Schedule
        </button>
        {(['day', 'week', 'month'] as ViewMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => onViewChange(mode)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
              viewMode === mode
                ? 'bg-[#C17A72] text-white'
                : 'border border-white/10 text-[#9CA3AF] hover:text-white hover:bg-white/5'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>
    </div>
  );
}
