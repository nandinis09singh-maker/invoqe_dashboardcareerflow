import api from '../api/axios';
import { ROLES_DATA } from '../data/fallbackCareerPaths';

const SKILL_PROGRESS_KEY = 'careerflow_skill_progress';
const CAREER_GOALS_KEY = 'careerflow_career_goals';

// Helper to get local completed skill IDs
export function getLocalCompletedSkillIds() {
  try {
    const raw = localStorage.getItem(SKILL_PROGRESS_KEY);
    if (!raw) {
      // Seed with a few completed beginner skills for a great first impression
      const initial = ['fe-1-1', 'fe-1-2', 'fe-1-3', 'fe-1-6', 'fs-1-1', 'fs-1-2', 'fs-1-3'];
      localStorage.setItem(SKILL_PROGRESS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

// 1. Fetch all roles summary list
export async function fetchCareerRoles() {
  try {
    const res = await api.get('/career/roles');
    if (res.data && res.data.success && Array.isArray(res.data.roles)) {
      return res.data.roles;
    }
  } catch (err) {
    console.warn('Backend unavailable, using fallback career roles:', err.message);
  }

  const completedIds = getLocalCompletedSkillIds();

  return ROLES_DATA.map((role, idx) => {
    let totalSkills = 0;
    let completedCount = 0;

    (role.stages || []).forEach((st, sIdx) => {
      (st.skills || []).forEach((sk, kIdx) => {
        totalSkills++;
        const skillId = sk.id || `${role.slug.slice(0, 2)}-${sIdx + 1}-${kIdx + 1}`;
        if (completedIds.includes(skillId)) {
          completedCount++;
        }
      });
    });

    const percentage = totalSkills > 0 ? Math.round((completedCount / totalSkills) * 100) : 0;

    return {
      id: idx + 1,
      slug: role.slug,
      title: role.title,
      description: role.description,
      icon: role.icon,
      userProgress: {
        percentage,
        completedSkills: completedCount,
        totalSkills
      }
    };
  });
}

// 2. Fetch specific role details with full stages, skills, projects, and resources
export async function fetchCareerRoleDetail(slug) {
  try {
    const res = await api.get(`/career/roles/${slug}`);
    if (res.data && res.data.success && res.data.role) {
      return res.data.role;
    }
  } catch (err) {
    console.warn(`Backend unavailable for role ${slug}, using fallback details:`, err.message);
  }

  const rawRole = ROLES_DATA.find((r) => r.slug === slug) || ROLES_DATA[0];
  const completedIds = getLocalCompletedSkillIds();

  let totalSkills = 0;
  let completedCount = 0;

  const stages = (rawRole.stages || []).map((st, sIdx) => {
    let stageTotal = 0;
    let stageCompleted = 0;

    const skills = (st.skills || []).map((sk, kIdx) => {
      const skillId = sk.id || `${rawRole.slug.slice(0, 2)}-${sIdx + 1}-${kIdx + 1}`;
      const isDone = completedIds.includes(skillId);
      stageTotal++;
      totalSkills++;
      if (isDone) {
        stageCompleted++;
        completedCount++;
      }
      return {
        id: skillId,
        name: sk.name,
        description: sk.description,
        category: sk.category,
        importance: sk.importance || 'Essential',
        completed: isDone
      };
    });

    const stagePercentage = stageTotal > 0 ? Math.round((stageCompleted / stageTotal) * 100) : 0;

    return {
      id: sIdx + 1,
      stage_order: st.stage_order || sIdx + 1,
      name: st.name,
      description: st.description,
      estimated_time: st.estimated_time || '6-8 weeks',
      totalSkills: stageTotal,
      completedSkills: stageCompleted,
      percentage: stagePercentage,
      skills,
      project_ideas: st.project_ideas || [],
      resources: st.resources || []
    };
  });

  const overallPercentage = totalSkills > 0 ? Math.round((completedCount / totalSkills) * 100) : 0;

  return {
    id: ROLES_DATA.indexOf(rawRole) + 1,
    slug: rawRole.slug,
    title: rawRole.title,
    description: rawRole.description,
    icon: rawRole.icon,
    totalSkills,
    completedCount,
    overallPercentage,
    salary_data: rawRole.salary_data || [],
    stages
  };
}

// 3. Fetch Skill Gap for a role
export async function fetchCareerGap(slug) {
  try {
    const res = await api.get(`/career/gap/${slug}`);
    if (res.data && res.data.success) {
      return res.data;
    }
  } catch (err) {
    console.warn(`Backend unavailable for skill gap of ${slug}, generating client gap:`, err.message);
  }

  const role = await fetchCareerRoleDetail(slug);
  const masteredSkills = [];
  const missingSkills = [];

  (role.stages || []).forEach((st) => {
    (st.skills || []).forEach((sk) => {
      if (sk.completed) {
        masteredSkills.push({ name: sk.name, category: sk.category });
      } else {
        missingSkills.push({
          id: sk.id,
          name: sk.name,
          category: sk.category,
          importance: sk.importance,
          stageId: st.id,
          stageName: st.name
        });
      }
    });
  });

  const total = masteredSkills.length + missingSkills.length;
  const matchPercentage = total > 0 ? Math.round((masteredSkills.length / total) * 100) : 0;

  return {
    matchPercentage,
    masteredSkills,
    missingSkills,
    totalRoleSkills: total,
    userCompletedCount: masteredSkills.length
  };
}

// 4. Toggle skill progress
export async function toggleCareerSkillProgress(skillId, roleId, completed, stageId) {
  try {
    const res = await api.post('/career/progress', { skillId, roleId, completed });
    if (res.data && res.data.success) {
      // Sync local storage as well
      const ids = getLocalCompletedSkillIds();
      const updated = completed
        ? Array.from(new Set([...ids, String(skillId)]))
        : ids.filter((id) => id !== String(skillId));
      localStorage.setItem(SKILL_PROGRESS_KEY, JSON.stringify(updated));
      return res.data;
    }
  } catch (err) {
    console.warn('Backend unavailable, saving skill progress locally:', err.message);
  }

  const ids = getLocalCompletedSkillIds();
  const updated = completed
    ? Array.from(new Set([...ids, String(skillId)]))
    : ids.filter((id) => id !== String(skillId));
  localStorage.setItem(SKILL_PROGRESS_KEY, JSON.stringify(updated));

  return {
    success: true,
    isStageCompleted: false,
    message: completed ? 'Skill completed!' : 'Skill unchecked'
  };
}

// 5. Career Goals
export async function fetchUserCareerGoals() {
  try {
    const res = await api.get('/career/goals');
    if (res.data && res.data.success && Array.isArray(res.data.goals)) {
      return res.data.goals;
    }
  } catch (err) {}

  try {
    const raw = localStorage.getItem(CAREER_GOALS_KEY);
    if (!raw) {
      const initial = [
        {
          id: 1,
          role_slug: 'frontend-developer',
          role_title: 'Frontend Developer',
          target_date: '2026-12-31',
          priority: 'High',
          percentage: 42,
          created_at: new Date().toISOString()
        }
      ];
      localStorage.setItem(CAREER_GOALS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export async function setCareerGoal(roleSlug, targetDate, priority = 'Medium') {
  try {
    const res = await api.post('/career/goals', { roleSlug, targetDate, priority });
    if (res.data && res.data.success) {
      return res.data;
    }
  } catch (e) {}

  const goals = await fetchUserCareerGoals();
  const matchedRole = ROLES_DATA.find((r) => r.slug === roleSlug) || { title: roleSlug };
  const newGoal = {
    id: Date.now(),
    role_slug: roleSlug,
    role_title: matchedRole.title,
    target_date: targetDate,
    priority,
    percentage: 25,
    created_at: new Date().toISOString()
  };

  const updated = [newGoal, ...goals.filter((g) => g.role_slug !== roleSlug)];
  localStorage.setItem(CAREER_GOALS_KEY, JSON.stringify(updated));
  return { success: true, goal: newGoal };
}
