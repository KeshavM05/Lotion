import { useQuery, useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query';
import { toast } from 'sonner';
import { milestonesApi, goalsApi } from '@/lib/api-client';
import type { Milestone, Goal } from '@/lib/store';
import { GOALS_QUERY_KEY } from './useGoals';

export const MILESTONES_QUERY_KEY = ['milestones'] as const;

export function useMilestones(goalId?: string) {
  return useQuery({
    queryKey: [...MILESTONES_QUERY_KEY, goalId] as const,
    queryFn: async () => {
      const goals = await goalsApi.list();
      const all: Milestone[] = [];
      goals.forEach((g: Goal & { milestones?: Milestone[] }) => {
        if (Array.isArray(g.milestones)) all.push(...g.milestones);
      });
      return goalId ? all.filter((m) => m.goalId === goalId) : all;
    },
  });
}

export function useCreateMilestone() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Milestone, 'id' | 'createdAt' | 'completed' | 'completedAt'>) =>
      milestonesApi.create(data),
    onMutate: async (data) => {
      const key = [...MILESTONES_QUERY_KEY, data.goalId] as const;
      await qc.cancelQueries({ queryKey: key });
      const snapshot = qc.getQueryData<Milestone[]>(key);
      const temp: Milestone = {
        ...data,
        id: `temp-${crypto.randomUUID()}`,
        completed: false,
        completedAt: null,
        createdAt: new Date().toISOString(),
      };
      qc.setQueryData<Milestone[]>(key, (prev = []) => [...prev, temp]);
      return { snapshot, tempId: temp.id, goalId: data.goalId };
    },
    onSuccess: (saved, _v, ctx) => {
      if (!ctx) return;
      const key = [...MILESTONES_QUERY_KEY, ctx.goalId] as const;
      qc.setQueryData<Milestone[]>(key, (prev = []) =>
        prev.map((m) => (m.id === ctx.tempId ? saved : m))
      );
      qc.invalidateQueries({ queryKey: GOALS_QUERY_KEY });
    },
    onError: (_e, _v, ctx) => {
      if (ctx) qc.setQueryData([...MILESTONES_QUERY_KEY, ctx.goalId], ctx.snapshot);
      toast.error('Failed to create milestone');
    },
  });
}

export function useUpdateMilestone() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Milestone> }) =>
      milestonesApi.update(id, updates),
    onMutate: async ({ id, updates }) => {
      const entries = qc.getQueriesData<Milestone[]>({ queryKey: MILESTONES_QUERY_KEY });
      const snapshots = entries.map(([key, data]) => [key, data] as const);
      for (const [key] of entries)
        qc.setQueryData<Milestone[]>(key as QueryKey, (prev = []) =>
          prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
        );
      return { snapshots };
    },
    onSuccess: (updated, { id }) => {
      const entries = qc.getQueriesData<Milestone[]>({ queryKey: MILESTONES_QUERY_KEY });
      for (const [key] of entries)
        qc.setQueryData<Milestone[]>(key as QueryKey, (prev = []) =>
          prev.map((m) => (m.id === id ? updated : m))
        );
      qc.invalidateQueries({ queryKey: GOALS_QUERY_KEY });
    },
    onError: (_e, _v, ctx) => {
      for (const [key, snap] of ctx?.snapshots ?? []) qc.setQueryData(key as QueryKey, snap);
      toast.error('Failed to update milestone');
    },
  });
}

export function useDeleteMilestone() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => milestonesApi.delete(id),
    onMutate: async (id) => {
      const entries = qc.getQueriesData<Milestone[]>({ queryKey: MILESTONES_QUERY_KEY });
      const snapshots = entries.map(([key, data]) => [key, data] as const);
      for (const [key] of entries)
        qc.setQueryData<Milestone[]>(key as QueryKey, (prev = []) =>
          prev.filter((m) => m.id !== id)
        );
      return { snapshots };
    },
    onError: (_e, _v, ctx) => {
      for (const [key, snap] of ctx?.snapshots ?? []) qc.setQueryData(key as QueryKey, snap);
      toast.error('Failed to delete milestone');
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: MILESTONES_QUERY_KEY });
      qc.invalidateQueries({ queryKey: GOALS_QUERY_KEY });
    },
  });
}
