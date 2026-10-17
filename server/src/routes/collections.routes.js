const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

// GET /api/collections - List user collections with job count
router.get('/', (req, res) => {
  try {
    const collections = db.prepare(`
      SELECT 
        c.*,
        COUNT(s.id) as job_count
      FROM collections c
      LEFT JOIN saved_jobs s ON s.collection_id = c.id
      WHERE c.user_id = ?
      GROUP BY c.id
      ORDER BY c.created_at ASC
    `).all(req.user.id);

    res.json({
      success: true,
      collections
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/collections - Create collection
router.post('/', (req, res) => {
  try {
    const { name, color = '#6366f1' } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Collection name is required.' });
    }

    const result = db.prepare(`
      INSERT INTO collections (user_id, name, color)
      VALUES (?, ?, ?)
    `).run(req.user.id, name.trim(), color);

    const collection = db.prepare('SELECT *, 0 as job_count FROM collections WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: 'Collection created successfully.',
      collection
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/collections/:id - Update collection
router.put('/:id', (req, res) => {
  try {
    const colId = parseInt(req.params.id, 10);
    const { name, color } = req.body;

    const existing = db.prepare('SELECT id FROM collections WHERE id = ? AND user_id = ?').get(colId, req.user.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Collection not found.' });
    }

    db.prepare(`
      UPDATE collections
      SET name = COALESCE(?, name), color = COALESCE(?, color)
      WHERE id = ? AND user_id = ?
    `).run(name ? name.trim() : null, color || null, colId, req.user.id);

    const updated = db.prepare(`
      SELECT c.*, COUNT(s.id) as job_count
      FROM collections c
      LEFT JOIN saved_jobs s ON s.collection_id = c.id
      WHERE c.id = ?
      GROUP BY c.id
    `).get(colId);

    res.json({
      success: true,
      message: 'Collection updated successfully.',
      collection: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/collections/:id - Delete collection
router.delete('/:id', (req, res) => {
  try {
    const colId = parseInt(req.params.id, 10);
    const existing = db.prepare('SELECT id FROM collections WHERE id = ? AND user_id = ?').get(colId, req.user.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Collection not found.' });
    }

    // Set collection_id to null in saved_jobs first
    db.prepare('UPDATE saved_jobs SET collection_id = NULL WHERE collection_id = ?').run(colId);
    db.prepare('DELETE FROM collections WHERE id = ?').run(colId);

    res.json({
      success: true,
      message: 'Collection deleted successfully.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
