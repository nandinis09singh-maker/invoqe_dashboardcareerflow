import api from '../api/axios';
import { FALLBACK_JOBS } from '../data/fallbackJobs';

const SAVED_JOBS_KEY = 'careerflow_saved_jobs';
const COLLECTIONS_KEY = 'careerflow_collections';

// Initial default saved jobs so the user sees real active data
const DEFAULT_SAVED_IDS = [1, 2, 4]; // Razorpay, Swiggy, Zerodha

const DEFAULT_COLLECTIONS = [
  { id: 1, name: 'Tier 1 Fintech', icon: 'zap', color: '#6366f1', job_count: 2 },
  { id: 2, name: 'High Compensation', icon: 'dollar-sign', color: '#10b981', job_count: 1 },
  { id: 3, name: 'Remote Roles', icon: 'globe', color: '#ec4899', job_count: 1 }
];

export function getLocalSavedJobIds() {
  try {
    const raw = localStorage.getItem(SAVED_JOBS_KEY);
    if (!raw) {
      localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(DEFAULT_SAVED_IDS));
      return DEFAULT_SAVED_IDS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_SAVED_IDS;
  }
}

export function isJobSavedLocally(jobId) {
  const ids = getLocalSavedJobIds();
  return ids.includes(Number(jobId));
}

export async function toggleJobSave(jobId) {
  const numId = Number(jobId);
  try {
    const res = await api.post(`/jobs/${jobId}/save`);
    if (res.data && res.data.success) {
      // Sync local storage
      const ids = getLocalSavedJobIds();
      let nextIds;
      if (res.data.is_saved) {
        nextIds = Array.from(new Set([...ids, numId]));
      } else {
        nextIds = ids.filter((id) => id !== numId);
      }
      localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(nextIds));
      return { success: true, is_saved: res.data.is_saved, message: res.data.message };
    }
  } catch (err) {
    console.warn('Backend unavailable, saving job to local storage:', err.message);
  }

  // Fallback to localStorage
  const ids = getLocalSavedJobIds();
  const alreadySaved = ids.includes(numId);
  let nextIds;
  let isSaved;
  if (alreadySaved) {
    nextIds = ids.filter((id) => id !== numId);
    isSaved = false;
  } else {
    nextIds = [...ids, numId];
    isSaved = true;
  }
  localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(nextIds));

  return {
    success: true,
    is_saved: isSaved,
    message: isSaved ? 'Job saved to your bookmarks!' : 'Job removed from saved bookmarks'
  };
}

export async function fetchSavedJobsList(params = {}) {
  try {
    const res = await api.get('/saved', { params });
    if (res.data && res.data.success && Array.isArray(res.data.saved_jobs)) {
      return res.data.saved_jobs;
    }
  } catch (err) {
    console.warn('Backend unavailable, loading saved jobs from local storage:', err.message);
  }

  // Fallback: Map saved IDs to FALLBACK_JOBS
  const savedIds = getLocalSavedJobIds();
  let list = FALLBACK_JOBS.filter((j) => savedIds.includes(j.id)).map((job) => ({
    id: job.id,
    job_id: job.id,
    notes: 'Saved for upcoming interview cycle',
    collection_id: job.id === 1 || job.id === 4 ? 1 : 2,
    created_at: new Date(Date.now() - job.id * 86400000).toISOString(),
    job
  }));

  if (params.collection_id && params.collection_id !== 'all') {
    list = list.filter((s) => String(s.collection_id) === String(params.collection_id));
  }

  if (params.sort === 'salary') {
    list.sort((a, b) => (b.job?.salary_max || 0) - (a.job?.salary_max || 0));
  } else if (params.sort === 'match') {
    list.sort((a, b) => (b.job?.match_percentage || 75) - (a.job?.match_percentage || 75));
  } else {
    // date
    list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  return list;
}

export async function removeSavedJob(savedItemId, jobId) {
  try {
    await api.delete(`/saved/${savedItemId}`);
  } catch (e) {
    console.warn('Backend unavailable, removing job locally');
  }

  const ids = getLocalSavedJobIds();
  const nextIds = ids.filter((id) => id !== Number(jobId || savedItemId));
  localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(nextIds));
  return { success: true };
}

export async function fetchCollectionsList() {
  try {
    const res = await api.get('/collections');
    if (res.data && res.data.success && Array.isArray(res.data.collections)) {
      return res.data.collections;
    }
  } catch (err) {
    console.warn('Backend unavailable, loading collections from local storage');
  }

  try {
    const raw = localStorage.getItem(COLLECTIONS_KEY);
    if (!raw) {
      localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(DEFAULT_COLLECTIONS));
      return DEFAULT_COLLECTIONS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_COLLECTIONS;
  }
}

export async function createCollectionDoc(name, icon = 'folder', color = '#6366f1') {
  try {
    const res = await api.post('/collections', { name, icon, color });
    if (res.data && res.data.success) {
      return res.data.collection;
    }
  } catch (e) {}

  const collections = await fetchCollectionsList();
  const newCol = {
    id: Date.now(),
    name,
    icon,
    color,
    job_count: 0
  };
  const updated = [...collections, newCol];
  localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(updated));
  return newCol;
}
