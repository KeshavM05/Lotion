'use client';

import { useState, useRef, useEffect } from 'react';
import { type GroupMode } from '@/lib/task-utils';

export type SortField = 'priority' | 'deadline' | 'created' | 'updated' | 'title';
export type SortDir = 'asc' | 'desc';

export interface ViewOptions {
  groupMode: GroupMode;
  sortField: SortField;
  sortDir: SortDir;
  hideCompleted: boolean;
  hideEmptyGroups: boolean;
}

export const DEFAULT_VIEW_OPTIONS: ViewOptions = {
  groupMode: 'none',
  sortField: 'priority',
  sortDir: 'desc',
  hideCompleted: false,
  hideEmptyGroups: true,
};

interface ViewOptionsMenuProps {
  options: ViewOptions;
  onChange: (opts: ViewOptions) => void;
}

const GROUP_LABELS: Record<GroupMode, string> = {
  none: 'None',
  time: 'Due Date',
  status: 'Status',
  priority: 'Priority',
};

const SORT_LABELS: Record<SortField, string> = {
  priority: 'Priority',
  deadline: 'Due Date',
  created: 'Date Created',
  updated: 'Date Updated',
  title: 'Title',
};

export function ViewOptionsMenu({ options, onChange }: ViewOptionsMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  function update(patch: Partial<ViewOptions>) {
    onChange({ ...options, ...patch });
  }

  const hasCustomOptions =
    options.groupMode !== DEFAULT_VIEW_OPTIONS.groupMode ||
    options.sortField !== DEFAULT_VIEW_OPTIONS.sortField ||
    options.sortDir !== DEFAULT_VIEW_OPTIONS.sortDir ||
    options.hideCompleted !== DEFAULT_VIEW_OPTIONS.hideCompleted;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
          open || hasCustomOptions
            ? 'bg-[#C17A72]/20 text-[#C17A72] border border-[#C17A72]/30'
            : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'
        }`}
        title="View options"
      >
        <span className="material-symbols-outlined text-sm">tune</span>
        <span>View</span>
        {hasCustomOptions && (
          <span className="w-1.5 h-1.5 rounded-full bg-[#C17A72] flex-shrink-0" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 glass-card rounded-xl border border-white/10 shadow-xl z-50 overflow-hidden">
          <div className="p-3 border-b border-white/5">
            <p className="text-xs font-semibold text-[#BEC6DF] font-['Space_Grotesk'] uppercase tracking-wider">
              View Options
            </p>
          </div>

          {/* Group By */}
          <div className="p-3 border-b border-white/5">
            <p className="text-[10px] uppercase tracking-wider text-[#6B7280] mb-2">Group By</p>
            <div className="grid grid-cols-2 gap-1">
              {(Object.keys(GROUP_LABELS) as GroupMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => update({ groupMode: mode })}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-colors ${
                    options.groupMode === mode
                      ? 'bg-[#C17A72]/20 text-[#C17A72] border border-[#C17A72]/30'
                      : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {GROUP_LABELS[mode]}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div className="p-3 border-b border-white/5">
            <p className="text-[10px] uppercase tracking-wider text-[#6B7280] mb-2">Sort By</p>
            <div className="flex flex-col gap-1">
              {(Object.keys(SORT_LABELS) as SortField[]).map((field) => (
                <button
                  key={field}
                  onClick={() => {
                    if (options.sortField === field) {
                      update({ sortDir: options.sortDir === 'asc' ? 'desc' : 'asc' });
                    } else {
                      update({ sortField: field, sortDir: field === 'title' ? 'asc' : 'desc' });
                    }
                  }}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    options.sortField === field
                      ? 'bg-[#C17A72]/20 text-[#C17A72] border border-[#C17A72]/30'
                      : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{SORT_LABELS[field]}</span>
                  {options.sortField === field && (
                    <span className="material-symbols-outlined text-xs">
                      {options.sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="p-3 border-b border-white/5 space-y-2">
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-xs text-[#9CA3AF] group-hover:text-white transition-colors">
                Hide completed tasks
              </span>
              <div
                onClick={() => update({ hideCompleted: !options.hideCompleted })}
                className={`w-8 h-4 rounded-full transition-colors relative ${
                  options.hideCompleted ? 'bg-[#C17A72]' : 'bg-white/10'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${
                    options.hideCompleted ? 'translate-x-4' : 'translate-x-0.5'
                  }`}
                />
              </div>
            </label>
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-xs text-[#9CA3AF] group-hover:text-white transition-colors">
                Hide empty groups
              </span>
              <div
                onClick={() => update({ hideEmptyGroups: !options.hideEmptyGroups })}
                className={`w-8 h-4 rounded-full transition-colors relative ${
                  options.hideEmptyGroups ? 'bg-[#C17A72]' : 'bg-white/10'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${
                    options.hideEmptyGroups ? 'translate-x-4' : 'translate-x-0.5'
                  }`}
                />
              </div>
            </label>
          </div>

          {/* Reset */}
          {hasCustomOptions && (
            <div className="p-3">
              <button
                onClick={() => onChange(DEFAULT_VIEW_OPTIONS)}
                className="w-full px-3 py-2 rounded-lg text-xs text-[#9CA3AF] hover:text-white bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">restart_alt</span>
                Reset to defaults
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
