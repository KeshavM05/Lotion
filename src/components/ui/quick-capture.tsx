"use client";

import { useState, useEffect, useRef } from "react";
import { useStore } from "@/lib/store";

type CaptureMode = "select" | "text" | "voice";

export function useQuickCapture() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isTyping = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
      if (isTyping) return;

      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "j") {
        e.preventDefault();
        setIsOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return { isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) };
}

export function QuickCaptureOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const store = useStore();
  const [mode, setMode] = useState<CaptureMode>("select");
  const [text, setText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Voice state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setMode("select");
      setText("");
      setIsSaving(false);
      setSaved(false);
      setIsRecording(false);
      setRecordingTime(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (mode === "text" && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [mode]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRecording) {
      interval = setInterval(() => setRecordingTime((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && mode === "text" && text.trim() && !isSaving) {
        handleSaveText();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, mode, text, isSaving]);

  function handleSaveText() {
    if (!text.trim() || isSaving) return;
    setIsSaving(true);
    store.addJournalEntry({ content: text.trim(), mood: null, linkedGoalIds: [] });
    setSaved(true);
    setTimeout(() => onClose(), 600);
  }

  function handleStopVoice() {
    setIsRecording(false);
    setIsSaving(true);
    store.addJournalEntry({
      content: `[Voice capture - ${formatTime(recordingTime)}] (Transcription pending)`,
      mood: null,
      linkedGoalIds: [],
    });
    setSaved(true);
    setTimeout(() => onClose(), 600);
  }

  function formatTime(s: number) {
    return `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
      onClick={() => !isSaving && onClose()}
    >
      <div
        className="w-full max-w-2xl mx-4 rounded-2xl overflow-hidden animate-in"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(193,122,114,0.05)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-3">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center"
              style={{ background: "var(--accent-glow)", border: "1px solid rgba(193,122,114,0.3)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Quick Capture</div>
              <div className="text-[10px]" style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>
                Ctrl+Shift+J
              </div>
            </div>
          </div>
          <button
            onClick={() => !isSaving && onClose()}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Success state */}
          {saved && (
            <div className="text-center py-8 animate-in">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ background: "rgba(52,211,153,0.15)" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <p className="text-sm font-medium" style={{ color: "var(--success)" }}>Captured!</p>
            </div>
          )}

          {/* Select mode */}
          {!saved && mode === "select" && (
            <div className="text-center py-4">
              <h3 className="text-xl font-medium mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "var(--text-primary)" }}>
                What&apos;s on your mind?
              </h3>
              <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
                Capture now, reflect later.
              </p>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => { setMode("voice"); setIsRecording(true); }}
                  className="h-20 w-40 rounded-xl flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 btn-glow"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                    <path d="M19 10v2a7 7 0 01-14 0v-2" />
                    <line x1="12" x2="12" y1="19" y2="23" />
                    <line x1="8" x2="16" y1="23" y2="23" />
                  </svg>
                  <span className="text-sm font-medium">Voice</span>
                </button>
                <button
                  onClick={() => setMode("text")}
                  className="h-20 w-40 rounded-xl flex flex-col items-center justify-center gap-2 transition-all hover:scale-105"
                  style={{
                    background: "var(--bg-tertiary)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                  <span className="text-sm font-medium">Type</span>
                </button>
              </div>
            </div>
          )}

          {/* Text mode */}
          {!saved && mode === "text" && (
            <div className="animate-in">
              <textarea
                ref={textareaRef}
                placeholder="What's the thought, decision, or challenge on your mind?"
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={isSaving}
                maxLength={2000}
                rows={5}
                className="w-full resize-none rounded-xl p-4 text-base leading-relaxed outline-none"
                style={{
                  background: "var(--bg-tertiary)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                  fontFamily: "'Inter', system-ui, sans-serif",
                }}
              />
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2 text-[11px]" style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>
                  <span>{text.length}/2000</span>
                  <span style={{ color: "var(--border)" }}>|</span>
                  <span>Ctrl+Enter to save</span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setMode("select")}
                    disabled={isSaving}
                    className="px-3 py-2 text-sm rounded-lg transition-colors"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSaveText}
                    disabled={!text.trim() || isSaving}
                    className="btn-glow px-5 py-2 rounded-xl text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSaving ? (
                      <span className="ai-thinking">Saving...</span>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                        Capture
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Voice mode */}
          {!saved && mode === "voice" && (
            <div className="text-center py-6 animate-in">
              <div
                className="text-4xl font-medium mb-8"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--text-primary)", letterSpacing: "0.1em" }}
              >
                {formatTime(recordingTime)}
              </div>

              {/* Waveform */}
              <div className="flex items-center gap-0.5 h-16 mb-8 justify-center px-12">
                {Array.from({ length: 50 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 rounded-full transition-all duration-75"
                    style={{
                      backgroundColor: "var(--accent)",
                      height: isRecording ? `${Math.max(8, Math.random() * 100)}%` : "8%",
                      opacity: isRecording ? 0.8 : 0.2,
                    }}
                  />
                ))}
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => { setIsRecording(false); setMode("select"); setRecordingTime(0); }}
                  className="px-4 py-2 text-sm rounded-lg transition-colors"
                  style={{ color: "var(--text-secondary)" }}
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleStopVoice}
                  disabled={isSaving}
                  className="btn-glow h-14 px-8 rounded-full text-sm font-medium flex items-center gap-2"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                  </svg>
                  Stop & Save
                </button>
              </div>

              <div className="mt-4 text-xs ai-thinking" style={{ color: "var(--text-muted)" }}>
                {isSaving ? "Saving..." : "Recording..."}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
