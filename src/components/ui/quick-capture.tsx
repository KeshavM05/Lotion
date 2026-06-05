'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';

type CaptureMode = 'select' | 'text' | 'voice';
type CaptureType = 'note' | 'task' | 'idea';

const CAPTURE_TYPES: { type: CaptureType; label: string; icon: string; key: string }[] = [
  { type: 'note', label: 'Note', icon: 'edit_note', key: '1' },
  { type: 'task', label: 'Task', icon: 'check_circle', key: '2' },
  { type: 'idea', label: 'Idea', icon: 'lightbulb', key: '3' },
];

export function useQuickCapture() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      if (isTyping) return;

      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setIsOpen(true);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) };
}

// Static waveform heights (50 bars) — computed once, never random on each render
function generateWaveformHeights(count: number): number[] {
  const heights: number[] = [];
  // Use a deterministic sine-based pattern that looks organic
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const h =
      15 +
      70 *
        Math.abs(
          0.5 * Math.sin(t * Math.PI * 6) +
            0.3 * Math.sin(t * Math.PI * 11 + 1.2) +
            0.2 * Math.sin(t * Math.PI * 17 + 0.7)
        );
    heights.push(Math.max(8, Math.min(100, h)));
  }
  return heights;
}

export function QuickCaptureOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const store = useStore();
  const [mode, setMode] = useState<CaptureMode>('select');
  const [captureType, setCaptureType] = useState<CaptureType>('note');
  const [text, setText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedType, setSavedType] = useState<CaptureType>('note');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Voice state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [liveWaveform, setLiveWaveform] = useState<number[]>([]);
  const [transcript, setTranscript] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);

  // MediaRecorder refs — not state, so updates don't cause re-renders
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // Static waveform pattern (memoised, never re-computed)
  const staticWaveform = useMemo(() => generateWaveformHeights(50), []);

  // Display the live analyser waveform while recording, otherwise the static pattern
  const waveformHeights = isRecording && liveWaveform.length === 50 ? liveWaveform : staticWaveform;

  useEffect(() => {
    if (!isOpen) {
      setMode('select');
      setCaptureType('note');
      setText('');
      setIsSaving(false);
      setSaved(false);
      setIsRecording(false);
      setRecordingTime(0);
      setTranscript('');
      setIsTranscribing(false);
      setLiveWaveform([]);
      stopMediaResources();
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (mode === 'text' && textareaRef.current) {
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
      if (e.key === 'Escape' && isOpen) onClose();
      if (
        (e.metaKey || e.ctrlKey) &&
        e.key === 'Enter' &&
        mode === 'text' &&
        text.trim() &&
        !isSaving
      ) {
        handleSaveText();
      }
      // 1/2/3 to switch capture type in text mode
      if (mode === 'text' && !isSaving && !e.metaKey && !e.ctrlKey && !e.altKey) {
        if (e.key === '1') {
          e.preventDefault();
          setCaptureType('note');
        }
        if (e.key === '2') {
          e.preventDefault();
          setCaptureType('task');
        }
        if (e.key === '3') {
          e.preventDefault();
          setCaptureType('idea');
        }
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, mode, text, isSaving]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Media resource cleanup ───────────────────────────────────────────────
  function stopMediaResources() {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
  }

  // ── Live waveform via Web Audio AnalyserNode ─────────────────────────────
  function startAnalyser(stream: MediaStream) {
    try {
      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      source.connect(analyser);
      analyserRef.current = analyser;

      const data = new Uint8Array(analyser.frequencyBinCount);

      function tick() {
        analyser.getByteFrequencyData(data);
        // Map 64 frequency bins → 50 bars
        const bars: number[] = [];
        for (let i = 0; i < 50; i++) {
          const idx = Math.floor((i / 50) * data.length);
          bars.push(Math.max(8, (data[idx] / 255) * 100));
        }
        setLiveWaveform(bars);
        animFrameRef.current = requestAnimationFrame(tick);
      }
      animFrameRef.current = requestAnimationFrame(tick);
    } catch {
      // AudioContext not available — waveform stays static
    }
  }

  // ── Web Speech API transcription ─────────────────────────────────────────
  function startSpeechRecognition() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    const SpeechRec =
      typeof window !== 'undefined'
        ? win.SpeechRecognition || win.webkitSpeechRecognition || null
        : null;

    if (!SpeechRec) return;

    const recognition = new SpeechRec();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    let finalText = '';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (e: any) => {
      let interimText = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) {
          finalText += res[0].transcript + ' ';
        } else {
          interimText += res[0].transcript;
        }
      }
      setTranscript((finalText + interimText).trim());
    };

    recognition.onerror = () => {
      // Silently ignore — we fall back to duration-based note on stop
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      // Already started or not permitted
    }
  }

  // ── Start voice recording ────────────────────────────────────────────────
  async function startVoiceRecording() {
    chunksRef.current = [];
    setTranscript('');
    setRecordingTime(0);
    setLiveWaveform([]);

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err: unknown) {
      const isDenied =
        err instanceof DOMException &&
        (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError');
      toast.error(
        isDenied
          ? 'Microphone access denied. Please allow microphone access and try again.'
          : 'Could not access microphone. Please check your device settings.'
      );
      setMode('select');
      return;
    }

    streamRef.current = stream;

    // MediaRecorder
    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.start(100); // collect chunks every 100 ms

    setIsRecording(true);
    startAnalyser(stream);
    startSpeechRecognition();
  }

  // ── Stop voice recording & save ──────────────────────────────────────────
  async function handleStopVoice() {
    if (isSaving) return;

    // Capture transcript before stopping recognition (it gets cleared)
    const capturedTranscript = transcript.trim();

    // Stop all media resources
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    const duration = recordingTime;
    setIsRecording(false);
    setIsTranscribing(true);

    // Wait for MediaRecorder to flush its last chunk
    await new Promise<void>((resolve) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder || recorder.state === 'inactive') {
        resolve();
        return;
      }
      recorder.onstop = () => resolve();
      recorder.stop();
    });

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    setIsTranscribing(false);
    setIsSaving(true);

    // Determine what content to save
    const durationLabel = formatTime(duration);
    let content: string;
    if (capturedTranscript) {
      content = capturedTranscript;
    } else {
      content = `🎙️ Voice note (${durationLabel})`;
    }

    try {
      await store.addJournalEntry({ content, mood: null, linkedGoalIds: [] });
      setSaved(true);
      setTimeout(() => onClose(), 600);
    } catch (error) {
      console.error('Failed to save voice capture:', error);
      toast.error('Failed to save voice note. Please try again.');
      setIsSaving(false);
    }
  }

  function formatTime(s: number) {
    return `${Math.floor(s / 60)
      .toString()
      .padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  }

  // Start recording as soon as voice mode is entered
  async function enterVoiceMode() {
    setMode('voice');
    await startVoiceRecording();
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
      onClick={() => !isSaving && onClose()}
    >
      <div
        className="w-full max-w-2xl mx-4 rounded-2xl overflow-hidden animate-in"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(193,122,114,0.05)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center"
              style={{
                background: 'var(--accent-glow)',
                border: '1px solid rgba(193,122,114,0.3)',
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2.5"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Quick Capture
              </div>
              <div
                className="text-[10px]"
                style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}
              >
                Ctrl+Shift+J
              </div>
            </div>
          </div>
          <button
            onClick={() => !isSaving && onClose()}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Success state */}
          {saved && (
            <div className="text-center py-8 animate-in">
              <div
                className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(52,211,153,0.15)' }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--success)"
                  strokeWidth="2.5"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <p className="text-sm font-medium" style={{ color: 'var(--success)' }}>
                {savedType === 'task'
                  ? 'Task added!'
                  : savedType === 'idea'
                    ? 'Idea saved!'
                    : 'Note saved!'}
              </p>
            </div>
          )}

          {/* Select mode */}
          {!saved && mode === 'select' && (
            <div>
              <div className="text-center py-4">
                <h3
                  className="text-xl font-medium mb-1"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    color: 'var(--text-primary)',
                  }}
                >
                  What&apos;s on your mind?
                </h3>
                <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
                  Capture now, reflect later.
                </p>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={enterVoiceMode}
                    className="h-20 w-40 rounded-xl flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 btn-glow"
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                      <path d="M19 10v2a7 7 0 01-14 0v-2" />
                      <line x1="12" x2="12" y1="19" y2="23" />
                      <line x1="8" x2="16" y1="23" y2="23" />
                    </svg>
                    <span className="text-sm font-medium">Voice</span>
                  </button>
                  <button
                    onClick={() => setMode('text')}
                    className="h-20 w-40 rounded-xl flex flex-col items-center justify-center gap-2 transition-all hover:scale-105"
                    style={{
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                    <span className="text-sm font-medium">Type</span>
                  </button>
                </div>
              </div>

              {/* Recent captures */}
              {(store.journalEntries.length > 0 || store.tasks.length > 0) && (
                <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                  <p
                    className="text-[10px] font-medium uppercase tracking-wider mb-3"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Recent captures
                  </p>
                  <div className="space-y-1.5">
                    {[
                      ...store.journalEntries.slice(0, 3).map((e) => ({
                        id: e.id,
                        text: e.content.replace(/<[^>]+>/g, '').slice(0, 80),
                        type: 'note' as CaptureType,
                        createdAt: e.createdAt,
                      })),
                      ...store.tasks.slice(0, 2).map((t) => ({
                        id: t.id,
                        text: t.title.slice(0, 80),
                        type: 'task' as CaptureType,
                        createdAt: t.createdAt,
                      })),
                    ]
                      .sort(
                        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                      )
                      .slice(0, 5)
                      .map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg"
                          style={{ background: 'var(--bg-tertiary)' }}
                        >
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0"
                            style={{
                              background:
                                item.type === 'task'
                                  ? 'rgba(52,211,153,0.1)'
                                  : 'var(--accent-soft)',
                              color: item.type === 'task' ? 'var(--success)' : 'var(--accent)',
                            }}
                          >
                            {item.type}
                          </span>
                          <span
                            className="text-xs truncate"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            {item.text || '—'}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Text mode */}
          {!saved && mode === 'text' && (
            <div className="animate-in">
              {/* Capture type selector */}
              <div className="flex gap-2 mb-3">
                {CAPTURE_TYPES.map((ct) => (
                  <button
                    key={ct.type}
                    onClick={() => setCaptureType(ct.type)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background:
                        captureType === ct.type ? 'var(--accent-soft)' : 'var(--bg-tertiary)',
                      color: captureType === ct.type ? 'var(--accent)' : 'var(--text-muted)',
                      border: `1px solid ${captureType === ct.type ? 'rgba(193,122,114,0.3)' : 'var(--border)'}`,
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                      {ct.icon}
                    </span>
                    {ct.label}
                    <span
                      className="ml-0.5 opacity-50"
                      style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px' }}
                    >
                      [{ct.key}]
                    </span>
                  </button>
                ))}
              </div>
              <textarea
                ref={textareaRef}
                placeholder={
                  captureType === 'task'
                    ? 'What needs to get done?'
                    : captureType === 'idea'
                      ? "What's the idea?"
                      : "What's the thought, decision, or challenge on your mind?"
                }
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={isSaving}
                maxLength={2000}
                rows={5}
                className="w-full resize-none rounded-xl p-4 text-base leading-relaxed outline-none"
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  fontFamily: "'Inter', system-ui, sans-serif",
                }}
              />
              <div className="flex items-center justify-between mt-4">
                <div
                  className="flex items-center gap-2 text-[11px]"
                  style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}
                >
                  <span>{text.length}/2000</span>
                  <span style={{ color: 'var(--border)' }}>|</span>
                  <span>Ctrl+Enter to save · 1/2/3 to switch type</span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setMode('select')}
                    disabled={isSaving}
                    className="px-3 py-2 text-sm rounded-lg transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
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
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                        Save{' '}
                        {captureType === 'task' ? 'Task' : captureType === 'idea' ? 'Idea' : 'Note'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Voice mode */}
          {!saved && mode === 'voice' && (
            <div className="text-center py-6 animate-in">
              <div
                className="text-4xl font-medium mb-8"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color: 'var(--text-primary)',
                  letterSpacing: '0.1em',
                }}
              >
                {formatTime(recordingTime)}
              </div>

              {/* Waveform */}
              <div className="flex items-center gap-0.5 h-16 mb-4 justify-center px-12">
                {waveformHeights.map((h, i) => (
                  <div
                    key={i}
                    className="w-1 rounded-full transition-all duration-75"
                    style={{
                      backgroundColor: 'var(--accent)',
                      height: isRecording ? `${h}%` : '8%',
                      opacity: isRecording ? 0.8 : 0.2,
                    }}
                  />
                ))}
              </div>

              {/* Live transcript preview */}
              {transcript && (
                <div
                  className="mx-4 mb-6 px-4 py-3 rounded-xl text-sm text-left leading-relaxed"
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)',
                    fontStyle: 'italic',
                    maxHeight: '80px',
                    overflowY: 'auto',
                  }}
                >
                  {transcript}
                </div>
              )}

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => {
                    stopMediaResources();
                    setIsRecording(false);
                    setMode('select');
                    setRecordingTime(0);
                    setTranscript('');
                    setLiveWaveform([]);
                  }}
                  className="px-4 py-2 text-sm rounded-lg transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleStopVoice}
                  disabled={isSaving || isTranscribing}
                  className="btn-glow h-14 px-8 rounded-full text-sm font-medium flex items-center gap-2"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="1"
                  >
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                  </svg>
                  Stop & Save
                </button>
              </div>

              <div className="mt-4 text-xs ai-thinking" style={{ color: 'var(--text-muted)' }}>
                {isSaving ? 'Saving...' : isTranscribing ? 'Processing...' : 'Recording...'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  async function handleSaveText() {
    if (!text.trim() || isSaving) return;
    setIsSaving(true);
    try {
      if (captureType === 'task') {
        await store.addTask({
          title: text.trim(),
          description: '',
          status: 'todo',
          priority: 'medium',
          goalId: null,
          milestoneId: null,
          durationMinutes: 30,
          deadline: null,
          scheduledStart: null,
          scheduledEnd: null,
          listId: null,
        });
      } else {
        const content = captureType === 'idea' ? `💡 ${text.trim()}` : text.trim();
        await store.addJournalEntry({ content, mood: null, linkedGoalIds: [] });
      }
      setSavedType(captureType);
      setSaved(true);
      setTimeout(() => onClose(), 600);
    } catch (error) {
      console.error('Failed to save capture:', error);
      toast.error('Failed to save. Please try again.');
      setIsSaving(false);
    }
  }
}
