'use client';

import { useState } from 'react';
import { useStore, type ChatSession, type ChatFolder } from '@/lib/store';

export function ChatSidebar() {
  const {
    chatSessions,
    activeChatId,
    createChatSession,
    deleteChatSession,
    renameChatSession,
    setActiveChatId,
    chatFolders,
    createChatFolder,
    renameChatFolder,
    deleteChatFolder,
    moveChatToFolder,
    toggleFolderCollapsed,
  } = useStore();

  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [folderMenuId, setFolderMenuId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renamingFolderId, setRenamingFolderId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const sorted = [...chatSessions].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const unfiledChats = sorted.filter((s) => !s.folderId);
  const sortedFolders = [...chatFolders].sort((a, b) => a.order - b.order);

  function chatsInFolder(folderId: string) {
    return sorted.filter((s) => s.folderId === folderId);
  }

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

  function startFolderRename(id: string, currentName: string) {
    setRenamingFolderId(id);
    setRenameValue(currentName);
    setFolderMenuId(null);
  }

  function commitFolderRename(id: string) {
    if (renameValue.trim()) {
      renameChatFolder(id, renameValue.trim());
    }
    setRenamingFolderId(null);
  }

  function handleNewFolder() {
    if (newFolderName.trim()) {
      createChatFolder(newFolderName.trim());
      setNewFolderName('');
      setShowNewFolder(false);
    }
  }

  function renderChatItem(session: ChatSession) {
    return (
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
            setFolderMenuId(null);
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
              minWidth: '140px',
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
            {sortedFolders.length > 0 && <div className="border-t border-white/5 my-1" />}
            {sortedFolders.map((folder) => (
              <button
                key={folder.id}
                onClick={(e) => {
                  e.stopPropagation();
                  moveChatToFolder(session.id, folder.id);
                  setMenuOpenId(null);
                }}
                className="w-full text-left px-3 py-1.5 text-xs hover:bg-white/5 flex items-center gap-2"
                style={{ color: 'var(--text-primary)' }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: folder.color || '#C17A72' }}
                />
                Move to {folder.name}
              </button>
            ))}
            {session.folderId && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  moveChatToFolder(session.id, null);
                  setMenuOpenId(null);
                }}
                className="w-full text-left px-3 py-1.5 text-xs hover:bg-white/5 flex items-center gap-2"
                style={{ color: 'var(--text-primary)' }}
              >
                <span className="material-symbols-outlined text-sm">drive_file_move_outline</span>
                Remove from folder
              </button>
            )}
            <div className="border-t border-white/5 my-1" />
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
    );
  }

  function renderFolder(folder: ChatFolder) {
    const folderChats = chatsInFolder(folder.id);

    return (
      <div key={folder.id} className="mb-1">
        <div
          className="group flex items-center gap-1.5 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-white/5 transition-all"
          onClick={() => toggleFolderCollapsed(folder.id)}
        >
          <span
            className="material-symbols-outlined text-sm transition-transform"
            style={{
              color: 'var(--text-muted)',
              transform: folder.collapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
            }}
          >
            expand_more
          </span>
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: folder.color || '#C17A72' }}
          />
          {renamingFolderId === folder.id ? (
            <input
              autoFocus
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={() => commitFolderRename(folder.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitFolderRename(folder.id);
                if (e.key === 'Escape') setRenamingFolderId(null);
              }}
              className="flex-1 bg-transparent text-xs font-medium outline-none border-b border-[#C17A72]/50"
              style={{ color: 'var(--text-primary)' }}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span
              className="flex-1 text-xs font-medium truncate"
              style={{ color: 'var(--text-primary, #f1f5f9)' }}
            >
              {folder.name}
            </span>
          )}
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {folderChats.length}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFolderMenuId(folderMenuId === folder.id ? null : folder.id);
              setMenuOpenId(null);
            }}
            className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-white/10 transition-opacity"
          >
            <span
              className="material-symbols-outlined text-sm"
              style={{ color: 'var(--text-muted)' }}
            >
              more_horiz
            </span>
          </button>

          {folderMenuId === folder.id && (
            <div
              className="absolute right-4 mt-20 z-50 rounded-lg shadow-xl py-1 border"
              style={{
                background: 'var(--bg-glass, #1f2d47)',
                borderColor: 'var(--border, rgba(255,255,255,0.08))',
                minWidth: '120px',
              }}
            >
              {!folder.goalId && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startFolderRename(folder.id, folder.name);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-white/5 flex items-center gap-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  Rename
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  createChatSession(folder.id);
                  setFolderMenuId(null);
                }}
                className="w-full text-left px-3 py-1.5 text-xs hover:bg-white/5 flex items-center gap-2"
                style={{ color: 'var(--text-primary)' }}
              >
                <span className="material-symbols-outlined text-sm">add</span>
                New chat here
              </button>
              {!folder.goalId && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChatFolder(folder.id);
                    setFolderMenuId(null);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-white/5 flex items-center gap-2 text-red-400"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                  Delete folder
                </button>
              )}
            </div>
          )}
        </div>

        {!folder.collapsed && (
          <div className="ml-3 pl-2 border-l border-white/5">
            {folderChats.length === 0 ? (
              <p className="text-xs px-2 py-1.5" style={{ color: 'var(--text-muted)' }}>
                No chats yet
              </p>
            ) : (
              folderChats.map(renderChatItem)
            )}
          </div>
        )}
      </div>
    );
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
      <div className="p-3 space-y-2">
        <button
          onClick={() => createChatSession()}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all hover:bg-white/5 border border-white/10 hover:border-[#C17A72]/50"
          style={{ color: 'var(--text-primary, #f1f5f9)' }}
        >
          <span className="material-symbols-outlined text-[#C17A72] text-lg">add</span>
          New Chat
        </button>
        <button
          onClick={() => setShowNewFolder(true)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all hover:bg-white/5"
          style={{ color: 'var(--text-muted)' }}
        >
          <span className="material-symbols-outlined text-sm">create_new_folder</span>
          New Folder
        </button>
      </div>

      {showNewFolder && (
        <div className="px-3 pb-2">
          <input
            autoFocus
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onBlur={() => {
              handleNewFolder();
              setShowNewFolder(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleNewFolder();
              if (e.key === 'Escape') {
                setShowNewFolder(false);
                setNewFolderName('');
              }
            }}
            placeholder="Folder name..."
            className="w-full bg-white/5 text-sm rounded-lg px-3 py-1.5 outline-none border border-white/10 focus:border-[#C17A72]/50"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {sortedFolders.length === 0 && unfiledChats.length === 0 && (
          <p className="text-xs text-center mt-8 px-4" style={{ color: 'var(--text-muted)' }}>
            No conversations yet. Start a new chat!
          </p>
        )}

        {sortedFolders.map(renderFolder)}

        {unfiledChats.length > 0 && sortedFolders.length > 0 && (
          <div className="mt-2 pt-2 border-t border-white/5">
            <p className="text-xs px-2 pb-1 font-medium" style={{ color: 'var(--text-muted)' }}>
              Unfiled
            </p>
          </div>
        )}
        {unfiledChats.map(renderChatItem)}
      </div>
    </div>
  );
}
