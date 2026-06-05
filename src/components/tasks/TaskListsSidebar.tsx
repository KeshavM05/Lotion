'use client';

import { useState, useRef } from 'react';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';

// Preset colors for list creation
const PRESET_COLORS = [
  '#C17A72', // rose
  '#6B9FD4', // blue
  '#7BC47F', // green
  '#E8B84B', // amber
  '#B07CC6', // purple
  '#E87C6B', // coral
  '#5BC4C4', // teal
  '#9CA3AF', // gray
];

// Preset icons
const PRESET_ICONS = [
  'folder',
  'work',
  'home',
  'school',
  'fitness_center',
  'shopping_cart',
  'favorite',
  'star',
  'rocket_launch',
  'code',
  'book',
  'music_note',
  'sports_soccer',
  'travel_explore',
  'restaurant',
  'local_hospital',
  'attach_money',
  'palette',
];

type ProjectFilter =
  | 'all'
  | 'overdue'
  | 'today'
  | 'tomorrow'
  | 'upcoming'
  | 'inbox'
  | 'unassigned'
  | string;

interface TaskListsSidebarProps {
  projectFilter: ProjectFilter;
  onProjectFilterChange: (filter: ProjectFilter) => void;
  tasks: {
    deadline?: string | null;
    completed: boolean;
    goalId?: string | null;
    listId?: string | null;
  }[];
  goals: { id: string; title: string; color: string; status: string }[];
}

interface ListFormState {
  name: string;
  color: string;
  icon: string;
}

const DEFAULT_FORM: ListFormState = { name: '', color: '#C17A72', icon: 'folder' };

