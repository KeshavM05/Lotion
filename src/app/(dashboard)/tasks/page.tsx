'use client';

import { useState, useEffect } from 'react';
import {
  useStore,
  type Task,
  type Priority,
  type TaskStatus,
  type EnergyLevel,
  type TimePreference,
  PRIORITY_LABELS,
  ENERGY_LABELS,
  TIME_PREFERENCE_LABELS,
} from '@/lib/store';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '@/lib/hooks/useTasks';
import { useGoals } from '@/lib/hooks/useGoals';
import { Modal } from '@/components/ui/modal';
import { formatRelativeDate } from '@/lib/utils';
import { usePageHeader } from '@/lib/page-header-context';
import { groupByTime, groupByStatus, groupByPriority, type GroupMode } from '@/lib/task-utils';

type FilterTab = 'all' | 'today' | 'upcoming' | 'completed';
type ViewMode = 'list' | 'board';
type ProjectFilter = 'all' | 'unassigned' | string;

const PRIORITY_DOTS: Record<Priority, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#3b82f6',
};

const GROUP_ICONS: Record<string, string> = {
  overdue: 'warning',
  today: 'today',
  tomorrow: 'event',
  this_week: 'date_range',
  later: 'schedule',
  no_due_date: 'remove_circle_outline',
  todo: 'radio_button_unchecked',
  in_progress: 'pending',
  done: 'check_circle',
  cancelled: 'cancel',
  critical: 'priority_high',
  high: 'keyboard_arrow_up',
  medium: 'remove',
  low: 'keyboard_arrow_down',
};

