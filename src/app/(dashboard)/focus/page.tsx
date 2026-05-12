"use client";

import { useState, useEffect, useRef } from "react";
import { useStore, type Task } from "@/lib/store";
import { usePageHeader } from "@/lib/page-header-context";

type TimerMode = "pomodoro" | "short_break" | "long_break" | "custom";

const TIMER_DURATIONS = {
  pomodoro: 25 * 60,
  short_break: 5 * 60,
  long_break: 15 * 60,
  custom: 0,
};

export default function FocusPage() {
  const store = useStore();
  const { setPageControls } = usePageHeader();

  // Current focused task
  const [focusedTask, setFocusedTask] = useState<Task | null>(null);
  const [queuedTasks, setQueuedTasks] = useState<Task[]>([]);

  // Timer state
  const [timerMode, setTimerMode] = useState<TimerMode>("pomodoro");
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATIONS.pomodoro);
  const [isRunning, setIsRunning] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(25);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Notes
  const [notes, setNotes] = useState("");

  // Load tasks
  useEffect(() => {
    const incompleteTasks = store.tasks
      .filter((t) => !t.completed && t.status !== "cancelled")
      .sort((a, b) => {
        // Sort by priority (critical > high > medium > low), then by deadline
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityDiff !== 0) return priorityDiff;

        if (a.deadline && b.deadline) {
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        }
        if (a.deadline) return -1;
        if (b.deadline) return 1;
        return 0;
      });

    if (!focusedTask && incompleteTasks.length > 0) {
      setFocusedTask(incompleteTasks[0]);
      setQueuedTasks(incompleteTasks.slice(1));
    } else if (focusedTask) {
      // Update queued tasks, excluding the focused one
      setQueuedTasks(incompleteTasks.filter((t) => t.id !== focusedTask.id));
    } else {
      setQueuedTasks([]);
    }
  }, [store.tasks, focusedTask]);

  // Set page header
  useEffect(() => {
    setPageControls(
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setIsRunning(false);
            setTimeLeft(TIMER_DURATIONS[timerMode]);
          }}
          className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#9CA3AF] hover:text-white hover:bg-white/5 transition-colors"
        >
          Reset Timer
        </button>
        <button
          onClick={() => setFocusedTask(null)}
          className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#9CA3AF] hover:text-white hover:bg-white/5 transition-colors"
        >
          Clear Focus
        </button>
      </div>
    );
    return () => {
      setPageControls(null);
    };
  }, [setPageControls, timerMode]);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            // Play notification sound or show alert
            if (typeof window !== "undefined" && "Notification" in window) {
              if (Notification.permission === "granted") {
                new Notification("Timer Complete!", {
                  body: timerMode === "pomodoro" ? "Time for a break!" : "Time to focus!",
                });
              }
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, timeLeft, timerMode]);

  // Timer controls
  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(timerMode === "custom" ? customMinutes * 60 : TIMER_DURATIONS[timerMode]);
  };

  const changeTimerMode = (mode: TimerMode) => {
    setTimerMode(mode);
    setIsRunning(false);
    if (mode === "custom") {
      setTimeLeft(customMinutes * 60);
    } else {
      setTimeLeft(TIMER_DURATIONS[mode]);
    }
  };

  // Task actions
  const completeTask = async () => {
    if (!focusedTask) return;
    await store.updateTask(focusedTask.id, {
      completed: true,
      status: "done",
      completedAt: new Date().toISOString(),
    });
    // Move to next task
    if (queuedTasks.length > 0) {
      setFocusedTask(queuedTasks[0]);
    } else {
      setFocusedTask(null);
    }
    resetTimer();
  };

  const skipTask = () => {
    if (queuedTasks.length > 0) {
      setFocusedTask(queuedTasks[0]);
    } else {
      setFocusedTask(null);
    }
    resetTimer();
  };

  const selectTask = (task: Task) => {
    setFocusedTask(task);
    resetTimer();
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Request notification permission
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, []);

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Main Focus Area */}
      <div className="flex-1 flex flex-col">
        {focusedTask ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-8">
            {/* Task Info */}
            <div className="text-center space-y-4 max-w-2xl">
              <div className="flex items-center justify-center gap-2 mb-6">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: { critical: "#ef4444", high: "#f59e0b", medium: "#3b82f6", low: "#6b7280" }[
                      focusedTask.priority
                    ],
                  }}
                />
                <span className="text-xs font-['JetBrains_Mono'] text-[#9CA3AF] uppercase tracking-wider">
                  {focusedTask.priority} Priority
                </span>
              </div>
              <h1 className="text-4xl font-['Playfair_Display'] font-bold text-[#F5F5F5] mb-4">
                {focusedTask.title}
              </h1>
              {focusedTask.description && (
                <p className="text-lg text-[#BEC6DF] font-['Space_Grotesk'] leading-relaxed">
                  {focusedTask.description}
                </p>
              )}
              {focusedTask.deadline && (
                <div className="flex items-center justify-center gap-2 text-sm text-[#9CA3AF]">
                  <span className="material-symbols-outlined text-base">calendar_today</span>
                  <span>Due {new Date(focusedTask.deadline).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {/* Timer */}
            <div className="glass-card rounded-3xl p-12 space-y-6">
              {/* Timer Display */}
              <div className="text-center">
                <div className="text-8xl font-['JetBrains_Mono'] font-bold text-[#F5F5F5] mb-4 tabular-nums">
                  {formatTime(timeLeft)}
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-[#9CA3AF]">
                  <span className="material-symbols-outlined text-base">timer</span>
                  <span className="uppercase tracking-wider">
                    {timerMode === "pomodoro" ? "Focus" : timerMode === "short_break" ? "Short Break" : timerMode === "long_break" ? "Long Break" : "Custom"}
                  </span>
                </div>
              </div>

              {/* Timer Controls */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={isRunning ? pauseTimer : startTimer}
                  className="px-8 py-3 rounded-xl bg-[#C17A72] text-white font-['Space_Grotesk'] font-semibold text-sm hover:bg-[#C17A72]/90 transition-all active:scale-95"
                >
                  {isRunning ? (
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">pause</span>
                      Pause
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">play_arrow</span>
                      Start
                    </span>
                  )}
                </button>
                <button
                  onClick={resetTimer}
                  className="px-6 py-3 rounded-xl bg-white/5 text-[#9CA3AF] hover:text-white hover:bg-white/10 transition-all font-['Space_Grotesk'] font-medium text-sm"
                >
                  <span className="material-symbols-outlined text-lg">refresh</span>
                </button>
              </div>

              {/* Timer Mode Selector */}
              <div className="flex items-center justify-center gap-2">
                {(["pomodoro", "short_break", "long_break"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => changeTimerMode(mode)}
                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                      timerMode === mode
                        ? "bg-[#C17A72]/20 text-[#C17A72] border border-[#C17A72]/30"
                        : "text-[#9CA3AF] hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {mode === "pomodoro" ? "25m" : mode === "short_break" ? "5m" : "15m"}
                  </button>
                ))}
                <div className="relative">
                  <button
                    onClick={() => changeTimerMode("custom")}
                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                      timerMode === "custom"
                        ? "bg-[#C17A72]/20 text-[#C17A72] border border-[#C17A72]/30"
                        : "text-[#9CA3AF] hover:text-white hover:bg-white/5"
                    }`}
                  >
                    Custom
                  </button>
                  {timerMode === "custom" && (
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={customMinutes}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        setCustomMinutes(val);
                        setTimeLeft(val * 60);
                      }}
                      className="absolute top-full left-0 mt-2 w-20 px-3 py-2 bg-[#1F2D47] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#C17A72]/50"
                      placeholder="Min"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Task Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={completeTask}
                className="px-6 py-3 rounded-xl bg-green-600/20 border border-green-600/30 text-green-400 font-['Space_Grotesk'] font-semibold text-sm hover:bg-green-600/30 transition-all active:scale-95"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                  Complete Task
                </span>
              </button>
              <button
                onClick={skipTask}
                className="px-6 py-3 rounded-xl bg-white/5 text-[#9CA3AF] hover:text-white hover:bg-white/10 transition-all font-['Space_Grotesk'] font-medium text-sm"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">skip_next</span>
                  Skip Task
                </span>
              </button>
            </div>

            {/* Notes */}
            <div className="w-full max-w-2xl glass-card rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-base text-[#C17A72]">description</span>
                <label className="text-sm font-['Space_Grotesk'] font-semibold text-[#F5F5F5]">
                  Session Notes
                </label>
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Jot down thoughts, progress, or blockers..."
                className="w-full h-24 px-4 py-3 bg-[#1F2D47]/50 border border-white/10 rounded-lg text-sm text-[#F5F5F5] placeholder:text-[#9CA3AF]/50 focus:outline-none focus:border-[#C17A72]/50 resize-none font-['Space_Grotesk']"
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-[#C17A72]/10 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-4xl text-[#C17A72]">
                radio_button_unchecked
              </span>
            </div>
            <h2 className="text-2xl font-['Playfair_Display'] font-bold text-[#F5F5F5]">
              No Task Selected
            </h2>
            <p className="text-[#9CA3AF] font-['Space_Grotesk'] max-w-md">
              Select a task from the queue on the right to begin your focus session.
            </p>
          </div>
        )}
      </div>

      {/* Task Queue Sidebar */}
      <div className="w-80 flex-shrink-0 glass-card rounded-2xl p-6 overflow-hidden flex flex-col">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-['Playfair_Display'] font-bold text-[#F5F5F5]">Task Queue</h3>
            <span className="text-xs font-['JetBrains_Mono'] text-[#9CA3AF] bg-white/5 px-2 py-1 rounded-md">
              {queuedTasks.length}
            </span>
          </div>
          <p className="text-xs text-[#9CA3AF] font-['Space_Grotesk']">
            Prioritized by urgency and importance
          </p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          {queuedTasks.length === 0 ? (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-4xl text-[#9CA3AF]/30 mb-2">
                task_alt
              </span>
              <p className="text-sm text-[#9CA3AF]">No tasks in queue</p>
            </div>
          ) : (
            queuedTasks.map((task, index) => (
              <button
                key={task.id}
                onClick={() => selectTask(task)}
                className="w-full text-left glass-card rounded-lg p-4 hover:bg-white/[0.02] transition-all group"
              >
                <div className="flex items-start gap-3">
                  <span className="text-xs font-['JetBrains_Mono'] text-[#9CA3AF] mt-0.5">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{
                          background: { critical: "#ef4444", high: "#f59e0b", medium: "#3b82f6", low: "#6b7280" }[
                            task.priority
                          ],
                        }}
                      />
                      <h4 className="text-sm font-['Space_Grotesk'] font-semibold text-[#F5F5F5] truncate group-hover:text-[#C17A72] transition-colors">
                        {task.title}
                      </h4>
                    </div>
                    {task.description && (
                      <p className="text-xs text-[#9CA3AF] line-clamp-2 mb-2">{task.description}</p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-[#9CA3AF]">
                      {task.durationMinutes > 0 && (
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">schedule</span>
                          {task.durationMinutes}m
                        </span>
                      )}
                      {task.deadline && (
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">event</span>
                          {new Date(task.deadline).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