function SidebarItem({
  icon,
  label,
  count,
  active,
  iconColor,
  onClick,
}: {
  icon: string;
  label: string;
  count: number;
  active: boolean;
  iconColor?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all ${
        active
          ? 'bg-[#C17A72]/20 text-[#C17A72] border border-[#C17A72]/30'
          : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <span
          className="material-symbols-outlined text-sm flex-shrink-0"
          style={{ color: active ? '#C17A72' : iconColor }}
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

function ListForm({
  initial,
  onSave,
  onCancel,
  saveLabel,
}: {
  initial: ListFormState;
  onSave: (form: ListFormState) => void;
  onCancel: () => void;
  saveLabel: string;
}) {
  const [form, setForm] = useState<ListFormState>(initial);

  return (
    <div className="bg-[#0F1729]/80 rounded-xl border border-white/10 p-3 space-y-3">
      {/* Name */}
      <input
        type="text"
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && form.name.trim()) onSave(form);
          if (e.key === 'Escape') onCancel();
        }}
        placeholder="List name"
        autoFocus
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#C17A72]/50"
      />

      {/* Color picker */}
      <div>
        <p className="text-[10px] text-[#6B7280] mb-1.5 uppercase tracking-wider">Color</p>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setForm((f) => ({ ...f, color: c }))}
              className="w-5 h-5 rounded-full transition-transform hover:scale-110"
              style={{
                background: c,
                outline: form.color === c ? `2px solid white` : 'none',
                outlineOffset: '2px',
              }}
            />
          ))}
        </div>
      </div>

      {/* Icon picker */}
      <div>
        <p className="text-[10px] text-[#6B7280] mb-1.5 uppercase tracking-wider">Icon</p>
        <div className="flex flex-wrap gap-1">
          {PRESET_ICONS.map((ic) => (
            <button
              key={ic}
              onClick={() => setForm((f) => ({ ...f, icon: ic }))}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                form.icon === ic
                  ? 'bg-[#C17A72]/20 border border-[#C17A72]/40'
                  : 'hover:bg-white/5 border border-transparent'
              }`}
            >
              <span
                className="material-symbols-outlined text-sm"
                style={{ color: form.icon === ic ? form.color : '#6B7280' }}
              >
                {ic}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => form.name.trim() && onSave(form)}
          disabled={!form.name.trim()}
          className="flex-1 py-1.5 rounded-lg text-xs font-medium btn-glow disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saveLabel}
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-1.5 rounded-lg text-xs text-[#9CA3AF] hover:text-white hover:bg-white/5 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export function TaskListsSidebar({
  projectFilter,
  onProjectFilterChange,
  tasks,
  goals,
}: TaskListsSidebarProps) {
  const store = useStore();
  const { taskLists } = store;

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Drag state for reordering custom lists
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart);
  todayEnd.setHours(23, 59, 59, 999);
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);
  const tomorrowEnd = new Date(tomorrowStart);
  tomorrowEnd.setHours(23, 59, 59, 999);
  const weekEnd = new Date(todayStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const incomplete = tasks.filter((t) => !t.completed);

  const systemCounts = {
    all: incomplete.length,
    overdue: incomplete.filter((t) => t.deadline && new Date(t.deadline) < todayStart).length,
    today: incomplete.filter(
      (t) => t.deadline && new Date(t.deadline) >= todayStart && new Date(t.deadline) <= todayEnd
    ).length,
    tomorrow: incomplete.filter(
      (t) =>
        t.deadline && new Date(t.deadline) >= tomorrowStart && new Date(t.deadline) <= tomorrowEnd
    ).length,
    upcoming: incomplete.filter(
      (t) => t.deadline && new Date(t.deadline) > tomorrowEnd && new Date(t.deadline) <= weekEnd
    ).length,
    inbox: incomplete.filter((t) => !t.deadline && !t.listId).length,
  };

  const sortedLists = [...taskLists].sort((a, b) => a.order - b.order);

  async function handleCreate(form: ListFormState) {
    try {
      await store.addTaskList({
        name: form.name.trim(),
        color: form.color,
        icon: form.icon,
        order: taskLists.length,
      });
      setShowCreateForm(false);
      toast.success(`"${form.name.trim()}" list created`);
    } catch {
      toast.error('Failed to create list');
    }
  }

  async function handleUpdate(id: string, form: ListFormState) {
    try {
      await store.updateTaskList(id, {
        name: form.name.trim(),
        color: form.color,
        icon: form.icon,
      });
      setEditingId(null);
      toast.success('List updated');
    } catch {
      toast.error('Failed to update list');
    }
  }

  async function handleDelete(id: string) {
    const list = taskLists.find((l) => l.id === id);
    try {
      await store.deleteTaskList(id);
      // If currently filtering by this list, go back to all
      if (projectFilter === id) onProjectFilterChange('all');
      setConfirmDeleteId(null);
      setMenuOpenId(null);
      toast.success(`"${list?.name}" deleted — tasks moved to Inbox`);
    } catch {
      toast.error('Failed to delete list');
    }
  }

  // Drag reorder handlers
  function handleDragStart(id: string) {
    setDragId(id);
  }

  async function handleDrop(targetId: string) {
    if (!dragId || dragId === targetId) {
      setDragId(null);
      setDragOverId(null);
      return;
    }
    const ordered = [...sortedLists];
    const fromIdx = ordered.findIndex((l) => l.id === dragId);
    const toIdx = ordered.findIndex((l) => l.id === targetId);
    if (fromIdx < 0 || toIdx < 0) return;
    const [moved] = ordered.splice(fromIdx, 1);
    ordered.splice(toIdx, 0, moved);
    // Update order for each
    await Promise.all(ordered.map((l, i) => store.updateTaskList(l.id, { order: i })));
    setDragId(null);
    setDragOverId(null);
  }

  const activeGoals = goals.filter((g) => g.status === 'active');

  return (
    <div className="w-56 flex-shrink-0 glass-card rounded-2xl overflow-hidden flex flex-col">
      {/* System lists */}
      <div className="p-3 space-y-0.5">
        <SidebarItem
          icon="inbox"
          label="All Tasks"
          count={systemCounts.all}
          active={projectFilter === 'all'}
          onClick={() => onProjectFilterChange('all')}
        />
        {systemCounts.overdue > 0 && (
          <SidebarItem
            icon="warning"
            label="Overdue"
            count={systemCounts.overdue}
            active={projectFilter === 'overdue'}
            iconColor="#C17A72"
            onClick={() => onProjectFilterChange('overdue')}
          />
        )}
        <SidebarItem
          icon="today"
          label="Due Today"
          count={systemCounts.today}
          active={projectFilter === 'today'}
          iconColor="#BEC6DF"
          onClick={() => onProjectFilterChange('today')}
        />
        <SidebarItem
          icon="event"
          label="Tomorrow"
          count={systemCounts.tomorrow}
          active={projectFilter === 'tomorrow'}
          iconColor="#9CA3AF"
          onClick={() => onProjectFilterChange('tomorrow')}
        />
        <SidebarItem
          icon="date_range"
          label="This Week"
          count={systemCounts.upcoming}
          active={projectFilter === 'upcoming'}
          iconColor="#9CA3AF"
          onClick={() => onProjectFilterChange('upcoming')}
        />
        <SidebarItem
          icon="radio_button_unchecked"
          label="Inbox"
          count={systemCounts.inbox}
          active={projectFilter === 'inbox'}
          iconColor="#6B7280"
          onClick={() => onProjectFilterChange('inbox')}
        />
      </div>

      {/* Custom Lists section */}
      <div className="h-px bg-white/5 mx-3" />
      <div className="p-3 pt-2 flex-1 overflow-y-auto flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7280] font-['Space_Grotesk']">
            My Lists
          </span>
          <button
            onClick={() => {
              setShowCreateForm(true);
              setEditingId(null);
            }}
            title="New list"
            className="p-0.5 rounded text-[#6B7280] hover:text-[#C17A72] transition-colors"
          >
            <span className="material-symbols-outlined text-sm">add</span>
          </button>
        </div>

        {showCreateForm && (
          <div className="mb-2">
            <ListForm
              initial={DEFAULT_FORM}
              onSave={handleCreate}
              onCancel={() => setShowCreateForm(false)}
              saveLabel="Create"
            />
          </div>
        )}

        <div className="space-y-0.5">
          {sortedLists.map((list) => {
            const count = incomplete.filter((t) => t.listId === list.id).length;
            const isActive = projectFilter === list.id;
            const isDraggingOver = dragOverId === list.id && dragId !== list.id;

            if (editingId === list.id) {
              return (
                <div key={list.id} className="mb-2">
                  <ListForm
                    initial={{ name: list.name, color: list.color, icon: list.icon }}
                    onSave={(form) => handleUpdate(list.id, form)}
                    onCancel={() => setEditingId(null)}
                    saveLabel="Save"
                  />
                </div>
              );
            }

            if (confirmDeleteId === list.id) {
              const tasksInList = incomplete.filter((t) => t.listId === list.id).length;
              return (
                <div
                  key={list.id}
                  className="rounded-lg border border-[#C17A72]/30 bg-[#0F1729]/80 p-3 mb-2"
                >
                  <p className="text-xs text-[#BEC6DF] mb-1">Delete &quot;{list.name}&quot;?</p>
                  {tasksInList > 0 && (
                    <p className="text-[10px] text-[#9CA3AF] mb-2">
                      {tasksInList} task{tasksInList !== 1 ? 's' : ''} will move to Inbox.
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(list.id)}
                      className="flex-1 py-1 rounded-lg text-xs font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="flex-1 py-1 rounded-lg text-xs text-[#9CA3AF] hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={list.id}
                className="relative group"
                draggable
                onDragStart={() => handleDragStart(list.id)}
                onDragEnd={() => {
                  setDragId(null);
                  setDragOverId(null);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverId(list.id);
                }}
                onDrop={() => handleDrop(list.id)}
                style={{
                  opacity: dragId === list.id ? 0.4 : 1,
                  borderTop: isDraggingOver ? '2px solid #C17A72' : '2px solid transparent',
                }}
              >
                <button
                  onClick={() => onProjectFilterChange(list.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all ${
                    isActive
                      ? 'bg-[#C17A72]/20 text-[#C17A72] border border-[#C17A72]/30'
                      : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span
                      className="material-symbols-outlined text-sm flex-shrink-0"
                      style={{ color: isActive ? '#C17A72' : list.color }}
                    >
                      {list.icon}
                    </span>
                    <span className="text-xs font-medium truncate">{list.name}</span>
                  </div>
                  {count > 0 && (
                    <span
                      className="text-xs font-['JetBrains_Mono'] ml-2 flex-shrink-0 px-1.5 py-0.5 rounded"
                      style={{
                        background: isActive ? 'rgba(193,122,114,0.2)' : 'rgba(255,255,255,0.05)',
                        color: isActive ? '#C17A72' : '#6B7280',
                      }}
                    >
                      {count}
                    </span>
                  )}
                </button>

                {/* Three-dot menu */}
                <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="relative" ref={menuOpenId === list.id ? menuRef : null}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId(menuOpenId === list.id ? null : list.id);
                      }}
                      className="p-1 rounded hover:bg-white/10 text-[#6B7280] hover:text-white transition-colors"
                    >
                      <span className="material-symbols-outlined text-xs">more_vert</span>
                    </button>
                    {menuOpenId === list.id && (
                      <div className="absolute right-0 top-full mt-1 w-32 glass-card rounded-lg border border-white/10 shadow-xl z-50 overflow-hidden">
                        <button
                          onClick={() => {
                            setEditingId(list.id);
                            setMenuOpenId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#9CA3AF] hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <span className="material-symbols-outlined text-xs">edit</span>
                          Rename
                        </button>
                        <button
                          onClick={() => {
                            setConfirmDeleteId(list.id);
                            setMenuOpenId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                        >
                          <span className="material-symbols-outlined text-xs">delete</span>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {sortedLists.length === 0 && !showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[#6B7280] hover:text-[#9CA3AF] hover:bg-white/5 transition-colors text-xs"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            New list
          </button>
        )}
      </div>

      {/* Projects section */}
      {activeGoals.length > 0 && (
        <>
          <div className="h-px bg-white/5 mx-3" />
          <div className="p-3 pt-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7280] mb-1.5 font-['Space_Grotesk']">
              Projects
            </p>
            <div className="space-y-0.5">
              {activeGoals.map((goal) => {
                const taskCount = incomplete.filter((t) => t.goalId === goal.id).length;
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
          </div>
        </>
      )}
    </div>
  );
}
