import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import JobCard from '../components/jobs/JobCard';
import JobFilters from '../components/jobs/JobFilters';
import Drawer from '../components/ui/Drawer';
import { JobCardSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import api from '../api/axios';

export default function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter State read from URL
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    job_type: searchParams.get('job_type') || '',
    experience_level: searchParams.get('experience_level') || '',
    category: searchParams.get('category') || '',
    salary_min: searchParams.get('salary_min') || '',
    skills: searchParams.get('skills') || '',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page'), 10) || 1
  });

  const [metaFilters, setMetaFilters] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1, limit: 9 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debounce search input by 400ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setFilters(prev => ({ ...prev, page: 1 }));
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Sync state to URL search params
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (filters.location) params.set('location', filters.location);
    if (filters.job_type) params.set('job_type', filters.job_type);
    if (filters.experience_level) params.set('experience_level', filters.experience_level);
    if (filters.category) params.set('category', filters.category);
    if (filters.salary_min) params.set('salary_min', filters.salary_min);
    if (filters.skills) params.set('skills', filters.skills);
    if (filters.sort && filters.sort !== 'newest') params.set('sort', filters.sort);
    if (filters.page && filters.page > 1) params.set('page', filters.page.toString());

    setSearchParams(params, { replace: true });
  }, [debouncedSearch, filters, setSearchParams]);

  // Load filter metadata once
  useEffect(() => {
    async function loadMeta() {
      try {
        const res = await api.get('/jobs/meta/filters');
        if (res.data.success) {
          setMetaFilters(res.data.filters);
        }
      } catch (e) {
        console.error('Failed to load filter metadata', e);
      }
    }
    loadMeta();
  }, []);

  // Fetch Jobs from Backend
  const fetchJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = {
        search: debouncedSearch,
        location: filters.location,
        job_type: filters.job_type,
        experience_level: filters.experience_level,
        category: filters.category,
        salary_min: filters.salary_min,
        skills: filters.skills,
        sort: filters.sort,
        page: filters.page,
        limit: 9
      };

      const res = await api.get('/jobs', { params });
      if (res.data.success) {
        setJobs(res.data.jobs);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load jobs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleFilterChange = (newPartialFilters) => {
    setFilters(prev => ({ ...prev, ...newPartialFilters, page: 1 }));
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setFilters({
      location: '',
      job_type: '',
      experience_level: '',
      category: '',
      salary_min: '',
      skills: '',
      sort: 'newest',
      page: 1
    });
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Explore Tech Jobs
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Showing {pagination.total} opportunities matching your criteria
          </p>
        </div>

        {/* Sort Selector & Mobile Filter Button */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200"
          >
            <SlidersHorizontal className="w-4 h-4 text-brand-600" />
            Filters
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">Sort:</span>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange({ sort: e.target.value })}
              className="text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="newest">Newest First</option>
              <option value="match">Best Match Score</option>
              <option value="salary_desc">Salary: High to Low</option>
              <option value="salary_asc">Salary: Low to High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Filter Sidebar (Desktop) + Right Jobs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* DESKTOP FILTER SIDEBAR */}
        <div className="hidden lg:block lg:col-span-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-soft sticky top-24">
          <JobFilters
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
            metaFilters={metaFilters}
          />
        </div>

        {/* MOBILE DRAWER FILTER */}
        <Drawer
          isOpen={isFilterDrawerOpen}
          onClose={() => setIsFilterDrawerOpen(false)}
          title="Filter Jobs"
          position="bottom"
        >
          <JobFilters
            filters={filters}
            onChange={(newFilters) => {
              handleFilterChange(newFilters);
              setIsFilterDrawerOpen(false);
            }}
            onReset={() => {
              handleResetFilters();
              setIsFilterDrawerOpen(false);
            }}
            metaFilters={metaFilters}
          />
        </Drawer>

        {/* JOBS CONTENT AREA */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search box inline */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by title, company, or skill (e.g. React, Razorpay, Bengaluru)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-slate-900 dark:text-slate-100 placeholder-slate-400 shadow-sm"
            />
          </div>

          {/* Loading Skeleton State */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <JobCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            /* Error State with Retry */
            <div className="p-8 text-center rounded-2xl border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20">
              <p className="text-sm font-bold text-rose-700 dark:text-rose-400">{error}</p>
              <Button variant="primary" size="sm" onClick={fetchJobs} className="mt-4">
                Retry
              </Button>
            </div>
          ) : jobs.length === 0 ? (
            /* Empty State */
            <EmptyState
              title="No jobs matched your filters"
              description="Try adjusting your salary range, clearing specific skills, or checking other cities."
              actionLabel="Clear All Filters"
              onAction={handleResetFilters}
            />
          ) : (
            /* Jobs Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onSaveToggle={(jobId, isSaved) => {
                    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, is_saved: isSaved } : j));
                  }}
                  onApplySuccess={(jobId) => {
                    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, is_applied: true } : j));
                  }}
                />
              ))}
            </div>
          )}

          {/* PAGINATION CONTROLS */}
          {pagination.totalPages > 1 && (
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} total jobs)
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  icon={ChevronLeft}
                >
                  Previous
                </Button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                  {[...Array(pagination.totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    const isActive = pagination.page === pageNum;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-8 h-8 rounded-lg text-xs font-semibold transition ${
                          isActive
                            ? 'bg-brand-600 text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
