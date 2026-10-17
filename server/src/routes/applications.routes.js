const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { authenticate } = require('../middleware/auth');
const { uploadResume } = require('../middleware/upload');

router.use(authenticate);

// POST /api/jobs/:id/apply - Apply for a job
router.post('/jobs/:id/apply', uploadResume.single('resume'), (req, res) => {
  try {
    const jobId = parseInt(req.params.id, 10);
    const userId = req.user.id;
    const { cover_letter = '', notes = '', use_profile_resume = 'false', resume_id } = req.body;

    // Check job exists
    const job = db.prepare('SELECT id, title, company FROM jobs WHERE id = ?').get(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    // Check duplicate
    const existing = db.prepare('SELECT id, status FROM applications WHERE user_id = ? AND job_id = ?').get(userId, jobId);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `You have already applied for this position (Current status: ${existing.status}).`
      });
    }

    // Resume resolution
    let resumeUrl = '';
    let linkedResumeId = null;

    if (resume_id) {
      const savedRes = db.prepare('SELECT id, title FROM resumes WHERE id = ? AND user_id = ?').get(parseInt(resume_id, 10), userId);
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

    // Record initial timeline event
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

// GET /api/applications - List all applications with timeline events
router.get('/', (req, res) => {
  try {
    const { status, search } = req.query;
    const userId = req.user.id;

    let filterClause = '';
    const params = [userId];

    if (status && status !== 'All') {
      filterClause += ' AND a.status = ?';
      params.push(status);
    }

    if (search && search.trim()) {
      filterClause += ' AND (j.company LIKE ? OR j.title LIKE ?)';
      params.push(`%${search.trim()}%`, `%${search.trim()}%`);
    }

    const query = `
      SELECT 
        a.*,
        j.title as job_title,
        j.company as job_company,
        j.logo_url as job_logo_url,
        j.location as job_location,
        j.job_type as job_type,
        j.experience_level as job_experience_level,
        j.salary_min as job_salary_min,
        j.salary_max as job_salary_max,
        j.category as job_category,
        j.skills as job_skills
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE a.user_id = ? ${filterClause}
      ORDER BY a.updated_at DESC
    `;

    const apps = db.prepare(query).all(...params);

    // Fetch timeline events for each application
    const appIds = apps.map(a => a.id);
    let eventsByApp = {};

    if (appIds.length > 0) {
      const placeholders = appIds.map(() => '?').join(',');
      const events = db.prepare(`
        SELECT * FROM application_events
        WHERE application_id IN (${placeholders})
        ORDER BY created_at ASC
      `).all(...appIds);

      events.forEach(ev => {
        if (!eventsByApp[ev.application_id]) {
          eventsByApp[ev.application_id] = [];
        }
        eventsByApp[ev.application_id].push(ev);
      });
    }

    const formattedApps = apps.map(a => {
      let skills = [];
      try { skills = JSON.parse(a.job_skills || '[]'); } catch (e) {}

      return {
        id: a.id,
        user_id: a.user_id,
        job_id: a.job_id,
        status: a.status,
        cover_letter: a.cover_letter,
        resume_url: a.resume_url,
        notes: a.notes || '',
        interview_date: a.interview_date || '',
        interview_time: a.interview_time || '',
        meeting_link: a.meeting_link || '',
        applied_at: a.applied_at,
        updated_at: a.updated_at,
        job: {
          id: a.job_id,
          title: a.job_title,
          company: a.job_company,
          logo_url: a.job_logo_url,
          location: a.job_location,
          job_type: a.job_type,
          experience_level: a.job_experience_level,
          salary_min: a.job_salary_min,
          salary_max: a.job_salary_max,
          category: a.job_category,
          skills
        },
        timeline: eventsByApp[a.id] || []
      };
    });

    res.json({
      success: true,
      applications: formattedApps
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/applications/:id - Update status, notes, or interview
router.patch('/:id', (req, res) => {
  try {
    const appId = parseInt(req.params.id, 10);
    const userId = req.user.id;
    const { status, notes, interview_date, interview_time, meeting_link, timeline_note } = req.body;

    const existing = db.prepare('SELECT * FROM applications WHERE id = ? AND user_id = ?').get(appId, userId);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    const updates = ['updated_at = datetime(\'now\')'];
    const params = [];

    let statusChanged = false;
    if (status && status !== existing.status) {
      updates.push('status = ?');
      params.push(status);
      statusChanged = true;
    }

    if (notes !== undefined) {
      updates.push('notes = ?');
      params.push(notes);
    }

    if (interview_date !== undefined) {
      updates.push('interview_date = ?');
      params.push(interview_date);
    }

    if (interview_time !== undefined) {
      updates.push('interview_time = ?');
      params.push(interview_time);
    }

    if (meeting_link !== undefined) {
      updates.push('meeting_link = ?');
      params.push(meeting_link);
    }

    params.push(appId, userId);
    db.prepare(`UPDATE applications SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`).run(...params);

    // If status changed or note explicitly added for timeline
    if (statusChanged) {
      const eventNote = timeline_note || `Status updated to ${status}`;
      db.prepare(`
        INSERT INTO application_events (application_id, status, notes, created_at)
        VALUES (?, ?, ?, datetime('now'))
      `).run(appId, status, eventNote);
    }

    const updated = db.prepare('SELECT * FROM applications WHERE id = ?').get(appId);
    const timeline = db.prepare('SELECT * FROM application_events WHERE application_id = ? ORDER BY created_at ASC').all(appId);

    res.json({
      success: true,
      message: 'Application updated successfully.',
      application: {
        ...updated,
        timeline
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/applications/:id - Withdraw application
router.delete('/:id', (req, res) => {
  try {
    const appId = parseInt(req.params.id, 10);
    const userId = req.user.id;

    const existing = db.prepare('SELECT * FROM applications WHERE id = ? AND user_id = ?').get(appId, userId);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    // Delete application events first, then application
    db.prepare('DELETE FROM application_events WHERE application_id = ?').run(appId);
    db.prepare('DELETE FROM applications WHERE id = ?').run(appId);

    res.json({
      success: true,
      message: 'Application successfully withdrawn.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
