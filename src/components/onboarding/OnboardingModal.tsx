'use client';

import { useState, useEffect } from 'react';
import { useStore, CATEGORY_COLORS, type GoalCategory } from '@/lib/store';
import { useRouter } from 'next/navigation';

const ONBOARDING_KEY = 'lotion_onboarding_done';

const FOCUS_AREAS: { id: GoalCategory; label: string; icon: string }[] = [
  { id: 'career', label: 'Career', icon: 'work' },
  { id: 'health', label: 'Health & Fitness', icon: 'fitness_center' },
  { id: 'finance', label: 'Finance', icon: 'savings' },
  { id: 'personal', label: 'Personal Growth', icon: 'self_improvement' },
  { id: 'creative', label: 'Creative Projects', icon: 'palette' },
  { id: 'business', label: 'Business', icon: 'business_center' },
];

const TOTAL_STEPS = 5;

export function OnboardingModal() {
  const store = useStore();
  const router = useRouter();

  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedAreas, setSelectedAreas] = useState<GoalCategory[]>([]);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalCategory, setGoalCategory] = useState<GoalCategory>('personal');
  const [goalTargetDate, setGoalTargetDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const done = localStorage.getItem(ONBOARDING_KEY);
    if (!done && !store.loading && store.goals.length === 0) {
      setVisible(true);
    }
  }, [store.loading, store.goals.length]);

  // Sync first selected area to goal category
  useEffect(() => {
    if (selectedAreas.length > 0) {
      setGoalCategory(selectedAreas[0]);
    }
  }, [selectedAreas]);

  function dismiss() {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setVisible(false);
  }

  function toggleArea(area: GoalCategory) {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  }

  async function handleCreateGoal() {
    if (!goalTitle.trim()) return;
    setSubmitting(true);
    try {
      await store.addGoal({
        title: goalTitle.trim(),
        description: '',
        category: goalCategory,
        priority: 'medium',
        targetDate: goalTargetDate || null,
        color: CATEGORY_COLORS[goalCategory],
        status: 'active',
      });
      setStep(4);
    } catch {
      // error toast handled by store
    } finally {
      setSubmitting(false);
    }
  }

  function handleFinish() {
    dismiss();
    router.push('/dashboard');
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg rounded-2xl border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.6)]"
        style={{ background: '#1F2D47' }}
      >
        {/* Progress bar */}
        <div
          className="h-1 w-full rounded-t-2xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.07)' }}
        >
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${(step / TOTAL_STEPS) * 100}%`,
              background: 'linear-gradient(90deg, #C17A72, #e09d97)',
            }}
          />
        </div>

        <div className="p-8">
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-8">
            <span
              className="text-[10px] uppercase tracking-[0.2em] font-bold"
              style={{ color: '#C17A72', fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Step {step} of {TOTAL_STEPS}
            </span>
            <button
              onClick={dismiss}
              className="text-gray-500 hover:text-gray-300 transition-colors"
              aria-label="Skip onboarding"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* ─── Step 1: Welcome ─── */}
          {step === 1 && (
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(193,122,114,0.4)]"
                style={{ background: 'linear-gradient(135deg, #C17A72, #8b5cf6)' }}
              >
                <span
                  className="material-symbols-outlined text-white text-3xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  smart_toy
                </span>
              </div>
              <h1
                className="text-4xl mb-3 text-white"
                style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic' }}
              >
                Welcome to Lotion 👋
              </h1>
              <p
                className="text-base mb-2"
                style={{ color: '#BEC6DF', fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Your AI life coach
              </p>
              <p
                className="text-sm leading-relaxed mb-10"
                style={{ color: '#9CA3AF', fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Lotion helps you set meaningful goals, stay accountable, and get personalised
                coaching — all in one place. Let&apos;s get you set up in under a minute.
              </p>
              <button
                onClick={() => setStep(2)}
                className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, #C17A72, #b06860)',
                  fontFamily: 'Space Grotesk, sans-serif',
                }}
              >
                Get Started
              </button>
            </div>
          )}

          {/* ─── Step 2: Focus Areas ─── */}
          {step === 2 && (
            <div>
              <h2
                className="text-2xl text-white mb-2"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                What do you want to focus on?
              </h2>
              <p
                className="text-sm mb-6"
                style={{ color: '#9CA3AF', fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Select all areas that matter to you right now.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {FOCUS_AREAS.map((area) => {
                  const selected = selectedAreas.includes(area.id);
                  return (
                    <button
                      key={area.id}
                      onClick={() => toggleArea(area.id)}
                      className="flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 text-left"
                      style={{
                        background: selected
                          ? `${CATEGORY_COLORS[area.id]}18`
                          : 'rgba(255,255,255,0.04)',
                        borderColor: selected ? CATEGORY_COLORS[area.id] : 'rgba(255,255,255,0.1)',
                        color: selected ? CATEGORY_COLORS[area.id] : '#BEC6DF',
                      }}
                    >
                      <span
                        className="material-symbols-outlined text-xl"
                        style={{ fontVariationSettings: selected ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        {area.icon}
                      </span>
                      <span
                        className="text-sm font-medium"
                        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                      >
                        {area.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-sm text-gray-400 hover:text-white transition-colors"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={selectedAreas.length === 0}
                  className="flex-1 py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #C17A72, #b06860)',
                    fontFamily: 'Space Grotesk, sans-serif',
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* ─── Step 3: Create First Goal ─── */}
          {step === 3 && (
            <div>
              <h2
                className="text-2xl text-white mb-2"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Create your first goal
              </h2>
              <p
                className="text-sm mb-6"
                style={{ color: '#9CA3AF', fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Start with one goal — you can always add more later.
              </p>

              <div className="space-y-4 mb-8">
                {/* Goal Title */}
                <div>
                  <label
                    className="block text-xs uppercase tracking-widest mb-2"
                    style={{ color: '#9CA3AF', fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    Goal title
                  </label>
                  <input
                    type="text"
                    value={goalTitle}
                    onChange={(e) => setGoalTitle(e.target.value)}
                    placeholder="e.g. Run a half marathon"
                    className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 border border-white/10 outline-none focus:border-[#C17A72] transition-colors"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      fontFamily: 'Space Grotesk, sans-serif',
                    }}
                  />
                </div>

                {/* Category */}
                <div>
                  <label
                    className="block text-xs uppercase tracking-widest mb-2"
                    style={{ color: '#9CA3AF', fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    Category
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(selectedAreas.length > 0 ? selectedAreas : FOCUS_AREAS.map((a) => a.id)).map(
                      (areaId) => {
                        const area = FOCUS_AREAS.find((a) => a.id === areaId)!;
                        if (!area) return null;
                        const selected = goalCategory === areaId;
                        return (
                          <button
                            key={areaId}
                            onClick={() => setGoalCategory(areaId)}
                            className="py-2 px-3 rounded-lg text-xs font-medium border transition-all"
                            style={{
                              background: selected
                                ? `${CATEGORY_COLORS[areaId]}20`
                                : 'rgba(255,255,255,0.04)',
                              borderColor: selected
                                ? CATEGORY_COLORS[areaId]
                                : 'rgba(255,255,255,0.08)',
                              color: selected ? CATEGORY_COLORS[areaId] : '#9CA3AF',
                              fontFamily: 'Space Grotesk, sans-serif',
                            }}
                          >
                            {area.label}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Target Date */}
                <div>
                  <label
                    className="block text-xs uppercase tracking-widest mb-2"
                    style={{ color: '#9CA3AF', fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    Target date{' '}
                    <span className="normal-case tracking-normal opacity-50">(optional)</span>
                  </label>
                  <input
                    type="date"
                    value={goalTargetDate}
                    onChange={(e) => setGoalTargetDate(e.target.value)}
                    className="w-full rounded-xl px-4 py-3 text-sm text-white border border-white/10 outline-none focus:border-[#C17A72] transition-colors"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      fontFamily: 'Space Grotesk, sans-serif',
                      colorScheme: 'dark',
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-sm text-gray-400 hover:text-white transition-colors"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  Back
                </button>
                <button
                  onClick={handleCreateGoal}
                  disabled={!goalTitle.trim() || submitting}
                  className="flex-1 py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #C17A72, #b06860)',
                    fontFamily: 'Space Grotesk, sans-serif',
                  }}
                >
                  {submitting ? 'Creating...' : 'Create Goal'}
                </button>
              </div>
            </div>
          )}

          {/* ─── Step 4: Connect Calendar ─── */}
          {step === 4 && (
            <div>
              <div
                className="w-14 h-14 rounded-xl mx-auto mb-6 flex items-center justify-center"
                style={{
                  background: 'rgba(66,133,244,0.15)',
                  border: '1px solid rgba(66,133,244,0.3)',
                }}
              >
                <span className="material-symbols-outlined text-2xl" style={{ color: '#4285F4' }}>
                  calendar_month
                </span>
              </div>
              <h2
                className="text-2xl text-white mb-2 text-center"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Connect your calendar
              </h2>
              <p
                className="text-sm mb-8 text-center"
                style={{ color: '#9CA3AF', fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Sync Google Calendar to see your events alongside your goals and tasks.
              </p>

              <div className="space-y-3 mb-8">
                <a
                  href="/settings"
                  onClick={dismiss}
                  className="flex items-center justify-center gap-3 w-full py-3 rounded-xl border border-white/10 text-sm font-medium text-white hover:border-white/20 transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    fontFamily: 'Space Grotesk, sans-serif',
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Connect Google Calendar
                </a>
                <button
                  onClick={() => setStep(5)}
                  className="w-full py-3 rounded-xl text-sm transition-colors"
                  style={{ color: '#9CA3AF', fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  Skip for now
                </button>
              </div>
            </div>
          )}

          {/* ─── Step 5: Done ─── */}
          {step === 5 && (
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(52,211,153,0.3)]"
                style={{
                  background: 'rgba(52,211,153,0.15)',
                  border: '1px solid rgba(52,211,153,0.3)',
                }}
              >
                <span
                  className="material-symbols-outlined text-3xl"
                  style={{ color: '#34d399', fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
              </div>
              <h2
                className="text-3xl text-white mb-3"
                style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic' }}
              >
                You&apos;re all set!
              </h2>
              <p
                className="text-sm mb-8"
                style={{ color: '#9CA3AF', fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Here are a few shortcuts to help you move fast:
              </p>

              <div className="space-y-3 mb-8 text-left">
                {[
                  { keys: ['Ctrl', 'K'], label: 'Open command palette — jump anywhere instantly' },
                  {
                    keys: ['Ctrl', 'Shift', 'J'],
                    label: 'Quick capture — capture a thought in seconds',
                  },
                ].map(({ keys, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-4 p-4 rounded-xl border border-white/8"
                    style={{ background: 'rgba(255,255,255,0.04)' }}
                  >
                    <div className="flex items-center gap-1 shrink-0">
                      {keys.map((k, i) => (
                        <span key={i} className="flex items-center gap-1">
                          <kbd
                            className="px-2 py-1 rounded text-xs font-mono border border-white/15"
                            style={{ background: 'rgba(255,255,255,0.08)', color: '#C17A72' }}
                          >
                            {k}
                          </kbd>
                          {i < keys.length - 1 && <span className="text-gray-600 text-xs">+</span>}
                        </span>
                      ))}
                    </div>
                    <span
                      className="text-sm"
                      style={{ color: '#BEC6DF', fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleFinish}
                className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, #C17A72, #b06860)',
                  fontFamily: 'Space Grotesk, sans-serif',
                }}
              >
                Let&apos;s go!
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
