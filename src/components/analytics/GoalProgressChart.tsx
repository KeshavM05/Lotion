'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { Milestone } from '@/lib/store';

interface GoalProgressChartProps {
  milestones: Milestone[];
  goalTitle: string;
}

export function GoalProgressChart({ milestones, goalTitle }: GoalProgressChartProps) {
  // Build a sorted timeline of cumulative completion %
  const sorted = [...milestones].sort((a, b) => {
    const da = a.completedAt ?? a.targetDate ?? a.createdAt;
    const db = b.completedAt ?? b.targetDate ?? b.createdAt;
    return new Date(da).getTime() - new Date(db).getTime();
  });

  const data = sorted.map((ms, i) => ({
    name: ms.title.length > 16 ? ms.title.slice(0, 16) + '…' : ms.title,
    progress: Math.round(((i + 1) / milestones.length) * 100),
    completed: ms.completed,
    date: ms.completedAt
      ? new Date(ms.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : ms.targetDate
        ? new Date(ms.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : '—',
  }));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-[#9CA3AF] text-sm">
        No milestones to chart
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="bg-[#1F2D47] border border-white/10 rounded-lg px-3 py-2 text-xs shadow-lg">
        <p className="text-[#F5F5F5] font-medium mb-1">{d.name}</p>
        <p className="text-[#9CA3AF]">{d.date}</p>
        <p style={{ color: '#C17A72' }}>Progress: {d.progress}%</p>
        <p className={d.completed ? 'text-[#34d399]' : 'text-[#9CA3AF]'}>
          {d.completed ? 'Completed' : 'Pending'}
        </p>
      </div>
    );
  };

  return (
    <div className="w-full">
      <p className="text-xs text-[#9CA3AF] font-['Space_Grotesk'] mb-3 tracking-wide uppercase">
        {goalTitle} — Milestone Timeline
      </p>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis
            dataKey="name"
            tick={{ fill: '#9CA3AF', fontSize: 10, fontFamily: 'Space Grotesk' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: '#9CA3AF', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="progress"
            stroke="#C17A72"
            strokeWidth={2}
            dot={{ fill: '#C17A72', r: 4, strokeWidth: 0 }}
            activeDot={{ fill: '#C17A72', r: 6, strokeWidth: 2, stroke: '#1F2D47' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
