"use client";

import { useState, useRef, useEffect } from "react";
import { useAiChat } from "@/lib/use-ai-chat";

export default function CoachPage() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, isLoading } = useAiChat({ goalId: null });
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isLoading]);

  function send() {
    if (!input.trim() || isLoading) return;
    const msg = input.trim();
    setInput("");
    sendMessage(msg);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-8 relative">
        <div className="flex items-center gap-4 mb-3">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C17A72] to-[#8b5cf6] flex items-center justify-center shadow-[0_0_30px_rgba(193,122,114,0.4)]">
              <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                smart_toy
              </span>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#C17A72] rounded-full animate-pulse shadow-[0_0_10px_rgba(193,122,114,0.8)]"></div>
          </div>
          <div>
            <h1 className="text-5xl font-['Playfair_Display'] text-[#F5F5F5] leading-tight">
              AI Life Coach
            </h1>
            <p className="text-xs text-[#C17A72] font-['Space_Grotesk'] font-semibold tracking-[0.15em] uppercase mt-1">
              Powered by Claude
            </p>
          </div>
        </div>
        <p className="text-[#9CA3AF] font-['Space_Grotesk'] text-base max-w-2xl leading-relaxed">
          An AI that knows your goals, schedule, and progress. Get personalized guidance, strategic advice, and accountability — all in one conversation.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.length === 0 && !isLoading && (
            <div className="text-center py-16">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#C17A72] to-[#8b5cf6] blur-2xl opacity-40 animate-pulse"></div>
                <div
                  className="relative w-24 h-24 rounded-3xl flex items-center justify-center bg-gradient-to-br from-[#C17A72] to-[#8b5cf6] shadow-[0_0_40px_rgba(193,122,114,0.4)]"
                >
                  <span className="material-symbols-outlined text-white text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    psychology
                  </span>
                </div>
              </div>
              <h2 className="text-3xl mb-3 text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Your AI Life Coach is Ready
              </h2>
              <p className="text-base mb-4 max-w-xl mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                I have full context on your goals, tasks, calendar, and journal entries. Ask me anything — from strategic planning to daily prioritization.
              </p>
              <div className="flex items-center justify-center gap-2 mb-10 text-xs" style={{ color: "var(--text-muted)" }}>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-[#C17A72] rounded-full"></div>
                  <span>Context-Aware</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-[#C17A72] rounded-full"></div>
                  <span>Personalized</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-[#C17A72] rounded-full"></div>
                  <span>Always Learning</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 max-w-xl mx-auto">
                {[
                  { q: "What should I focus on today?", icon: "target" },
                  { q: "Help me plan this week", icon: "calendar_month" },
                  { q: "How am I doing on my goals?", icon: "trending_up" },
                  { q: "I'm feeling overwhelmed", icon: "psychology" },
                ].map((suggestion) => (
                  <button
                    key={suggestion.q}
                    onClick={() => setInput(suggestion.q)}
                    className="group px-5 py-4 rounded-xl text-sm font-medium transition-all text-left border border-white/10 hover:border-[#C17A72]/50 hover:bg-white/5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <span className="material-symbols-outlined text-[#C17A72] text-lg mb-2 block">
                      {suggestion.icon}
                    </span>
                    {suggestion.q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div
                  className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C17A72] to-[#8b5cf6] flex items-center justify-center flex-shrink-0 mr-3 mt-1 shadow-[0_0_15px_rgba(193,122,114,0.3)]"
                >
                  <span className="material-symbols-outlined text-white text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                    smart_toy
                  </span>
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

          {isLoading && (
            <div className="flex justify-start">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C17A72] to-[#8b5cf6] flex items-center justify-center flex-shrink-0 mr-3 mt-1 shadow-[0_0_15px_rgba(193,122,114,0.3)]">
                <span className="material-symbols-outlined text-white text-lg ai-thinking" style={{ fontVariationSettings: "'FILL' 1" }}>
                  smart_toy
                </span>
              </div>
              <div className="px-4 py-3 rounded-2xl text-sm" style={{ background: "var(--bg-glass)", border: "1px solid var(--border)", borderRadius: "20px 20px 20px 4px" }}>
                <span className="ai-thinking inline-block" style={{ color: "var(--text-muted)" }}>Thinking...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="pt-4 border-t mt-6" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-2xl mx-auto flex gap-3">
          <input
            type="text"
            placeholder="Ask your AI coach anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            disabled={isLoading}
            className="input-glass flex-1 disabled:opacity-50"
          />
          <button
            onClick={send}
            disabled={!input.trim() || isLoading}
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
