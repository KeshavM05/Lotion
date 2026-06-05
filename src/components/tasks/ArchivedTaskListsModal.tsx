'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useStore, type TaskList } from '@/lib/store';
import { Modal } from '@/components/ui/modal';
import { formatRelativeDate } from '@/lib/utils';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ArchivedTaskListsModal({ open, onClose }: Props) {
  const store = useStore();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const archivedLists = store.taskLists.filter((l) => l.archived);

  async function handleRestore(list: TaskList) {
    await store.restoreTaskList(list.id);
    toast.success(`"${list.name}" restored`);
  }

  async function handleDeletePermanently(list: TaskList) {
    setDeletingId(list.id);
  }

  async function confirmDelete(list: TaskList) {
    await store.deleteTaskList(list.id);
    setDeletingId(null);
    toast.success(`"${list.name}" permanently deleted`);
  }

  return (
    <Modal open={open} onClose={onClose} title="Archived Lists">
      <div className="space-y-2 min-h-[120px]">
        {archivedLists.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <span className="material-symbols-outlined text-4xl text-[#9CA3AF]/40 mb-2">
              archive
            </span>
            <p className="text-sm text-[#9CA3AF]">No archived lists</p>
          </div>
        ) : (
          archivedLists.map((list) => (
            <div key={list.id}>
              {deletingId === list.id ? (
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#ef4444]/10 border border-[#ef4444]/20">
                  <div className="text-sm text-[#F5F5F5]">
                    Delete <span className="font-semibold">&ldquo;{list.name}&rdquo;</span>?
                    <p className="text-xs text-[#9CA3AF] mt-0.5">Tasks will be moved to Inbox.</p>
                  </div>
                  <div className="flex gap-2 ml-4 flex-shrink-0">
                    <button
                      onClick={() => setDeletingId(null)}
                      className="px-3 py-1.5 rounded-lg text-xs text-[#9CA3AF] hover:text-white hover:bg-white/5 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => confirmDelete(list)}
                      className="px-3 py-1.5 rounded-lg text-xs text-white bg-[#ef4444] hover:bg-[#ef4444]/80 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/[0.07] transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="material-symbols-outlined text-base flex-shrink-0"
                      style={{ color: list.color }}
                    >
                      {list.icon}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm text-[#F5F5F5] truncate">{list.name}</p>
                      {list.archivedAt && (
                        <p className="text-xs text-[#9CA3AF]">
                          Archived {formatRelativeDate(list.archivedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4 flex-shrink-0">
                    <button
                      onClick={() => handleRestore(list)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-[#C17A72]/20 text-[#C17A72] hover:bg-[#C17A72]/30 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">unarchive</span>
                      Restore
                    </button>
                    <button
                      onClick={() => handleDeletePermanently(list)}
                      className="px-3 py-1.5 rounded-lg text-xs text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Modal>
  );
}
