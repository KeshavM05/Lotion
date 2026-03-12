"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import {
  exportGoalsMarkdown,
  exportChatMarkdown,
  exportJournalMarkdown,
  exportAllJSON,
  downloadFile,
} from "@/lib/export";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: string;
  action: () => void;
  category: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const store = useStore();

  // Register Cmd+K shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
        setQuery("");
        setSelectedIndex(0);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const commands = useMemo<CommandItem[]>(() => {
    const items: CommandItem[] = [
      // Navigation
      { id: "nav-calendar", label: "Calendar", icon: "cal", action: () => router.push("/calendar"), category: "Navigate" },
      { id: "nav-goals", label: "Vision Board", icon: "goal", action: () => router.push("/goals"), category: "Navigate" },
      { id: "nav-tasks", label: "Tasks", icon: "task", action: () => router.push("/tasks"), category: "Navigate" },
      { id: "nav-journal", label: "Journal", icon: "pen", action: () => router.push("/journal"), category: "Navigate" },
      { id: "nav-coach", label: "AI Coach", icon: "chat", action: () => router.push("/coach"), category: "Navigate" },
      { id: "nav-memory", label: "AI Memory", icon: "mem", action: () => router.push("/memory"), category: "Navigate" },

      // Actions
      {
        id: "action-schedule",
        label: "Auto-schedule tasks",
        description: "Schedule unscheduled tasks into calendar",
        icon: "sched",
        action: () => { store.autoSchedule(); setOpen(false); },
        category: "Actions",
      },

      // Export
      {
        id: "export-goals-md",
        label: "Export goals as Markdown",
        icon: "exp",
        action: () => {
          const md = exportGoalsMarkdown(store.goals, store.milestones, store.tasks);
          downloadFile(md, "goals.md", "text/markdown");
          setOpen(false);
        },
        category: "Export",
      },
      {
        id: "export-journal-md",
        label: "Export journal as Markdown",
        icon: "exp",
        action: () => {
          const md = exportJournalMarkdown(store.journalEntries, store.goals);
          downloadFile(md, "journal.md", "text/markdown");
          setOpen(false);
        },
        category: "Export",
      },
      {
        id: "export-chat-md",
        label: "Export coach chat as Markdown",
        icon: "exp",
        action: () => {
          const msgs = store.getChatMessages(null);
          const md = exportChatMarkdown(msgs);
          downloadFile(md, "coach-chat.md", "text/markdown");
          setOpen(false);
        },
        category: "Export",
      },
      {
        id: "export-all-json",
        label: "Export all data as JSON",
        description: "Full backup of everything",
        icon: "exp",
        action: () => {
          const json = exportAllJSON({
            goals: store.goals,
            milestones: store.milestones,
            tasks: store.tasks,
            events: store.events,
            chatMessages: store.chatMessages,
            journalEntries: store.journalEntries,
            aiMemory: store.aiMemory,
          });
          downloadFile(json, "motion-backup.json", "application/json");
          setOpen(false);
        },
        category: "Export",
      },
    ];

    // Add goal-specific items
    store.goals
      .filter((g) => g.status === "active")
      .forEach((goal) => {
        items.push({
          id: `goal-${goal.id}`,
          label: goal.title,
          description: `${goal.category} goal`,
          icon: "goal",
          action: () => router.push(`/goals/${goal.id}`),
          category: "Goals",
        });
      });

    return items;
  }, [store, router]);

  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    );
  }, [commands, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      filtered[selectedIndex].action();
      setOpen(false);
    }
  }

  if (!open) return null;

  // Group by category
  const groups: Record<string, CommandItem[]> = {};
  filtered.forEach((item) => {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  });

  let flatIndex = 0;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-lg mx-4 glass-static overflow-hidden animate-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search commands, goals, actions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-sm"
            style={{ color: "var(--text-primary)" }}
          />
          <kbd className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-muted)" }}>
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-auto py-2">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>
              No results found
            </div>
          ) : (
            Object.entries(groups).map(([category, items]) => (
              <div key={category}>
                <div className="px-4 py-1.5 text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  {category}
                </div>
                {items.map((item) => {
                  const idx = flatIndex++;
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { item.action(); setOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                      style={{
                        background: isSelected ? "var(--accent-soft)" : "transparent",
                        color: isSelected ? "var(--accent)" : "var(--text-primary)",
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                    >
                      <span className="text-sm font-medium">{item.label}</span>
                      {item.description && (
                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                          {item.description}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 px-4 py-2 border-t text-[10px]" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
          <span>Navigate with arrow keys</span>
          <span>Enter to select</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
}
