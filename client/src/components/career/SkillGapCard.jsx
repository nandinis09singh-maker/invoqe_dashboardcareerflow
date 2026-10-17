import React from 'react';
import { Sparkles, CheckCircle2, ArrowRight, BookOpen, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';

export default function SkillGapCard({ gapData, onJumpToSkill }) {
  if (!gapData) return null;

  const {
    matchPercentage = 0,
    matchedCount = 0,
    missingCount = 0,
    totalSkills = 0,
    matchedSkills = [],
    missingSkills = []
  } = gapData;

  const matchColor =
    matchPercentage >= 75
      ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800'
      : matchPercentage >= 50
      ? 'text-brand-600 bg-brand-50 dark:bg-brand-950/60 border-brand-200 dark:border-brand-800'
      : 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800';

  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-card space-y-6">
      {/* Top Header with Match Percentage */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>Profile Competency Match</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Skill Gap Evaluation
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Comparing your profile skills and completed milestones against target role competencies
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {matchPercentage}%
            </span>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Readiness Score
            </p>
          </div>
          <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${matchColor}`}>
            {matchedCount} of {totalSkills} Skills
          </div>
        </div>
      </div>

      {/* Two Column Grid: You Have vs You Need to Learn */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* You Have Column */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              You Have ({matchedSkills.length})
            </h4>
            <span className="text-[11px] text-slate-400">Validated</span>
          </div>

          {matchedSkills.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-500 italic text-center">
              No matching skills found in your profile yet. Add skills or check them off in the roadmap below!
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5 max-h-56 overflow-y-auto pr-1">
              {matchedSkills.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onJumpToSkill && onJumpToSkill(s.id, s.stageId)}
                  className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 text-xs font-semibold hover:border-emerald-400 transition"
                  title={`Stage: ${s.stageName} • Click to jump in roadmap`}
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span>{s.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* You Need to Learn Column */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              You Need to Learn ({missingSkills.length})
            </h4>
            <span className="text-[11px] text-slate-400">Action items</span>
          </div>

          {missingSkills.length === 0 ? (
            <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 font-semibold text-center">
              🎉 Outstanding! You have acquired or matched all skills for this role!
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5 max-h-56 overflow-y-auto pr-1">
              {missingSkills.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onJumpToSkill && onJumpToSkill(s.id, s.stageId)}
                  className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 text-xs font-medium hover:border-brand-500 hover:text-brand-600 transition"
                  title={`Stage: ${s.stageName} • Click to jump to roadmap`}
                >
                  <span>{s.name}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
