"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";

export default function MemoryPage() {
  const store = useStore();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(store.aiMemory);

  useEffect(() => {
    setDraft(store.aiMemory);
  }, [store.aiMemory]);

  function save() {
    store.setAiMemory(draft);
    setEditing(false);
  }

  const hasMemory = store.aiMemory.trim().length > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-8 py-6 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              AI Memory
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              This is what your AI coach knows about you. You can view and edit it anytime.
            </p>
          </div>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="btn-glow px-5 py-2.5 rounded-xl text-sm font-medium"
            >
              {hasMemory ? "Edit Memory" : "Add Memory"}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-2xl mx-auto">
          {editing ? (
            <div className="animate-in">
              <div className="glass-static p-1 rounded-2xl">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  autoFocus
                  rows={20}
                  placeholder={`Write what the AI should know about you. For example:

# About Me
- Name: Keshav
- I'm a builder/founder working on multiple projects
- Currently applying to YC and Cansbridge Fellowship

# Goals & Priorities
- Building a SaaS product for passive income
- Content creation (YouTube, Twitter)
- Getting into top tech companies (Shopify, Google)

# Preferences
- I prefer morning deep work sessions (9-12)
- I journal in the evenings
- I like direct, no-fluff advice

# Patterns the AI has noticed
- I tend to overcommit and spread thin
- Most productive on Tuesdays and Wednesdays
- I work best with clear deadlines`}
                  className="w-full bg-transparent border-none outline-none resize-none text-sm leading-relaxed p-5"
                  style={{ color: "var(--text-primary)", minHeight: "400px" }}
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => { setEditing(false); setDraft(store.aiMemory); }}
                  className="px-4 py-2 text-sm rounded-lg"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Cancel
                </button>
                <button onClick={save} className="btn-glow px-5 py-2 rounded-xl text-sm font-medium">
                  Save Memory
                </button>
              </div>
            </div>
          ) : hasMemory ? (
            <div className="glass-static p-6 cursor-pointer" onClick={() => setEditing(true)}>
              <pre className="text-sm whitespace-pre-wrap leading-relaxed" style={{
                color: "var(--text-primary)",
                fontFamily: "'Inter', system-ui, sans-serif",
              }}>
                {store.aiMemory}
              </pre>
            </div>
          ) : (
            <div className="text-center py-20" style={{ color: "var(--text-muted)" }}>
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                style={{ background: "var(--accent-glow)", border: "1px solid rgba(193,122,114,0.2)" }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5">
                  <path d="M12 2a10 10 0 1 0 10 10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <h2 className="text-xl mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                No memory yet
              </h2>
              <p className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                Tell your AI coach about yourself — your goals, preferences, patterns.
              </p>
              <p className="text-xs">
                This document is always visible to you and editable. The AI references it in every conversation.
              </p>
            </div>
          )}

          {/* Info card */}
          <div className="glass-static p-4 mt-6" style={{ opacity: 0.7 }}>
            <div className="flex items-start gap-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" className="mt-0.5 flex-shrink-0">
                <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
              </svg>
              <div>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  This memory document is included as context in every AI conversation.
                  The more specific you are, the better your coaching will be.
                  Your data stays local and is fully exportable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
