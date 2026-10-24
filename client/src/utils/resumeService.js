import api from '../api/axios';

const RESUMES_STORAGE_KEY = 'careerflow_resumes';

const SEEDED_SAMPLE_RESUME = {
  id: 1,
  title: 'Senior Full Stack Lead Resume',
  template: 'modern',
  accent_color: '#4f46e5',
  font_family: 'Inter',
  font_size: 'normal',
  ats_score: 88,
  created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
  updated_at: new Date().toISOString(),
  content: {
    personal_info: {
      full_name: 'Alex Rivera',
      headline: 'Senior Full-Stack Engineer & Cloud Architect',
      email: 'alex.rivera@example.com',
      phone: '+91 98765 43210',
      location: 'Bengaluru, India',
      website: 'https://alexrivera.dev',
      linkedin: 'https://linkedin.com/in/alex-rivera-dev',
      github: 'https://github.com/alexrivera-tech'
    },
    summary:
      'Results-driven Senior Full-Stack Engineer with 6+ years of expertise designing distributed microservices, low-latency web applications, and resilient cloud architectures. Proven track record reducing page load times by 48% and leading high-performing agile engineering teams.',
    experience: [
      {
        id: 'exp-1',
        role: 'Senior Software Engineer',
        company: 'Razorpay',
        location: 'Bengaluru',
        start_date: '2022-03',
        end_date: 'Present',
        current: true,
        bullets: [
          'Architected real-time merchant checkout SDK handling 12M+ monthly transactions with 99.99% service availability.',
          'Spearheaded transition to TypeScript and modular micro-frontends, reducing team onboarding latency by 35%.',
          'Mentored 6 junior engineers through code reviews and bi-weekly system design workshops.'
        ]
      },
      {
        id: 'exp-2',
        role: 'Full-Stack Developer',
        company: 'Swiggy',
        location: 'Bengaluru',
        start_date: '2019-07',
        end_date: '2022-02',
        current: false,
        bullets: [
          'Designed high-throughput dispatch event streaming pipeline with Kafka and Node.js microservices.',
          'Implemented Redis distributed caching layer, reducing PostgreSQL read latency by 62% during peak ordering hours.',
          'Built accessible rider-facing portal using React, Tailwind CSS, and WebSockets.'
        ]
      }
    ],
    education: [
      {
        id: 'edu-1',
        degree: 'B.Tech in Computer Science and Engineering',
        institution: 'National Institute of Technology (NIT)',
        location: 'Karnataka',
        start_date: '2015-08',
        end_date: '2019-05',
        score: '8.8 CGPA'
      }
    ],
    projects: [
      {
        id: 'proj-1',
        title: 'CareerFlow - Next-Gen Career Discovery Platform',
        link: 'https://careerflow.dev',
        start_date: '2024-01',
        end_date: '2024-04',
        bullets: [
          'Developed end-to-end job intelligence system with interactive visual career roadmaps and real-time ATS resume scoring.',
          'Optimized client bundle size by 54% using route code-splitting, lazy imports, and Vite build pipeline.'
        ]
      }
    ],
    skills: {
      Frontend: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Redux / Zustand', 'Vite'],
      Backend: ['Node.js', 'Express', 'Go', 'GraphQL', 'REST APIs', 'WebSockets'],
      'Cloud & Databases': ['PostgreSQL', 'Redis', 'Docker', 'AWS (S3, ECS, Lambda)', 'Kafka', 'CI/CD']
    },
    certifications: [
      {
        id: 'cert-1',
        name: 'AWS Certified Solutions Architect - Associate',
        issuer: 'Amazon Web Services',
        issue_date: '2023-06'
      }
    ],
    achievements: [
      {
        id: 'ach-1',
        title: 'Hackathon Champion - Smart India Hackathon',
        year: '2019',
        description: 'First prize out of 1,200 teams for AI-driven logistics tracking solution.'
      }
    ],
    languages: [
      { id: 'lang-1', language: 'English', proficiency: 'Fluent' },
      { id: 'lang-2', language: 'Hindi', proficiency: 'Native' }
    ],
    section_order: [
      'summary',
      'experience',
      'projects',
      'skills',
      'education',
      'certifications',
      'achievements',
      'languages'
    ],
    section_visibility: {
      summary: true,
      experience: true,
      projects: true,
      skills: true,
      education: true,
      certifications: true,
      achievements: true,
      languages: true
    }
  }
};

