import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Bookmark,
  CheckCircle2,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { formatSalary, timeAgo, getInitials, getAvatarGradient } from '../../utils/formatters';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import ApplyModal from './ApplyModal';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { toggleJobSave, isJobSavedLocally } from '../../utils/savedJobService';
import toast from 'react-hot-toast';

export default function JobCard({ job, onSaveToggle, onApplySuccess }) {
  const { isAuthenticated } = useAuth();
  const [isSaved, setIsSaved] = useState(Boolean(job.is_saved || isJobSavedLocally(job.id)));
  const [isApplied, setIsApplied] = useState(job.is_applied);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const handleSaveClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please log in to save jobs.');
      return;
    }

    try {
      setIsSaveLoading(true);
      const res = await toggleJobSave(job.id);
      if (res.success) {
        setIsSaved(res.is_saved);
        toast.success(res.message);
        if (onSaveToggle) {
          onSaveToggle(job.id, res.is_saved);
        }
      }
    } catch (err) {
      toast.error('Failed to update bookmark.');
    } finally {
      setIsSaveLoading(false);
    }
  };

  const matchScore = job.match_percentage || 75;
  const matchColor =
    matchScore >= 85
      ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
      : matchScore >= 70
      ? 'text-brand-700 bg-brand-50 dark:bg-brand-950/60 dark:text-brand-300 border-brand-200 dark:border-brand-800'
      : 'text-amber-700 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';

  return (
    <>
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.15 }}
        className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-card hover:shadow-soft-hover hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between group relative overflow-hidden"
      >
        <div>
          {/* Card Header: Avatar / Logo, Company info, and Bookmark button */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {job.logo_url ? (
                <img
                  src={job.logo_url}
                  alt={job.company}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-100 dark:border-slate-800 shrink-0 shadow-sm"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getAvatarGradient(
                    job.company
                  )} flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm`}
                >
                  {getInitials(job.company)}
                </div>
              )}
              <div className="min-w-0">
                <Link
                  to={`/jobs/${job.id}`}
                  className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition truncate block"
                >
                  {job.title}
                </Link>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                  {job.company}
                </p>
              </div>
            </div>

            {/* Bookmark button */}
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={handleSaveClick}
              disabled={isSaveLoading}
              className={`p-2 rounded-xl transition ${
                isSaved
                  ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save job'}
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </motion.button>
          </div>

          {/* Meta Details: Location, Type, Level, Salary */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {job.location}
            </span>
            <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              {job.job_type}
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-brand-600 dark:text-brand-400 bg-brand-50/80 dark:bg-brand-950/40 px-2.5 py-1 rounded-lg">
              <DollarSign className="w-3.5 h-3.5" />
              {formatSalary(job.salary_min, job.salary_max)}
            </span>
          </div>

          {/* Skills Chips */}
          {job.skills && job.skills.length > 0 && (
            <div className="mt-3.5 flex flex-wrap gap-1.5">
              {job.skills.slice(0, 4).map((skill) => (
                <span
                  key={skill}
                  className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  {skill}
                </span>
              ))}
              {job.skills.length > 4 && (
                <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-md text-slate-400">
                  +{job.skills.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Card Footer: Match Score, Posted Time & Actions */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          {/* Match Score Badge */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${matchColor}`}
            >
              <Sparkles className="w-3 h-3 shrink-0" />
              {matchScore}% Match
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400">
              <Clock className="w-3 h-3" />
              {timeAgo(job.posted_at)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Link to={`/jobs/${job.id}`}>
              <Button variant="ghost" size="sm" className="px-2.5">
                View
              </Button>
            </Link>

            {isApplied ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Applied
              </span>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  if (!isAuthenticated) {
                    toast.error('Please log in to apply.');
                    return;
                  }
                  setIsApplyModalOpen(true);
                }}
              >
                Apply
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Apply Modal */}
      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        job={job}
        onSuccess={() => {
          setIsApplied(true);
          if (onApplySuccess) onApplySuccess(job.id);
        }}
      />
    </>
  );
}
