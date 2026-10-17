const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

// Action verbs dictionary for ATS score analysis
const ACTION_VERBS = [
  'architected', 'engineered', 'developed', 'spearheaded', 'designed',
  'implemented', 'scaled', 'optimized', 'led', 'managed', 'delivered',
  'built', 'refactored', 'automated', 'mentored', 'orchestrated',
  'collaborated', 'reduced', 'increased', 'boosted', 'deployed',
  'analyzed', 'pioneered', 'streamlined', 'resolved', 'launched',
  'created', 'executed', 'formulated', 'accelerated', 'revamped'
];

// Common technical skills dictionary for JD match and ATS checks
const TECH_KEYWORDS_DICTIONARY = [
  'react', 'react.js', 'typescript', 'javascript', 'node', 'node.js', 'express',
  'next.js', 'vue', 'angular', 'html', 'html5', 'css', 'css3', 'tailwind',
  'bootstrap', 'sass', 'redux', 'zustand', 'python', 'django', 'fastapi',
  'flask', 'java', 'spring', 'spring boot', 'go', 'golang', 'rust', 'c++',
  'sql', 'postgresql', 'postgres', 'mysql', 'sqlite', 'mongodb', 'redis',
  'elasticsearch', 'dynamodb', 'cassandra', 'docker', 'kubernetes', 'k8s',
  'terraform', 'aws', 'gcp', 'azure', 'ci/cd', 'github actions', 'jenkins',
  'linux', 'git', 'rest', 'restful', 'graphql', 'grpc', 'microservices',
  'kafka', 'rabbitmq', 'vitest', 'jest', 'cypress', 'playwright', 'webpack',
  'vite', 'figma', 'ui/ux', 'agile', 'scrum', 'jira', 'oop', 'mvc', 'solid',
  'security', 'owasp', 'jwt', 'oauth', 'websockets', 'performance',
  'pandas', 'numpy', 'scikit-learn', 'pytorch', 'tensorflow', 'machine learning',
  'deep learning', 'nlp', 'llm', 'power bi', 'tableau', 'excel', 'dbt', 'etl'
];

function matchKeyword(text, keyword) {
  if (!text || !keyword) return false;
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const prefix = /^\w/.test(keyword) ? '\\b' : '';
  const suffix = /\w$/.test(keyword) ? '\\b' : '';
  try {
    const regex = new RegExp(`${prefix}${escaped}${suffix}`, 'i');
    return regex.test(text);
  } catch (e) {
    return text.toLowerCase().includes(keyword.toLowerCase());
  }
}