export default function TasksPage() {
  const { data: tasks = [] } = useTasks();
  const { data: goals = [] } = useGoals();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  // store kept for compatibility with shared components
  const store = useStore();
  void store;
  const { setPageControls } = usePageHeader();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [groupMode, setGroupMode] = useState<GroupMode>('none');
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [projectFilter, setProjectFilter] = useState<ProjectFilter>('all');
  const [showProjects, setShowProjects] = useState(true);

  // Advanced filters
  const [filterEnergy, setFilterEnergy] = useState<EnergyLevel | 'all'>('all');
  const [filterTimePreference, setFilterTimePreference] = useState<TimePreference | 'all'>('all');
  const [filterTag, setFilterTag] = useState<string>('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPriority, setFormPriority] = useState<Priority>('medium');
  const [formDuration, setFormDuration] = useState(30);
  const [formDeadline, setFormDeadline] = useState('');
  const [formGoalId, setFormGoalId] = useState('');
  const [formEnergyLevel, setFormEnergyLevel] = useState<EnergyLevel>('medium');
  const [formTimePreference, setFormTimePreference] = useState<TimePreference>('anytime');
  const [formTags, setFormTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  function openCreate() {
    setEditingTask(null);
    setFormTitle('');
    setFormDescription('');
    setFormPriority('medium');
    setFormDuration(30);
    setFormDeadline('');
    setFormGoalId('');
    setFormEnergyLevel('medium');
    setFormTimePreference('anytime');
    setFormTags([]);
    setModalOpen(true);
  }

  function openEdit(task: Task) {
    setEditingTask(task);
    setFormTitle(task.title);
    setFormDescription(task.description);
    setFormPriority(task.priority);
    setFormDuration(task.durationMinutes);
    setFormEnergyLevel(task.energyLevel || 'medium');
    setFormTimePreference(task.timePreference || 'anytime');
    setFormTags(task.tags || []);
    setFormDeadline(task.deadline ? task.deadline.split('T')[0] : '');
    setFormGoalId(task.goalId || '');
    setModalOpen(true);
  }

  function handleSave() {
    if (!formTitle.trim()) return;
    const data = {
      title: formTitle.trim(),
      description: formDescription.trim(),
      priority: formPriority,
      durationMinutes: formDuration,
      deadline: formDeadline ? new Date(formDeadline).toISOString() : null,
      goalId: formGoalId || null,
      energyLevel: formEnergyLevel,
      timePreference: formTimePreference,
      tags: formTags,
    };
    if (editingTask) {
      updateTaskMutation.mutate({ id: editingTask.id, updates: data });
    } else {
      createTaskMutation.mutate({
        ...data,
        status: 'todo',
        milestoneId: null,
        listId: null,
        scheduledStart: null,
        scheduledEnd: null,
      });
    }
    setModalOpen(false);
  }

  function toggleComplete(task: Task) {
    const done = !task.completed;
    updateTaskMutation.mutate({
      id: task.id,
      updates: {
        completed: done,
        status: done ? 'done' : 'todo',
        completedAt: done ? new Date().toISOString() : null,
      },
    });
  }

  function toggleGroup(key: string) {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const now = new Date();
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  const filtered = tasks.filter((t) => {
    let tabMatch = false;
    switch (activeTab) {
      case 'all':
        tabMatch = !t.completed;
        break;
      case 'today':
        tabMatch = !t.completed && !!t.deadline && new Date(t.deadline) <= todayEnd;
        break;
      case 'upcoming':
        tabMatch = !t.completed && !!t.deadline && new Date(t.deadline) > todayEnd;
        break;
      case 'completed':
        tabMatch = t.completed;
        break;
    }
    if (!tabMatch) return false;

    if (projectFilter === 'unassigned') {
      if (t.goalId) return false;
    } else if (projectFilter !== 'all') {
      if (t.goalId !== projectFilter) return false;
    }

    if (filterEnergy !== 'all' && t.energyLevel !== filterEnergy) return false;
    if (filterTimePreference !== 'all' && t.timePreference !== filterTimePreference) return false;
    if (filterTag !== 'all' && (!t.tags || !t.tags.includes(filterTag))) return false;

    return true;
  });

  const pw: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };
  const sorted = [...filtered].sort((a, b) => {
    if (pw[b.priority] !== pw[a.priority]) return pw[b.priority] - pw[a.priority];
    const da = a.deadline ? new Date(a.deadline).getTime() : Infinity;
    const db = b.deadline ? new Date(b.deadline).getTime() : Infinity;
    return da - db;
  });

  const allTags = Array.from(new Set(tasks.flatMap((t) => t.tags || [])));

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: tasks.filter((t) => !t.completed).length },
    {
      key: 'today',
      label: 'Today',
      count: tasks.filter((t) => !t.completed && t.deadline && new Date(t.deadline) <= todayEnd)
        .length,
    },
    {
      key: 'upcoming',
      label: 'Upcoming',
      count: tasks.filter((t) => !t.completed && t.deadline && new Date(t.deadline) > todayEnd)
        .length,
    },
    { key: 'completed', label: 'Done', count: tasks.filter((t) => t.completed).length },
  ];

  const groups =
    groupMode === 'time'
      ? groupByTime(sorted)
      : groupMode === 'status'
        ? groupByStatus(sorted)
        : groupMode === 'priority'
          ? groupByPriority(sorted)
          : null;

  useEffect(() => {
    setPageControls(
      <div className="flex items-center justify-between w-full">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-[#C17A72]/20 text-[#C17A72] border border-[#C17A72]/30'
                  : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
              {tab.count > 0 && <span className="ml-1.5 opacity-60">{tab.count}</span>}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Group mode toggle */}
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
            {(
              [
                { mode: 'none', icon: 'format_list_bulleted', title: 'No grouping' },
                { mode: 'time', icon: 'schedule', title: 'Group by time' },
                { mode: 'status', icon: 'flag', title: 'Group by status' },
                { mode: 'priority', icon: 'priority_high', title: 'Group by priority' },
              ] as const
            ).map(({ mode, icon, title }) => (
              <button
                key={mode}
                onClick={() => setGroupMode(mode)}
                title={title}
                className={`px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${
                  groupMode === mode ? 'bg-[#C17A72] text-white' : 'text-[#9CA3AF] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{icon}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAdvancedFilters((v) => !v)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              showAdvancedFilters ||
              filterEnergy !== 'all' ||
              filterTimePreference !== 'all' ||
              filterTag !== 'all'
                ? 'bg-[#C17A72]/20 text-[#C17A72]'
                : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'
            }`}
            title="Advanced filters"
          >
            <span className="material-symbols-outlined text-sm">filter_list</span>
          </button>
          <button
            onClick={() => setShowProjects((v) => !v)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              showProjects
                ? 'bg-[#C17A72]/20 text-[#C17A72]'
                : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'
            }`}
            title="Toggle projects sidebar"
          >
            <span className="material-symbols-outlined text-sm">folder</span>
          </button>
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                viewMode === 'list' ? 'bg-[#C17A72] text-white' : 'text-[#9CA3AF] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-sm">view_list</span>
            </button>
            <button
              onClick={() => setViewMode('board')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                viewMode === 'board' ? 'bg-[#C17A72] text-white' : 'text-[#9CA3AF] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-sm">view_kanban</span>
            </button>
          </div>
          <button
            onClick={openCreate}
            className="btn-glow px-4 py-2 rounded-xl text-sm font-medium"
          >
            <span className="material-symbols-outlined text-base mr-1">add</span>
            New Task
          </button>
        </div>
      </div>
    );

    return () => setPageControls(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeTab,
    viewMode,
    groupMode,
    showProjects,
    showAdvancedFilters,
    filterEnergy,
    filterTimePreference,
    filterTag,
    tabs,
    setPageControls,
  ]);

  function handleDragStart(task: Task, e: React.DragEvent) {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedTask(task);
  }

  function handleDragEnd() {
    setDraggedTask(null);
  }

  function handleDrop(newStatus: TaskStatus, e: React.DragEvent) {
    e.preventDefault();
    if (!draggedTask) return;
    updateTaskMutation.mutate({
      id: draggedTask.id,
      updates: {
        status: newStatus,
        completed: newStatus === 'done',
        completedAt: newStatus === 'done' ? new Date().toISOString() : null,
      },
    });
    setDraggedTask(null);
  }

  function renderTaskRow(task: Task) {
    const goal = task.goalId ? goals.find((g) => g.id === task.goalId) : null;
    const overdue = task.deadline && !task.completed && new Date(task.deadline) < now;

    return (
      <div
        key={task.id}
        className="flex items-center gap-3 px-4 py-3 rounded-xl group cursor-pointer transition-colors hover:bg-white/[0.02]"
        onClick={() => openEdit(task)}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleComplete(task);
          }}
          className="w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors"
          style={{
            borderColor: task.completed ? '#C17A72' : 'rgba(255,255,255,0.1)',
            background: task.completed ? '#C17A72' : 'transparent',
          }}
        >
          {task.completed && (
            <span
              className="material-symbols-outlined text-xs text-white"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check
            </span>
          )}
        </button>
        <div className="flex-1 min-w-0">
          <span
            className={`text-sm ${task.completed ? 'line-through text-[#9CA3AF]' : 'text-[#F5F5F5]'}`}
          >
            {task.title}
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            {goal && (
              <span className="flex items-center gap-1 text-[10px] text-[#9CA3AF]">
                <span className="w-2 h-2 rounded-full" style={{ background: goal.color }} />
                {goal.title}
              </span>
            )}
            {task.deadline && (
              <span className={`text-[10px] ${overdue ? 'text-[#ef4444]' : 'text-[#9CA3AF]'}`}>
                {formatRelativeDate(task.deadline)}
              </span>
            )}
            <span className="text-[10px] text-[#9CA3AF] font-['JetBrains_Mono']">
              {task.durationMinutes}m
            </span>
            {task.scheduledStart && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#C17A72]/20 text-[#C17A72]">
                Scheduled
              </span>
            )}
          </div>
        </div>
        <span
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ background: PRIORITY_DOTS[task.priority] }}
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteTaskMutation.mutate(task.id);
          }}
          className="opacity-0 group-hover:opacity-100 p-1 rounded transition-all text-[#9CA3AF] hover:text-[#ef4444]"
        >
          <span className="material-symbols-outlined text-sm">delete</span>
        </button>
      </div>
    );
  }

  function renderListContent() {
    if (!groups) {
      if (sorted.length === 0) {
        return (
          <div className="text-center py-20 text-[#9CA3AF]">
            <span className="material-symbols-outlined text-4xl mb-3 block opacity-40">
              task_alt
            </span>
            <p className="text-sm font-['Playfair_Display'] text-[#BEC6DF]">
              {activeTab === 'completed' ? 'No completed tasks' : 'No tasks yet'}
            </p>
          </div>
        );
      }
      return <div className="space-y-1 max-w-3xl">{sorted.map(renderTaskRow)}</div>;
    }

    if (groups.length === 0) {
      return (
        <div className="text-center py-20 text-[#9CA3AF]">
          <span className="material-symbols-outlined text-4xl mb-3 block opacity-40">task_alt</span>
          <p className="text-sm font-['Playfair_Display'] text-[#BEC6DF]">No tasks yet</p>
        </div>
      );
    }

    return (
      <div className="space-y-6 max-w-3xl">
        {groups.map((group) => {
          const isCollapsed = collapsedGroups.has(group.key);
          const isOverdue = group.key === 'overdue';
          const icon = GROUP_ICONS[group.key] ?? 'folder';

          return (
            <div key={group.key}>
              <button
                onClick={() => toggleGroup(group.key)}
                className="flex items-center gap-2 mb-2 w-full text-left"
              >
                <span
                  className="material-symbols-outlined text-sm"
                  style={{ color: isOverdue ? '#C17A72' : '#9CA3AF' }}
                >
                  {isCollapsed ? 'chevron_right' : 'expand_more'}
                </span>
                <span
                  className="material-symbols-outlined text-sm"
                  style={{ color: isOverdue ? '#C17A72' : '#9CA3AF' }}
                >
                  {icon}
                </span>
                <span
                  className="text-xs font-semibold font-['Space_Grotesk'] uppercase tracking-wider"
                  style={{ color: isOverdue ? '#C17A72' : '#9CA3AF' }}
                >
                  {group.label}
                </span>
                <span
                  className="text-xs px-1.5 py-0.5 rounded font-['JetBrains_Mono']"
                  style={{
                    background: isOverdue ? 'rgba(193,122,114,0.15)' : 'rgba(255,255,255,0.05)',
                    color: isOverdue ? '#C17A72' : '#6B7280',
                  }}
                >
                  {group.tasks.length}
                </span>
              </button>
              {!isCollapsed && (
                <div className="space-y-1 pl-2 border-l border-white/5">
                  {group.tasks.map(renderTaskRow)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex gap-6 h-full">
      {/* Projects Sidebar */}
      {showProjects && (
        <div className="w-64 flex-shrink-0 glass-card rounded-2xl p-4 overflow-hidden flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-['Space_Grotesk'] font-semibold text-[#F5F5F5] mb-1">
              Projects
            </h3>
            <p className="text-xs text-[#9CA3AF]">Filter by goal</p>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1">
            <button
              onClick={() => setProjectFilter('all')}
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
                {tasks.filter((t) => !t.completed).length}
              </span>
            </button>

            <button
              onClick={() => setProjectFilter('unassigned')}
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
                {tasks.filter((t) => !t.completed && !t.goalId).length}
              </span>
            </button>

            <div className="h-px bg-white/5 my-2" />

            {goals
              .filter((g) => g.status === 'active')
              .map((goal) => {
                const taskCount = tasks.filter((t) => !t.completed && t.goalId === goal.id).length;
                return (
                  <button
                    key={goal.id}
                    onClick={() => setProjectFilter(goal.id)}
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
      )}

      {/* Advanced Filters Sidebar */}
      {showAdvancedFilters && (
        <div className="w-64 flex-shrink-0 glass-card rounded-2xl p-4 overflow-hidden flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-['Space_Grotesk'] font-semibold text-[#F5F5F5] mb-1">
              Advanced Filters
            </h3>
            <p className="text-xs text-[#9CA3AF]">Refine your task list</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-[#BEC6DF] mb-2 block">Energy Level</label>
              <select
                value={filterEnergy}
                onChange={(e) => setFilterEnergy(e.target.value as EnergyLevel | 'all')}
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

            <div>
              <label className="text-xs font-medium text-[#BEC6DF] mb-2 block">
                Time Preference
              </label>
              <select
                value={filterTimePreference}
                onChange={(e) => setFilterTimePreference(e.target.value as TimePreference | 'all')}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-[#C17A72]/50 cursor-pointer"
              >
                <option value="all">All Times</option>
                {(['morning', 'afternoon', 'evening', 'anytime'] as TimePreference[]).map(
                  (time) => (
                    <option key={time} value={time}>
                      {TIME_PREFERENCE_LABELS[time]}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-[#BEC6DF] mb-2 block">Tag</label>
              <select
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
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

            {(filterEnergy !== 'all' || filterTimePreference !== 'all' || filterTag !== 'all') && (
              <button
                onClick={() => {
                  setFilterEnergy('all');
                  setFilterTimePreference('all');
                  setFilterTag('all');
                }}
                className="w-full px-3 py-2 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-[#9CA3AF] hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">clear</span>
                Clear Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {viewMode === 'list' && <div className="flex-1 overflow-auto">{renderListContent()}</div>}

        {viewMode === 'board' && (
          <div className="flex-1 overflow-auto">
            <div className="grid grid-cols-3 gap-4 h-full">
              {(['todo', 'in_progress', 'done'] as const).map((status) => {
                const statusTasks = tasks.filter((t) => t.status === status);
                const statusLabels: Record<typeof status, string> = {
                  todo: 'To Do',
                  in_progress: 'In Progress',
                  done: 'Done',
                };
                const statusColors: Record<typeof status, string> = {
                  todo: '#6B7280',
                  in_progress: '#f59e0b',
                  done: '#10b981',
                };

                return (
                  <div
                    key={status}
                    className="flex flex-col glass-card rounded-2xl overflow-hidden"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(status, e)}
                  >
                    <div className="px-4 py-3 border-b border-white/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ background: statusColors[status] }}
                          />
                          <h3 className="text-sm font-['Space_Grotesk'] font-semibold text-[#F5F5F5]">
                            {statusLabels[status]}
                          </h3>
                        </div>
                        <span className="text-xs text-[#9CA3AF] font-['JetBrains_Mono']">
                          {statusTasks.length}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                      {statusTasks.length === 0 ? (
                        <div className="text-center py-8 text-[#6B7280] text-xs">No tasks</div>
                      ) : (
                        statusTasks.map((task) => {
                          const goal = task.goalId ? goals.find((g) => g.id === task.goalId) : null;
                          const overdue =
                            task.deadline && !task.completed && new Date(task.deadline) < now;
                          const isDragging = draggedTask?.id === task.id;

                          return (
                            <div
                              key={task.id}
                              draggable
                              onDragStart={(e) => handleDragStart(task, e)}
                              onDragEnd={handleDragEnd}
                              className={`glass-card rounded-lg p-3 cursor-grab active:cursor-grabbing transition-all ${
                                isDragging ? 'opacity-50' : 'hover:bg-white/[0.02]'
                              }`}
                              onClick={() => openEdit(task)}
                            >
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h4 className="text-sm text-[#F5F5F5] font-medium flex-1">
                                  {task.title}
                                </h4>
                                <span
                                  className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                                  style={{ background: PRIORITY_DOTS[task.priority] }}
                                />
                              </div>

                              {task.description && (
                                <p className="text-xs text-[#9CA3AF] mb-2 line-clamp-2">
                                  {task.description}
                                </p>
                              )}

                              <div className="flex items-center gap-2 flex-wrap">
                                {goal && (
                                  <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded bg-white/5 text-[#9CA3AF]">
                                    <span
                                      className="w-1.5 h-1.5 rounded-full"
                                      style={{ background: goal.color }}
                                    />
                                    {goal.title}
                                  </span>
                                )}
                                {task.deadline && (
                                  <span
                                    className={`text-[10px] px-2 py-1 rounded ${
                                      overdue
                                        ? 'bg-red-500/20 text-red-400'
                                        : 'bg-white/5 text-[#9CA3AF]'
                                    }`}
                                  >
                                    {formatRelativeDate(task.deadline)}
                                  </span>
                                )}
                                <span className="text-[10px] px-2 py-1 rounded bg-white/5 text-[#9CA3AF] font-['JetBrains_Mono']">
                                  {task.durationMinutes}m
                                </span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTask ? 'Edit Task' : 'New Task'}
      >
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Task title"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            autoFocus
            className="input-glass"
          />
          <textarea
            placeholder="Description (optional)"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            rows={2}
            className="input-glass resize-none"
          />
          <div>
            <label className="text-xs mb-2 block" style={{ color: 'var(--text-muted)' }}>
              Priority
            </label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high', 'critical'] as Priority[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setFormPriority(p)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background:
                      formPriority === p ? 'var(--accent-soft)' : 'rgba(255,255,255,0.03)',
                    color: formPriority === p ? 'var(--accent)' : 'var(--text-muted)',
                    border: `1px solid ${formPriority === p ? 'rgba(193,122,114,0.3)' : 'var(--border)'}`,
                  }}
                >
                  {PRIORITY_LABELS[p]}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>
                Duration
              </label>
              <select
                value={formDuration}
                onChange={(e) => setFormDuration(Number(e.target.value))}
                className="input-glass w-full"
              >
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
              </select>
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>
                Deadline
              </label>
              <input
                type="date"
                value={formDeadline}
                onChange={(e) => setFormDeadline(e.target.value)}
                className="input-glass w-full"
              />
            </div>
          </div>
          {goals.length > 0 && (
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>
                Goal
              </label>
              <select
                value={formGoalId}
                onChange={(e) => setFormGoalId(e.target.value)}
                className="input-glass w-full"
              >
                <option value="">No goal</option>
                {goals
                  .filter((g) => g.status === 'active')
                  .map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.title}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <div className="border-t border-white/10 pt-4">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>
                  Energy Level
                </label>
                <select
                  value={formEnergyLevel}
                  onChange={(e) => setFormEnergyLevel(e.target.value as EnergyLevel)}
                  className="input-glass w-full"
                >
                  {(['low', 'medium', 'high'] as EnergyLevel[]).map((level) => (
                    <option key={level} value={level}>
                      {ENERGY_LABELS[level]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>
                  Time Preference
                </label>
                <select
                  value={formTimePreference}
                  onChange={(e) => setFormTimePreference(e.target.value as TimePreference)}
                  className="input-glass w-full"
                >
                  {(['morning', 'afternoon', 'evening', 'anytime'] as TimePreference[]).map(
                    (time) => (
                      <option key={time} value={time}>
                        {TIME_PREFERENCE_LABELS[time]}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-[#C17A72]/20 text-[#C17A72] rounded text-xs"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => setFormTags(formTags.filter((t) => t !== tag))}
                      className="hover:text-white transition-colors"
                    >
                      <span className="material-symbols-outlined text-xs">close</span>
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && tagInput.trim()) {
                      e.preventDefault();
                      if (!formTags.includes(tagInput.trim())) {
                        setFormTags([...formTags, tagInput.trim()]);
                      }
                      setTagInput('');
                    }
                  }}
                  placeholder="Add tag..."
                  className="input-glass flex-1 text-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (tagInput.trim() && !formTags.includes(tagInput.trim())) {
                      setFormTags([...formTags, tagInput.trim()]);
                      setTagInput('');
                    }
                  }}
                  className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#9CA3AF] hover:text-white transition-colors text-xs"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {editingTask ? (
              <button
                onClick={() => {
                  deleteTaskMutation.mutate(editingTask.id);
                  setModalOpen(false);
                }}
                className="px-3 py-2 text-sm rounded-lg"
                style={{ color: 'var(--danger)' }}
              >
                Delete
              </button>
            ) : (
              <div />
            )}
            <div className="flex gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm rounded-lg"
                style={{ color: 'var(--text-secondary)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="btn-glow px-5 py-2 rounded-xl text-sm font-medium"
              >
                {editingTask ? 'Save' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
