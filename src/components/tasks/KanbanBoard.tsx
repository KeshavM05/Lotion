'use client';

import { useState } from 'react';
import { useStore, type Task, type TaskStatus } from '@/lib/store';
import { TaskCard } from './TaskCard';

interface KanbanBoardProps {
  onEdit: (task: Task) => void;
}

const STATUS_COLUMNS = ['todo', 'in_progress', 'done'] as const;
const STATUS_LABELS: Record<(typeof STATUS_COLUMNS)[number], string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};
const STATUS_COLORS: Record<(typeof STATUS_COLUMNS)[number], string> = {
  todo: '#6B7280',
  in_progress: '#f59e0b',
  done: '#10b981',
};

export function KanbanBoard({ onEdit }: KanbanBoardProps) {
  const store = useStore();
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

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
    store.updateTask(draggedTask.id, {
      status: newStatus,
      completed: newStatus === 'done',
      completedAt: newStatus === 'done' ? new Date().toISOString() : null,
    });
    setDraggedTask(null);
  }

  // Kanban board shows all tasks (not filtered like list view)
  return (
    <div className="flex-1 overflow-auto">
      <div className="grid grid-cols-3 gap-4 h-full">
        {STATUS_COLUMNS.map((status) => {
          const statusTasks = store.tasks.filter((t) => t.status === status);

          return (
            <div
              key={status}
              className="flex flex-col glass-card rounded-2xl overflow-hidden"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(status, e)}
            >
              {/* Column Header */}
              <div className="px-4 py-3 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: STATUS_COLORS[status] }}
                    />
                    <h3 className="text-sm font-['Space_Grotesk'] font-semibold text-[#F5F5F5]">
                      {STATUS_LABELS[status]}
                    </h3>
                  </div>
                  <span className="text-xs text-[#9CA3AF] font-['JetBrains_Mono']">
                    {statusTasks.length}
                  </span>
                </div>
              </div>

              {/* Column Tasks */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {statusTasks.length === 0 ? (
                  <div className="text-center py-8 text-[#6B7280] text-xs">No tasks</div>
                ) : (
                  statusTasks.map((task) => {
                    const goal = task.goalId ? store.goals.find((g) => g.id === task.goalId) : null;
                    return (
                      <TaskCard
                        key={task.id}
                        task={task}
                        goalTitle={goal?.title}
                        goalColor={goal?.color}
                        onEdit={onEdit}
                        onToggleComplete={() => {}} // not used in board variant
                        onDelete={() => {}} // not used in board variant
                        variant="board"
                        isDragging={draggedTask?.id === task.id}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                      />
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
