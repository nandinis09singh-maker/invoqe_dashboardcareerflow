import React from 'react';
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  BookOpen,
  Code2,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function RoadmapStage({
  stage,
  roleId,
  onToggleSkill,
  highlightedSkillId
}) {
  const isAllCompleted = stage.totalCount > 0 && stage.completedCount === stage.totalCount;

  return (
    <div
      id={`stage-${stage.id}`}
      className={`rounded-2xl border transition-all duration-300 p-6 bg-white dark:bg-slate-900 shadow-card ${
        isAllCompleted
          ? 'border-emerald-300 dark:border-emerald-800 ring-1 ring-emerald-500/20'
          : 'border-slate-200/80 dark:border-slate-800'
      }`}
    >
      {/* Stage Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 border ${
              isAllCompleted
                ? 'bg-emerald-500 text-white border-emerald-400'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
            }`}
          >
            {isAllCompleted ? <CheckCircle2 className="w-5 h-5" /> : `0${stage.stageOrder}`}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Stage {stage.stageOrder}: {stage.name}
              </h3>
              {isAllCompleted && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Completed
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {stage.description}
            </p>
          </div>
        </div>

        {/* Stage Meta & Progress Pill */}
        <div className="flex items-center gap-4 shrink-0">
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {stage.estimatedTime}
          </span>
          <div className="text-right">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {stage.completedCount} / {stage.totalCount} Skills
            </span>
            <p className="text-[10px] text-slate-400 font-medium">
              {stage.percentage}% finished
            </p>
          </div>
        </div>
      </div>

      {/* Stage Progress Bar */}
      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 mt-4 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isAllCompleted
              ? 'bg-emerald-500'
              : 'bg-gradient-to-r from-brand-600 to-indigo-500'
          }`}
          style={{ width: `${stage.percentage}%` }}
        />
      </div>

      {/* SKILLS CHECKLIST */}
      <div className="mt-6 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
          Competencies & Milestones
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {stage.skills.map((skill) => {
            const isHighlighted = highlightedSkillId === skill.id;

            return (
              <label
                key={skill.id}
                id={`skill-${skill.id}`}
                className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none group ${
                  skill.isCompleted
                    ? 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-brand-300 dark:hover:border-slate-700'
                } ${isHighlighted ? 'ring-2 ring-brand-500 bg-brand-50/50 dark:bg-brand-950/40' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={skill.isCompleted}
                  onChange={() => onToggleSkill(skill.id, roleId, !skill.isCompleted, stage.id)}
                  className="mt-0.5 w-4 h-4 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-xs font-bold truncate ${
                        skill.isCompleted
                          ? 'text-slate-500 line-through'
                          : 'text-slate-900 dark:text-slate-100 group-hover:text-brand-600 transition'
                      }`}
                    >
                      {skill.name}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {skill.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {skill.description}
                  </p>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* LOWER SECTION: PROJECT IDEAS & FREE LEARNING RESOURCES */}
      <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project Ideas */}
        {stage.projectIdeas && stage.projectIdeas.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              Recommended Project Ideas
            </h4>

            <div className="space-y-2.5">
              {stage.projectIdeas.map((proj, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1.5"
                >
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {proj.title}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {proj.description}
                  </p>
                  {proj.key_features && proj.key_features.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {proj.key_features.map((f, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700"
                        >
                          ✓ {f}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Free Learning Resources */}
        {stage.resources && stage.resources.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Free Learning Resources
            </h4>

            <div className="space-y-2">
              {stage.resources.map((res, idx) => (
                <a
                  key={idx}
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 hover:border-brand-500 hover:bg-brand-50/20 dark:hover:bg-brand-950/20 transition group"
                >
                  <div className="min-w-0 pr-3">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 transition truncate">
                      {res.title}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Provided by {res.provider} • {res.type}
                    </p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-600 shrink-0 transition" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
