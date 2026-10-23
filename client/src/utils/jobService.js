import api from '../api/axios';
import { FALLBACK_JOBS } from '../data/fallbackJobs';

export async function fetchJobsList(params = {}) {
  try {
    const res = await api.get('/jobs', { params });
    if (res.data && res.data.success && Array.isArray(res.data.jobs)) {
      return {
        jobs: res.data.jobs,
        pagination: res.data.pagination || {
          total: res.data.jobs.length,
          page: 1,
          totalPages: 1,
          limit: 9
        },
        isFallback: false
      };
    }
  } catch (err) {
    console.warn('Backend API unavailable, using client-side jobs data:', err.message);
  }

  // Client-side fallback filtering
  let filtered = [...FALLBACK_JOBS];

  const search = (params.search || '').toLowerCase().trim();
  if (search) {
    filtered = filtered.filter((j) => {
      const titleMatch = (j.title || '').toLowerCase().includes(search);
      const companyMatch = (j.company || '').toLowerCase().includes(search);
      const descMatch = (j.description || '').toLowerCase().includes(search);
      const skillMatch = (j.skills || []).some((s) => s.toLowerCase().includes(search));
      const locMatch = (j.location || '').toLowerCase().includes(search);
      return titleMatch || companyMatch || descMatch || skillMatch || locMatch;
    });
  }

  if (params.location && params.location !== 'All') {
    filtered = filtered.filter(
      (j) => (j.location || '').toLowerCase() === params.location.toLowerCase()
    );
  }

  if (params.job_type && params.job_type !== 'All') {
    filtered = filtered.filter(
      (j) => (j.job_type || '').toLowerCase() === params.job_type.toLowerCase()
    );
  }

  if (params.experience_level && params.experience_level !== 'All') {
    filtered = filtered.filter(
      (j) => (j.experience_level || '').toLowerCase() === params.experience_level.toLowerCase()
    );
  }

  if (params.category && params.category !== 'All') {
    filtered = filtered.filter(
      (j) => (j.category || '').toLowerCase() === params.category.toLowerCase()
    );
  }

  if (params.salary_min && !isNaN(Number(params.salary_min))) {
    const min = Number(params.salary_min);
    filtered = filtered.filter((j) => (j.salary_max || 0) >= min);
  }

  if (params.skills) {
    const skillFilters = params.skills
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    if (skillFilters.length > 0) {
      filtered = filtered.filter((j) => {
        const jobSkills = (j.skills || []).map((s) => s.toLowerCase());
        return skillFilters.some((sf) => jobSkills.includes(sf));
      });
    }
  }

  // Sorting
  const sort = params.sort || 'newest';
  if (sort === 'salary_desc') {
    filtered.sort((a, b) => (b.salary_max || 0) - (a.salary_max || 0));
  } else if (sort === 'salary_asc') {
    filtered.sort((a, b) => (a.salary_min || 0) - (b.salary_min || 0));
  } else if (sort === 'match') {
    filtered.sort((a, b) => (b.match_percentage || 0) - (a.match_percentage || 0));
  } else {
    // newest (by id desc)
    filtered.sort((a, b) => (b.id || 0) - (a.id || 0));
  }

  const limit = Math.max(1, parseInt(params.limit, 10) || 9);
  const page = Math.max(1, parseInt(params.page, 10) || 1);
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const offset = (page - 1) * limit;
  const pagedJobs = filtered.slice(offset, offset + limit);

  return {
    jobs: pagedJobs,
    pagination: {
      total,
      page,
      totalPages,
      limit
    },
    isFallback: true
  };
}

export async function fetchJobDetails(id) {
  try {
    const res = await api.get(`/jobs/${id}`);
    if (res.data && res.data.success && res.data.job) {
      return { job: res.data.job, similarJobs: res.data.similarJobs || [] };
    }
  } catch (err) {
    console.warn('Backend API unavailable for job details, using fallback:', err.message);
  }

  const job = FALLBACK_JOBS.find((j) => String(j.id) === String(id)) || FALLBACK_JOBS[0];
  const similarJobs = FALLBACK_JOBS.filter(
    (j) => j.id !== job.id && (j.category === job.category || j.company === job.company)
  ).slice(0, 3);

  return { job, similarJobs };
}

export async function fetchFilterMeta() {
  try {
    const res = await api.get('/jobs/meta/filters');
    if (res.data && res.data.success && res.data.filters) {
      return res.data.filters;
    }
  } catch (err) {
    console.warn('Backend API unavailable for filter meta, using fallback:', err.message);
  }

  const locations = Array.from(new Set(FALLBACK_JOBS.map((j) => j.location).filter(Boolean))).sort();
  const jobTypes = Array.from(new Set(FALLBACK_JOBS.map((j) => j.job_type).filter(Boolean))).sort();
  const experienceLevels = Array.from(
    new Set(FALLBACK_JOBS.map((j) => j.experience_level).filter(Boolean))
  ).sort();
  const categories = Array.from(new Set(FALLBACK_JOBS.map((j) => j.category).filter(Boolean))).sort();
  const allSkills = new Set();
  FALLBACK_JOBS.forEach((j) => {
    (j.skills || []).forEach((s) => allSkills.add(s));
  });

  return {
    locations,
    jobTypes,
    experienceLevels,
    categories,
    skills: Array.from(allSkills).sort(),
    salaryRange: { min: 4, max: 75 }
  };
}
