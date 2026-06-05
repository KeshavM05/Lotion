'use client';

import type { Task, JournalEntry } from '@/lib/store';

interface StreakTrackerProps {
  tasks: Task[];
  journalEntries: JournalEntry[];
}

function computeStreak(dates: string[]): {
  current: number;
  longest: number;
  activeDays: Set<string>;
} {
  // Deduplicate dates at day granularity (YYYY-MM-DD)
  const daySet = new Set(dates.map((d) => d.slice(0, 10)));
  const today = new Date();

  let current = 0;
  let longest = 0;
  let streak = 0;

  // Walk backwards from today to count current streak
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (daySet.has(key)) {
      streak++;
      if (i === 0 || current > 0) current = streak;
    } else {
      if (i <= 1) {
        // allow missing today (not yet)
        if (i === 0) continue;
      }
      break;
    }
  }
  current = streak; // simplify: streak from today backward

  // Longest streak over all time
  const allDays = Array.from(daySet).sort();
  let run = 0;
  for (let i = 0; i < allDays.length; i++) {
    if (i === 0) {
      run = 1;
    } else {
      const prev = new Date(allDays[i - 1]);
      const curr = new Date(allDays[i]);
      const diffDays = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays === 1) {
        run++;
      } else {
        run = 1;
      }
    }
    if (run > longest) longest = run;
  }

  return { current, longest, activeDays: daySet };
}

export function StreakTracker({ tasks, journalEntries }: StreakTrackerProps) {
  const completedTaskDates = tasks
    .filter((t) => t.completed && t.completedAt)
    .map((t) => t.completedAt as string);

  const journalDates = journalEntries.map((e) => e.createdAt);

  const taskStreak = computeStreak(completedTaskDates);
  const journalStreak = computeStreak(journalDates);

  // Last 14 days heatmap
  const today = new Date();
  const last14 = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (13 - i));
    return d.toISOString().slice(0, 10);
  });

  return (
    <div className="space-y-6">
      {/* Streak cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Task streak */}
        <div className="bg-[#1F2D47]/50 border border-white/8 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="material-symbols-outlined text-[#C17A72]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              task_alt
            </span>
            <span className="text-xs font-['Space_Grotesk'] tracking-widest uppercase text-[#9CA3AF]">
              Task Streak
            </span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-['JetBrains_Mono'] text-[#F5F5F5]">
              {taskStreak.current}
            </span>
            <span className="text-[#9CA3AF] text-sm mb-1">days</span>
          </div>
          <p className="text-xs text-[#9CA3AF] mt-1">
            Longest:{' '}
            <span className="text-[#C17A72] font-['JetBrains_Mono']">{taskStreak.longest}</span>{' '}
            days
          </p>
        </div>

        {/* Journal streak */}
        <div className="bg-[#1F2D47]/50 border border-white/8 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="material-symbols-outlined text-[#C17A72]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              edit_note
            </span>
            <span className="text-xs font-['Space_Grotesk'] tracking-widest uppercase text-[#9CA3AF]">
              Journal Streak
            </span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-['JetBrains_Mono'] text-[#F5F5F5]">
              {journalStreak.current}
            </span>
            <span className="text-[#9CA3AF] text-sm mb-1">days</span>
          </div>
          <p className="text-xs text-[#9CA3AF] mt-1">
            Longest:{' '}
            <span className="text-[#C17A72] font-['JetBrains_Mono']">{journalStreak.longest}</span>{' '}
            days
          </p>
        </div>
      </div>

      {/* 14-day activity grid */}
      <div>
        <p className="text-xs font-['Space_Grotesk'] tracking-widest uppercase text-[#9CA3AF] mb-3">
          Last 14 Days
        </p>
        <div className="flex gap-1.5">
          {last14.map((day) => {
            const hasTask = taskStreak.activeDays.has(day);
            const hasJournal = journalStreak.activeDays.has(day);
            const both = hasTask && hasJournal;
            const either = hasTask || hasJournal;
            const label = new Date(day + 'T12:00:00').toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            });
            return (
              <div
                key={day}
                className="flex-1 flex flex-col items-center gap-1"
                title={`${label}: ${hasTask ? 'task' : ''}${both ? ' + ' : ''}${hasJournal ? 'journal' : ''}`}
              >
                <div
                  className="w-full rounded-md transition-all"
                  style={{
                    height: 28,
                    background: both
                      ? '#C17A72'
                      : hasTask
                        ? 'rgba(193,122,114,0.5)'
                        : hasJournal
                          ? 'rgba(193,122,114,0.25)'
                          : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${either ? 'rgba(193,122,114,0.3)' : 'rgba(255,255,255,0.05)'}`,
                  }}
                />
                <span className="text-[9px] text-[#9CA3AF]/60 font-['JetBrains_Mono']">
                  {new Date(day + 'T12:00:00').getDate()}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-[#C17A72]" />
            <span className="text-[10px] text-[#9CA3AF]">Both</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: 'rgba(193,122,114,0.5)' }} />
            <span className="text-[10px] text-[#9CA3AF]">Task only</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: 'rgba(193,122,114,0.25)' }} />
            <span className="text-[10px] text-[#9CA3AF]">Journal only</span>
          </div>
        </div>
      </div>
    </div>
  );
}
