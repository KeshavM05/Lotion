'use client';

import { useStore, CATEGORY_LABELS } from '@/lib/store';
import { GoalProgressChart } from '@/components/analytics/GoalProgressChart';
import { GoalCategoryBreakdown } from '@/components/analytics/GoalCategoryBreakdown';
import { StreakTracker } from '@/components/analytics/StreakTracker';
import { ProgressRing } from '@/components/ui/progress-ring';

export default function AnalyticsPage() {
  const store = useStore();

  // ── Overview stats ──────────────────────────────────────
  const totalGoals = store.goals.length;
  const activeGoals = store.goals.filter((g) => g.status === 'active').length;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const completedThisMonth = store.goals.filter(
    (g) => g.status === 'completed' && g.updatedAt && new Date(g.updatedAt) >= startOfMonth
  ).length;

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const tasksDoneThisWeek = store.tasks.filter(
    (t) => t.completed && t.completedAt && new Date(t.completedAt) >= startOfWeek
  ).length;

  const stats = [
    { label: 'Total Goals', value: totalGoals, icon: 'auto_awesome_motion', color: '#C17A72' },
    { label: 'Active Goals', value: activeGoals, icon: 'flag', color: '#f59e0b' },
    {
      label: 'Completed This Month',
      value: completedThisMonth,
      icon: 'check_circle',
      color: '#34d399',
    },
    { label: 'Tasks Done This Week', value: tasksDoneThisWeek, icon: 'task_alt', color: '#60a5fa' },
  ];

  // ── Per-goal progress cards ────────────────────────────
  const goalsWithData = store.goals
    .filter((g) => g.status === 'active')
    .map((goal) => {
      const milestones = store.getGoalMilestones(goal.id);
      const tasks = store.getGoalTasks(goal.id);
      const progress = store.getGoalProgress(goal.id);
      return { goal, milestones, tasks, progress };
    });

  return (
    <div className="space-y-10">
      {/* ── Overview Stats ── */}
      <section>
        <h2 className="text-lg font-['Playfair_Display'] text-[#F5F5F5] mb-5">Overview</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="glass-card rounded-2xl p-6 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-xl"
                  style={{ color: s.color, fontVariationSettings: "'FILL' 1" }}
                >
                  {s.icon}
                </span>
                <span className="text-xs font-['Space_Grotesk'] tracking-widest uppercase text-[#9CA3AF]">
                  {s.label}
                </span>
              </div>
              <span className="text-4xl font-['JetBrains_Mono'] text-[#F5F5F5]">{s.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Category Breakdown + Streaks ── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category donut */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-base font-['Playfair_Display'] text-[#F5F5F5] mb-4">
            Goals by Category
          </h2>
          <GoalCategoryBreakdown goals={store.goals} />
        </div>

        {/* Streak tracker */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-base font-['Playfair_Display'] text-[#F5F5F5] mb-4">Streaks</h2>
          <StreakTracker tasks={store.tasks} journalEntries={store.journalEntries} />
        </div>
      </section>

      {/* ── Per-goal progress cards ── */}
      <section>
        <h2 className="text-lg font-['Playfair_Display'] text-[#F5F5F5] mb-5">Goal Progress</h2>
        {goalsWithData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-[#9CA3AF]">
            <span className="material-symbols-outlined text-5xl opacity-20 mb-4">bar_chart</span>
            <p className="text-sm">No active goals to display</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {goalsWithData.map(({ goal, milestones, tasks, progress }) => (
              <div key={goal.id} className="glass-card rounded-2xl p-6">
                {/* Card header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0 mr-4">
                    <h3 className="text-base font-['Playfair_Display'] text-[#F5F5F5] truncate">
                      {goal.title}
                    </h3>
                    <p className="text-xs text-[#9CA3AF] font-['Space_Grotesk'] mt-0.5">
                      {CATEGORY_LABELS[goal.category]} •{' '}
                      {goal.targetDate
                        ? new Date(goal.targetDate).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'Ongoing'}
                    </p>
                  </div>
                  <ProgressRing progress={progress} size={56} strokeWidth={4} color="#C17A72">
                    <span className="font-['JetBrains_Mono'] text-xs text-[#F5F5F5]">
                      {progress}%
                    </span>
                  </ProgressRing>
                </div>

                {/* Mini stats */}
                <div className="flex gap-4 mb-4 text-xs text-[#9CA3AF] font-['Space_Grotesk']">
                  <span>
                    <span className="text-[#C17A72] font-['JetBrains_Mono']">
                      {milestones.filter((m) => m.completed).length}
                    </span>
                    /{milestones.length} milestones
                  </span>
                  <span>
                    <span className="text-[#C17A72] font-['JetBrains_Mono']">
                      {tasks.filter((t) => t.completed).length}
                    </span>
                    /{tasks.length} tasks
                  </span>
                </div>

                {/* Line chart (only if milestones exist) */}
                {milestones.length > 1 ? (
                  <GoalProgressChart milestones={milestones} goalTitle={goal.title} />
                ) : milestones.length === 1 ? (
                  <div className="text-xs text-[#9CA3AF] italic">
                    Add more milestones to see a timeline chart
                  </div>
                ) : (
                  <div className="text-xs text-[#9CA3AF] italic">
                    No milestones — progress tracked via tasks
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
