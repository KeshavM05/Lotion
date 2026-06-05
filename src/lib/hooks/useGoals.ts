import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { goalsApi } from '@/lib/api-client';
import type { Goal } from '@/lib/store';

export const GOALS_QUERY_KEY = ['goals'] as const;

export function useGoals() {
  return useQuery({ queryKey: GOALS_QUERY_KEY, queryFn: () => goalsApi.list() });
}

export function useCreateGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => goalsApi.create(data),
    onMutate: async (data) => {
      await qc.cancelQueries({ queryKey: GOALS_QUERY_KEY });
      const snapshot = qc.getQueryData<Goal[]>(GOALS_QUERY_KEY);
      const temp: Goal = {
        ...data,
        id: `temp-${crypto.randomUUID()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      qc.setQueryData<Goal[]>(GOALS_QUERY_KEY, (prev = []) => [...prev, temp]);
      return { snapshot, tempId: temp.id };
    },
    onSuccess: (saved, _v, ctx) => {
      qc.setQueryData<Goal[]>(GOALS_QUERY_KEY, (prev = []) =>
        prev.map((g) => (g.id === ctx?.tempId ? saved : g))
      );
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.snapshot !== undefined) qc.setQueryData(GOALS_QUERY_KEY, ctx.snapshot);
      toast.error('Failed to create goal');
    },
  });
}

export function useUpdateGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Goal> }) =>
      goalsApi.update(id, updates),
    onMutate: async ({ id, updates }) => {
      await qc.cancelQueries({ queryKey: GOALS_QUERY_KEY });
      const snapshot = qc.getQueryData<Goal[]>(GOALS_QUERY_KEY);
      qc.setQueryData<Goal[]>(GOALS_QUERY_KEY, (prev = []) =>
        prev.map((g) =>
          g.id === id ? { ...g, ...updates, updatedAt: new Date().toISOString() } : g
        )
      );
      return { snapshot };
    },
    onSuccess: (updated, { id }) => {
      qc.setQueryData<Goal[]>(GOALS_QUERY_KEY, (prev = []) =>
        prev.map((g) => (g.id === id ? updated : g))
      );
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.snapshot !== undefined) qc.setQueryData(GOALS_QUERY_KEY, ctx.snapshot);
      toast.error('Failed to update goal');
    },
  });
}

export function useDeleteGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => goalsApi.delete(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: GOALS_QUERY_KEY });
      const snapshot = qc.getQueryData<Goal[]>(GOALS_QUERY_KEY);
      qc.setQueryData<Goal[]>(GOALS_QUERY_KEY, (prev = []) => prev.filter((g) => g.id !== id));
      return { snapshot };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.snapshot !== undefined) qc.setQueryData(GOALS_QUERY_KEY, ctx.snapshot);
      toast.error('Failed to delete goal');
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: GOALS_QUERY_KEY });
    },
  });
}
