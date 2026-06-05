'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  useStore,
  type Task,
  type Priority,
  type EnergyLevel,
  type TimePreference,
} from '@/lib/store';
import { usePageHeader } from '@/lib/page-header-context';
import { TaskList } from '@/components/tasks/TaskList';
import { KanbanBoard } from '@/components/tasks/KanbanBoard';
import { ProjectsSidebar, AdvancedFiltersSidebar } from '@/components/tasks/TaskFilters';
import { TaskModal } from '@/components/tasks/TaskModal';

type FilterTab = 'all' | 'today' | 'upcoming' | 'completed';
type ViewMode = 'list' | 'board';
type ProjectFilter = 'all' | 'unassigned' | string;

type ModalValues = {
  title: string;
  description: string;
  priority: Priority;
  duration: number;
  deadline: string;
  goalId: string;
  energyLevel: EnergyLevel;
  timePreference: TimePreference;
  tags: string[];
};

const DEFAULT_FORM: ModalValues = {
  title: '',
  description: '',
  priority: 'medium',
  duration: 30,
  deadline: '',
  goalId: '',
  energyLevel: 'medium',
  timePreference: 'anytime',
  tags: [],
};

export default function TasksPage() {
  const store = useStore();
  const { setPageControls } = usePageHeader();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [modalValues, setModalValues] = useState<ModalValues>(DEFAULT_FORM);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [projectFilter, setProjectFilter] = useState<ProjectFilter>('all');
  const [showProjects, setShowProjects] = useState(true);

  // Advanced filters
  const [filterEnergy, setFilterEnergy] = useState<EnergyLevel | 'all'>('all');
  const [filterTimePreference, setFilterTimePreference] = useState<TimePreference | 'all'>('all');
  const [filterTag, setFilterTag] = useState<string>('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  function openCreate() {
    setEditingTask(null);
    setModalValues(DEFAULT_FORM);
    setModalOpen(true);
  }

  function openEdit(task: Task) {
    setEditingTask(task);
    setModalValues({
      title: task.title,
      description: task.description,
      priority: task.priority,
      duration: task.durationMinutes,
      deadline: task.deadline ? task.deadline.split('T')[0] : '',
      goalId: task.goalId || '',
      energyLevel: task.energyLevel || 'medium',
      timePreference: task.timePreference || 'anytime',
      tags: task.tags || [],
    });
    setModalOpen(true);
  }

  function toggleComplete(task: Task) {
    const done = !task.completed;
    store.updateTask(task.id, {
      completed: done,
      status: done ? 'done' : 'todo',
      completedAt: done ? new Date().toISOString() : null,
    });
  }

  const now = new Date();
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  const tabs: { key: FilterTab; label: string; count: number }[] = useMemo(
    () => [
      { key: 'all', label: 'All', count: store.tasks.filter((t) => !t.completed).length },
      {
        key: 'today',
        label: 'Today',
        count: store.tasks.filter(
          (t) => !t.completed && !!t.deadline && new Date(t.deadline) <= todayEnd
        ).length,
      },
      {
        key: 'upcoming',
        label: 'Upcoming',
        count: store.tasks.filter(
          (t) => !t.completed && !!t.deadline && new Date(t.deadline) > todayEnd
        ).length,
      },
      { key: 'completed', label: 'Done', count: store.tasks.filter((t) => t.completed).length },
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ],
    [store.tasks]
  );

  const allTags = useMemo(
    () => Array.from(new Set(store.tasks.flatMap((t) => t.tags || []))),
    [store.tasks]
  );

  const filteredTasks = useMemo(() => {
    return store.tasks.filter((t) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.tasks, activeTab, projectFilter, filterEnergy, filterTimePreference, filterTag]);

  // Set page header controls
  useEffect(() => {
    setPageControls(
      <div className="flex items-center justify-between w-full">
        {/* Tabs */}
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

        {/* View Mode, Filters, Projects Toggle & Add Button */}
        <div className="flex items-center gap-2">
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
  }, [
    activeTab,
    viewMode,
    showProjects,
    showAdvancedFilters,
    filterEnergy,
    filterTimePreference,
    filterTag,
    tabs,
    setPageControls,
  ]);

  return (
    <div className="flex gap-6 h-full">
      {/* Projects Sidebar */}
      {showProjects && (
        <ProjectsSidebar projectFilter={projectFilter} onProjectFilterChange={setProjectFilter} />
      )}

      {/* Advanced Filters Sidebar */}
      {showAdvancedFilters && (
        <AdvancedFiltersSidebar
          filterEnergy={filterEnergy}
          filterTimePreference={filterTimePreference}
          filterTag={filterTag}
          allTags={allTags}
          onEnergyChange={setFilterEnergy}
          onTimePreferenceChange={setFilterTimePreference}
          onTagChange={setFilterTag}
          onClear={() => {
            setFilterEnergy('all');
            setFilterTimePreference('all');
            setFilterTag('all');
          }}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {viewMode === 'list' && (
          <div className="flex-1 overflow-auto">
            <TaskList
              tasks={filteredTasks}
              onEdit={openEdit}
              onToggleComplete={toggleComplete}
              onDelete={(id) => store.deleteTask(id)}
              emptyLabel={activeTab === 'completed' ? 'No completed tasks' : 'No tasks yet'}
            />
          </div>
        )}

        {viewMode === 'board' && <KanbanBoard onEdit={openEdit} />}
      </div>

      {/* Task Modal — key forces re-mount (resets form state) on task change */}
      <TaskModal
        key={editingTask?.id ?? 'new'}
        open={modalOpen}
        editingTask={editingTask}
        initialValues={modalValues}
        onClose={() => setModalOpen(false)}
        onSaved={() => setModalOpen(false)}
      />
    </div>
  );
}
