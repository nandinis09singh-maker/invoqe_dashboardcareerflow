import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ArrowRight, Sparkles } from 'lucide-react';
import JobCard from '../jobs/JobCard';
import Button from '../ui/Button';
import api from '../../api/axios';

export default function MatchingJobsSection({ roleTitle, roleSlug }) {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMatchingJobs() {
      try {
        setIsLoading(true);
        // Search jobs matching the role title or category
        const res = await api.get(`/jobs?search=${encodeURIComponent(roleTitle)}&limit=3`);
        if (res.data.success && res.data.jobs.length > 0) {
          setJobs(res.data.jobs);
        } else {
          // Fallback to top featured jobs
          const fallbackRes = await api.get('/jobs?limit=3');
          if (fallbackRes.data.success) {
            setJobs(fallbackRes.data.jobs);
          }
        }
      } catch (e) {
        console.error('Failed to load matching jobs', e);
      } finally {
        setIsLoading(false);
      }
    }

    if (roleTitle) {
      fetchMatchingJobs();
    }
  }, [roleTitle]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-0.5">
            <Sparkles className="w-3.5 h-3.5" />
            Live Opportunities
          </div>
          <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Open Positions Matching Your Career Path
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real jobs matching the competencies you are developing for {roleTitle}
          </p>
        </div>

        <Link to={`/jobs?search=${encodeURIComponent(roleTitle)}`}>
          <Button variant="outline" size="sm" icon={ArrowRight}>
            View All Matching Jobs
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
