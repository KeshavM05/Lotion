'use client';

import { useState } from 'react';
import { useStore, type GoalCategory, CATEGORY_COLORS, CATEGORY_LABELS } from '@/lib/store';
import { toast } from 'sonner';

const FOCUS_AREAS: GoalCategory[] = [
  'career',
  'health',
  'finance',
  'personal',
  'business',
  'creative',
];

const SHORTCUTS = [
  { keys: 'Ctrl+K', label: 'Open command palette' },
  { keys: 'Ctrl+Shift+J', label: 'Quick capture overlay' },
  { keys: 'G then D', label: 'Go to Dashboard' },
  { keys: 'G then T', label: 'Go to Tasks' },
  { keys: 'G then G', label: 'Go to Goals' },
  { keys: 'G then C', label: 'Go to Calendar' },
  { keys: '?', label: 'Show shortcuts' },
];

const TOTAL_STEPS = 4;

interface Props {
  onDone: () => void;
}

export function OnboardingModal({ onDone }: Props) {
  const store = useStore();
  const [step, setStep] = useState(1);
  const [selectedAreas, setSelectedAreas] = useState<GoalCategory[]>([]);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalCategory, setGoalCategory] = useState<GoalCategory>('personal');
  const [saving, setSaving] = useState(false);

  function toggleArea(area: GoalCategory) {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  }

  async function handleCreateGoal() {
    if (!goalTitle.trim()) {
      setStep(3);
      return;
    }
    setSaving(true);
    try {
      await store.addGoal({
        title: goalTitle.trim(),
        description: '',
        category: goalCategory,
        priority: 'high',
        targetDate: null,
        color: CATEGORY_COLORS[goalCategory],
        status: 'active',
      });
      toast.success('Goal created!');
    } catch {
      toast.error('Failed to create goal');
    } finally {
      setSaving(false);
      setStep(3);
    }
  }

  function handleSkipGoal() {
    setStep(3);
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg mx-4 glass-card rounded-2xl p-8 shadow-2xl">
        {/* Progress dots */}
        <div className="flex items-center gap-2 mb-8">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i + 1 <= step ? 'bg-[#C17A72]' : 'bg-white/10'
              } ${i + 1 === step ? 'w-8' : 'w-4'}`}
            />
          ))}
          <button
            onClick={onDone}
            className="ml-auto text-xs text-[#9CA3AF] hover:text-white transition-colors"
          >
            Skip setup
          </button>
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div>
            <div className="text-4xl mb-4">👋</div>
            <h2 className="text-2xl font-['Playfair_Display'] font-semibold text-[#F5F5F5] mb-2">
              Welcome to Lotion
            </h2>
            <p className="text-[#9CA3AF] text-sm mb-6">
              Your AI life coach. Let&apos;s take 2 minutes to set things up so we can help you
              reach your goals.
            </p>

            <div className="mb-6">
              <p className="text-xs text-[#9CA3AF] uppercase tracking-wider mb-3">
                What are you focused on? (pick any)
              </p>
              <div className="grid grid-cols-3 gap-2">
                {FOCUS_AREAS.map((area) => (
                  <button
                    key={area}
                    onClick={() => toggleArea(area)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                      selectedAreas.includes(area)
                        ? 'border-[#C17A72]/50 bg-[#C17A72]/15 text-[#F5F5F5]'
                        : 'border-white/10 bg-white/5 text-[#9CA3AF] hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: CATEGORY_COLORS[area] }}
                    />
                    {CATEGORY_LABELS[area]}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                if (selectedAreas.length > 0) setGoalCategory(selectedAreas[0]);
                setStep(2);
              }}
              className="btn-glow w-full py-3 rounded-xl font-medium"
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 2: Create first goal */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-['Playfair_Display'] font-semibold text-[#F5F5F5] mb-2">
              Set your first goal
            </h2>
            <p className="text-[#9CA3AF] text-sm mb-6">
              Goals are the heart of Lotion. Each goal gets its own AI coach, milestone tracker, and
              task list.
            </p>

            <div className="mb-4">
              <label className="text-xs text-[#9CA3AF] uppercase tracking-wider mb-2 block">
                What do you want to achieve?
              </label>
              <input
                type="text"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateGoal()}
                placeholder="e.g. Launch my SaaS product, Run a 5K, Save $10K…"
                autoFocus
                className="input-glass w-full"
              />
            </div>

            <div className="mb-6">
              <label className="text-xs text-[#9CA3AF] uppercase tracking-wider mb-2 block">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {FOCUS_AREAS.map((area) => (
                  <button
                    key={area}
                    onClick={() => setGoalCategory(area)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      goalCategory === area
                        ? 'border-[#C17A72]/50 bg-[#C17A72]/15 text-[#F5F5F5]'
                        : 'border-white/10 bg-white/5 text-[#9CA3AF] hover:text-white'
                    }`}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: CATEGORY_COLORS[area] }}
                    />
                    {CATEGORY_LABELS[area]}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSkipGoal}
                className="flex-1 py-3 rounded-xl text-sm text-[#9CA3AF] hover:text-white border border-white/10 hover:bg-white/5 transition-colors"
              >
                Skip for now
              </button>
              <button
                onClick={handleCreateGoal}
                disabled={saving || !goalTitle.trim()}
                className="flex-1 btn-glow py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Creating…' : 'Create Goal →'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Connect calendar (skippable) */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-['Playfair_Display'] font-semibold text-[#F5F5F5] mb-2">
              Connect your calendar
            </h2>
            <p className="text-[#9CA3AF] text-sm mb-6">
              Sync with Google Calendar or Outlook to see your events alongside your tasks and get
              smarter scheduling suggestions.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#4285f4]/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm text-[#4285f4]">
                      calendar_month
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#F5F5F5]">Google Calendar</p>
                    <p className="text-xs text-[#9CA3AF]">Two-way sync</p>
                  </div>
                </div>
                <span className="text-xs text-[#9CA3AF] bg-white/5 px-2 py-1 rounded">
                  Coming soon
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0078d4]/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm text-[#0078d4]">event</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#F5F5F5]">Microsoft Outlook</p>
                    <p className="text-xs text-[#9CA3AF]">Two-way sync</p>
                  </div>
                </div>
                <span className="text-xs text-[#9CA3AF] bg-white/5 px-2 py-1 rounded">
                  Coming soon
                </span>
              </div>
            </div>

            <button
              onClick={() => setStep(4)}
              className="btn-glow w-full py-3 rounded-xl font-medium"
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 4: Keyboard shortcuts */}
        {step === 4 && (
          <div>
            <h2 className="text-2xl font-['Playfair_Display'] font-semibold text-[#F5F5F5] mb-2">
              You&apos;re all set 🎉
            </h2>
            <p className="text-[#9CA3AF] text-sm mb-6">
              Here are a few shortcuts to help you move fast.
            </p>

            <div className="space-y-2 mb-8">
              {SHORTCUTS.map(({ keys, label }) => (
                <div key={keys} className="flex items-center justify-between py-2">
                  <span className="text-sm text-[#9CA3AF]">{label}</span>
                  <kbd className="px-2.5 py-1 text-xs font-['JetBrains_Mono'] bg-white/10 border border-white/15 rounded-lg text-[#F5F5F5]">
                    {keys}
                  </kbd>
                </div>
              ))}
            </div>

            <button onClick={onDone} className="btn-glow w-full py-3 rounded-xl font-medium">
              Start using Lotion →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
