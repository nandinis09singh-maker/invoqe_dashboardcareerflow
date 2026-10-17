import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
  UserCheck,
  Bookmark,
  Send,
  Compass,
  FileText,
  ChevronDown,
  ChevronUp,
  Award
} from 'lucide-react';
import Button from '../ui/Button';

export default function OnboardingChecklist({ stats, profileCompletion, primaryGoal, latestResume }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const steps = [
    {
      id: 'profile',
      title: 'Complete candidate profile',
      desc: 'Add headline, bio, experience, and core skills to unlock accurate matching.',
      link: '/profile',
      actionText: 'Update Profile',
      icon: UserCheck,
      completed: (profileCompletion?.percentage || 0) >= 60
    },
    {
      id: 'save',
      title: 'Bookmark your first job',
      desc: 'Save promising roles to private collections for later application.',
      link: '/jobs',
      actionText: 'Explore Jobs',
      icon: Bookmark,
      completed: (stats?.savedJobs || 0) > 0
    },
    {
      id: 'goal',
      title: 'Set an active career goal',
      desc: 'Pick your target engineering role in Career Path and set milestones.',
      link: '/career-path',
      actionText: 'Choose Goal',
      icon: Compass,
      completed: Boolean(primaryGoal)
    },
    {
      id: 'resume',
      title: 'Create an ATS-friendly resume',
      desc: 'Build or autofill a tailored resume and score it with the ATS scanner.',
      link: '/resume-builder',
      actionText: 'Build Resume',
      icon: FileText,
      completed: Boolean(latestResume)
    },
    {
      id: 'apply',
      title: 'Submit your first application',
      desc: 'Apply to an open position using your saved resume and track it in Kanban.',
      link: '/jobs',
      actionText: 'Apply Now',
      icon: Send,
      completed: (stats?.appliedJobs || 0) > 0
    }
  ];

  const completedCount = steps.filter((s) => s.completed).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  // If candidate has completed all 5 steps, show compact celebration badge
  if (completedCount === 5) {
    return (
      <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/80 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent p-4 sm:p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>All Onboarding Milestones Achieved!</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                5/5 Done
              </span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your profile, career path, resume, and application pipeline are fully active.
            </p>
          </div>
        </div>
        <Link to="/jobs">
          <Button variant="primary" size="sm" className="text-xs font-semibold shrink-0">
            Find Next Opportunity
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 shadow-soft overflow-hidden transition-all">
      {/* Header bar */}
      <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-[11px] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Getting Started Checklist</span>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Kickstart Your Career Journey
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Complete these 5 foundational steps to maximize recruiter discovery and match accuracy.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <span className="text-sm font-extrabold text-brand-600 dark:text-brand-400">
              {completedCount} of {steps.length}
            </span>
            <span className="text-xs text-slate-400 block font-medium">Completed</span>
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition"
            aria-label={isCollapsed ? 'Expand checklist' : 'Collapse checklist'}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Progress Line */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 overflow-hidden">
        <div
          className="bg-gradient-to-r from-brand-600 to-emerald-500 h-full transition-all duration-700"
          style={{ width: `${Math.max(progressPercent, 5)}%` }}
        />
      </div>

      {/* Checklist Items */}
      {!isCollapsed && (
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80 p-2 sm:p-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className={`p-3 sm:p-3.5 rounded-xl transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  step.completed
                    ? 'bg-slate-50/40 dark:bg-slate-950/20'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="pt-0.5 shrink-0">
                    {step.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-xs sm:text-sm font-semibold truncate ${
                        step.completed
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {step.desc}
                    </p>
                  </div>
                </div>

                <div className="pl-8 sm:pl-0 shrink-0">
                  {step.completed ? (
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg">
                      Completed
                    </span>
                  ) : (
                    <Link to={step.link}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs font-semibold py-1 px-3 h-auto hover:border-brand-500 hover:text-brand-600"
                      >
                        <span>{step.actionText}</span>
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
