'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CATEGORY_COLORS, CATEGORY_LABELS, type GoalCategory } from '@/lib/store';

interface GoalCategoryBreakdownProps {
  goals: Array<{ category: GoalCategory; status: string }>;
}

export function GoalCategoryBreakdown({ goals }: GoalCategoryBreakdownProps) {
  // Count by category (all goals, active + completed)
  const counts: Partial<Record<GoalCategory, number>> = {};
  for (const g of goals) {
    counts[g.category] = (counts[g.category] ?? 0) + 1;
  }

  const data = Object.entries(counts).map(([cat, count]) => ({
    name: CATEGORY_LABELS[cat as GoalCategory],
    value: count as number,
    color: CATEGORY_COLORS[cat as GoalCategory],
  }));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-[#9CA3AF] text-sm">
        No goals yet
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    const total = data.reduce((s, x) => s + x.value, 0);
    return (
      <div className="bg-[#1F2D47] border border-white/10 rounded-lg px-3 py-2 text-xs shadow-lg">
        <p className="font-medium mb-1" style={{ color: d.color }}>
          {d.name}
        </p>
        <p className="text-[#F5F5F5]">
          {d.value} goal{d.value !== 1 ? 's' : ''} ({Math.round((d.value / total) * 100)}%)
        </p>
      </div>
    );
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.08) return null;
    const RADIAN = Math.PI / 180;
    const r = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + r * Math.cos(-midAngle * RADIAN);
    const y = cy + r * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={11}
        fontFamily="JetBrains Mono"
      >
        {`${Math.round(percent * 100)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
          dataKey="value"
          labelLine={false}
          label={renderCustomLabel}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color}
              stroke="rgba(0,0,0,0.2)"
              strokeWidth={1}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value: string) => (
            <span style={{ color: '#9CA3AF', fontSize: 11, fontFamily: 'Space Grotesk' }}>
              {value}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
