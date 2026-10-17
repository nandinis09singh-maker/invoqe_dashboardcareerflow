import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Trash2, Clock, History, ExternalLink } from 'lucide-react';
import { formatDate, formatSalary, getInitials, getAvatarGradient } from '../../utils/formatters';
import Badge from '../ui/Badge';
import confetti from 'canvas-confetti';

const STATUS_OPTIONS = ['Applied', 'Under Review', 'Interview', 'Offer', 'Rejected'];

export default function ApplicationTableView({
  applications,
  onStatusChange,
  onOpenTimeline,
  onOpenInterviewModal,
  onWithdraw
}) {
  const handleStatusSelect = (appId, newStatus) => {
    if (newStatus === 'Offer') {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    onStatusChange(appId, newStatus);
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold uppercase tracking-wider">
            <th className="py-3.5 px-4">Role & Company</th>
            <th className="py-3.5 px-4">Status</th>
            <th className="py-3.5 px-4">Applied Date</th>
            <th className="py-3.5 px-4">Interview Schedule</th>
            <th className="py-3.5 px-4">Notes</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
          {applications.map((app) => {
            const { job } = app;
            return (
              <tr
                key={app.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
              >
                {/* Role & Company */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    {job.logo_url ? (
                      <img
                        src={job.logo_url}
                        alt={job.company}
                        className="w-8 h-8 rounded-lg object-cover shrink-0"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    ) : (
                      <div
                        className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getAvatarGradient(
                          job.company
                        )} flex items-center justify-center text-white font-bold text-[10px] shrink-0`}
                      >
                        {getInitials(job.company)}
                      </div>
                    )}
                    <div>
                      <Link
                        to={`/jobs/${job.id}`}
                        className="font-bold text-slate-900 dark:text-slate-100 hover:text-brand-600 truncate block max-w-xs"
                      >
                        {job.title}
                      </Link>
                      <p className="text-[11px] text-slate-400">
                        {job.company} • {formatSalary(job.salary_min, job.salary_max)}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Status Selector */}
                <td className="py-3.5 px-4">
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusSelect(app.id, e.target.value)}
                    className="text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1 text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Applied Date */}
                <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                  {formatDate(app.applied_at)}
                </td>

                {/* Interview Date */}
                <td className="py-3.5 px-4">
                  {app.interview_date ? (
                    <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold whitespace-nowrap">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {formatDate(app.interview_date)}{' '}
                        {app.interview_time ? `(${app.interview_time})` : ''}
                      </span>
                      {app.meeting_link && (
                        <a
                          href={app.meeting_link.startsWith('http') ? app.meeting_link : `https://${app.meeting_link}`}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline ml-1"
                          title="Open meeting link"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => onOpenInterviewModal(app)}
                      className="text-[11px] font-medium text-slate-400 hover:text-brand-600 hover:underline"
                    >
                      + Schedule
                    </button>
                  )}
                </td>

                {/* Notes */}
                <td className="py-3.5 px-4 max-w-xs truncate text-slate-500 italic">
                  {app.notes || '—'}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onOpenTimeline(app)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="View Timeline"
                    >
                      <History className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onWithdraw(app)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="Withdraw Application"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
