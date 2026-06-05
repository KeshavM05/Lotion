'use client';

import { useState, useEffect } from 'react';
import { useTasks } from '@/lib/hooks/useTasks';
import { useGoals } from '@/lib/hooks/useGoals';

type ProjectFilter =
  | 'all'
  | 'overdue'
  | 'today'
  | 'tomorrow'
  | 'upcoming'
  | 'inbox'
  | 'unassigned'
  | string;

interface TasksSidebarProps {
  projectFilter: ProjectFilter;
  onProjectFilterChange: (filter: ProjectFilter) => void;
}

function useCollapsed(key: string, defaultValue: boolean): [boolean, () => void] {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return defaultValue;
    const stored = localStorage.getItem(`sidebar_collapsed_${key}`);
    return stored !== null ? stored === 'true' : defaultValue;
  });

  function toggle() {
    setCollapsed((v) => {
      const next = !v;
      localStorage.setItem(`sidebar_collapsed_${key}`, String(next));
      return next;
    });
  }

  return [collapsed, toggle];
}

function SidebarItem({
  id,
  icon,
  label,
  count,
  active,
  iconColor,
  onClick,
}: {
  id: string;
  icon: string;
  label: string;
  count: number;
  active: boolean;
  iconColor?: string;
  onClick: () => void;
}) {
  return (
    <button
      key={id}
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all group ${
        active
          ? 'bg-[#C17A72]/20 text-[#C17A72] border border-[#C17A72]/30'
          : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <span
          className="material-symbols-outlined text-sm flex-shrink-0"
          style={{ color: active ? '#C17A72' : (iconColor ?? undefined) }}
        >
          {icon}
        </span>
        <span className="text-xs font-medium truncate">{label}</span>
      </div>
      {count > 0 && (
        <span
          className="text-xs font-['JetBrains_Mono'] ml-2 flex-shrink-0 px-1.5 py-0.5 rounded"
          style={{
            background: active ? 'rgba(193,122,114,0.2)' : 'rgba(255,255,255,0.05)',
            color: active ? '#C17A72' : '#6B7280',
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function SectionHeader({
  label,
  collapsed,
  onToggle,
}: {
  label: string;
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-1.5 w-full px-1 py-1.5 text-left group"
    >
      <span
        className="material-symbols-outlined text-xs text-[#6B7280] group-hover:text-[#9CA3AF] transition-colors"
        style={{ fontSize: '14px' }}
      >
        {collapsed ? 'chevron_right' : 'expand_more'}
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7280] group-hover:text-[#9CA3AF] transition-colors font-['Space_Grotesk']">
        {label}
      </span>
    </button>
  );
}

export function TasksSidebar({ projectFilter, onProjectFilterChange }: TasksSidebarProps) {
  const { data: tasks = [] } = useTasks();
  const { data: goals = [] } = useGoals();

  const [listsCollapsed, toggleLists] = useCollapsed('lists', false);
  const [projectsCollapsed, toggleProjects] = useCollapsed('projects', false);

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);
  const tomorrowEnd = new Date(tomorrowStart);
  tomorrowEnd.setHours(23, 59, 59, 999);
  const weekEnd = new Date(todayStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const todayEnd = new Date(todayStart);
  todayEnd.setHours(23, 59, 59, 999);

  const incompleteTasks = tasks.filter((t) => !t.completed);

  const counts = {
    all: incompleteTasks.length,
    overdue: incompleteTasks.filter((t) => t.deadline && new Date(t.deadline) < todayStart).length,
    today: incompleteTasks.filter(
      (t) => t.deadline && new Date(t.deadline) >= todayStart && new Date(t.deadline) <= todayEnd
    ).length,
    tomorrow: incompleteTasks.filter(
      (t) =>
        t.deadline && new Date(t.deadline) >= tomorrowStart && new Date(t.deadline) <= tomorrowEnd
    ).length,
    upcoming: incompleteTasks.filter(
      (t) => t.deadline && new Date(t.deadline) > tomorrowEnd && new Date(t.deadline) <= weekEnd
    ).length,
    inbox: incompleteTasks.filter((t) => !t.deadline).length,
    unassigned: incompleteTasks.filter((t) => !t.goalId).length,
  };

  const systemItems = [
    {
      id: 'all',
      icon: 'inbox',
      label: 'All Tasks',
      count: counts.all,
      iconColor: undefined,
    },
    counts.overdue > 0
      ? {
          id: 'overdue',
          icon: 'warning',
          label: 'Overdue',
          count: counts.overdue,
          iconColor: '#C17A72',
        }
      : null,
    { id: 'today', icon: 'today', label: 'Due Today', count: counts.today, iconColor: '#BEC6DF' },
    {
      id: 'tomorrow',
      icon: 'event',
      label: 'Tomorrow',
      count: counts.tomorrow,
      iconColor: '#9CA3AF',
    },
    {
      id: 'upcoming',
      icon: 'date_range',
      label: 'This Week',
      count: counts.upcoming,
      iconColor: '#9CA3AF',
    },
    {
      id: 'inbox',
      icon: 'radio_button_unchecked',
      label: 'No Due Date',
      count: counts.inbox,
      iconColor: '#6B7280',
    },
  ].filter(Boolean) as {
    id: string;
    icon: string;
    label: string;
    count: number;
    iconColor: string | undefined;
  }[];

  const activeGoals = goals.filter((g) => g.status === 'active');

  return (
    <div className="w-56 flex-shrink-0 glass-card rounded-2xl overflow-hidden flex flex-col">
      {/* System lists — always visible */}
      <div className="p-3 space-y-0.5">
        {systemItems.map((item) => (
          <SidebarItem
            key={item.id}
            id={item.id}
            icon={item.icon}
            label={item.label}
            count={item.count}
            active={projectFilter === item.id}
            iconColor={item.iconColor}
            onClick={() => onProjectFilterChange(item.id)}
          />
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-white/5 mx-3" />

      {/* Projects section */}
      {activeGoals.length > 0 && (
        <div className="p-3 pt-2">
          <SectionHeader label="Projects" collapsed={projectsCollapsed} onToggle={toggleProjects} />
          {!projectsCollapsed && (
            <div className="mt-1 space-y-0.5">
              {activeGoals.map((goal) => {
                const taskCount = incompleteTasks.filter((t) => t.goalId === goal.id).length;
                return (
                  <button
                    key={goal.id}
                    onClick={() => onProjectFilterChange(goal.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all ${
                      projectFilter === goal.id
                        ? 'bg-[#C17A72]/20 text-[#C17A72] border border-[#C17A72]/30'
                        : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: goal.color }}
                      />
                      <span className="text-xs font-medium truncate">{goal.title}</span>
                    </div>
                    {taskCount > 0 && (
                      <span
                        className="text-xs font-['JetBrains_Mono'] ml-2 flex-shrink-0 px-1.5 py-0.5 rounded"
                        style={{
                          background:
                            projectFilter === goal.id
                              ? 'rgba(193,122,114,0.2)'
                              : 'rgba(255,255,255,0.05)',
                          color: projectFilter === goal.id ? '#C17A72' : '#6B7280',
                        }}
                      >
                        {taskCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Unassigned shortcut */}
      <div className="px-3 pb-3">
        <SidebarItem
          id="unassigned"
          icon="layers_clear"
          label="No Project"
          count={counts.unassigned}
          active={projectFilter === 'unassigned'}
          onClick={() => onProjectFilterChange('unassigned')}
        />
      </div>
    </div>
  );
}
