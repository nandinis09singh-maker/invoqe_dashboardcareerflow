import api from '../api/axios';
import { FALLBACK_JOBS } from '../data/fallbackJobs';

const APPS_STORAGE_KEY = 'careerflow_applications';

const DEFAULT_APPLICATIONS = [
  {
    id: 1,
    job_id: 1,
    status: 'Under Review',
    cover_letter: 'Excited to apply my deep microservices and frontend architecture experience at Razorpay.',
    notes: 'Submitted via CareerFlow 1-click apply.',
    applied_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    job: FALLBACK_JOBS[0] || {
      id: 1,
      title: 'Senior Full-Stack Engineer',
      company: 'Razorpay',
      location: 'Bengaluru',
      salary_min: 28,
      salary_max: 45,
      job_type: 'Full-time'
    },
    timeline: [
      { id: 1, status: 'Applied', note: 'Application submitted', created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
      { id: 2, status: 'Under Review', note: 'Recruiter screened candidate profile', created_at: new Date(Date.now() - 86400000 * 1).toISOString() }
    ]
  },
  {
    id: 2,
    job_id: 2,
    status: 'Interview',
    cover_letter: 'Passionate about building blazing-fast web architectures and design systems at Swiggy.',
    notes: 'Technical round scheduled for next week.',
    applied_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    job: FALLBACK_JOBS[1] || {
      id: 2,
      title: 'Lead Frontend Architect',
      company: 'Swiggy',
      location: 'Bengaluru',
      salary_min: 32,
      salary_max: 55,
      job_type: 'Full-time'
    },
    timeline: [
      { id: 3, status: 'Applied', note: 'Application submitted', created_at: new Date(Date.now() - 86400000 * 5).toISOString() },
      { id: 4, status: 'Under Review', note: 'Passed resume screening', created_at: new Date(Date.now() - 86400000 * 3).toISOString() },
      { id: 5, status: 'Interview', note: 'Technical System Design Interview confirmed', created_at: new Date(Date.now() - 86400000 * 2).toISOString() }
    ]
  },
  {
    id: 3,
    job_id: 3,
    status: 'Applied',
    cover_letter: 'Eager to contribute to high-reliability financial systems at Cred.',
    notes: 'Applied with ATS Resume version 2.',
    applied_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    job: FALLBACK_JOBS[2] || {
      id: 3,
      title: 'Staff Backend Architect',
      company: 'Cred',
      location: 'Bengaluru',
      salary_min: 40,
      salary_max: 65,
      job_type: 'Full-time'
    },
    timeline: [
      { id: 6, status: 'Applied', note: 'Application submitted', created_at: new Date(Date.now() - 86400000 * 7).toISOString() }
    ]
  }
];

export function getLocalApplications() {
  try {
    const raw = localStorage.getItem(APPS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(APPS_STORAGE_KEY, JSON.stringify(DEFAULT_APPLICATIONS));
      return DEFAULT_APPLICATIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_APPLICATIONS;
  } catch (e) {
    return DEFAULT_APPLICATIONS;
  }
}

export function saveLocalApplications(apps) {
  try {
    localStorage.setItem(APPS_STORAGE_KEY, JSON.stringify(apps));
  } catch (e) {}
}

export async function fetchApplicationsList(params = {}) {
  try {
    const res = await api.get('/applications', { params });
    if (res.data && res.data.success && Array.isArray(res.data.applications)) {
      return res.data.applications;
    }
  } catch (e) {
    console.warn('Backend unavailable, reading applications locally');
  }

  let list = getLocalApplications();

  if (params.status && params.status !== 'All') {
    list = list.filter((a) => (a.status || '').toLowerCase() === params.status.toLowerCase());
  }

  if (params.search) {
    const s = params.search.toLowerCase();
    list = list.filter(
      (a) =>
        (a.job?.title || '').toLowerCase().includes(s) ||
        (a.job?.company || '').toLowerCase().includes(s)
    );
  }

  return list;
}

export async function submitApplication(job, payload) {
  try {
    const formData = new FormData();
    if (payload.cover_letter) formData.append('cover_letter', payload.cover_letter);
    if (payload.notes) formData.append('notes', payload.notes);
    if (payload.resume_id) formData.append('resume_id', payload.resume_id);
    if (payload.resume) formData.append('resume', payload.resume);

    const res = await api.post(`/jobs/${job.id}/apply`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    if (res.data && res.data.success) {
      return { success: true, message: res.data.message };
    }
  } catch (e) {}

  const list = getLocalApplications();
  const newApp = {
    id: Date.now(),
    job_id: job.id,
    status: 'Applied',
    cover_letter: payload.cover_letter || '',
    notes: payload.notes || '',
    applied_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    job,
    timeline: [
      { id: Date.now(), status: 'Applied', note: 'Application submitted', created_at: new Date().toISOString() }
    ]
  };

  saveLocalApplications([newApp, ...list]);
  return { success: true, message: 'Application submitted successfully!' };
}

export async function updateAppStatus(appId, newStatus) {
  try {
    await api.patch(`/applications/${appId}`, { status: newStatus });
  } catch (e) {}

  const list = getLocalApplications();
  const nextList = list.map((a) => {
    if (String(a.id) === String(appId)) {
      const timeline = a.timeline || [];
      return {
        ...a,
        status: newStatus,
        updated_at: new Date().toISOString(),
        timeline: [
          ...timeline,
          {
            id: Date.now(),
            status: newStatus,
            note: `Status updated to ${newStatus}`,
            created_at: new Date().toISOString()
          }
        ]
      };
    }
    return a;
  });

  saveLocalApplications(nextList);
  return { success: true };
}

export async function withdrawApp(appId) {
  try {
    await api.delete(`/applications/${appId}`);
  } catch (e) {}

  const list = getLocalApplications();
  const nextList = list.filter((a) => String(a.id) !== String(appId));
  saveLocalApplications(nextList);
  return { success: true };
}
