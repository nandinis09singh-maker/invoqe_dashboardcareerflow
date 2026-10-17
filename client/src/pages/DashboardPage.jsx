import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Bookmark,
  Send,
  Calendar,
  Award,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  Compass,
  FileText,
  Bot
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { formatDate, formatSalary, timeAgo, getStatusStyle } from '../utils/formatters';
import ProfileCompletionCard from '../components/profile/ProfileCompletionCard';
import OnboardingChecklist from '../components/dashboard/OnboardingChecklist';
import Button from '../components/ui/Button';

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await api.get('/analytics/dashboard');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-72 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-72 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  const stats = data?.stats || {
    totalJobs: 52,
    savedJobs: 0,
    appliedJobs: 0,
    interviews: 0,
    offers: 0
  };

  const statCards = [
    { title: 'Total Jobs', count: stats.totalJobs, icon: Briefcase, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400', link: '/jobs' },
    { title: 'Saved Jobs', count: stats.savedJobs, icon: Bookmark, color: 'text-brand-600 bg-brand-50 dark:bg-brand-950/60 dark:text-brand-400', link: '/saved' },
    { title: 'Applications', count: stats.appliedJobs, icon: Send, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400', link: '/applications' },
    { title: 'Interviews', count: stats.interviews, icon: Calendar, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-400', link: '/applications?status=Interview' },
    { title: 'Offers Extended', count: stats.offers, icon: Award, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400', link: '/applications?status=Offer' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Executive Candidate Welcome Card */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active Candidate • {stats.appliedJobs} Live Applications</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Welcome back, {user?.name || 'Engineer'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
            You have <span className="font-semibold text-slate-900 dark:text-slate-200">{stats.appliedJobs} active applications</span> and <span className="font-semibold text-slate-900 dark:text-slate-200">{stats.interviews} scheduled interview rounds</span>. Keep the momentum going!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0 z-10">
          <Link to="/mock-interview">
            <Button variant="primary" size="sm" className="font-semibold shadow-sm flex items-center gap-1.5 bg-gradient-to-r from-brand-600 to-indigo-600 border-none text-white hover:opacity-95">
              <Bot className="w-4 h-4" />
              AI Mock Interview
            </Button>
          </Link>
          <Link to="/jobs">
            <Button variant="outline" size="sm" className="font-semibold">
              Explore Jobs
            </Button>
          </Link>
          <Link to="/applications">
            <Button variant="outline" size="sm" className="font-semibold">
              Kanban Tracker
            </Button>
          </Link>
        </div>
      </div>

      {/* 5 STAT CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.title}
              to={c.link}
              className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-4 shadow-soft hover:shadow-soft-hover transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {c.title}
                </span>
                <div className={`p-2 rounded-xl ${c.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-3">
                {c.count}
              </p>
            </Link>
          );
        })}
      </div>

      {/* FIRST-TIME CANDIDATE ONBOARDING CHECKLIST */}
      <OnboardingChecklist
        stats={stats}
        profileCompletion={data?.profileCompletion}
        primaryGoal={data?.primaryGoal}
        latestResume={data?.latestResume}
      />

      {/* STAGE 2: CAREER GOAL & RESUME SCORE DUAL CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Primary Career Goal Progress Card */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-6 shadow-soft space-y-4 flex flex-col justify-between relative overflow-hidden group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold">
                <Compass className="w-3.5 h-3.5" />
                <span>Active Career Goal</span>
              </div>
              {data?.primaryGoal && (
                <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                  {data.primaryGoal.percentage}% Complete
                </span>
              )}
            </div>

            {data?.primaryGoal ? (
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">
                  {data.primaryGoal.title || data.primaryGoal.roleTitle}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Target Role: <span className="font-semibold text-slate-800 dark:text-slate-200">{data.primaryGoal.roleTitle}</span>
                  {data.primaryGoal.targetDate ? ` • Target: ${data.primaryGoal.targetDate}` : ''}
                </p>

                {/* Progress Bar */}
                <div className="space-y-1 pt-1">
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-brand-600 to-indigo-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(data.primaryGoal.percentage, 5)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>{data.primaryGoal.completedCount} of {data.primaryGoal.totalSkills} skills mastered</span>
                    <span>{data.primaryGoal.percentage}%</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-1 py-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  No Primary Career Goal Set
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select a target role in Career Path and set your milestone targets.
                </p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400">Interactive Visual Roadmap</span>
            <Link to="/career-path">
              <Button variant="outline" size="sm" className="text-xs font-semibold">
                <span>View Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Latest Resume ATS Score Card */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-6 shadow-soft space-y-4 flex flex-col justify-between relative overflow-hidden group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                <FileText className="w-3.5 h-3.5" />
                <span>Resume ATS Readiness</span>
              </div>
              {data?.latestResume?.atsScore != null && (
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  data.latestResume.atsScore >= 80
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600'
                    : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600'
                }`}>
                  {data.latestResume.atsScore}% ATS Score
                </span>
              )}
            </div>

            {data?.latestResume ? (
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">
                  {data.latestResume.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                  {data.latestResume.template} Template • Last edited {timeAgo(data.latestResume.updatedAt)}
                </p>
                <div className="flex items-center gap-2 pt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Optimized for applicant tracking systems & recruiter screeners</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1 py-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  No Resumes Created Yet
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Build your first ATS-friendly resume with 1-click profile autofill and A4 PDF export.
                </p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400">Resume Builder & ATS Scanner</span>
            <Link to={data?.latestResume ? `/resume-builder/${data.latestResume.id}` : '/resume-builder'}>
              <Button variant="outline" size="sm" className="text-xs font-semibold">
                <span>{data?.latestResume ? 'Edit Resume' : 'Build Resume'}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* CHARTS & PROFILE COMPLETION ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Trend Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Application Activity
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Weekly application volume submitted over the past 6 weeks
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
              Weekly Trend
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.weeklyTrend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }}
                />
                <Bar dataKey="applications" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Profile Completion Card */}
        <ProfileCompletionCard
          percentage={data?.profileCompletion?.percentage || 75}
          tips={data?.profileCompletion?.tips || []}
        />
      </div>

      {/* RECENT APPLICATIONS & RECOMMENDED JOBS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Recent Applications
            </h3>
            <Link to="/applications" className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {(!data?.recentApplications || data.recentApplications.length === 0) ? (
              <p className="text-xs text-slate-500 italic py-6 text-center">No recent applications submitted yet.</p>
            ) : (
              data.recentApplications.map((app) => {
                const style = getStatusStyle(app.status);
                return (
                  <div key={app.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <Link
                        to={`/jobs/${app.job_id}`}
                        className="text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-brand-600 truncate block"
                      >
                        {app.title}
                      </Link>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {app.company} • {app.location}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full ${style.bg}`}>
                        {app.status}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {timeAgo(app.applied_at)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recommended Jobs */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              Recommended for You
            </h3>
            <Link to="/jobs?sort=match" className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1">
              Explore Matches <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {(!data?.recommendedJobs || data.recommendedJobs.length === 0) ? (
              <p className="text-xs text-slate-500 italic py-6 text-center">Update your profile skills to unlock personalized recommendations.</p>
            ) : (
              data.recommendedJobs.map((j) => (
                <div key={j.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <Link
                      to={`/jobs/${j.id}`}
                      className="text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-brand-600 truncate block"
                    >
                      {j.title}
                    </Link>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {j.company} • {formatSalary(j.salary_min, j.salary_max)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      {j.match_percentage}% Match
                    </span>
                    <Link to={`/jobs/${j.id}`}>
                      <Button variant="outline" size="sm" className="px-2.5">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
