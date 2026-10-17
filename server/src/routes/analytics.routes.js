const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

// GET /api/analytics/dashboard
router.get('/dashboard', (req, res) => {
  try {
    const userId = req.user.id;

    // Total jobs in system
    const totalJobsCount = db.prepare('SELECT COUNT(*) as count FROM jobs').get().count;

    // User counts
    const savedCount = db.prepare('SELECT COUNT(*) as count FROM saved_jobs WHERE user_id = ?').get(userId).count;
    const appliedCount = db.prepare('SELECT COUNT(*) as count FROM applications WHERE user_id = ?').get(userId).count;
    const interviewCount = db.prepare('SELECT COUNT(*) as count FROM applications WHERE user_id = ? AND status = ?').get(userId, 'Interview').count;
    const offerCount = db.prepare('SELECT COUNT(*) as count FROM applications WHERE user_id = ? AND status = ?').get(userId, 'Offer').count;
    const reviewCount = db.prepare('SELECT COUNT(*) as count FROM applications WHERE user_id = ? AND status = ?').get(userId, 'Under Review').count;
    const rejectedCount = db.prepare('SELECT COUNT(*) as count FROM applications WHERE user_id = ? AND status = ?').get(userId, 'Rejected').count;

    // Status breakdown for Pie/Bar charts
    const statusBreakdown = [
      { name: 'Applied', count: db.prepare('SELECT COUNT(*) as count FROM applications WHERE user_id = ? AND status = ?').get(userId, 'Applied').count, color: '#6366f1' },
      { name: 'Under Review', count: reviewCount, color: '#f59e0b' },
      { name: 'Interview', count: interviewCount, color: '#3b82f6' },
      { name: 'Offer', count: offerCount, color: '#10b981' },
      { name: 'Rejected', count: rejectedCount, color: '#ef4444' }
    ];

    // Weekly applications trend (past 6 weeks)
    const weeklyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const daysAgoStart = i * 7;
      const daysAgoEnd = (i + 1) * 7;
      const label = i === 0 ? 'This Week' : `${i}w ago`;
      
      const count = db.prepare(`
        SELECT COUNT(*) as count FROM applications
        WHERE user_id = ?
        AND applied_at >= datetime('now', '-' || ? || ' days')
        AND applied_at < datetime('now', '-' || ? || ' days')
      `).get(userId, daysAgoEnd, daysAgoStart).count;

      weeklyTrend.push({
        week: label,
        applications: count
      });
    }

    // Recent applications (last 5)
    const recentApplications = db.prepare(`
      SELECT 
        a.id,
        a.job_id,
        a.status,
        a.applied_at,
        a.updated_at,
        j.title,
        j.company,
        j.logo_url,
        j.location,
        j.salary_min,
        j.salary_max
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE a.user_id = ?
      ORDER BY a.updated_at DESC
      LIMIT 5
    `).all(userId);

    // Profile & completion
    const user = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(userId);
    const profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(userId) || {};
    const eduCount = db.prepare('SELECT COUNT(*) as count FROM education WHERE user_id = ?').get(userId).count;
    const expCount = db.prepare('SELECT COUNT(*) as count FROM experience WHERE user_id = ?').get(userId).count;

    let userSkills = [];
    try { userSkills = JSON.parse(profile.skills || '[]'); } catch (e) {}

    let profileScore = 0;
    const tips = [];
    if (user.name) profileScore += 5;
    if (profile.headline) profileScore += 5; else tips.push('Add a professional headline');
    if (profile.bio && profile.bio.length > 20) profileScore += 5; else tips.push('Write a short bio');
    if (profile.location) profileScore += 5; else tips.push('Add your location');
    if (profile.phone) profileScore += 5; else tips.push('Add contact phone');
    if (profile.avatar_url) profileScore += 10; else tips.push('Upload a profile photo');
    if (userSkills.length >= 3) profileScore += 15; else tips.push('Add at least 3 core skills');
    if (eduCount > 0) profileScore += 15; else tips.push('Add education details');
    if (expCount > 0) profileScore += 15; else tips.push('Add work experience');
    if (profile.resume_url) profileScore += 10; else tips.push('Upload your resume (PDF)');
    if (profile.expected_salary_min > 0) profileScore += 10; else tips.push('Specify target salary');

    // Recommended jobs (top 4)
    const rawJobs = db.prepare('SELECT * FROM jobs ORDER BY is_featured DESC, posted_at DESC LIMIT 15').all();
    const recommendedJobs = rawJobs.map(j => {
      let jSkills = [];
      try { jSkills = JSON.parse(j.skills || '[]'); } catch (e) {}
      
      let match = 70;
      if (userSkills.length > 0 && jSkills.length > 0) {
        const uLow = userSkills.map(s => s.toLowerCase());
        const matched = jSkills.filter(js => uLow.some(us => us.includes(js.toLowerCase()) || js.toLowerCase().includes(us)));
        match = Math.min(Math.max(Math.round((matched.length / jSkills.length) * 100), 40), 98);
      }

      return {
        id: j.id,
        title: j.title,
        company: j.company,
        logo_url: j.logo_url,
        location: j.location,
        job_type: j.job_type,
        salary_min: j.salary_min,
        salary_max: j.salary_max,
        skills: jSkills,
        match_percentage: match
      };
    }).sort((a, b) => b.match_percentage - a.match_percentage).slice(0, 4);

    // Stage 2: Primary Career Goal
    let primaryGoal = null;
    try {
      const pGoal = db.prepare(`
        SELECT 
          g.id, 
          g.role_id, 
          g.title, 
          g.target_date, 
          r.title as role_title, 
          r.slug as role_slug, 
          r.icon as role_icon,
          COUNT(DISTINCT k.id) as total_skills
        FROM career_goals g
        JOIN career_roles r ON r.id = g.role_id
        LEFT JOIN career_skills k ON k.role_id = r.id
        WHERE g.user_id = ? AND g.is_primary = 1
        GROUP BY g.id
        LIMIT 1
      `).get(userId);

      if (pGoal) {
        const prog = db.prepare(`
          SELECT COUNT(cp.id) as count
          FROM career_progress cp
          JOIN career_skills cs ON cs.id = cp.skill_id
          WHERE cp.user_id = ? AND cs.role_id = ?
        `).get(userId, pGoal.role_id);
        const completedCount = prog?.count || 0;
        const percentage = pGoal.total_skills > 0 ? Math.round((completedCount / pGoal.total_skills) * 100) : 0;

        primaryGoal = {
          id: pGoal.id,
          roleId: pGoal.role_id,
          roleTitle: pGoal.role_title,
          roleSlug: pGoal.role_slug,
          roleIcon: pGoal.role_icon,
          title: pGoal.title,
          targetDate: pGoal.target_date,
          completedCount,
          totalSkills: pGoal.total_skills,
          percentage
        };
      }
    } catch (e) {
      console.error('Error fetching primary goal for dashboard:', e);
    }

    // Stage 2: Latest Resume ATS Score
    let latestResume = null;
    try {
      const resm = db.prepare(`
        SELECT id, title, template, ats_score, updated_at 
        FROM resumes 
        WHERE user_id = ? 
        ORDER BY updated_at DESC 
        LIMIT 1
      `).get(userId);

      if (resm) {
        latestResume = {
          id: resm.id,
          title: resm.title,
          template: resm.template,
          atsScore: resm.ats_score,
          updatedAt: resm.updated_at
        };
      }
    } catch (e) {
      console.error('Error fetching latest resume for dashboard:', e);
    }

    res.json({
      success: true,
      stats: {
        totalJobs: totalJobsCount,
        savedJobs: savedCount,
        appliedJobs: appliedCount,
        interviews: interviewCount,
        offers: offerCount
      },
      profileCompletion: {
        percentage: Math.min(profileScore, 100),
        tips
      },
      statusBreakdown,
      weeklyTrend,
      recentApplications,
      recommendedJobs,
      primaryGoal,
      latestResume
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
