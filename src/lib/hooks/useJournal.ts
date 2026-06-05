import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { journalApi } from '@/lib/api-client';
import type { JournalEntry } from '@/lib/store';

export const JOURNAL_QUERY_KEY = ['journal'] as const;
const PAGE_SIZE = 20;

type JournalPage = { items: JournalEntry[]; nextCursor?: number };
type JournalInfiniteData = { pages: JournalPage[]; pageParams: unknown[] };

export function useJournal() {
  return useInfiniteQuery({
    queryKey: JOURNAL_QUERY_KEY,
    queryFn: async ({ pageParam = 0 }) => {
      const all = await journalApi.list();
      const start = (pageParam as number) * PAGE_SIZE;
      return {
        items: all.slice(start, start + PAGE_SIZE) as JournalEntry[],
        nextCursor: start + PAGE_SIZE < all.length ? (pageParam as number) + 1 : undefined,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}

export function useCreateJournalEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) =>
      journalApi.create(data),
    onMutate: async (data) => {
      await qc.cancelQueries({ queryKey: JOURNAL_QUERY_KEY });
      const temp: JournalEntry = {
        ...data,
        id: `temp-${crypto.randomUUID()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      qc.setQueryData<JournalInfiniteData>(JOURNAL_QUERY_KEY, (old) => {
        if (!old) return old;
        const [first, ...rest] = old.pages;
        return { ...old, pages: [{ ...first, items: [temp, ...first.items] }, ...rest] };
      });
      return { tempId: temp.id };
    },
    onSuccess: (saved, _v, ctx) => {
      qc.setQueryData<JournalInfiniteData>(JOURNAL_QUERY_KEY, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((p) => ({
            ...p,
            items: p.items.map((e) => (e.id === ctx?.tempId ? saved : e)),
          })),
        };
      });
    },
    onError: () => {
      qc.invalidateQueries({ queryKey: JOURNAL_QUERY_KEY });
      toast.error('Failed to save journal entry');
    },
  });
}

export function useUpdateJournalEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<JournalEntry> }) =>
      journalApi.update(id, updates),
    onMutate: async ({ id, updates }) => {
      await qc.cancelQueries({ queryKey: JOURNAL_QUERY_KEY });
      const snapshot = qc.getQueryData(JOURNAL_QUERY_KEY);
      qc.setQueryData<JournalInfiniteData>(JOURNAL_QUERY_KEY, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((p) => ({
            ...p,
            items: p.items.map((e) =>
              e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e
            ),
          })),
        };
      });
      return { snapshot };
    },
    onSuccess: (updated, { id }) => {
      qc.setQueryData<JournalInfiniteData>(JOURNAL_QUERY_KEY, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((p) => ({
            ...p,
            items: p.items.map((e) => (e.id === id ? updated : e)),
          })),
        };
      });
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.snapshot) qc.setQueryData(JOURNAL_QUERY_KEY, ctx.snapshot);
      toast.error('Failed to update journal entry');
    },
  });
}

export function useDeleteJournalEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => journalApi.delete(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: JOURNAL_QUERY_KEY });
      const snapshot = qc.getQueryData(JOURNAL_QUERY_KEY);
      qc.setQueryData<JournalInfiniteData>(JOURNAL_QUERY_KEY, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((p) => ({ ...p, items: p.items.filter((e) => e.id !== id) })),
        };
      });
      return { snapshot };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.snapshot) qc.setQueryData(JOURNAL_QUERY_KEY, ctx.snapshot);
      toast.error('Failed to delete journal entry');
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: JOURNAL_QUERY_KEY });
    },
  });
}
