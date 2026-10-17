const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { optionalAuth, authenticate } = require('../middleware/auth');
const { uploadResume } = require('../middleware/upload');

// Helper to compute match score between user skills and job skills
function computeMatchScore(userSkills, jobSkills) {
  if (!userSkills || userSkills.length === 0 || !jobSkills || jobSkills.length === 0) {
    return 75; // Default baseline match if no user skills specified yet
  }

  const userLower = userSkills.map(s => s.toLowerCase().trim());
  const jobLower = jobSkills.map(s => s.toLowerCase().trim());

  let matches = 0;
  jobLower.forEach(js => {
    if (userLower.some(us => us.includes(js) || js.includes(us))) {
      matches++;
    }
  });

  const percentage = Math.round((matches / jobLower.length) * 100);
  return Math.min(Math.max(percentage, 35), 98); // Bound realistically between 35% and 98%
}

// Helper to parse job record JSON fields
function formatJob(job, userSkills = null, savedJobIds = new Set(), appliedJobIds = new Map()) {
  let skills = [];
  let requirements = [];
  let responsibilities = [];
  let benefits = [];

  try { skills = JSON.parse(job.skills || '[]'); } catch (e) { skills = []; }
  try { requirements = JSON.parse(job.requirements || '[]'); } catch (e) { requirements = []; }
  try { responsibilities = JSON.parse(job.responsibilities || '[]'); } catch (e) { responsibilities = []; }
  try { benefits = JSON.parse(job.benefits || '[]'); } catch (e) { benefits = []; }

  const match_percentage = computeMatchScore(userSkills, skills);

  return {
    ...job,
    skills,
    requirements,
    responsibilities,
    benefits,
    match_percentage,
    is_saved: savedJobIds.has(job.id),
    is_applied: appliedJobIds.has(job.id),
    application_status: appliedJobIds.get(job.id) || null
  };
}

