'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';

export function ChatSidebar() {
  const {
    chatSessions,
    activeChatId,
    createChatSession,
    deleteChatSession,
    renameChatSession,
    setActiveChatId,
  } = useStore();

  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const sorted = [...chatSessions].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  function formatRelativeDate(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }

  function startRename(id: string, currentTitle: string) {
    setRenamingId(id);
    setRenameValue(currentTitle);
    setMenuOpenId(null);
  }

  function commitRename(id: string) {
    if (renameValue.trim()) {
      renameChatSession(id, renameValue.trim());
    }
    setRenamingId(null);
  }

  return (
    <div
      className="h-full flex flex-col border-r"
      style={{
        width: '250px',
        minWidth: '250px',
        background: 'var(--bg-secondary, #1a2236)',
        borderColor: 'var(--border, rgba(255,255,255,0.08))',
      }}
    >
      <div className="p-3">
        <button
          onClick={() => createChatSession()}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all hover:bg-white/5 border border-white/10 hover:border-[#C17A72]/50"
          style={{ color: 'var(--text-primary, #f1f5f9)' }}
        >
          <span className="material-symbols-outlined text-[#C17A72] text-lg">add</span>
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {sorted.length === 0 && (
          <p className="text-xs text-center mt-8 px-4" style={{ color: 'var(--text-muted)' }}>
            No conversations yet. Start a new chat!
          </p>
        )}
        {sorted.map((session) => (
          <div
            key={session.id}
            className={`group relative flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer mb-0.5 transition-all ${
              activeChatId === session.id
                ? 'bg-white/10 border border-[#C17A72]/30'
                : 'hover:bg-white/5 border border-transparent'
            }`}
            onClick={() => setActiveChatId(session.id)}
          >
            <div className="flex-1 min-w-0">
              {renamingId === session.id ? (
                <input
                  autoFocus
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onBlur={() => commitRename(session.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') commitRename(session.id);
                    if (e.key === 'Escape') setRenamingId(null);
                  }}
                  className="w-full bg-transparent text-sm outline-none border-b border-[#C17A72]/50"
                  style={{ color: 'var(--text-primary)' }}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <>
                  <p className="text-sm truncate" style={{ color: 'var(--text-primary, #f1f5f9)' }}>
                    {session.title}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted, #6b7280)' }}>
                    {formatRelativeDate(session.updatedAt)}
                  </p>
                </>
              )}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpenId(menuOpenId === session.id ? null : session.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 transition-opacity"
            >
              <span
                className="material-symbols-outlined text-base"
                style={{ color: 'var(--text-muted)' }}
              >
                more_horiz
              </span>
            </button>

            {menuOpenId === session.id && (
              <div
                className="absolute right-2 top-full mt-1 z-50 rounded-lg shadow-xl py-1 border"
                style={{
                  background: 'var(--bg-glass, #1f2d47)',
                  borderColor: 'var(--border, rgba(255,255,255,0.08))',
                  minWidth: '120px',
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startRename(session.id, session.title);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-white/5 flex items-center gap-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  Rename
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChatSession(session.id);
                    setMenuOpenId(null);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-white/5 flex items-center gap-2 text-red-400"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
