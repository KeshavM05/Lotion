'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { isSameDay } from '@/lib/utils';
import type { ViewMenuPreferences } from './types';

interface TaskSectionProps {
  title: string;
  count: number;
  icon?: React.ReactNode;
  color?: string;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}

function TaskSection({
  title,
  count,
  icon,
  color,
  defaultExpanded = true,
  children,
}: TaskSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  return (
    <div>
      <div
        className="flex items-center gap-2 mb-2 cursor-pointer hover:bg-white/5 p-1 rounded-md transition-colors select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span
          className="material-symbols-outlined text-sm transition-transform"
          style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          chevron_right
        </span>
        {icon &&
          (typeof icon === 'string' ? (
            <span className="material-symbols-outlined text-[16px]" style={{ color }}>
              {icon}
            </span>
          ) : (
            icon
          ))}
        <h4 className="text-[13px] font-semibold flex-1" style={{ color: color || '#E5E7EB' }}>
          {title}
        </h4>
        {count > 0 && (
          <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded-full text-[#9CA3AF] font-medium min-w-[20px] text-center">
            {count}
          </span>
        )}
      </div>
      {isExpanded && <div className="space-y-1 pl-5">{children}</div>}
    </div>
  );
}

interface TaskItemProps {
  task: any;
  store: ReturnType<typeof useStore>;
  onDragStart: (task: any, e: React.DragEvent) => void;
  onDragEnd: () => void;
}

function TaskItem({ task, store, onDragStart, onDragEnd }: TaskItemProps) {
  return (
    <div
      draggable={!task.completed}
      onDragStart={(e) => onDragStart(task, e)}
      onDragEnd={onDragEnd}
      className={`flex items-start gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors group ${
        !task.completed ? 'cursor-grab active:cursor-grabbing' : ''
      }`}
    >
      <button
        onClick={() => store.updateTask(task.id, { completed: !task.completed })}
        className="mt-0.5 flex-shrink-0"
      >
        <span
          className={`material-symbols-outlined text-base transition-colors ${
            task.completed ? 'text-[#C17A72]' : 'text-[#9CA3AF] hover:text-[#C17A72]'
          }`}
          style={task.completed ? { fontVariationSettings: "'FILL' 1" } : {}}
        >
          {task.completed ? 'check_circle' : 'radio_button_unchecked'}
        </span>
      </button>
      <div className="flex-1 min-w-0">
        <p
          className={`text-xs font-['Space_Grotesk'] ${
            task.completed ? 'line-through text-[#9CA3AF]' : 'text-[#F5F5F5]'
          }`}
        >
          {task.title}
        </p>
        {task.deadline && (
          <p className="text-[10px] text-[#9CA3AF] mt-0.5">
            {new Date(task.deadline).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </p>
        )}
      </div>
      {!task.completed && (
        <span className="material-symbols-outlined text-sm text-[#9CA3AF] opacity-0 group-hover:opacity-100 transition-opacity">
          drag_indicator
        </span>
      )}
    </div>
  );
}

interface TaskSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onAddTask: () => void;
  onDragStart: (task: any, e: React.DragEvent) => void;
  onDragEnd: () => void;
  viewMenuPreferences: ViewMenuPreferences;
  onViewMenuPreferencesChange: (patch: Partial<ViewMenuPreferences>) => void;
  onAddList: () => void;
}

export default function TaskSidebar({
  collapsed,
  onToggleCollapse,
  onAddTask,
  onDragStart,
  onDragEnd,
  viewMenuPreferences,
  onViewMenuPreferencesChange,
  onAddList,
}: TaskSidebarProps) {
  const store = useStore();
  const [viewMenuOpen, setViewMenuOpen] = useState(false);
  const today = new Date();

  const overdueTasks = store.tasks.filter(
    (t) => !t.completed && t.deadline && new Date(t.deadline) < today
  );
  const todayTasks = store.tasks.filter(
    (t) => !t.completed && t.deadline && isSameDay(new Date(t.deadline), today)
  );
  const tomorrowTasks = store.tasks.filter((t) => {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return !t.completed && t.deadline && isSameDay(new Date(t.deadline), tomorrow);
  });
  const upcomingTasks = store.tasks.filter((t) => {
    if (!t.deadline || t.completed) return false;
    const deadline = new Date(t.deadline);
    const twoDaysOut = new Date(today);
    twoDaysOut.setDate(twoDaysOut.getDate() + 2);
    return deadline > twoDaysOut;
  });

  const handleToggleListVisibility = (listId: string) => {
    onViewMenuPreferencesChange({
      hiddenLists: viewMenuPreferences.hiddenLists.includes(listId)
        ? viewMenuPreferences.hiddenLists.filter((id) => id !== listId)
        : [...viewMenuPreferences.hiddenLists, listId],
    });
  };

  return (
    <div
      className={`flex-shrink-0 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-[340px]'
      } flex flex-col`}
    >
      <div className="glass-card rounded-2xl p-4 h-full overflow-visible flex flex-col bg-[#111111]/80 border-r border-white/5">
        {/* Sidebar Header */}
        <div className="flex flex-col gap-3 mb-4 border-b border-white/5 pb-3">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <h3 className="text-xl font-semibold text-[#F5F5F5] font-['Inter']">Tasks</h3>
            )}
            <div className="flex items-center gap-1">
              {!collapsed && (
                <>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-[#9CA3AF] transition-colors">
                    <span className="material-symbols-outlined text-sm">search</span>
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-[#9CA3AF] transition-colors">
                    <span className="material-symbols-outlined text-sm">filter_list</span>
                  </button>
                </>
              )}
              <button
                onClick={onToggleCollapse}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-[#9CA3AF] transition-colors"
              >
                <span className="material-symbols-outlined text-lg">
                  {collapsed ? 'chevron_right' : 'chevron_left'}
                </span>
              </button>
            </div>
          </div>

          {!collapsed && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#ff7e67] to-[#ffe3a1] shadow-sm"></div>
                <button className="text-[#9CA3AF] hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-lg">grid_view</span>
                </button>
              </div>
              <div className="relative">
                <button
                  onClick={() => setViewMenuOpen(!viewMenuOpen)}
                  className="flex items-center gap-1 text-sm font-semibold hover:bg-white/5 px-2 py-1 rounded text-[#E5E7EB]"
                >
                  <span className="material-symbols-outlined text-[16px]">tune</span>
                  View
                </button>
                {/* POPUP MENU */}
                {viewMenuOpen && (
                  <div className="absolute left-full top-0 ml-2 mt-1 w-72 bg-[#1C1C1C] border border-white/10 rounded-xl shadow-2xl z-50 p-2 flex flex-col font-['Inter',sans-serif]">
                    <button
                      onClick={() => {
                        setViewMenuOpen(false);
                        onAddList();
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-[#E5E7EB] hover:bg-white/5 rounded-lg w-full text-left"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      New task list
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 text-sm text-[#E5E7EB] hover:bg-white/5 rounded-lg w-full text-left">
                      <span className="material-symbols-outlined text-[16px]">inventory_2</span>
                      Show archived tasks
                    </button>

                    <div className="h-px bg-white/10 my-2"></div>

                    <div className="px-3 py-1">
                      <div className="text-xs font-semibold text-[#6B7280] mb-2 uppercase tracking-wider">
                        Grouping
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[#D1D5DB]">Group by</span>
                        <select className="bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-white">
                          <option>Task list</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[#D1D5DB]">then organise by</span>
                        <select className="bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-white">
                          <option>None</option>
                        </select>
                      </div>
                      <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-sm text-[#D1D5DB] group-hover:text-white transition-colors">
                          Hide empty groups
                        </span>
                        <input
                          type="checkbox"
                          className="rounded border-white/20 bg-[#1C1C1C] text-[#C17A72] focus:ring-[#C17A72]"
                        />
                      </label>
                    </div>

                    <div className="h-px bg-white/10 my-2"></div>

                    <div className="px-3 py-1">
                      <div className="text-xs font-semibold text-[#6B7280] mb-2 uppercase tracking-wider">
                        Filtering
                      </div>
                      <div className="flex items-center justify-between mb-2 text-xs text-[#9CA3AF]">
                        <div className="flex gap-2">
                          <button className="hover:text-white">Show all</button> |{' '}
                          <button className="hover:text-white">None</button>
                        </div>
                      </div>
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                        {store.taskLists.map((list) => (
                          <label
                            key={list.id}
                            className="flex items-center justify-between cursor-pointer group"
                          >
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-[16px] text-white/40 cursor-grab">
                                drag_indicator
                              </span>
                              <span
                                className="material-symbols-outlined text-[12px]"
                                style={{ color: list.color }}
                              >
                                {list.icon}
                              </span>
                              <span className="text-sm text-[#D1D5DB] group-hover:text-white transition-colors font-medium">
                                {list.name}
                              </span>
                            </div>
                            <input
                              type="checkbox"
                              checked={!viewMenuPreferences.hiddenLists.includes(list.id)}
                              onChange={() => handleToggleListVisibility(list.id)}
                              className="rounded border-white/20 bg-[#1C1C1C] text-[#8b5cf6] focus:ring-[#8b5cf6]"
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="h-px bg-white/10 my-2"></div>

                    <div className="px-3 py-1">
                      <div className="text-xs font-semibold text-[#6B7280] mb-2 uppercase tracking-wider">
                        Calendar preferences
                      </div>
                      <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-sm text-[#D1D5DB] group-hover:text-white transition-colors font-medium">
                          Manage due dates on the calendar
                        </span>
                        <input
                          type="checkbox"
                          checked={viewMenuPreferences.manageDueDates}
                          onChange={(e) =>
                            onViewMenuPreferencesChange({ manageDueDates: e.target.checked })
                          }
                          className="rounded border-white/20 bg-[#1C1C1C] text-[#8b5cf6] focus:ring-[#8b5cf6]"
                        />
                      </label>
                    </div>

                    <div className="h-px bg-white/10 my-2"></div>

                    <div className="px-3 py-1">
                      <div className="text-xs font-semibold text-[#6B7280] mb-2 uppercase tracking-wider">
                        Sidebar preferences
                      </div>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between cursor-pointer group">
                          <span className="text-sm text-[#D1D5DB] group-hover:text-white transition-colors font-medium">
                            Show scheduled tasks
                          </span>
                          <input
                            type="checkbox"
                            checked={viewMenuPreferences.showScheduledTasks}
                            onChange={(e) =>
                              onViewMenuPreferencesChange({ showScheduledTasks: e.target.checked })
                            }
                            className="rounded border-white/20 bg-[#1C1C1C] text-[#8b5cf6] focus:ring-[#8b5cf6]"
                          />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer group">
                          <span className="text-sm text-[#D1D5DB] group-hover:text-white transition-colors font-medium">
                            Enable Due today list
                          </span>
                          <input
                            type="checkbox"
                            checked={viewMenuPreferences.enableDueToday}
                            onChange={(e) =>
                              onViewMenuPreferencesChange({ enableDueToday: e.target.checked })
                            }
                            className="rounded border-white/20 bg-[#1C1C1C] text-[#8b5cf6] focus:ring-[#8b5cf6]"
                          />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer group">
                          <span className="text-sm text-[#D1D5DB] group-hover:text-white transition-colors font-medium">
                            Enable Due tomorrow list
                          </span>
                          <input
                            type="checkbox"
                            checked={viewMenuPreferences.enableDueTomorrow}
                            onChange={(e) =>
                              onViewMenuPreferencesChange({ enableDueTomorrow: e.target.checked })
                            }
                            className="rounded border-white/20 bg-[#1C1C1C] text-[#8b5cf6] focus:ring-[#8b5cf6]"
                          />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer group">
                          <span className="text-sm text-[#D1D5DB] group-hover:text-white transition-colors font-medium">
                            Enable Due soon list
                          </span>
                          <input
                            type="checkbox"
                            checked={viewMenuPreferences.enableDueSoon}
                            onChange={(e) =>
                              onViewMenuPreferencesChange({ enableDueSoon: e.target.checked })
                            }
                            className="rounded border-white/20 bg-[#1C1C1C] text-[#8b5cf6] focus:ring-[#8b5cf6]"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Task Lists */}
        {!collapsed && (
          <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {/* Time Based Lists */}
            {overdueTasks.length > 0 && (
              <TaskSection
                title="Overdue"
                count={overdueTasks.length}
                icon="schedule"
                color="#ef4444"
                defaultExpanded={false}
              >
                {overdueTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    store={store}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                  />
                ))}
              </TaskSection>
            )}

            {viewMenuPreferences.enableDueToday && todayTasks.length > 0 && (
              <TaskSection
                title="Due today"
                count={todayTasks.length}
                icon="light_mode"
                color="#f59e0b"
                defaultExpanded={true}
              >
                {todayTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    store={store}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                  />
                ))}
              </TaskSection>
            )}

            {viewMenuPreferences.enableDueTomorrow && tomorrowTasks.length > 0 && (
              <TaskSection
                title="Due tomorrow"
                count={tomorrowTasks.length}
                icon="arrow_forward_ios"
                color="#f59e0b"
                defaultExpanded={false}
              >
                {tomorrowTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    store={store}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                  />
                ))}
              </TaskSection>
            )}

            {viewMenuPreferences.enableDueSoon && upcomingTasks.length > 0 && (
              <TaskSection
                title="Due soon"
                count={upcomingTasks.length}
                icon="terrain"
                color="#f59e0b"
                defaultExpanded={false}
              >
                {upcomingTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    store={store}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                  />
                ))}
              </TaskSection>
            )}

            {/* Separator */}
            <div className="h-px bg-white/5 my-3"></div>

            {/* Custom Lists from Store */}
            {store.taskLists
              .filter((list) => !viewMenuPreferences.hiddenLists.includes(list.id))
              .sort((a, b) => a.order - b.order)
              .map((list) => {
                const listTasks = store.tasks.filter(
                  (t) =>
                    !t.completed &&
                    (!viewMenuPreferences.showScheduledTasks ? !t.scheduledStart : true) &&
                    t.listId === list.id
                );

                return (
                  <TaskSection
                    key={list.id}
                    title={list.name}
                    count={listTasks.length}
                    icon={list.icon}
                    color={list.color}
                    defaultExpanded={true}
                  >
                    {listTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        store={store}
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}
                      />
                    ))}
                  </TaskSection>
                );
              })}

            {/* Add Task Button */}
            <button
              onClick={onAddTask}
              className="w-full mt-4 flex items-center gap-2 px-2 py-2 rounded-xl text-[#9CA3AF] hover:text-white hover:bg-white/5 transition-all text-left"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              <span className="text-sm font-medium">Add Task</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
