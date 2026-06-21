'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useStore, type ChatRole } from '@/lib/store';
import { useSidebar } from '@/lib/sidebar-context';
import { getAuthHeaders } from '@/lib/api-client';
import { ChatSidebar } from '@/components/ui/chat-sidebar';

export default function CoachPage() {
  const { collapsed } = useSidebar();
  const store = useStore();
  const {
    chatSessions,
    activeChatId,
    createChatSession,
    addMessageToSession,
    getActiveSessionMessages,
  } = store;

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const userScrolledUp = useRef(false);

  const messages = getActiveSessionMessages();

  function handleChatScroll() {
    const el = chatScrollRef.current;
    if (!el) return;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    userScrolledUp.current = !isNearBottom;
  }

  useEffect(() => {
    if (!userScrolledUp.current) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, messages[messages.length - 1]?.content, isLoading]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      let sessionId = activeChatId;
      if (!sessionId) {
        sessionId = await createChatSession();
      }

      addMessageToSession(sessionId, 'user', content.trim());
      setIsLoading(true);

      try {
        const session = chatSessions.find((s) => s.id === sessionId);
        const prevMessages = session?.messages ?? [];
        const allMessages = [
          ...prevMessages.map((m) => ({ role: m.role, content: m.content })),
          { role: 'user' as ChatRole, content: content.trim() },
        ];

        const authHeaders = await getAuthHeaders();
        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { ...authHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: allMessages,
            sessionId,
            goalId: null,
            aiMemory: store.aiMemory || undefined,
          }),
        });

        const data = await res.json();
        const reply = data.error
          ? data.error.includes('not configured')
            ? getFallbackResponse(store)
            : `Sorry, something went wrong: ${data.error}`
          : data.message;

        addMessageToSession(sessionId!, 'assistant', reply);
      } catch {
        addMessageToSession(sessionId!, 'assistant', getFallbackResponse(store));
      } finally {
        setIsLoading(false);
      }
    },
    [activeChatId, chatSessions, createChatSession, addMessageToSession, isLoading, store]
  );

  function send() {
    if (!input.trim() || isLoading) return;
    const msg = input.trim();
    setInput('');
    sendMessage(msg);
  }

  return (
    <div
      className="flex overflow-hidden -mx-4 md:-mx-8 -mt-6 -mb-8"
      style={{ height: 'calc(100vh - 64px)' }}
    >
      <ChatSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Empty State */}
        {messages.length === 0 && !isLoading && (
          <div
            className="flex-1 flex items-center justify-center"
            style={{ paddingTop: '80px', paddingBottom: '160px' }}
          >
            <div className="max-w-2xl mx-auto px-8 w-full">
              <div className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#C17A72] to-[#8b5cf6] blur-xl opacity-40 animate-pulse"></div>
                  <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#C17A72] to-[#8b5cf6] shadow-[0_0_30px_rgba(193,122,114,0.4)]">
                    <span
                      className="material-symbols-outlined text-white text-3xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      psychology
                    </span>
                  </div>
                </div>
                <h2
                  className="text-2xl mb-2 text-white"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Your AI Life Coach is Ready
                </h2>
                <p
                  className="text-sm mb-3 max-w-lg mx-auto leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Full context on your goals, tasks, calendar, and journal. Ask me anything.
                </p>
                <div
                  className="flex items-center justify-center gap-2 mb-8 text-xs"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-[#C17A72] rounded-full"></div>
                    <span>Context-Aware</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-[#C17A72] rounded-full"></div>
                    <span>Personalized</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-[#C17A72] rounded-full"></div>
                    <span>Always Learning</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 max-w-xl mx-auto">
                  {[
                    { q: 'What should I focus on today?', icon: 'target' },
                    { q: 'Help me plan this week', icon: 'calendar_month' },
                    { q: 'How am I doing on my goals?', icon: 'trending_up' },
                    { q: "I'm feeling overwhelmed", icon: 'psychology' },
                  ].map((suggestion) => (
                    <button
                      key={suggestion.q}
                      onClick={() => setInput(suggestion.q)}
                      className="group px-4 py-3.5 rounded-xl text-xs font-medium transition-all text-left border border-white/10 hover:border-[#C17A72]/50 hover:bg-white/5 flex flex-col items-center justify-center"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <span className="material-symbols-outlined text-[#C17A72] text-xl mb-2 block">
                        {suggestion.icon}
                      </span>
                      {suggestion.q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        {messages.length > 0 && (
          <div
            ref={chatScrollRef}
            onScroll={handleChatScroll}
            className="flex-1 overflow-auto min-h-0 mb-20"
          >
            <div className="max-w-2xl mx-auto space-y-4 pb-4 pt-6 px-8">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C17A72] to-[#8b5cf6] flex items-center justify-center flex-shrink-0 mr-3 mt-1 shadow-[0_0_15px_rgba(193,122,114,0.3)]">
                      <span
                        className="material-symbols-outlined text-white text-lg"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        smart_toy
                      </span>
                    </div>
                  )}
                  <div
                    className="max-w-[75%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap"
                    style={{
                      background: msg.role === 'user' ? 'var(--accent)' : 'var(--bg-glass)',
                      color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                      border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
                      borderRadius:
                        msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C17A72] to-[#8b5cf6] flex items-center justify-center flex-shrink-0 mr-3 mt-1 shadow-[0_0_15px_rgba(193,122,114,0.3)]">
                    <span
                      className="material-symbols-outlined text-white text-lg ai-thinking"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      smart_toy
                    </span>
                  </div>
                  <div
                    className="px-4 py-3 rounded-2xl text-sm"
                    style={{
                      background: 'var(--bg-glass)',
                      border: '1px solid var(--border)',
                      borderRadius: '20px 20px 20px 4px',
                    }}
                  >
                    <span
                      className="ai-thinking inline-block"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      Thinking...
                    </span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>
        )}

        {/* Input */}
        <div className="absolute bottom-0 left-[250px] right-0 pt-8 pb-4 bg-gradient-to-t from-[#0F1729] via-[#0F1729] to-transparent">
          <div className="max-w-2xl mx-auto flex gap-3 px-8">
            <input
              type="text"
              placeholder="Ask your AI coach anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
              disabled={isLoading}
              className="input-glass flex-1 disabled:opacity-50"
            />
            <button
              onClick={send}
              disabled={!input.trim() || isLoading}
              className="btn-glow px-4 py-2.5 rounded-xl text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getFallbackResponse(store: ReturnType<typeof import('@/lib/store').useStore>) {
  const activeGoals = store.goals.filter((g) => g.status === 'active');
  const totalTasks = store.tasks.filter((t) => !t.completed).length;
  return `Here's your overview:

**${activeGoals.length} active goals:**
${activeGoals.map((g) => `• ${g.title} — ${store.getGoalProgress(g.id)}%`).join('\n') || "• No goals yet — let's set some!"}

**${totalTasks} tasks** waiting for you.

What would you like to work on? I can help you:
• Break a goal into milestones and tasks
• Plan your week around your priorities
• Brainstorm strategies for any goal

*Add your AWS credentials to .env.local for real AI coaching via Bedrock.*`;
}
