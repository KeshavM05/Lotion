'use client';

import {
  useStore,
  type EnergyLevel,
  type TimePreference,
  ENERGY_LABELS,
  TIME_PREFERENCE_LABELS,
} from '@/lib/store';

type ProjectFilter = 'all' | 'unassigned' | string;

interface ProjectsSidebarProps {
  projectFilter: ProjectFilter;
  onProjectFilterChange: (filter: ProjectFilter) => void;
}

interface AdvancedFiltersSidebarProps {
  filterEnergy: EnergyLevel | 'all';
  filterTimePreference: TimePreference | 'all';
  filterTag: string;
  allTags: string[];
  onEnergyChange: (value: EnergyLevel | 'all') => void;
  onTimePreferenceChange: (value: TimePreference | 'all') => void;
  onTagChange: (value: string) => void;
  onClear: () => void;
}

export function ProjectsSidebar({ projectFilter, onProjectFilterChange }: ProjectsSidebarProps) {
  const store = useStore();

  return (
    <div className="w-64 flex-shrink-0 glass-card rounded-2xl p-4 overflow-hidden flex flex-col">
      <div className="mb-4">
        <h3 className="text-sm font-['Space_Grotesk'] font-semibold text-[#F5F5F5] mb-1">
          Projects
        </h3>
        <p className="text-xs text-[#9CA3AF]">Filter by goal</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1">
        {/* All Projects */}
        <button
          onClick={() => onProjectFilterChange('all')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors ${
            projectFilter === 'all'
              ? 'bg-[#C17A72]/20 text-[#C17A72] border border-[#C17A72]/30'
              : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-base">inbox</span>
            <span className="text-xs font-medium">All Tasks</span>
          </div>
          <span className="text-xs font-['JetBrains_Mono']">
            {store.tasks.filter((t) => !t.completed).length}
          </span>
        </button>

        {/* Unassigned */}
        <button
          onClick={() => onProjectFilterChange('unassigned')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors ${
            projectFilter === 'unassigned'
              ? 'bg-[#C17A72]/20 text-[#C17A72] border border-[#C17A72]/30'
              : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-base">radio_button_unchecked</span>
            <span className="text-xs font-medium">No Project</span>
          </div>
          <span className="text-xs font-['JetBrains_Mono']">
            {store.tasks.filter((t) => !t.completed && !t.goalId).length}
          </span>
        </button>

        <div className="h-px bg-white/5 my-2" />

        {/* Goals as Projects */}
        {store.goals
          .filter((g) => g.status === 'active')
          .map((goal) => {
            const taskCount = store.tasks.filter(
              (t) => !t.completed && t.goalId === goal.id
            ).length;
            return (
              <button
                key={goal.id}
                onClick={() => onProjectFilterChange(goal.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors group ${
                  projectFilter === goal.id
                    ? 'bg-[#C17A72]/20 text-[#C17A72] border border-[#C17A72]/30'
                    : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: goal.color }}
                  />
                  <span className="text-xs font-medium truncate">{goal.title}</span>
                </div>
                <span className="text-xs font-['JetBrains_Mono'] ml-2 flex-shrink-0">
                  {taskCount}
                </span>
              </button>
            );
          })}
      </div>
    </div>
  );
}

export function AdvancedFiltersSidebar({
  filterEnergy,
  filterTimePreference,
  filterTag,
  allTags,
  onEnergyChange,
  onTimePreferenceChange,
  onTagChange,
  onClear,
}: AdvancedFiltersSidebarProps) {
  const hasActiveFilters =
    filterEnergy !== 'all' || filterTimePreference !== 'all' || filterTag !== 'all';

  return (
    <div className="w-64 flex-shrink-0 glass-card rounded-2xl p-4 overflow-hidden flex flex-col">
      <div className="mb-4">
        <h3 className="text-sm font-['Space_Grotesk'] font-semibold text-[#F5F5F5] mb-1">
          Advanced Filters
        </h3>
        <p className="text-xs text-[#9CA3AF]">Refine your task list</p>
      </div>

      <div className="space-y-4">
        {/* Energy Level Filter */}
        <div>
          <label className="text-xs font-medium text-[#BEC6DF] mb-2 block">Energy Level</label>
          <select
            value={filterEnergy}
            onChange={(e) => onEnergyChange(e.target.value as EnergyLevel | 'all')}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-[#C17A72]/50 cursor-pointer"
          >
            <option value="all">All Levels</option>
            {(['low', 'medium', 'high'] as EnergyLevel[]).map((level) => (
              <option key={level} value={level}>
                {ENERGY_LABELS[level]}
              </option>
            ))}
          </select>
        </div>

        {/* Time Preference Filter */}
        <div>
          <label className="text-xs font-medium text-[#BEC6DF] mb-2 block">Time Preference</label>
          <select
            value={filterTimePreference}
            onChange={(e) => onTimePreferenceChange(e.target.value as TimePreference | 'all')}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-[#C17A72]/50 cursor-pointer"
          >
            <option value="all">All Times</option>
            {(['morning', 'afternoon', 'evening', 'anytime'] as TimePreference[]).map((time) => (
              <option key={time} value={time}>
                {TIME_PREFERENCE_LABELS[time]}
              </option>
            ))}
          </select>
        </div>

        {/* Tag Filter */}
        <div>
          <label className="text-xs font-medium text-[#BEC6DF] mb-2 block">Tag</label>
          <select
            value={filterTag}
            onChange={(e) => onTagChange(e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-[#C17A72]/50 cursor-pointer"
          >
            <option value="all">All Tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="w-full px-3 py-2 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-[#9CA3AF] hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">clear</span>
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
