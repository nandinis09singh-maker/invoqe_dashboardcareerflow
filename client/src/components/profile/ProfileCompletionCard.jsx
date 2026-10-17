import React from 'react';
import { Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProfileCompletionCard({ percentage = 0, tips = [] }) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            Profile Strength
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Complete profiles receive 3x more recruiter contacts
          </p>
        </div>

        {/* Circular Ring */}
        <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
            {/* Background circle */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="currentColor"
              strokeWidth="6"
              className="text-slate-100 dark:text-slate-800"
              fill="transparent"
            />
            {/* Active circle */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="currentColor"
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="text-brand-600 dark:text-brand-400 transition-all duration-700 ease-out"
              fill="transparent"
            />
          </svg>
          <span className="absolute text-xs font-bold text-slate-900 dark:text-slate-100">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Actionable Tips */}
      {tips.length > 0 ? (
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Recommended Improvements:
          </p>
          <div className="space-y-1.5">
            {tips.slice(0, 3).map((tip, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Your profile is 100% complete and fully optimized!</span>
        </div>
      )}
    </div>
  );
}