// GET /api/jobs/meta/filters - distinct filter options
router.get('/meta/filters', (req, res) => {
  try {
    const locations = db.prepare('SELECT DISTINCT location FROM jobs ORDER BY location ASC').all().map(r => r.location);
    const jobTypes = db.prepare('SELECT DISTINCT job_type FROM jobs ORDER BY job_type ASC').all().map(r => r.job_type);
    const experienceLevels = db.prepare('SELECT DISTINCT experience_level FROM jobs ORDER BY experience_level ASC').all().map(r => r.experience_level);
    const categories = db.prepare('SELECT DISTINCT category FROM jobs ORDER BY category ASC').all().map(r => r.category);
    
    // Extract unique skills
    const allSkillsRaw = db.prepare('SELECT skills FROM jobs').all();
    const skillsSet = new Set();
    allSkillsRaw.forEach(row => {
      try {
        const parsed = JSON.parse(row.skills);
        parsed.forEach(s => skillsSet.add(s));
      } catch (e) {}
    });

    const salaryStats = db.prepare('SELECT MIN(salary_min) as minSal, MAX(salary_max) as maxSal FROM jobs').get();

    res.json({
      success: true,
      filters: {
        locations,
        jobTypes,
        experienceLevels,
        categories,
        skills: Array.from(skillsSet).sort(),
        salaryRange: {
          min: Math.floor(salaryStats.minSal || 4),
          max: Math.ceil(salaryStats.maxSal || 75)
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/jobs/recommended - recommended jobs based on user profile
router.get('/recommended', optionalAuth, (req, res) => {
  try {
    let userSkills = [];
    const savedJobIds = new Set();
    const appliedJobIds = new Map();

    if (req.user) {
      const profile = db.prepare('SELECT skills, preferred_roles, preferred_locations FROM profiles WHERE user_id = ?').get(req.user.id);
      if (profile) {
        try { userSkills = JSON.parse(profile.skills || '[]'); } catch (e) {}
      }

      const saved = db.prepare('SELECT job_id FROM saved_jobs WHERE user_id = ?').all(req.user.id);
      saved.forEach(s => savedJobIds.add(s.job_id));

      const applied = db.prepare('SELECT job_id, status FROM applications WHERE user_id = ?').all(req.user.id);
      applied.forEach(a => appliedJobIds.set(a.job_id, a.status));
    }

    const rawJobs = db.prepare(`
      SELECT * FROM jobs
      ORDER BY is_featured DESC, posted_at DESC
      LIMIT 20
    `).all();

    let formatted = rawJobs.map(j => formatJob(j, userSkills, savedJobIds, appliedJobIds));
    
    // Sort by match_percentage
    formatted.sort((a, b) => b.match_percentage - a.match_percentage);

    res.json({
      success: true,
      jobs: formatted.slice(0, 6)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/jobs - search, filter, sort, paginate
router.get('/', optionalAuth, (req, res) => {
  try {
    const {
      search = '',
      location = '',
      job_type = '',
      experience_level = '',
      category = '',
      salary_min,
      salary_max,
      skills = '',
      sort = 'newest',
      page = 1,
      limit = 9
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(50, parseInt(limit, 10) || 9));
    const offset = (pageNum - 1) * limitNum;

    // Build WHERE clauses
    const whereConditions = [];
    const params = {};

    if (search && search.trim()) {
      whereConditions.push(`(title LIKE @search OR company LIKE @search OR skills LIKE @search OR description LIKE @search)`);
      params.search = `%${search.trim()}%`;
    }

    if (location && location.trim()) {
      whereConditions.push(`location = @location`);
      params.location = location.trim();
    }

    const resolvedJobType = (job_type || req.query.type || '').trim();
    if (resolvedJobType) {
      whereConditions.push(`job_type = @job_type`);
      params.job_type = resolvedJobType;
    }

    if (experience_level && experience_level.trim()) {
      whereConditions.push(`experience_level = @experience_level`);
      params.experience_level = experience_level.trim();
    }

    if (category && category.trim()) {
      whereConditions.push(`category = @category`);
      params.category = category.trim();
    }

    if (salary_min !== undefined && salary_min !== '') {
      whereConditions.push(`salary_max >= @salary_min`);
      params.salary_min = parseFloat(salary_min);
    }

    if (salary_max !== undefined && salary_max !== '') {
      whereConditions.push(`salary_min <= @salary_max`);
      params.salary_max = parseFloat(salary_max);
    }

    if (skills && skills.trim()) {
      const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
      if (skillsArray.length > 0) {
        const skillConditions = skillsArray.map((s, idx) => {
          params[`skill_${idx}`] = `%${s}%`;
          return `skills LIKE @skill_${idx}`;
        });
        whereConditions.push(`(${skillConditions.join(' OR ')})`);
      }
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Count total
    const countQuery = `SELECT COUNT(*) as total FROM jobs ${whereClause}`;
    const totalCount = db.prepare(countQuery).get(params).total;

    // Sorting
    let orderBy = 'posted_at DESC';
    if (sort === 'salary_desc') {
      orderBy = 'salary_max DESC, salary_min DESC';
    } else if (sort === 'salary_asc') {
      orderBy = 'salary_min ASC';
    } else if (sort === 'oldest') {
      orderBy = 'posted_at ASC';
    }

    // Prepare user context for match scores & saved/applied tags
    let userSkills = [];
    const savedJobIds = new Set();
    const appliedJobIds = new Map();

    if (req.user) {
      const profile = db.prepare('SELECT skills FROM profiles WHERE user_id = ?').get(req.user.id);
      if (profile) {
        try { userSkills = JSON.parse(profile.skills || '[]'); } catch (e) {}
      }

      const saved = db.prepare('SELECT job_id FROM saved_jobs WHERE user_id = ?').all(req.user.id);
      saved.forEach(s => savedJobIds.add(s.job_id));

      const applied = db.prepare('SELECT job_id, status FROM applications WHERE user_id = ?').all(req.user.id);
      applied.forEach(a => appliedJobIds.set(a.job_id, a.status));
    }

    let finalJobs = [];

    // If sort by 'match', we need to calculate match scores for all filtered results
    if (sort === 'match') {
      const allFilteredJobs = db.prepare(`SELECT * FROM jobs ${whereClause}`).all(params);
      let formattedAll = allFilteredJobs.map(j => formatJob(j, userSkills, savedJobIds, appliedJobIds));
      formattedAll.sort((a, b) => b.match_percentage - a.match_percentage);
      finalJobs = formattedAll.slice(offset, offset + limitNum);
    } else {
      const selectQuery = `
        SELECT * FROM jobs
        ${whereClause}
        ORDER BY ${orderBy}
        LIMIT @limit OFFSET @offset
      `;
      const rows = db.prepare(selectQuery).all({ ...params, limit: limitNum, offset });
      finalJobs = rows.map(j => formatJob(j, userSkills, savedJobIds, appliedJobIds));
    }

    const totalPages = Math.ceil(totalCount / limitNum) || 1;

    res.json({
      success: true,
      jobs: finalJobs,
      pagination: {
        total: totalCount,
        page: pageNum,
        totalPages,
        limit: limitNum
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/jobs/:id - single job details
router.get('/:id', optionalAuth, (req, res) => {
  try {
    const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job posting not found.' });
    }

    let userSkills = [];
    const savedJobIds = new Set();
    const appliedJobIds = new Map();
    let savedNote = '';
    let savedCollectionId = null;

    if (req.user) {
      const profile = db.prepare('SELECT skills FROM profiles WHERE user_id = ?').get(req.user.id);
      if (profile) {
        try { userSkills = JSON.parse(profile.skills || '[]'); } catch (e) {}
      }

      const saved = db.prepare('SELECT job_id, note, collection_id FROM saved_jobs WHERE user_id = ? AND job_id = ?').get(req.user.id, job.id);
      if (saved) {
        savedJobIds.add(saved.job_id);
        savedNote = saved.note || '';
        savedCollectionId = saved.collection_id;
      }

      const applied = db.prepare('SELECT job_id, status FROM applications WHERE user_id = ? AND job_id = ?').get(req.user.id, job.id);
      if (applied) {
        appliedJobIds.set(applied.job_id, applied.status);
      }
    }

    const formattedJob = formatJob(job, userSkills, savedJobIds, appliedJobIds);
    formattedJob.saved_note = savedNote;
    formattedJob.saved_collection_id = savedCollectionId;

    // Fetch 3 similar jobs
    const similarRaw = db.prepare(`
      SELECT * FROM jobs
      WHERE id != ? AND (category = ? OR location = ?)
      ORDER BY posted_at DESC
      LIMIT 3
    `).all(job.id, job.category, job.location);

    const similar_jobs = similarRaw.map(j => formatJob(j, userSkills, savedJobIds, appliedJobIds));

    res.json({
      success: true,
      job: formattedJob,
      similar_jobs
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/jobs/:id/save - Toggle bookmark
router.post('/:id/save', authenticate, (req, res) => {
  try {
    const jobId = parseInt(req.params.id, 10);
    const userId = req.user.id;

    const job = db.prepare('SELECT id FROM jobs WHERE id = ?').get(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    const existing = db.prepare('SELECT id FROM saved_jobs WHERE user_id = ? AND job_id = ?').get(userId, jobId);

    if (existing) {
      db.prepare('DELETE FROM saved_jobs WHERE id = ?').run(existing.id);
      return res.json({
        success: true,
        is_saved: false,
        message: 'Job removed from saved jobs.'
      });
    } else {
      db.prepare(`
        INSERT INTO saved_jobs (user_id, job_id)
        VALUES (?, ?)
      `).run(userId, jobId);

      return res.json({
        success: true,
        is_saved: true,
        message: 'Job saved to your bookmarks!'
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/jobs/:id/apply - Apply for job
router.post('/:id/apply', authenticate, uploadResume.single('resume'), (req, res) => {
  try {
    const jobId = parseInt(req.params.id, 10);
    const userId = req.user.id;
    const { cover_letter = '', notes = '', use_profile_resume = 'false' } = req.body;
    const resumeIdParam = req.body.resume_id || req.body.resumeId;

    const job = db.prepare('SELECT id, title, company FROM jobs WHERE id = ?').get(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    const existing = db.prepare('SELECT id, status FROM applications WHERE user_id = ? AND job_id = ?').get(userId, jobId);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `You have already applied for this position (Current status: ${existing.status}).`
      });
    }

    let resumeUrl = '';
    let linkedResumeId = null;

    if (resumeIdParam) {
      const savedRes = db.prepare('SELECT id, title FROM resumes WHERE id = ? AND user_id = ?').get(parseInt(resumeIdParam, 10), userId);
      if (savedRes) {
        linkedResumeId = savedRes.id;
        resumeUrl = `saved-resume://${savedRes.id}`;
      }
    }

    if (!resumeUrl) {
      if (req.file) {
        resumeUrl = `/uploads/resumes/${req.file.filename}`;
      } else if (use_profile_resume === 'true' || use_profile_resume === true) {
        const profile = db.prepare('SELECT resume_url FROM profiles WHERE user_id = ?').get(userId);
        if (profile && profile.resume_url) {
          resumeUrl = profile.resume_url;
        }
      }
    }

    const result = db.prepare(`
      INSERT INTO applications (user_id, job_id, status, cover_letter, resume_url, resume_id, notes, applied_at, updated_at)
      VALUES (?, ?, 'Applied', ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).run(userId, jobId, cover_letter, resumeUrl, linkedResumeId, notes);

    const applicationId = result.lastInsertRowid;

    db.prepare(`
      INSERT INTO application_events (application_id, status, notes, created_at)
      VALUES (?, 'Applied', 'Application submitted successfully', datetime('now'))
    `).run(applicationId);

    res.status(201).json({
      success: true,
      message: `Successfully applied to ${job.company} for ${job.title}!`,
      application_id: applicationId
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
