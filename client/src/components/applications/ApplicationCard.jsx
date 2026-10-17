import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Video,
  FileText,
  Trash2,
  MoreVertical,
  MapPin,
  ExternalLink,
  DollarSign
} from 'lucide-react';
import { formatSalary, formatDate, timeAgo, getInitials, getAvatarGradient } from '../../utils/formatters';

export default function ApplicationCard({
  application,
  onOpenTimeline,
  onOpenInterviewModal,
  onWithdraw
}) {
  const { job } = application;

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', application.id.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-card hover:shadow-soft-hover transition-all cursor-grab active:cursor-grabbing group relative select-none"
    >
      {/* Top Header: Logo & Company */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {job.logo_url ? (
            <img
              src={job.logo_url}
              alt={job.company}
              className="w-9 h-9 rounded-xl object-cover border border-slate-100 dark:border-slate-800 shrink-0"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          ) : (
            <div
              className={`w-9 h-9 rounded-xl bg-gradient-to-br ${getAvatarGradient(
                job.company
              )} flex items-center justify-center text-white font-bold text-xs shrink-0`}
            >
              {getInitials(job.company)}
            </div>
          )}
          <div className="min-w-0">
            <Link
              to={`/jobs/${job.id}`}
              className="text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-brand-600 dark:hover:text-brand-400 truncate block"
            >
              {job.title}
            </Link>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
              {job.company}
            </p>
          </div>
        </div>

        {/* Action Menu Buttons */}
        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
          <button
            onClick={() => onWithdraw(application)}
            className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Withdraw application"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Meta Specs: Salary and Location */}
      <div className="mt-3 flex items-center gap-2 text-xs">
        <span className="font-semibold text-brand-600 dark:text-brand-400 bg-brand-50/80 dark:bg-brand-950/40 px-2 py-0.5 rounded-md">
          {formatSalary(job.salary_min, job.salary_max)}
        </span>
        <span className="text-slate-500 truncate">{job.location}</span>
      </div>

      {/* Interview Details if Scheduled */}
      {application.interview_date && (
        <div className="mt-3 p-2.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-xs text-blue-700 dark:text-blue-300">
          <div className="flex items-center justify-between font-semibold">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(application.interview_date)}{' '}
              {application.interview_time ? `at ${application.interview_time}` : ''}
            </span>
            {application.meeting_link && (
              <a
                href={application.meeting_link.startsWith('http') ? application.meeting_link : `https://${application.meeting_link}`}
                target="_blank"
                rel="noreferrer"
                className="hover:underline flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400"
              >
                Join <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Note preview if any */}
      {application.notes && (
        <p className="mt-2.5 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 italic bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg">
          "{application.notes}"
        </p>
      )}

      {/* Card Footer Tools */}
      <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1 text-[11px]">
          <Clock className="w-3 h-3" />
          {timeAgo(application.applied_at)}
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onOpenInterviewModal(application)}
            className="px-2 py-1 rounded-lg text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {application.interview_date ? 'Reschedule' : 'Interview'}
          </button>
          <button
            onClick={() => onOpenTimeline(application)}
            className="px-2 py-1 rounded-lg text-[11px] font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 hover:bg-brand-100 transition"
          >
            Timeline
          </button>
        </div>
      </div>
    </div>
  );
}