// ATS Scorer Function
function calculateAtsScore(content) {
  if (!content || typeof content !== 'object') {
    return { score: 20, breakdown: {}, suggestions: ['Complete your personal info and work experience.'] };
  }

  const { personal_info = {}, summary = '', experience = [], education = [], projects = [], skills = {} } = content;

  let contactScore = 0;
  const suggestions = [];

  // 1. Contact Information (15 pts)
  if (personal_info.full_name?.trim()) contactScore += 3;
  else suggestions.push('Add your full name in the Personal Info section.');

  if (personal_info.email?.trim() && personal_info.email.includes('@')) contactScore += 3;
  else suggestions.push('Add a valid professional email address.');

  if (personal_info.phone?.trim()) contactScore += 3;
  else suggestions.push('Include a contact phone number with country code.');

  if (personal_info.location?.trim()) contactScore += 3;
  else suggestions.push('Specify your current city or location.');

  if (personal_info.linkedin?.trim() || personal_info.github?.trim() || personal_info.website?.trim()) contactScore += 3;
  else suggestions.push('Add at least one professional link (LinkedIn, GitHub, or Portfolio).');

  // 2. Section Completeness (20 pts)
  let sectionScore = 0;
  if (summary.trim().length > 40) sectionScore += 4;
  else suggestions.push('Write a compelling 2-4 sentence professional summary highlighting your strengths.');

  if (experience.length >= 1) sectionScore += 6;
  else suggestions.push('Add at least one work experience entry.');

  if (education.length >= 1) sectionScore += 4;
  else suggestions.push('Add your academic degree or educational background.');

  const hasSkills = Object.values(skills).some(s => Array.isArray(s) && s.length > 0) || (Array.isArray(skills) && skills.length > 0);
  if (hasSkills) sectionScore += 4;
  else suggestions.push('List key technical skills and tools.');

  if (projects.length >= 1) sectionScore += 2;
  else suggestions.push('Include at least one standout project to demonstrate practical skills.');

  // Extract all text content for text-based analysis
  const fullTextPieces = [
    summary,
    personal_info.headline || '',
    ...experience.map(e => `${e.role || ''} ${e.company || ''} ${e.description || ''} ${(e.bullets || []).join(' ')}`),
    ...projects.map(p => `${p.title || ''} ${p.description || ''} ${p.tech_stack || ''} ${(p.bullets || []).join(' ')}`),
    JSON.stringify(skills)
  ];
  const combinedText = fullTextPieces.join(' ').toLowerCase();
  const words = combinedText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // 3. Length & Density (15 pts)
  let lengthScore = 0;
  if (wordCount >= 250 && wordCount <= 850) {
    lengthScore = 15;
  } else if (wordCount >= 150 && wordCount < 250) {
    lengthScore = 10;
    suggestions.push('Your resume is slightly brief (under 250 words). Add more details to your achievements.');
  } else if (wordCount > 850) {
    lengthScore = 10;
    suggestions.push('Your resume is lengthy (over 850 words). Aim for a concise, high-impact 1-2 page format.');
  } else {
    lengthScore = 5;
    suggestions.push('Resume content is very short. Expand on your responsibilities and achievements.');
  }

  // 4. Action Verbs (20 pts)
  let actionVerbsFound = 0;
  for (const verb of ACTION_VERBS) {
    const regex = new RegExp(`\\b${verb}\\b`, 'i');
    if (regex.test(combinedText)) {
      actionVerbsFound++;
    }
  }
  let actionVerbsScore = Math.min(20, actionVerbsFound * 4);
  if (actionVerbsFound < 4) {
    suggestions.push('Start your accomplishment bullets with strong action verbs (e.g. "Architected", "Engineered", "Optimized", "Scaled").');
  }

  // 5. Quantified Metrics (15 pts)
  // Match numbers followed by %, x, k, m, or currency or plus
  const metricRegex = /\b(\d+%\b|\d+x\b|\$\d+|\b\d+\s*(users|customers|requests|transactions|lpa|team|engineers|k|m|million|billion)\b)/gi;
  const metricsFound = combinedText.match(metricRegex) || [];
  let metricsScore = Math.min(15, metricsFound.length * 5);
  if (metricsFound.length < 3) {
    suggestions.push('Add quantifiable metrics to your experience bullets (e.g., "reduced latency by 35%", "scaled to 10k users").');
  }

  // 6. Keywords Variety (15 pts)
  let keywordsFound = 0;
  for (const kw of TECH_KEYWORDS_DICTIONARY) {
    if (matchKeyword(combinedText, kw)) {
      keywordsFound++;
    }
  }
  let keywordsScore = Math.min(15, Math.round((keywordsFound / 8) * 15));
  if (keywordsFound < 6) {
    suggestions.push('Include more specific technology keywords relevant to your target engineering roles.');
  }

  const totalScore = Math.min(100, Math.round(contactScore + sectionScore + lengthScore + actionVerbsScore + metricsScore + keywordsScore));

  return {
    score: totalScore,
    breakdown: {
      contact: { score: contactScore, max: 15 },
      sections: { score: sectionScore, max: 20 },
      length: { score: lengthScore, max: 15, wordCount },
      actionVerbs: { score: actionVerbsScore, max: 20, count: actionVerbsFound },
      metrics: { score: metricsScore, max: 15, count: metricsFound.length },
      keywords: { score: keywordsScore, max: 15, count: keywordsFound }
    },
    suggestions: suggestions.slice(0, 5)
  };
}

