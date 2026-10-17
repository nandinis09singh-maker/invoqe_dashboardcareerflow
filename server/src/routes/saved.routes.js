const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

// Toggle save for a job
router.post('/jobs/:id/save', (req, res) => {
  toggleSaveHandler(req, res);
});

router.post('/:id/save', (req, res) => {
  toggleSaveHandler(req, res);
});

function toggleSaveHandler(req, res) {
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
}

// GET /api/saved - List saved jobs
router.get('/', (req, res) => {
  try {
    const { sort = 'date', collection_id } = req.query;
    const userId = req.user.id;

    let orderBy = 's.created_at DESC';
    if (sort === 'salary') {
      orderBy = 'j.salary_max DESC, j.salary_min DESC';
    } else if (sort === 'oldest') {
      orderBy = 's.created_at ASC';
    }

    let filterCondition = '';
    const params = [userId];

    if (collection_id) {
      if (collection_id === 'none') {
        filterCondition = 'AND s.collection_id IS NULL';
      } else {
        filterCondition = 'AND s.collection_id = ?';
        params.push(parseInt(collection_id, 10));
      }
    }

    const query = `
      SELECT 
        s.id as saved_id,
        s.job_id,
        s.note,
        s.collection_id,
        s.created_at as saved_at,
        c.name as collection_name,
        c.color as collection_color,
        j.title,
        j.company,
        j.logo_url,
        j.location,
        j.job_type,
        j.experience_level,
        j.salary_min,
        j.salary_max,
        j.skills,
        j.category,
        j.posted_at,
        a.id as application_id,
        a.status as application_status
      FROM saved_jobs s
      JOIN jobs j ON s.job_id = j.id
      LEFT JOIN collections c ON s.collection_id = c.id
      LEFT JOIN applications a ON a.user_id = s.user_id AND a.job_id = s.job_id
      WHERE s.user_id = ? ${filterCondition}
      ORDER BY ${orderBy}
    `;

    const rows = db.prepare(query).all(...params);

    const savedJobs = rows.map(r => {
      let skills = [];
      try { skills = JSON.parse(r.skills || '[]'); } catch (e) {}

      return {
        id: r.saved_id,
        job_id: r.job_id,
        note: r.note || '',
        collection_id: r.collection_id,
        collection_name: r.collection_name,
        collection_color: r.collection_color,
        saved_at: r.saved_at,
        is_applied: !!r.application_id,
        application_status: r.application_status,
        job: {
          id: r.job_id,
          title: r.title,
          company: r.company,
          logo_url: r.logo_url,
          location: r.location,
          job_type: r.job_type,
          experience_level: r.experience_level,
          salary_min: r.salary_min,
          salary_max: r.salary_max,
          skills,
          category: r.category,
          posted_at: r.posted_at
        }
      };
    });

    res.json({
      success: true,
      saved_jobs: savedJobs
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/saved/:id - Update note or collection
router.patch('/:id', (req, res) => {
  try {
    const savedId = parseInt(req.params.id, 10);
    const userId = req.user.id;
    const { note, collection_id } = req.body;

    const existing = db.prepare('SELECT id FROM saved_jobs WHERE id = ? AND user_id = ?').get(savedId, userId);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Saved job entry not found.' });
    }

    const updates = [];
    const params = [];

    if (note !== undefined) {
      updates.push('note = ?');
      params.push(note);
    }

    if (collection_id !== undefined) {
      updates.push('collection_id = ?');
      params.push(collection_id === null || collection_id === '' ? null : parseInt(collection_id, 10));
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update.' });
    }

    params.push(savedId, userId);
    db.prepare(`UPDATE saved_jobs SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`).run(...params);

    res.json({
      success: true,
      message: 'Saved job updated successfully.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/saved/:id - Remove saved job
router.delete('/:id', (req, res) => {
  try {
    const savedId = parseInt(req.params.id, 10);
    const userId = req.user.id;

    const saved = db.prepare('SELECT * FROM saved_jobs WHERE id = ? AND user_id = ?').get(savedId, userId);
    if (!saved) {
      return res.status(404).json({ success: false, message: 'Saved job entry not found.' });
    }

    db.prepare('DELETE FROM saved_jobs WHERE id = ?').run(savedId);

    res.json({
      success: true,
      message: 'Job removed from saved list.',
      removed_item: saved
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/saved/bulk-delete - Bulk remove saved jobs
router.post('/bulk-delete', (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Array of saved IDs is required.' });
    }

    const placeholders = ids.map(() => '?').join(',');
    db.prepare(`DELETE FROM saved_jobs WHERE user_id = ? AND id IN (${placeholders})`).run(req.user.id, ...ids);

    res.json({
      success: true,
      message: `Successfully removed ${ids.length} saved jobs.`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/saved/bulk-move - Bulk move to a collection
router.post('/bulk-move', (req, res) => {
  try {
    const { ids, collection_id } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Array of saved IDs is required.' });
    }

    const targetCollection = collection_id ? parseInt(collection_id, 10) : null;
    const placeholders = ids.map(() => '?').join(',');
    db.prepare(`UPDATE saved_jobs SET collection_id = ? WHERE user_id = ? AND id IN (${placeholders})`).run(targetCollection, req.user.id, ...ids);

    res.json({
      success: true,
      message: `Updated collection for ${ids.length} saved jobs.`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
