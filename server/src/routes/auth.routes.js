const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { z } = require('zod');
const db = require('../db/database');
const { authenticate, JWT_SECRET } = require('../middleware/auth');

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

// Validation Schemas
const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

// Helper to fetch user with profile
function getUserWithProfile(userId) {
  const user = db.prepare('SELECT id, email, name, created_at FROM users WHERE id = ?').get(userId);
  if (!user) return null;

  const profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(userId);
  if (profile) {
    try {
      profile.skills = JSON.parse(profile.skills || '[]');
      profile.preferred_roles = JSON.parse(profile.preferred_roles || '[]');
      profile.preferred_locations = JSON.parse(profile.preferred_locations || '[]');
      profile.preferred_job_types = JSON.parse(profile.preferred_job_types || '[]');
    } catch (e) {
      profile.skills = [];
      profile.preferred_roles = [];
      profile.preferred_locations = [];
      profile.preferred_job_types = [];
    }
  }

  const notifPrefs = db.prepare('SELECT * FROM notifications_prefs WHERE user_id = ?').get(userId);

  return {
    ...user,
    profile,
    notificationsPrefs: notifPrefs
  };
}

// POST /api/auth/signup
router.post('/signup', (req, res, next) => {
  try {
    const validated = signupSchema.parse(req.body);
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(validated.email.toLowerCase().trim());
    
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(validated.password, salt);

    const userStmt = db.prepare(`
      INSERT INTO users (name, email, password_hash)
      VALUES (?, ?, ?)
    `);

    const result = userStmt.run(validated.name.trim(), validated.email.toLowerCase().trim(), passwordHash);
    const userId = result.lastInsertRowid;

    // Create default profile
    db.prepare(`
      INSERT INTO profiles (user_id, headline)
      VALUES (?, ?)
    `).run(userId, 'Software Professional');

    // Create default collections
    db.prepare(`INSERT INTO collections (user_id, name, color) VALUES (?, ?, ?)`).run(userId, 'Dream Companies', '#6366f1');
    db.prepare(`INSERT INTO collections (user_id, name, color) VALUES (?, ?, ?)`).run(userId, 'Apply Later', '#10b981');

    // Create notifications preferences
    db.prepare(`
      INSERT INTO notifications_prefs (user_id)
      VALUES (?)
    `).run(userId);

    // Generate token
    const token = jwt.sign({ userId, email: validated.email }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('careerflow_token', token, COOKIE_OPTIONS);

    const fullUser = getUserWithProfile(userId);

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to CareerFlow.',
      token,
      user: fullUser
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', (req, res, next) => {
  try {
    const validated = loginSchema.parse(req.body);
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(validated.email.toLowerCase().trim());

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = bcrypt.compareSync(validated.password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('careerflow_token', token, COOKIE_OPTIONS);

    const fullUser = getUserWithProfile(user.id);

    res.json({
      success: true,
      message: 'Welcome back to CareerFlow!',
      token,
      user: fullUser
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('careerflow_token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  });
  res.json({
    success: true,
    message: 'Logged out successfully.'
  });
});

// GET /api/auth/me
router.get('/me', authenticate, (req, res) => {
  const fullUser = getUserWithProfile(req.user.id);
  if (!fullUser) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  res.json({
    success: true,
    user: fullUser
  });
});

// POST /api/auth/forgot-password
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email address is required.' });
  }

  const user = db.prepare('SELECT id, email, name FROM users WHERE email = ?').get(email.toLowerCase().trim());
  
  // We generate a reset token regardless to prevent user enumeration, but if user exists, record it
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

  if (user) {
    // Invalidate existing tokens for this email
    db.prepare('DELETE FROM password_resets WHERE email = ?').run(user.email);
    db.prepare(`
      INSERT INTO password_resets (email, token, expires_at)
      VALUES (?, ?, ?)
    `).run(user.email, token, expiresAt);
  }

  res.json({
    success: true,
    message: 'If an account with that email exists, password reset instructions have been generated.',
    // Provide simulation token so user/reviewer can test right away in the UI without real email server
    simulatedResetToken: token,
    simulatedResetLink: `/forgot-password?token=${token}`
  });
});

// POST /api/auth/reset-password
router.post('/reset-password', (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ success: false, message: 'Token and new password are required.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
  }

  const resetRecord = db.prepare(`
    SELECT * FROM password_resets
    WHERE token = ? AND used = 0 AND expires_at > datetime('now')
  `).get(token);

  if (!resetRecord) {
    return res.status(400).json({
      success: false,
      message: 'Password reset link is invalid or has expired. Please request a new one.'
    });
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(newPassword, salt);

  db.prepare(`UPDATE users SET password_hash = ?, updated_at = datetime('now') WHERE email = ?`).run(passwordHash, resetRecord.email);
  db.prepare(`UPDATE password_resets SET used = 1 WHERE id = ?`).run(resetRecord.id);

  res.json({
    success: true,
    message: 'Your password has been successfully reset! You can now log in.'
  });
});

module.exports = router;
