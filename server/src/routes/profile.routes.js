const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const db = require('../db/database');
const { authenticate } = require('../middleware/auth');
const { uploadAvatar, uploadResume } = require('../middleware/upload');

router.use(authenticate);

// Helper to calculate profile completion percentage & tips
function calculateProfileCompletion(user, profile, educationCount, experienceCount) {
  let score = 0;
  const tips = [];

  // Name (already present in users table)
  if (user.name) score += 5;

  // Headline
  if (profile.headline && profile.headline.trim()) {
    score += 5;
  } else {
    tips.push('Add a professional headline (e.g., "Full-Stack Engineer | React & Node.js")');
  }

  // Bio
  if (profile.bio && profile.bio.trim().length > 20) {
    score += 5;
  } else {
    tips.push('Write a short bio describing your expertise and career goals');
  }

  // Location
  if (profile.location && profile.location.trim()) {
    score += 5;
  } else {
    tips.push('Specify your current city and state');
  }

  // Phone
  if (profile.phone && profile.phone.trim()) {
    score += 5;
  } else {
    tips.push('Add a contact phone number for recruiters');
  }

  // Avatar
  if (profile.avatar_url && profile.avatar_url.trim()) {
    score += 10;
  } else {
    tips.push('Upload a profile picture to enhance your profile visibility');
  }

  // Skills
  let skills = [];
  try { skills = JSON.parse(profile.skills || '[]'); } catch (e) {}
  if (skills.length >= 3) {
    score += 15;
  } else {
    tips.push('Add at least 3 skills to get accurate job match ratings');
  }

  // Education
  if (educationCount > 0) {
    score += 15;
  } else {
    tips.push('Add your college or degree under Education');
  }

  // Experience
  if (experienceCount > 0) {
    score += 15;
  } else {
    tips.push('Add your work experience or past internships');
  }

  // Resume
  if (profile.resume_url && profile.resume_url.trim()) {
    score += 10;
  } else {
    tips.push('Upload your resume (PDF) for 1-click easy applications');
  }

  // Preferences
  let prefRoles = [];
  try { prefRoles = JSON.parse(profile.preferred_roles || '[]'); } catch (e) {}
  if (prefRoles.length > 0 || profile.expected_salary_min > 0) {
    score += 10;
  } else {
    tips.push('Set your target job roles and salary expectations');
  }

  return {
    completionPercentage: Math.min(score, 100),
    tips
  };
}

