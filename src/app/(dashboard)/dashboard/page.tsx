'use client';

import Link from 'next/link';
import { useStore, CATEGORY_LABELS } from '@/lib/store';
import { ProgressRing } from '@/components/ui/progress-ring';

export default function DashboardPage() {
  const store = useStore();

  const activeGoals = store.goals.filter((g) => g.status === 'active');
  const activeTasks = store.tasks.filter((t) => !t.completed);
  const completedTasks = store.tasks.filter((t) => t.completed);
  const todayEntries = store.journalEntries.filter(
    (e) => new Date(e.createdAt).toDateString() === new Date().toDateString()
  );
  const todayEvents = store.events.filter(
    (e) => new Date(e.start).toDateString() === new Date().toDateString()
  );

  // Streaks
  const journalDays = new Set(store.journalEntries.map((e) => new Date(e.createdAt).toDateString()))
    .size;

  // Urgents
  const overdueTasks = activeTasks.filter((t) => t.deadline && new Date(t.deadline) < new Date());
  const upcomingDeadlines = activeTasks
    .filter((t) => t.deadline && new Date(t.deadline) > new Date())
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .slice(0, 5);

  return (
    <div className="flex flex-col h-full">
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Main Content Column */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* AI Coach Featured Insight Card */}
          <Link
            href="/coach"
            className="glass-card p-8 rounded-2xl relative overflow-hidden group block hover:border-[#C17A72]/40 transition-all duration-500 hover:shadow-[0_0_40px_rgba(193,122,114,0.15)]"
          >
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10 group-hover:opacity-20 transition-opacity">
              <div className="absolute inset-0 bg-gradient-to-br from-[#C17A72] to-[#8b5cf6] blur-3xl rounded-full"></div>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="relative">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#C17A72] to-[#8b5cf6] flex items-center justify-center shadow-[0_0_20px_rgba(193,122,114,0.3)] group-hover:shadow-[0_0_30px_rgba(193,122,114,0.5)] transition-shadow">
                    <span
                      className="material-symbols-outlined text-white text-xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      smart_toy
                    </span>
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#C17A72] rounded-full animate-pulse"></div>
                </div>
                <div>
                  <span className="font-['Space_Grotesk'] text-xs uppercase tracking-[0.15em] text-[#C17A72] font-bold block">
                    AI Life Coach
                  </span>
                  <span className="font-['Space_Grotesk'] text-[10px] text-[#9CA3AF] uppercase tracking-wider">
                    Personalized Insight
                  </span>
                </div>
              </div>
              <h3 className="text-3xl font-['Playfair_Display'] italic text-white mb-4 leading-snug">
                "The quietest hours often hold the loudest truths. You've been most productive at
                7:00 AM this week—try leaning into that stillness tomorrow."
              </h3>
              <p className="text-[#BEC6DF] font-['Space_Grotesk'] text-sm leading-relaxed mb-6">
                Based on your recent journal entries and task completion patterns, your creative
                energy peaks when your environment is at its lowest frequency.
              </p>
              <div className="flex items-center gap-2 text-[#C17A72] font-['Space_Grotesk'] text-sm font-semibold group-hover:gap-3 transition-all">
                <span>Talk to Your Coach</span>
                <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </div>
          </Link>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center text-center">
              <span className="font-['JetBrains_Mono'] text-4xl text-[#C17A72] mb-1">
                {activeGoals.length}
              </span>
              <span className="font-['Space_Grotesk'] text-xs text-on-secondary-container uppercase tracking-widest">
                Active Goals
              </span>
            </div>
            <div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center text-center border-l-2 border-l-[#C17A72]/30">
              <span className="font-['JetBrains_Mono'] text-4xl text-[#C17A72] mb-1">
                {activeTasks.length}
              </span>
              <span className="font-['Space_Grotesk'] text-xs text-on-secondary-container uppercase tracking-widest">
                Tasks Due Today
              </span>
            </div>
            <div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center text-center">
              <span className="font-['JetBrains_Mono'] text-4xl text-[#C17A72] mb-1">
                {Math.round((completedTasks.length / Math.max(store.tasks.length, 1)) * 100)}%
              </span>
              <span className="font-['Space_Grotesk'] text-xs text-on-secondary-container uppercase tracking-widest">
                Week Progress
              </span>
            </div>
          </div>

          {/* Goals Section */}
          <div className="pt-8">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-serif text-2xl text-white">Active Goals</h4>
              <Link
                href="/goals"
                className="text-xs font-label text-[#9CA3AF] hover:text-[#C17A72] uppercase tracking-widest"
              >
                View All
              </Link>
            </div>
            {activeGoals.length === 0 ? (
              <EmptyCard
                message="No goals yet. Define your vision to get started."
                linkText="Create a goal"
                linkHref="/goals"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeGoals.slice(0, 4).map((goal) => {
                  const progress = store.getGoalProgress(goal.id);
                  return (
                    <Link
                      key={goal.id}
                      href={`/goals/${goal.id}`}
                      className="glass-card p-6 rounded-2xl flex items-center gap-4 group hover:scale-[1.02] transition-all duration-300"
                    >
                      <ProgressRing
                        progress={progress}
                        size={56}
                        strokeWidth={4}
                        color={goal.color}
                      >
                        <span className="text-xs font-mono font-bold text-[#F5F5F5]">
                          {progress}%
                        </span>
                      </ProgressRing>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-label text-white group-hover:text-[#C17A72] transition-colors truncate mb-1">
                          {goal.title}
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className="text-[10px] px-2 py-0.5 rounded uppercase tracking-wider"
                            style={{ background: `${goal.color}20`, color: goal.color }}
                          >
                            {CATEGORY_LABELS[goal.category]}
                          </span>
                          <span className="text-[10px] text-on-secondary-container">
                            {store.getGoalTasks(goal.id).filter((t) => !t.completed).length} tasks
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Personal Stats Dashboard */}
          <div className="pt-8">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-serif text-2xl text-white">Daily Stats</h4>
              <span className="text-[10px] font-['Space_Grotesk'] text-[#9CA3AF] uppercase tracking-widest">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard
                icon="task_alt"
                label="Tasks Done Today"
                value={completedTasks
                  .filter(
                    (t) =>
                      t.completedAt &&
                      new Date(t.completedAt).toDateString() === new Date().toDateString()
                  )
                  .length.toString()}
                color="#10b981"
              />
              <StatCard
                icon="local_fire_department"
                label="Journal Streak"
                value={`${journalDays}d`}
                color="#f59e0b"
              />
              <StatCard
                icon="target"
                label="Goal Progress"
                value={`${activeGoals.length > 0 ? Math.round(activeGoals.reduce((sum, g) => sum + store.getGoalProgress(g.id), 0) / activeGoals.length) : 0}%`}
                color="#C17A72"
              />
              <StatCard
                icon="schedule"
                label="Events Today"
                value={todayEvents.length.toString()}
                color="#8b5cf6"
              />
            </div>

            {/* Weekly progress bar */}
            <div className="glass-card p-5 rounded-xl mt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-['Space_Grotesk'] text-[#9CA3AF] uppercase tracking-wider">
                  Weekly Task Completion
                </span>
                <span className="text-sm font-mono font-bold text-[#C17A72]">
                  {completedTasks.length}/{store.tasks.length}
                </span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#C17A72] to-[#8b5cf6] transition-all duration-500"
                  style={{
                    width: `${Math.round((completedTasks.length / Math.max(store.tasks.length, 1)) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Overdue & upcoming deadlines */}
            {(overdueTasks.length > 0 || upcomingDeadlines.length > 0) && (
              <div className="glass-card p-5 rounded-xl mt-4">
                {overdueTasks.length > 0 && (
                  <div className="mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">
                      Overdue ({overdueTasks.length})
                    </span>
                    <div className="mt-2 space-y-1">
                      {overdueTasks.slice(0, 3).map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center gap-2 text-xs text-red-300/80"
                        >
                          <span className="material-symbols-outlined text-sm">warning</span>
                          <span className="truncate">{task.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {upcomingDeadlines.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                      Upcoming Deadlines
                    </span>
                    <div className="mt-2 space-y-1">
                      {upcomingDeadlines.slice(0, 3).map((task) => (
                        <div key={task.id} className="flex items-center justify-between text-xs">
                          <span className="text-[#BEC6DF] truncate">{task.title}</span>
                          <span className="text-[#6B7280] font-mono ml-2 flex-shrink-0">
                            {new Date(task.deadline!).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Journal Preview */}
          <div className="pt-8">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-serif text-2xl text-white">Journal Preview</h4>
              <Link
                href="/journal"
                className="text-xs font-label text-[#9CA3AF] hover:text-[#C17A72] uppercase tracking-widest"
              >
                View All Entries
              </Link>
            </div>
            {store.journalEntries.length === 0 ? (
              <EmptyCard
                message="No journal entries yet. Start capturing your thoughts."
                linkText="Write entry"
                linkHref="/journal"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {store.journalEntries.slice(0, 2).map((entry) => (
                  <div
                    key={entry.id}
                    className="glass-card p-8 rounded-2xl transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <span className="font-mono text-xs text-[#C17A72]">
                        {new Date(entry.createdAt)
                          .toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                          .toUpperCase()}
                      </span>
                      <div className="h-px flex-1 bg-white/10"></div>
                    </div>
                    <h5 className="text-lg font-serif text-white mb-2">
                      {new Date(entry.createdAt).toLocaleTimeString([], {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}{' '}
                      Entry
                    </h5>
                    <p className="text-on-secondary-container font-body text-sm line-clamp-3 leading-relaxed opacity-70">
                      {entry.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Upcoming Events */}
          <div className="glass-card p-8 rounded-2xl">
            <div className="flex items-center justify-between mb-8">
              <h4 className="font-serif text-xl text-white">Upcoming</h4>
              <span className="material-symbols-outlined text-[#9CA3AF] cursor-pointer hover:text-white transition-colors">
                calendar_view_day
              </span>
            </div>
            {todayEvents.length === 0 ? (
              <p className="text-sm text-on-secondary-container">No events today</p>
            ) : (
              <div className="space-y-8">
                {todayEvents.slice(0, 3).map((event, idx, arr) => (
                  <div key={event.id} className="flex gap-4 group cursor-pointer">
                    <div className="flex flex-col items-center">
                      <span className="font-mono text-sm text-[#C17A72] font-bold">
                        {new Date(event.start).toLocaleTimeString([], {
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </span>
                      {idx < arr.length - 1 && <div className="w-px h-full bg-white/10 my-2"></div>}
                    </div>
                    <div className={idx < arr.length - 1 ? 'pb-6' : ''}>
                      <p className="text-sm font-label text-white group-hover:text-[#C17A72] transition-colors">
                        {event.title}
                      </p>
                      <p className="text-xs text-[#9CA3AF] mt-1">
                        {event.description || 'No description'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="glass-card p-8 rounded-2xl">
            <h4 className="font-serif text-xl text-white mb-6">Overview</h4>
            <div className="space-y-4">
              <StatRow label="Total Goals" value={store.goals.length.toString()} />
              <StatRow
                label="Tasks Completed"
                value={`${completedTasks.length}/${store.tasks.length}`}
              />
              <StatRow label="Journal Days" value={journalDays.toString()} />
              <StatRow label="AI Chats" value={store.chatMessages.length.toString()} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-on-secondary-container">{label}</span>
      <span className="text-sm font-mono font-semibold text-white">{value}</span>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="glass-card p-4 rounded-xl text-center">
      <span className="material-symbols-outlined text-xl mb-1 block" style={{ color }}>
        {icon}
      </span>
      <span className="font-['JetBrains_Mono'] text-2xl font-bold text-[#F5F5F5] block">
        {value}
      </span>
      <span className="text-[10px] text-[#9CA3AF] font-['Space_Grotesk'] uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

function EmptyCard({
  message,
  linkText,
  linkHref,
}: {
  message: string;
  linkText: string;
  linkHref: string;
}) {
  return (
    <div className="glass-static p-8 text-center">
      <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
        {message}
      </p>
      <Link href={linkHref} className="text-xs font-medium" style={{ color: 'var(--accent)' }}>
        {linkText} &rarr;
      </Link>
    </div>
  );
}