export function getLocalResumes() {
  try {
    const raw = localStorage.getItem(RESUMES_STORAGE_KEY);
    if (!raw) {
      const initial = [SEEDED_SAMPLE_RESUME];
      localStorage.setItem(RESUMES_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const initial = [SEEDED_SAMPLE_RESUME];
      localStorage.setItem(RESUMES_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return parsed;
  } catch (e) {
    return [SEEDED_SAMPLE_RESUME];
  }
}

export function saveLocalResumes(resumes) {
  try {
    localStorage.setItem(RESUMES_STORAGE_KEY, JSON.stringify(resumes));
  } catch (e) {}
}

export function computeAtsScore(content) {
  let score = 40; // Base score
  if (!content) return score;

  const info = content.personal_info || {};
  if (info.full_name) score += 5;
  if (info.email && info.phone) score += 5;
  if (info.linkedin || info.github) score += 5;

  if (content.summary && content.summary.length > 50) score += 10;

  if (Array.isArray(content.experience) && content.experience.length > 0) {
    score += 15;
    const hasBullets = content.experience.some(
      (e) => Array.isArray(e.bullets) && e.bullets.length > 0
    );
    if (hasBullets) score += 10;
  }

  if (Array.isArray(content.projects) && content.projects.length > 0) score += 5;
  if (Array.isArray(content.education) && content.education.length > 0) score += 5;

  const skillsCount = Object.values(content.skills || {}).flat().length;
  if (skillsCount >= 5) score += 5;

  return Math.min(score, 98);
}

// Fetch Resumes List
export async function fetchResumesList() {
  try {
    const res = await api.get('/resumes');
    if (res.data && res.data.success && Array.isArray(res.data.resumes)) {
      return res.data.resumes;
    }
  } catch (err) {
    console.warn('Backend unavailable, using local resumes:', err.message);
  }
  return getLocalResumes();
}

// Create Resume
export async function createResumeDoc(payload) {
  try {
    const res = await api.post('/resumes', payload);
    if (res.data && res.data.success && res.data.resume) {
      const list = getLocalResumes();
      saveLocalResumes([res.data.resume, ...list]);
      return { success: true, resume: res.data.resume };
    }
  } catch (err) {
    console.warn('Backend unavailable for create resume, creating locally:', err.message);
  }

  const list = getLocalResumes();
  const newId = Date.now();
  const newResume = {
    id: newId,
    title: payload.title || 'My Professional Resume',
    template: payload.template || 'modern',
    accent_color: payload.accent_color || '#4f46e5',
    font_family: payload.font_family || 'Inter',
    font_size: 'normal',
    ats_score: 82,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    content: {
      ...SEEDED_SAMPLE_RESUME.content,
      personal_info: {
        ...SEEDED_SAMPLE_RESUME.content.personal_info
      }
    }
  };

  saveLocalResumes([newResume, ...list]);
  return { success: true, resume: newResume };
}

// Get Resume By ID
export async function fetchResumeById(id) {
  try {
    const res = await api.get(`/resumes/${id}`);
    if (res.data && res.data.success && res.data.resume) {
      return { success: true, resume: res.data.resume };
    }
  } catch (err) {
    console.warn('Backend unavailable for resume details, loading locally:', err.message);
  }

  const list = getLocalResumes();
  const found = list.find((r) => String(r.id) === String(id));
  if (found) {
    return { success: true, resume: found };
  }

  // If not found, create a placeholder for this ID so user isn't kicked out
  const fallback = {
    ...SEEDED_SAMPLE_RESUME,
    id: Number(id) || id,
    title: 'Professional Resume'
  };
  saveLocalResumes([...list, fallback]);
  return { success: true, resume: fallback };
}

// Update / AutoSave Resume
export async function updateResumeDoc(id, payload) {
  const atsScore = computeAtsScore(payload.content);
  try {
    const res = await api.put(`/resumes/${id}`, { ...payload, ats_score: atsScore });
    if (res.data && res.data.success) {
      return { success: true, resume: res.data.resume };
    }
  } catch (err) {
    // Continue to local save
  }

  const list = getLocalResumes();
  let updatedResume = null;
  const nextList = list.map((r) => {
    if (String(r.id) === String(id)) {
      updatedResume = {
        ...r,
        ...payload,
        ats_score: atsScore,
        updated_at: new Date().toISOString()
      };
      return updatedResume;
    }
    return r;
  });

  if (!updatedResume) {
    updatedResume = {
      id: Number(id) || id,
      ...payload,
      ats_score: atsScore,
      updated_at: new Date().toISOString()
    };
    nextList.push(updatedResume);
  }

  saveLocalResumes(nextList);
  return { success: true, resume: updatedResume };
}

// Delete Resume
export async function deleteResumeDoc(id) {
  try {
    await api.delete(`/resumes/${id}`);
  } catch (e) {}

  const list = getLocalResumes();
  const nextList = list.filter((r) => String(r.id) !== String(id));
  saveLocalResumes(nextList);
  return { success: true };
}

// Duplicate Resume
export async function duplicateResumeDoc(id) {
  try {
    const res = await api.post(`/resumes/${id}/duplicate`);
    if (res.data && res.data.success) {
      return { success: true, resume: res.data.resume };
    }
  } catch (e) {}

  const list = getLocalResumes();
  const target = list.find((r) => String(r.id) === String(id)) || list[0];
  const duplicated = {
    ...target,
    id: Date.now(),
    title: `${target.title} (Copy)`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  saveLocalResumes([duplicated, ...list]);
  return { success: true, resume: duplicated };
}