// 1. GET /api/resumes - List resumes for current user
router.get('/', (req, res) => {
  try {
    const userId = req.user.id;
    const resumes = db.prepare(`
      SELECT 
        id, 
        title, 
        template, 
        accent_color, 
        font_family, 
        font_size, 
        ats_score, 
        created_at, 
        updated_at,
        content
      FROM resumes 
      WHERE user_id = ? 
      ORDER BY updated_at DESC
    `).all(userId);

    const formatted = resumes.map(r => {
      let parsed = {};
      try { parsed = JSON.parse(r.content); } catch (e) {}

      return {
        id: r.id,
        title: r.title,
        template: r.template,
        accentColor: r.accent_color,
        fontFamily: r.font_family,
        fontSize: r.font_size,
        atsScore: r.ats_score,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
        summary: parsed.summary || '',
        experienceCount: parsed.experience?.length || 0,
        projectsCount: parsed.projects?.length || 0
      };
    });

    res.json({ success: true, resumes: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. POST /api/resumes - Create new resume
router.post('/', (req, res) => {
  try {
    const userId = req.user.id;
    const {
      title = 'Untitled Resume',
      template = 'modern',
      content
    } = req.body;
    const accentColor = req.body.accentColor || req.body.accent_color || '#4f46e5';
    const fontFamily = req.body.fontFamily || req.body.font_family || 'Inter';
    const fontSize = req.body.fontSize || req.body.font_size || 'normal';

    let resumeContent = content;

    // If no content provided, try prefilling from user profile or create empty template
    if (!resumeContent) {
      const user = db.prepare('SELECT name, email FROM users WHERE id = ?').get(userId);
      const profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(userId);
      const experience = db.prepare('SELECT * FROM experience WHERE user_id = ? ORDER BY start_date DESC').all(userId);
      const education = db.prepare('SELECT * FROM education WHERE user_id = ? ORDER BY end_year DESC').all(userId);

      let skillsObj = { 'Core Skills': [] };
      if (profile?.skills) {
        try {
          const rawSkills = JSON.parse(profile.skills);
          if (Array.isArray(rawSkills)) skillsObj['Core Skills'] = rawSkills;
        } catch (e) {}
      }

      resumeContent = {
        personal_info: {
          full_name: user?.name || '',
          headline: profile?.headline || 'Software Engineer',
          email: user?.email || '',
          phone: profile?.phone || '',
          location: profile?.location || '',
          website: profile?.portfolio_url || '',
          linkedin: profile?.linkedin_url || '',
          github: profile?.github_url || ''
        },
        summary: profile?.bio || '',
        experience: experience.map(exp => ({
          id: `exp-${exp.id}`,
          role: exp.role,
          company: exp.company,
          location: exp.location || '',
          start_date: exp.start_date || '',
          end_date: exp.end_date || '',
          is_current: Boolean(exp.is_current),
          description: exp.description || '',
          bullets: exp.description ? [exp.description] : []
        })),
        education: education.map(edu => ({
          id: `edu-${edu.id}`,
          degree: edu.degree,
          institution: edu.institution,
          location: '',
          start_year: edu.start_year || '',
          end_year: edu.end_year || '',
          grade: edu.grade || '',
          description: edu.description || ''
        })),
        projects: [],
        skills: skillsObj,
        certifications: [],
        achievements: [],
        languages: [{ id: 'lang-1', language: 'English', proficiency: 'Professional' }],
        links: [],
        section_order: ['summary', 'experience', 'projects', 'skills', 'education', 'certifications', 'achievements', 'languages'],
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
      };
    }

    const { score: atsScore } = calculateAtsScore(resumeContent);

    const result = db.prepare(`
      INSERT INTO resumes (user_id, title, template, accent_color, font_family, font_size, content, ats_score)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      title.trim() || 'Untitled Resume',
      template,
      accentColor,
      fontFamily,
      fontSize,
      JSON.stringify(resumeContent),
      atsScore
    );

    const newResume = db.prepare('SELECT * FROM resumes WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: 'Resume created successfully.',
      resume: newResume,
      resumeId: result.lastInsertRowid
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. GET /api/resumes/:id - Get single resume
router.get('/:id', (req, res) => {
  try {
    const userId = req.user.id;
    const resumeId = parseInt(req.params.id, 10);

    const resume = db.prepare('SELECT * FROM resumes WHERE id = ? AND user_id = ?').get(resumeId, userId);
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found or unauthorized.' });
    }

    let parsedContent = {};
    try {
      parsedContent = JSON.parse(resume.content);
    } catch (e) {
      parsedContent = {};
    }

    res.json({
      success: true,
      resume: {
        id: resume.id,
        title: resume.title,
        template: resume.template,
        accentColor: resume.accent_color,
        fontFamily: resume.font_family,
        fontSize: resume.font_size,
        atsScore: resume.ats_score,
        createdAt: resume.created_at,
        updatedAt: resume.updated_at,
        content: parsedContent
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. PUT /api/resumes/:id - Update resume (auto-save or manual save)
router.put('/:id', (req, res) => {
  try {
    const userId = req.user.id;
    const resumeId = parseInt(req.params.id, 10);
    const { title, template, accentColor, fontFamily, fontSize, content } = req.body;

    const existing = db.prepare('SELECT * FROM resumes WHERE id = ? AND user_id = ?').get(resumeId, userId);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Resume not found or unauthorized.' });
    }

    const updatedContent = content !== undefined ? content : JSON.parse(existing.content);
    const { score: newAtsScore } = calculateAtsScore(updatedContent);

    const colorVal = accentColor !== undefined ? accentColor : (req.body.accent_color !== undefined ? req.body.accent_color : null);
    const fontVal = fontFamily !== undefined ? fontFamily : (req.body.font_family !== undefined ? req.body.font_family : null);
    const sizeVal = fontSize !== undefined ? fontSize : (req.body.font_size !== undefined ? req.body.font_size : null);

    db.prepare(`
      UPDATE resumes 
      SET 
        title = COALESCE(?, title),
        template = COALESCE(?, template),
        accent_color = COALESCE(?, accent_color),
        font_family = COALESCE(?, font_family),
        font_size = COALESCE(?, font_size),
        content = ?,
        ats_score = ?,
        updated_at = datetime('now')
      WHERE id = ? AND user_id = ?
    `).run(
      title !== undefined ? title.trim() : null,
      template !== undefined ? template : null,
      colorVal,
      fontVal,
      sizeVal,
      JSON.stringify(updatedContent),
      newAtsScore,
      resumeId,
      userId
    );

    const updatedResume = db.prepare('SELECT * FROM resumes WHERE id = ?').get(resumeId);

    res.json({
      success: true,
      message: 'Resume saved successfully.',
      resume: updatedResume,
      atsScore: newAtsScore,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 5. DELETE /api/resumes/:id - Delete resume
router.delete('/:id', (req, res) => {
  try {
    const userId = req.user.id;
    const resumeId = parseInt(req.params.id, 10);

    const existing = db.prepare('SELECT id FROM resumes WHERE id = ? AND user_id = ?').get(resumeId, userId);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Resume not found or unauthorized.' });
    }

    db.prepare('DELETE FROM resumes WHERE id = ? AND user_id = ?').run(resumeId, userId);

    res.json({ success: true, message: 'Resume deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 6. POST /api/resumes/:id/duplicate - Clone resume
router.post('/:id/duplicate', (req, res) => {
  try {
    const userId = req.user.id;
    const resumeId = parseInt(req.params.id, 10);

    const original = db.prepare('SELECT * FROM resumes WHERE id = ? AND user_id = ?').get(resumeId, userId);
    if (!original) {
      return res.status(404).json({ success: false, message: 'Original resume not found.' });
    }

    const newTitle = `${original.title} (Copy)`;

    const result = db.prepare(`
      INSERT INTO resumes (user_id, title, template, accent_color, font_family, font_size, content, ats_score)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      newTitle,
      original.template,
      original.accent_color,
      original.font_family,
      original.font_size,
      original.content,
      original.ats_score
    );

    const duplicated = db.prepare('SELECT * FROM resumes WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: 'Resume duplicated.',
      resume: duplicated,
      resumeId: result.lastInsertRowid
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 7. POST /api/resumes/:id/ats-check - Detailed ATS breakdown & suggestions
router.post('/:id/ats-check', (req, res) => {
  try {
    const userId = req.user.id;
    const resumeId = parseInt(req.params.id, 10);

    const resume = db.prepare('SELECT * FROM resumes WHERE id = ? AND user_id = ?').get(resumeId, userId);
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found or unauthorized.' });
    }

    let parsedContent = {};
    try {
      parsedContent = JSON.parse(resume.content);
    } catch (e) {
      parsedContent = {};
    }

    const atsResult = calculateAtsScore(parsedContent);

    // Save recalculated score
    db.prepare('UPDATE resumes SET ats_score = ? WHERE id = ?').run(atsResult.score, resumeId);

    res.json({
      success: true,
      atsScore: atsResult.score,
      score: atsResult.score,
      breakdown: atsResult.breakdown,
      categories: atsResult.breakdown,
      suggestions: atsResult.suggestions
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 8. POST /api/resumes/:id/jd-match - Match resume keywords against job description
router.post('/:id/jd-match', (req, res) => {
  try {
    const userId = req.user.id;
    const resumeId = parseInt(req.params.id, 10);
    const jobDescription = req.body.jobDescription || req.body.job_description || '';

    if (!jobDescription.trim()) {
      return res.status(400).json({ success: false, message: 'Job description text is required.' });
    }

    const resume = db.prepare('SELECT content FROM resumes WHERE id = ? AND user_id = ?').get(resumeId, userId);
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found or unauthorized.' });
    }

    let parsedContent = {};
    try { parsedContent = JSON.parse(resume.content); } catch (e) {}

    // Extract all resume text
    const resumeText = [
      parsedContent.summary || '',
      ...((parsedContent.experience || []).map(e => `${e.role || ''} ${e.company || ''} ${e.description || ''} ${(e.bullets || []).join(' ')}`)),
      ...((parsedContent.projects || []).map(p => `${p.title || ''} ${p.description || ''} ${p.tech_stack || ''} ${(p.bullets || []).join(' ')}`)),
      JSON.stringify(parsedContent.skills || {})
    ].join(' ').toLowerCase();

    const jdText = jobDescription.toLowerCase();

    // Find all keywords mentioned in the JD
    const jdKeywordsFound = [];
    for (const kw of TECH_KEYWORDS_DICTIONARY) {
      if (matchKeyword(jdText, kw)) {
        jdKeywordsFound.push(kw);
      }
    }

    const matchedKeywords = [];
    const missingKeywords = [];

    for (const kw of jdKeywordsFound) {
      if (matchKeyword(resumeText, kw)) {
        matchedKeywords.push(kw);
      } else {
        missingKeywords.push(kw);
      }
    }

    const totalJdKeywords = jdKeywordsFound.length;
    const matchPercentage = totalJdKeywords > 0
      ? Math.round((matchedKeywords.length / totalJdKeywords) * 100)
      : 80;

    res.json({
      success: true,
      matchPercentage,
      match_percentage: matchPercentage,
      totalJdKeywords,
      matchedKeywords,
      matched_keywords: matchedKeywords,
      missingKeywords,
      missing_keywords: missingKeywords
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
