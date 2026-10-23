import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Bookmark,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  Building2,
  Users,
  Award,
  Globe
} from 'lucide-react';
import { formatSalary, timeAgo, formatDate, getInitials, getAvatarGradient } from '../utils/formatters';
import Button from '../components/ui/Button';
import ApplyModal from '../components/jobs/ApplyModal';
import JobCard from '../components/jobs/JobCard';
import api from '../api/axios';
import { fetchJobDetails } from '../utils/jobService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isSaved, setIsSaved] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
    async function fetchJob() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchJobDetails(id);
        if (data.job) {
          setJob(data.job);
          setIsSaved(Boolean(data.job.is_saved));
          setIsApplied(Boolean(data.job.is_applied));
          setSimilarJobs(data.similarJobs || []);
        } else {
          setError('Job posting not found.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Job posting not found.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchJob();
  }, [id]);

  const handleToggleSave = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to save jobs.');
      return;
    }

    try {
      const res = await api.post(`/jobs/${id}/save`);
      if (res.data.success) {
        setIsSaved(res.data.is_saved);
        toast.success(res.data.message);
      }
    } catch (e) {
      toast.error('Failed to update bookmark.');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
          <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Job Posting Not Available
        </h2>
        <p className="text-sm text-slate-500">
          {error || 'This job may have expired or been removed.'}
        </p>
        <Button onClick={() => navigate('/jobs')} variant="primary" size="sm">
          Browse All Jobs
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Jobs
        </button>
      </div>

      {/* JOB HEADER CARD */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          {job.logo_url ? (
            <img
              src={job.logo_url}
              alt={job.company}
              className="w-16 h-16 rounded-2xl object-cover border border-slate-100 dark:border-slate-800 shrink-0 shadow-sm"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          ) : (
            <div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getAvatarGradient(
                job.company
              )} flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-sm`}
            >
              {getInitials(job.company)}
            </div>
          )}

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {job.title}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {job.company}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {job.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Posted {timeAgo(job.posted_at)}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-3 py-1 rounded-xl">
                {formatSalary(job.salary_min, job.salary_max)}
              </span>
              <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl font-medium">
                {job.job_type}
              </span>
              <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl font-medium">
                {job.experience_level}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={handleToggleSave}
            className={`p-3 rounded-2xl border transition ${
              isSaved
                ? 'border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400'
                : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save job'}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
          </button>

          {isApplied ? (
            <div className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              Applied ({job.application_status || 'Under Review'})
            </div>
          ) : (
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                if (!isAuthenticated) {
                  toast.error('Please log in to apply.');
                  return;
                }
                setIsApplyModalOpen(true);
              }}
            >
              Apply for Role
            </Button>
          )}
        </div>
      </div>

      {/* 2-COLUMN BODY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* LEFT COLUMN: DESCRIPTION, RESPONSIBILITIES, REQUIREMENTS */}
        <div className="md:col-span-2 space-y-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-card">
          {/* Overview */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
              About the Role
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
                Key Responsibilities
              </h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {job.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
                Requirements & Qualifications
              </h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills Required */}
          {job.skills && job.skills.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
                Core Technologies & Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
                Perks & Benefits
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {job.benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: MATCH SCORE & COMPANY DETAILS */}
        <div className="space-y-6">
          {/* Match Score Card */}
          <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Match Rating
              </span>
              <span className="text-2xl font-extrabold text-brand-700 dark:text-brand-300">
                {job.match_percentage}%
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Based on overlap between required tech stack and your profile skills.
            </p>
          </div>

          {/* Company Specs */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-soft">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Company Overview
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" /> Company
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{job.company}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" /> Size
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{job.company_size || '500-1000 employees'}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" /> Industry
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{job.industry || 'Technology'}</span>
              </div>

              {job.company_website && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <a
                    href={job.company_website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-brand-600 hover:underline"
                  >
                    <Globe className="w-3.5 h-3.5" /> Visit Company Website
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SIMILAR JOBS */}
      {similarJobs.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Similar Openings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {similarJobs.map((simJob) => (
              <JobCard key={simJob.id} job={simJob} />
            ))}
          </div>
        </div>
      )}

      {/* Apply Modal */}
      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        job={job}
        onSuccess={() => setIsApplied(true)}
      />
    </div>
  );
}
