'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { getUserTimezone } from '@/lib/utils';
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
  const tz = getUserTimezone();

  return (
    <div className="flex items-center justify-between w-full">
      {/* Month/Year Display + Navigation */}
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-['Playfair_Display'] text-white">
          {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <span
          className="hidden sm:inline text-[10px] px-2 py-0.5 rounded font-medium"
          style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}
          title="Your detected timezone"
        >
          {tz}
        </span>
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
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold bg-[#C17A72] text-[#F5F5F5] transition-transform active:scale-95 duration-200 mr-2"
        >
          <span className="material-symbols-outlined text-lg">bolt</span>
          Auto-schedule
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