// GET /api/profile - Full profile details
router.get('/', (req, res) => {
  try {
    const userId = req.user.id;
    const user = db.prepare('SELECT id, email, name, created_at FROM users WHERE id = ?').get(userId);
    let profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(userId);

    if (!profile) {
      db.prepare('INSERT INTO profiles (user_id) VALUES (?)').run(userId);
      profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(userId);
    }

    // Parse JSON fields
    try { profile.skills = JSON.parse(profile.skills || '[]'); } catch (e) { profile.skills = []; }
    try { profile.preferred_roles = JSON.parse(profile.preferred_roles || '[]'); } catch (e) { profile.preferred_roles = []; }
    try { profile.preferred_locations = JSON.parse(profile.preferred_locations || '[]'); } catch (e) { profile.preferred_locations = []; }
    try { profile.preferred_job_types = JSON.parse(profile.preferred_job_types || '[]'); } catch (e) { profile.preferred_job_types = []; }

    const education = db.prepare('SELECT * FROM education WHERE user_id = ? ORDER BY end_year DESC, start_year DESC').all(userId);
    const experienceRaw = db.prepare('SELECT * FROM experience WHERE user_id = ? ORDER BY is_current DESC, start_date DESC').all(userId);
    
    const experience = experienceRaw.map(exp => {
      let skills_used = [];
      try { skills_used = JSON.parse(exp.skills_used || '[]'); } catch (e) {}
      return { ...exp, skills_used };
    });

    const notifPrefs = db.prepare('SELECT * FROM notifications_prefs WHERE user_id = ?').get(userId) || {
      email_job_alerts: 1,
      email_application_updates: 1,
      email_weekly_digest: 1,
      in_app_notifications: 1
    };

    const completion = calculateProfileCompletion(user, profile, education.length, experience.length);

    res.json({
      success: true,
      user,
      profile,
      education,
      experience,
      notificationsPrefs: notifPrefs,
      ...completion
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/profile - Update basic info & skills
router.put('/', (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      phone = '',
      location = '',
      headline = '',
      bio = '',
      skills = [],
      github_url = '',
      linkedin_url = '',
      portfolio_url = '',
      twitter_url = ''
    } = req.body;

    if (name && name.trim()) {
      db.prepare('UPDATE users SET name = ?, updated_at = datetime(\'now\') WHERE id = ?').run(name.trim(), userId);
    }

    const skillsJson = JSON.stringify(Array.isArray(skills) ? skills : []);

    db.prepare(`
      UPDATE profiles
      SET 
        phone = ?,
        location = ?,
        headline = ?,
        bio = ?,
        skills = ?,
        github_url = ?,
        linkedin_url = ?,
        portfolio_url = ?,
        twitter_url = ?,
        updated_at = datetime('now')
      WHERE user_id = ?
    `).run(
      phone,
      location,
      headline,
      bio,
      skillsJson,
      github_url,
      linkedin_url,
      portfolio_url,
      twitter_url,
      userId
    );

    res.json({
      success: true,
      message: 'Profile updated successfully.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/profile/avatar - Upload avatar
router.post('/avatar', uploadAvatar.single('avatar'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select an image file to upload.' });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    db.prepare('UPDATE profiles SET avatar_url = ?, updated_at = datetime(\'now\') WHERE user_id = ?').run(avatarUrl, req.user.id);

    res.json({
      success: true,
      message: 'Avatar uploaded successfully!',
      avatar_url: avatarUrl
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/profile/avatar - Remove avatar
router.delete('/avatar', (req, res) => {
  try {
    db.prepare('UPDATE profiles SET avatar_url = \'\', updated_at = datetime(\'now\') WHERE user_id = ?').run(req.user.id);
    res.json({
      success: true,
      message: 'Avatar removed.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/profile/resume-file - Upload resume file
router.post('/resume-file', uploadResume.single('resume'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select a PDF file (max 2MB).' });
    }

    const resumeUrl = `/uploads/resumes/${req.file.filename}`;
    const resumeFilename = req.file.originalname;

    db.prepare(`
      UPDATE profiles
      SET resume_url = ?, resume_filename = ?, resume_uploaded_at = datetime('now'), updated_at = datetime('now')
      WHERE user_id = ?
    `).run(resumeUrl, resumeFilename, req.user.id);

    res.json({
      success: true,
      message: 'Resume uploaded successfully!',
      resume_url: resumeUrl,
      resume_filename: resumeFilename
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/profile/resume-file - Remove resume
router.delete('/resume-file', (req, res) => {
  try {
    db.prepare(`
      UPDATE profiles
      SET resume_url = '', resume_filename = '', resume_uploaded_at = NULL, updated_at = datetime('now')
      WHERE user_id = ?
    `).run(req.user.id);

    res.json({
      success: true,
      message: 'Resume removed successfully.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/profile/preferences - Job & Notification preferences
router.put('/preferences', (req, res) => {
  try {
    const userId = req.user.id;
    const {
      preferred_roles = [],
      preferred_locations = [],
      preferred_job_types = [],
      expected_salary_min = 0,
      expected_salary_max = 0,
      open_to_remote = 1,
      email_job_alerts = 1,
      email_application_updates = 1,
      email_weekly_digest = 1,
      in_app_notifications = 1
    } = req.body;

    db.prepare(`
      UPDATE profiles
      SET
        preferred_roles = ?,
        preferred_locations = ?,
        preferred_job_types = ?,
        expected_salary_min = ?,
        expected_salary_max = ?,
        open_to_remote = ?,
        updated_at = datetime('now')
      WHERE user_id = ?
    `).run(
      JSON.stringify(preferred_roles),
      JSON.stringify(preferred_locations),
      JSON.stringify(preferred_job_types),
      parseFloat(expected_salary_min) || 0,
      parseFloat(expected_salary_max) || 0,
      open_to_remote ? 1 : 0,
      userId
    );

    db.prepare(`
      INSERT INTO notifications_prefs (user_id, email_job_alerts, email_application_updates, email_weekly_digest, in_app_notifications)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET
        email_job_alerts = excluded.email_job_alerts,
        email_application_updates = excluded.email_application_updates,
        email_weekly_digest = excluded.email_weekly_digest,
        in_app_notifications = excluded.in_app_notifications
    `).run(
      userId,
      email_job_alerts ? 1 : 0,
      email_application_updates ? 1 : 0,
      email_weekly_digest ? 1 : 0,
      in_app_notifications ? 1 : 0
    );

    res.json({
      success: true,
      message: 'Career preferences and notification settings saved.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/profile/password - Change password
router.put('/password', (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
    }

    const user = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(req.user.id);
    const isMatch = bcrypt.compareSync(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password does not match.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const newHash = bcrypt.hashSync(newPassword, salt);

    db.prepare('UPDATE users SET password_hash = ?, updated_at = datetime(\'now\') WHERE id = ?').run(newHash, req.user.id);

    res.json({
      success: true,
      message: 'Password successfully updated.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/profile/email - Change email
router.put('/email', (req, res) => {
  try {
    const { newEmail, password } = req.body;
    if (!newEmail || !password) {
      return res.status(400).json({ success: false, message: 'New email and current password are required.' });
    }

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect password.' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(newEmail.toLowerCase().trim(), req.user.id);
    if (existing) {
      return res.status(409).json({ success: false, message: 'This email address is already in use by another account.' });
    }

    db.prepare('UPDATE users SET email = ?, updated_at = datetime(\'now\') WHERE id = ?').run(newEmail.toLowerCase().trim(), req.user.id);

    res.json({
      success: true,
      message: 'Email address updated successfully.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/profile - Delete account
router.delete('/', (req, res) => {
  try {
    const { confirmation } = req.body;
    if (confirmation !== 'DELETE') {
      return res.status(400).json({ success: false, message: 'Please type DELETE to confirm account deletion.' });
    }

    const userId = req.user.id;

    // Remove user - cascade will clean up profile, education, experience, saved_jobs, applications, collections
    db.prepare('DELETE FROM users WHERE id = ?').run(userId);

    res.clearCookie('careerflow_token', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });

    res.json({
      success: true,
      message: 'Your CareerFlow account and all associated data have been permanently deleted.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ================= EDUCATION =================
router.post('/education', (req, res) => {
  try {
    const { institution, degree, field_of_study = '', start_year, end_year, grade = '', description = '' } = req.body;
    if (!institution || !degree) {
      return res.status(400).json({ success: false, message: 'Institution and degree are required.' });
    }

    const result = db.prepare(`
      INSERT INTO education (user_id, institution, degree, field_of_study, start_year, end_year, grade, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(req.user.id, institution, degree, field_of_study, start_year ? parseInt(start_year, 10) : null, end_year ? parseInt(end_year, 10) : null, grade, description);

    const item = db.prepare('SELECT * FROM education WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({ success: true, message: 'Education added successfully.', item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/education/:id', (req, res) => {
  try {
    const eduId = parseInt(req.params.id, 10);
    const { institution, degree, field_of_study, start_year, end_year, grade, description } = req.body;

    const existing = db.prepare('SELECT id FROM education WHERE id = ? AND user_id = ?').get(eduId, req.user.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Education record not found.' });
    }

    db.prepare(`
      UPDATE education
      SET institution = ?, degree = ?, field_of_study = ?, start_year = ?, end_year = ?, grade = ?, description = ?
      WHERE id = ? AND user_id = ?
    `).run(
      institution,
      degree,
      field_of_study || '',
      start_year ? parseInt(start_year, 10) : null,
      end_year ? parseInt(end_year, 10) : null,
      grade || '',
      description || '',
      eduId,
      req.user.id
    );

    const updated = db.prepare('SELECT * FROM education WHERE id = ?').get(eduId);

    res.json({ success: true, message: 'Education updated successfully.', item: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/education/:id', (req, res) => {
  try {
    const eduId = parseInt(req.params.id, 10);
    db.prepare('DELETE FROM education WHERE id = ? AND user_id = ?').run(eduId, req.user.id);
    res.json({ success: true, message: 'Education record deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ================= EXPERIENCE =================
router.post('/experience', (req, res) => {
  try {
    const { company, role, location = '', start_date, end_date = '', is_current = 0, description = '', skills_used = [] } = req.body;
    if (!company || !role || !start_date) {
      return res.status(400).json({ success: false, message: 'Company, role, and start date are required.' });
    }

    const skillsJson = JSON.stringify(Array.isArray(skills_used) ? skills_used : []);

    const result = db.prepare(`
      INSERT INTO experience (user_id, company, role, location, start_date, end_date, is_current, description, skills_used)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(req.user.id, company, role, location, start_date, is_current ? '' : end_date, is_current ? 1 : 0, description, skillsJson);

    const item = db.prepare('SELECT * FROM experience WHERE id = ?').get(result.lastInsertRowid);
    item.skills_used = JSON.parse(item.skills_used || '[]');

    res.status(201).json({ success: true, message: 'Experience added successfully.', item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/experience/:id', (req, res) => {
  try {
    const expId = parseInt(req.params.id, 10);
    const { company, role, location = '', start_date, end_date = '', is_current = 0, description = '', skills_used = [] } = req.body;

    const existing = db.prepare('SELECT id FROM experience WHERE id = ? AND user_id = ?').get(expId, req.user.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Experience record not found.' });
    }

    const skillsJson = JSON.stringify(Array.isArray(skills_used) ? skills_used : []);

    db.prepare(`
      UPDATE experience
      SET company = ?, role = ?, location = ?, start_date = ?, end_date = ?, is_current = ?, description = ?, skills_used = ?
      WHERE id = ? AND user_id = ?
    `).run(
      company,
      role,
      location,
      start_date,
      is_current ? '' : end_date,
      is_current ? 1 : 0,
      description,
      skillsJson,
      expId,
      req.user.id
    );

    const updated = db.prepare('SELECT * FROM experience WHERE id = ?').get(expId);
    updated.skills_used = JSON.parse(updated.skills_used || '[]');

    res.json({ success: true, message: 'Experience updated successfully.', item: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/experience/:id', (req, res) => {
  try {
    const expId = parseInt(req.params.id, 10);
    db.prepare('DELETE FROM experience WHERE id = ? AND user_id = ?').run(expId, req.user.id);
    res.json({ success: true, message: 'Experience record deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
