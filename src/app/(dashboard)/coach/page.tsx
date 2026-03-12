"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";

export default function CoachPage() {
  const store = useStore();
  const [input, setInput] = useState("");
  const messages = store.getChatMessages(null);

  function send() {
    if (!input.trim()) return;
    store.addChatMessage({ goalId: null, role: "user", content: input.trim() });
    const userMsg = input.trim();
    setInput("");

    // Simulated AI response
    setTimeout(() => {
      const goalsSummary = store.goals
        .filter((g) => g.status === "active")
        .map((g) => `• ${g.title} (${store.getGoalProgress(g.id)}%)`)
        .join("\n");

      const activeTasks = store.tasks.filter((t) => !t.completed).length;
      const todayEvents = store.events.filter((e) => {
        const d = new Date(e.start);
        const now = new Date();
        return d.toDateString() === now.toDateString();
      }).length;

      store.addChatMessage({
        goalId: null,
        role: "assistant",
        content: `Here's a snapshot of where you stand:\n\n**Active Goals:**\n${goalsSummary || "No goals set yet — let's define your vision!"}\n\n**Today:** ${todayEvents} events, ${activeTasks} active tasks\n\nWhat would you like to focus on? I can help you:\n• Break a goal into actionable steps\n• Plan your week\n• Reflect on your progress\n• Brainstorm strategies\n\n*Connect the Claude API for real AI coaching.*`,
      });
    }, 600);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-8 py-6 border-b" style={{ borderColor: "var(--border)" }}>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          AI Coach
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          Your personal life coach. Ask anything about your goals, schedule, or strategy.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-20">
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                style={{ background: "var(--accent-glow)", border: "1px solid rgba(139,92,246,0.2)" }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
              </div>
              <h2 className="text-xl mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                What&apos;s on your mind?
              </h2>
              <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
                I know your goals, your calendar, and your progress. Let me help you move forward.
              </p>

              {/* Suggestion chips */}
              <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto">
                {[
                  "What should I focus on today?",
                  "Help me plan this week",
                  "How am I doing on my goals?",
                  "I'm feeling overwhelmed",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setInput(suggestion);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-medium transition-all glass"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mr-3 mt-1"
                  style={{ background: "var(--accent-glow)", border: "1px solid rgba(139,92,246,0.2)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
                    <path d="M12 2a10 10 0 1 0 10 10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
              )}
              <div
                className="max-w-[75%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap"
                style={{
                  background: msg.role === "user" ? "var(--accent)" : "var(--bg-glass)",
                  color: msg.role === "user" ? "white" : "var(--text-primary)",
                  border: msg.role === "assistant" ? "1px solid var(--border)" : "none",
                  borderRadius: msg.role === "user" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-2xl mx-auto flex gap-3">
          <input
            type="text"
            placeholder="Ask your AI coach anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            className="input-glass flex-1"
          />
          <button
            onClick={send}
            disabled={!input.trim()}
            className="btn-glow px-4 py-2.5 rounded-xl text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
