'use client';

import React from 'react';
import { type Task, type Priority } from '@/lib/store';
import { formatRelativeDate } from '@/lib/utils';

export const PRIORITY_DOTS: Record<Priority, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#3b82f6',
};

interface TaskCardProps {
  task: Task;
  goalTitle?: string;
  goalColor?: string;
  onEdit: (task: Task) => void;
  onToggleComplete: (task: Task) => void;
  onDelete: (taskId: string) => void;
  /** When true, render the kanban card style; when false, render the list row style */
  variant: 'list' | 'board';
  isDragging?: boolean;
  onDragStart?: (task: Task, e: React.DragEvent) => void;
  onDragEnd?: () => void;
}

const now = new Date();

function TaskCardComponent({
  task,
  goalTitle,
  goalColor,
  onEdit,
  onToggleComplete,
  onDelete,
  variant,
  isDragging = false,
  onDragStart,
  onDragEnd,
}: TaskCardProps) {
  const overdue = task.deadline && !task.completed && new Date(task.deadline) < now;

  if (variant === 'list') {
    return (
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl group cursor-pointer transition-colors hover:bg-white/[0.02]"
        onClick={() => onEdit(task)}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete(task);
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
            {goalTitle && goalColor && (
              <span className="flex items-center gap-1 text-[10px] text-[#9CA3AF]">
                <span className="w-2 h-2 rounded-full" style={{ background: goalColor }} />
                {goalTitle}
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
            onDelete(task.id);
          }}
          className="opacity-0 group-hover:opacity-100 p-1 rounded transition-all text-[#9CA3AF] hover:text-[#ef4444]"
        >
          <span className="material-symbols-outlined text-sm">delete</span>
        </button>
      </div>
    );
  }

  // board variant
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart?.(task, e)}
      onDragEnd={onDragEnd}
      className={`glass-card rounded-lg p-3 cursor-grab active:cursor-grabbing transition-all ${
        isDragging ? 'opacity-50' : 'hover:bg-white/[0.02]'
      }`}
      onClick={() => onEdit(task)}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm text-[#F5F5F5] font-medium flex-1">{task.title}</h4>
        <span
          className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
          style={{ background: PRIORITY_DOTS[task.priority] }}
        />
      </div>

      {task.description && (
        <p className="text-xs text-[#9CA3AF] mb-2 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        {goalTitle && goalColor && (
          <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded bg-white/5 text-[#9CA3AF]">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: goalColor }} />
            {goalTitle}
          </span>
        )}
        {task.deadline && (
          <span
            className={`text-[10px] px-2 py-1 rounded ${
              overdue ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-[#9CA3AF]'
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
}

export const TaskCard = React.memo(TaskCardComponent);
