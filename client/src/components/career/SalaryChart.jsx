import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { DollarSign, TrendingUp } from 'lucide-react';

export default function SalaryChart({ roleTitle, salaryData = [] }) {
  if (!salaryData || salaryData.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-card space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Salary Insights for {roleTitle}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Current market compensation bands in India (in LPA) across seniority tiers
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span className="w-3 h-3 rounded-md bg-brand-500 inline-block" /> Average
          </span>
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span className="w-3 h-3 rounded-md bg-brand-200 dark:bg-brand-900 inline-block" /> Max Range
          </span>
        </div>
      </div>

      <div className="h-64 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={salaryData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
            <XAxis dataKey="level" stroke="#94a3b8" fontSize={11} tickLine={false} />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              tickFormatter={(v) => `₹${v}L`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white text-xs p-3 rounded-xl shadow-xl border border-slate-800 space-y-1">
                      <p className="font-bold text-slate-200">{data.level} ({data.experience})</p>
                      <p className="text-emerald-400">Average: ₹{data.avg} LPA</p>
                      <p className="text-slate-400 text-[11px]">Range: ₹{data.min} LPA — ₹{data.max} LPA</p>
                    </div>
                  );
                }
                return null;
              }}
              cursor={{ fill: 'rgba(99, 102, 241, 0.06)' }}
            />
            <Bar dataKey="avg" fill="#6366f1" radius={[6, 6, 0, 0]} name="Average (LPA)" />
            <Bar dataKey="max" fill="#c7d2fe" radius={[6, 6, 0, 0]} name="Max (LPA)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
