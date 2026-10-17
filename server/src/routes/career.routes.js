const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { authenticate, optionalAuth } = require('../middleware/auth');

// Helper to normalize skill names for gap analysis matching
function normalizeSkill(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Helper to resolve role by numeric ID or slug string
function resolveRole(identifier) {
  if (!identifier) return null;
  let role = null;
  const num = parseInt(identifier, 10);
  if (!isNaN(num) && String(num) === String(identifier).trim() && num > 0) {
    role = db.prepare('SELECT * FROM career_roles WHERE id = ?').get(num);
  }
  if (!role) {
    role = db.prepare('SELECT * FROM career_roles WHERE slug = ?').get(identifier);
  }
  return role;
}

// 1. GET /api/career/roles - List all roles with high-level stats
router.get('/roles', optionalAuth, (req, res) => {
  try {
    const roles = db.prepare(`
      SELECT 
        r.id, 
        r.slug, 
        r.title, 
        r.description, 
        r.icon, 
        r.salary_data,
        COUNT(DISTINCT s.id) as stages_count,
        COUNT(DISTINCT k.id) as skills_count
      FROM career_roles r
      LEFT JOIN career_stages s ON s.role_id = r.id
      LEFT JOIN career_skills k ON k.role_id = r.id
      GROUP BY r.id
      ORDER BY r.id ASC
    `).all();

    const userId = req.user?.id;

    const formattedRoles = roles.map(r => {
      let salaryData = [];
      try {
        salaryData = JSON.parse(r.salary_data);
      } catch (e) {
        salaryData = [];
      }

      // If user is authenticated, compute their completion percentage for this role
      let completedCount = 0;
      let percentage = 0;
      if (userId) {
        const prog = db.prepare(`
          SELECT COUNT(cp.id) as count
          FROM career_progress cp
          JOIN career_skills cs ON cs.id = cp.skill_id
          WHERE cp.user_id = ? AND cs.role_id = ?
        `).get(userId, r.id);
        completedCount = prog?.count || 0;
        percentage = r.skills_count > 0 ? Math.round((completedCount / r.skills_count) * 100) : 0;
      }

      return {
        id: r.id,
        slug: r.slug,
        title: r.title,
        description: r.description,
        icon: r.icon,
        stagesCount: r.stages_count,
        skillsCount: r.skills_count,
        salaryData,
        userProgress: userId ? { completedCount, percentage } : null
      };
    });

    res.json({ success: true, roles: formattedRoles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. GET /api/career/roles/:id - Full roadmap with stages, skills, projects, and resources
router.get('/roles/:id', optionalAuth, (req, res) => {
  try {
    const role = resolveRole(req.params.id);

    if (!role) {
      return res.status(404).json({ success: false, message: 'Career role not found.' });
    }

    // Parse salary data
    let salaryData = [];
    try {
      salaryData = JSON.parse(role.salary_data);
    } catch (e) {
      salaryData = [];
    }

    // Get user's completed skill IDs if logged in
    const userId = req.user?.id;
    let completedSkillIds = new Set();
    if (userId) {
      const userProgress = db.prepare(`
        SELECT skill_id FROM career_progress 
        WHERE user_id = ? AND role_id = ?
      `).all(userId, role.id);
      completedSkillIds = new Set(userProgress.map(p => p.skill_id));
    }

    // Fetch stages in order
    const stages = db.prepare(`
      SELECT * FROM career_stages 
      WHERE role_id = ? 
      ORDER BY stage_order ASC
    `).all(role.id);

    // Fetch all skills for this role
    const skills = db.prepare(`
      SELECT * FROM career_skills 
      WHERE role_id = ? 
      ORDER BY id ASC
    `).all(role.id);

    let totalSkillsCount = skills.length;
    let totalCompletedCount = 0;

    const formattedStages = stages.map(stage => {
      let projectIdeas = [];
      let resources = [];
      try { projectIdeas = JSON.parse(stage.project_ideas); } catch (e) {}
      try { resources = JSON.parse(stage.resources); } catch (e) {}

      const stageSkills = skills
        .filter(s => s.stage_id === stage.id)
        .map(s => {
          const isCompleted = completedSkillIds.has(s.id);
          if (isCompleted) totalCompletedCount++;
          return {
            id: s.id,
            stageId: s.stage_id,
            name: s.name,
            description: s.description,
            category: s.category,
            importance: s.importance,
            isCompleted
          };
        });

      const stageCompletedCount = stageSkills.filter(s => s.isCompleted).length;
      const stagePercentage = stageSkills.length > 0
        ? Math.round((stageCompletedCount / stageSkills.length) * 100)
        : 0;

      return {
        id: stage.id,
        stageOrder: stage.stage_order,
        name: stage.name,
        description: stage.description,
        estimatedTime: stage.estimated_time,
        projectIdeas,
        resources,
        skills: stageSkills,
        completedCount: stageCompletedCount,
        totalCount: stageSkills.length,
        percentage: stagePercentage
      };
    });

    const overallPercentage = totalSkillsCount > 0
      ? Math.round((totalCompletedCount / totalSkillsCount) * 100)
      : 0;

    res.json({
      success: true,
      role: {
        id: role.id,
        slug: role.slug,
        title: role.title,
        description: role.description,
        icon: role.icon,
        salaryData,
        stages: formattedStages,
        overallPercentage,
        completedCount: totalCompletedCount,
        totalSkills: totalSkillsCount
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. POST /api/career/progress - Toggle skill completion
router.post('/progress', authenticate, (req, res) => {
  try {
    const userId = req.user.id;
    const { skillId, roleId, completed } = req.body;

    if (!skillId) {
      return res.status(400).json({ success: false, message: 'Skill ID is required.' });
    }

    const skill = db.prepare('SELECT id, role_id, stage_id FROM career_skills WHERE id = ?').get(skillId);
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found.' });
    }

    const resolvedRole = roleId ? resolveRole(roleId) : null;
    const targetRoleId = resolvedRole ? resolvedRole.id : (roleId || skill.role_id);
    const existing = db.prepare(`
      SELECT id FROM career_progress 
      WHERE user_id = ? AND skill_id = ?
    `).get(userId, skillId);

    let isCompletedNow = false;

    if (completed === false || (completed === undefined && existing)) {
      // Remove progress
      db.prepare('DELETE FROM career_progress WHERE user_id = ? AND skill_id = ?').run(userId, skillId);
      isCompletedNow = false;
    } else {
      // Add progress
      db.prepare(`
        INSERT OR IGNORE INTO career_progress (user_id, skill_id, role_id)
        VALUES (?, ?, ?)
      `).run(userId, skillId, targetRoleId);
      isCompletedNow = true;
    }

    // Return updated completed skill IDs for this role
    const completedSkills = db.prepare(`
      SELECT skill_id FROM career_progress 
      WHERE user_id = ? AND role_id = ?
    `).all(userId, targetRoleId);

    const completedSkillIds = completedSkills.map(p => p.skill_id);
    const totalSkills = db.prepare('SELECT COUNT(*) as count FROM career_skills WHERE role_id = ?').get(targetRoleId).count;
    const overallPercentage = totalSkills > 0 ? Math.round((completedSkillIds.length / totalSkills) * 100) : 0;

    // Check if current stage is 100% completed to celebrate
    const stageSkillsCount = db.prepare('SELECT COUNT(*) as count FROM career_skills WHERE stage_id = ?').get(skill.stage_id).count;
    const stageCompletedCount = db.prepare(`
      SELECT COUNT(cp.id) as count 
      FROM career_progress cp
      JOIN career_skills cs ON cs.id = cp.skill_id
      WHERE cp.user_id = ? AND cs.stage_id = ?
    `).get(userId, skill.stage_id).count;

    const isStageCompleted = stageSkillsCount > 0 && stageCompletedCount === stageSkillsCount;

    res.json({
      success: true,
      isCompleted: isCompletedNow,
      skillId,
      roleId: targetRoleId,
      stageId: skill.stage_id,
      completedSkillIds,
      completedCount: completedSkillIds.length,
      totalSkills,
      overallPercentage,
      isStageCompleted
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. GET /api/career/progress/:roleId - Get completed skills for a role
router.get('/progress/:roleId', authenticate, (req, res) => {
  try {
    const userId = req.user.id;
    const role = resolveRole(req.params.roleId);
    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found.' });
    }
    const roleId = role.id;

    const userProgress = db.prepare(`
      SELECT skill_id FROM career_progress 
      WHERE user_id = ? AND role_id = ?
    `).all(userId, roleId);

    const completedSkillIds = userProgress.map(p => p.skill_id);
    const totalSkills = db.prepare('SELECT COUNT(*) as count FROM career_skills WHERE role_id = ?').get(roleId).count;
    const overallPercentage = totalSkills > 0 ? Math.round((completedSkillIds.length / totalSkills) * 100) : 0;

    res.json({
      success: true,
      roleId,
      completedSkillIds,
      completedCount: completedSkillIds.length,
      totalSkills,
      overallPercentage
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 5. GET /api/career/gap/:roleId - Skill Gap Analysis
router.get('/gap/:roleId', authenticate, (req, res) => {
  try {
    const userId = req.user.id;
    const role = resolveRole(req.params.roleId);
    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found.' });
    }
    const roleId = role.id;

    // 1. Fetch user's profile skills
    const profile = db.prepare('SELECT skills FROM profiles WHERE user_id = ?').get(userId);
    let profileSkills = [];
    if (profile?.skills) {
      try {
        profileSkills = JSON.parse(profile.skills);
      } catch (e) {
        profileSkills = [];
      }
    }

    // 2. Fetch user's checked career_progress for this role
    const checkedSkills = db.prepare(`
      SELECT skill_id FROM career_progress 
      WHERE user_id = ? AND role_id = ?
    `).all(userId, roleId);
    const checkedSkillIds = new Set(checkedSkills.map(s => s.skill_id));

    // 3. Fetch all required skills for this role with their stage names
    const roleSkills = db.prepare(`
      SELECT 
        k.id, 
        k.name, 
        k.category, 
        k.importance, 
        k.stage_id,
        s.name as stage_name,
        s.stage_order
      FROM career_skills k
      JOIN career_stages s ON s.id = k.stage_id
      WHERE k.role_id = ?
      ORDER BY s.stage_order ASC, k.id ASC
    `).all(roleId);

    const normalizedProfileSkills = profileSkills.map(s => normalizeSkill(s));

    const matchedSkills = [];
    const missingSkills = [];

    for (const skill of roleSkills) {
      const normSkill = normalizeSkill(skill.name);
      const isCheckedInRoadmap = checkedSkillIds.has(skill.id);
      
      // Check if skill is in user profile skills (fuzzy match or direct match)
      const isPresentInProfile = normalizedProfileSkills.some(userSkill => {
        return (
          userSkill === normSkill ||
          normSkill.includes(userSkill) ||
          userSkill.includes(normSkill)
        );
      });

      if (isCheckedInRoadmap || isPresentInProfile) {
        matchedSkills.push({
          id: skill.id,
          name: skill.name,
          category: skill.category,
          importance: skill.importance,
          stageId: skill.stage_id,
          stageName: skill.stage_name,
          stageOrder: skill.stage_order,
          matchedVia: isCheckedInRoadmap ? 'progress' : 'profile'
        });
      } else {
        missingSkills.push({
          id: skill.id,
          name: skill.name,
          category: skill.category,
          importance: skill.importance,
          stageId: skill.stage_id,
          stageName: skill.stage_name,
          stageOrder: skill.stage_order
        });
      }
    }

    const totalSkills = roleSkills.length;
    const matchPercentage = totalSkills > 0
      ? Math.round((matchedSkills.length / totalSkills) * 100)
      : 0;

    res.json({
      success: true,
      roleId,
      roleTitle: role.title,
      totalSkills,
      matchedCount: matchedSkills.length,
      missingCount: missingSkills.length,
      matchPercentage,
      matchedSkills,
      missingSkills,
      haveSkills: matchedSkills,
      needSkills: missingSkills
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 6. GET /api/career/goals - List user's career goals
router.get('/goals', authenticate, (req, res) => {
  try {
    const userId = req.user.id;
    const goals = db.prepare(`
      SELECT 
        g.id,
        g.role_id,
        g.title,
        g.target_date,
        g.notes,
        g.is_primary,
        g.created_at,
        g.updated_at,
        r.title as role_title,
        r.slug as role_slug,
        r.icon as role_icon,
        COUNT(DISTINCT k.id) as total_skills
      FROM career_goals g
      JOIN career_roles r ON r.id = g.role_id
      LEFT JOIN career_skills k ON k.role_id = r.id
      WHERE g.user_id = ?
      GROUP BY g.id
      ORDER BY g.is_primary DESC, g.created_at DESC
    `).all(userId);

    const formattedGoals = goals.map(g => {
      // Calculate progress percentage
      const prog = db.prepare(`
        SELECT COUNT(cp.id) as count
        FROM career_progress cp
        JOIN career_skills cs ON cs.id = cp.skill_id
        WHERE cp.user_id = ? AND cs.role_id = ?
      `).get(userId, g.role_id);

      const completedCount = prog?.count || 0;
      const percentage = g.total_skills > 0 ? Math.round((completedCount / g.total_skills) * 100) : 0;

      return {
        id: g.id,
        roleId: g.role_id,
        roleTitle: g.role_title,
        roleSlug: g.role_slug,
        roleIcon: g.role_icon,
        title: g.title,
        targetDate: g.target_date,
        notes: g.notes,
        isPrimary: Boolean(g.is_primary),
        createdAt: g.created_at,
        updatedAt: g.updated_at,
        completedCount,
        totalSkills: g.total_skills,
        percentage
      };
    });

    res.json({ success: true, goals: formattedGoals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 7. POST /api/career/goals - Create new career goal
router.post('/goals', authenticate, (req, res) => {
  try {
    const userId = req.user.id;
    const roleId = req.body.roleId || req.body.role_id;
    const title = req.body.title;
    const targetDate = req.body.targetDate || req.body.target_date || '';
    const notes = req.body.notes || '';
    const isPrimary = req.body.isPrimary !== undefined ? req.body.isPrimary : (req.body.is_primary || false);

    if (!roleId) {
      return res.status(400).json({ success: false, message: 'Role ID is required.' });
    }

    const role = db.prepare('SELECT id, title FROM career_roles WHERE id = ?').get(roleId);
    if (!role) {
      return res.status(404).json({ success: false, message: 'Career role not found.' });
    }

    const goalTitle = title?.trim() || `Become ${role.title}`;

    // If isPrimary is true, unset other primary goals
    if (isPrimary) {
      db.prepare('UPDATE career_goals SET is_primary = 0 WHERE user_id = ?').run(userId);
    } else {
      // If user has zero existing goals, make this first goal primary automatically
      const existingCount = db.prepare('SELECT COUNT(*) as count FROM career_goals WHERE user_id = ?').get(userId).count;
      if (existingCount === 0) {
        req.body.isPrimary = true;
      }
    }

    const result = db.prepare(`
      INSERT INTO career_goals (user_id, role_id, title, target_date, notes, is_primary)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      role.id,
      goalTitle,
      targetDate,
      notes,
      req.body.isPrimary || isPrimary ? 1 : 0
    );

    res.status(201).json({
      success: true,
      message: 'Career goal saved successfully.',
      goalId: result.lastInsertRowid
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 8. PUT /api/career/goals/:id - Update goal or set primary
router.put('/goals/:id', authenticate, (req, res) => {
  try {
    const userId = req.user.id;
    const goalId = parseInt(req.params.id, 10);
    const { title, targetDate, notes, isPrimary } = req.body;

    const existing = db.prepare('SELECT * FROM career_goals WHERE id = ? AND user_id = ?').get(goalId, userId);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Goal not found or unauthorized.' });
    }

    if (isPrimary === true) {
      // Unset all other primary goals
      db.prepare('UPDATE career_goals SET is_primary = 0 WHERE user_id = ?').run(userId);
    }

    db.prepare(`
      UPDATE career_goals 
      SET 
        title = COALESCE(?, title),
        target_date = COALESCE(?, target_date),
        notes = COALESCE(?, notes),
        is_primary = CASE WHEN ? IS NOT NULL THEN ? ELSE is_primary END,
        updated_at = datetime('now')
      WHERE id = ? AND user_id = ?
    `).run(
      title !== undefined ? title.trim() : null,
      targetDate !== undefined ? targetDate : null,
      notes !== undefined ? notes : null,
      isPrimary !== undefined ? 1 : null,
      isPrimary ? 1 : 0,
      goalId,
      userId
    );

    res.json({ success: true, message: 'Goal updated successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 9. DELETE /api/career/goals/:id - Delete career goal
router.delete('/goals/:id', authenticate, (req, res) => {
  try {
    const userId = req.user.id;
    const goalId = parseInt(req.params.id, 10);

    const existing = db.prepare('SELECT * FROM career_goals WHERE id = ? AND user_id = ?').get(goalId, userId);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Goal not found or unauthorized.' });
    }

    db.prepare('DELETE FROM career_goals WHERE id = ? AND user_id = ?').run(goalId, userId);

    // If deleted goal was primary, pick another goal and make it primary
    if (existing.is_primary === 1) {
      const nextGoal = db.prepare('SELECT id FROM career_goals WHERE user_id = ? ORDER BY created_at DESC LIMIT 1').get(userId);
      if (nextGoal) {
        db.prepare('UPDATE career_goals SET is_primary = 1 WHERE id = ?').run(nextGoal.id);
      }
    }

    res.json({ success: true, message: 'Career goal deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
