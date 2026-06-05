'use client';

import { useMemo } from 'react';
import { type Task } from '@/lib/store';
import { useStore } from '@/lib/store';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onToggleComplete: (task: Task) => void;
  onDelete: (taskId: string) => void;
  emptyLabel?: string;
}

export function TaskList({ tasks, onEdit, onToggleComplete, onDelete, emptyLabel }: TaskListProps) {
  const store = useStore();

  const sorted = useMemo(() => {
    const pw: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };
    return [...tasks].sort((a, b) => {
      if (pw[b.priority] !== pw[a.priority]) return pw[b.priority] - pw[a.priority];
      const da = a.deadline ? new Date(a.deadline).getTime() : Infinity;
      const db = b.deadline ? new Date(b.deadline).getTime() : Infinity;
      return da - db;
    });
  }, [tasks]);

  if (sorted.length === 0) {
    return (
      <div className="text-center py-20 text-[#9CA3AF]">
        <span className="material-symbols-outlined text-4xl mb-3 block opacity-40">task_alt</span>
        <p className="text-sm font-['Playfair_Display'] text-[#BEC6DF]">
          {emptyLabel ?? 'No tasks yet'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1 max-w-3xl">
      {sorted.map((task) => {
        const goal = task.goalId ? store.goals.find((g) => g.id === task.goalId) : null;
        return (
          <TaskCard
            key={task.id}
            task={task}
            goalTitle={goal?.title}
            goalColor={goal?.color}
            onEdit={onEdit}
            onToggleComplete={onToggleComplete}
            onDelete={onDelete}
            variant="list"
          />
        );
      })}
    </div>
  );
}
