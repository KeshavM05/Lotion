import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { tasksApi } from '@/lib/api-client';
import type { Task } from '@/lib/store';

export const TASKS_QUERY_KEY = ['tasks'] as const;

export function useTasks() {
  return useQuery({ queryKey: TASKS_QUERY_KEY, queryFn: () => tasksApi.list() });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (
      data: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completed' | 'completedAt'>
    ) => tasksApi.create(data),
    onMutate: async (data) => {
      await qc.cancelQueries({ queryKey: TASKS_QUERY_KEY });
      const snapshot = qc.getQueryData<Task[]>(TASKS_QUERY_KEY);
      const temp: Task = {
        ...data,
        id: `temp-${crypto.randomUUID()}`,
        completed: false,
        completedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      qc.setQueryData<Task[]>(TASKS_QUERY_KEY, (prev = []) => [...prev, temp]);
      return { snapshot, tempId: temp.id };
    },
    onSuccess: (saved, _v, ctx) => {
      qc.setQueryData<Task[]>(TASKS_QUERY_KEY, (prev = []) =>
        prev.map((t) => (t.id === ctx?.tempId ? saved : t))
      );
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.snapshot !== undefined) qc.setQueryData(TASKS_QUERY_KEY, ctx.snapshot);
      toast.error('Failed to create task');
    },
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Task> }) =>
      tasksApi.update(id, updates),
    onMutate: async ({ id, updates }) => {
      await qc.cancelQueries({ queryKey: TASKS_QUERY_KEY });
      const snapshot = qc.getQueryData<Task[]>(TASKS_QUERY_KEY);
      qc.setQueryData<Task[]>(TASKS_QUERY_KEY, (prev = []) =>
        prev.map((t) =>
          t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
        )
      );
      return { snapshot };
    },
    onSuccess: (updated, { id }) => {
      qc.setQueryData<Task[]>(TASKS_QUERY_KEY, (prev = []) =>
        prev.map((t) => (t.id === id ? updated : t))
      );
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.snapshot !== undefined) qc.setQueryData(TASKS_QUERY_KEY, ctx.snapshot);
      toast.error('Failed to update task');
    },
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tasksApi.delete(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: TASKS_QUERY_KEY });
      const snapshot = qc.getQueryData<Task[]>(TASKS_QUERY_KEY);
      qc.setQueryData<Task[]>(TASKS_QUERY_KEY, (prev = []) => prev.filter((t) => t.id !== id));
      return { snapshot };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.snapshot !== undefined) qc.setQueryData(TASKS_QUERY_KEY, ctx.snapshot);
      toast.error('Failed to delete task');
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
  });
}
