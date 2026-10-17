const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'careerflow.db');
const db = new Database(dbPath);

// Enable WAL mode and foreign keys
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      phone TEXT DEFAULT '',
      location TEXT DEFAULT '',
      headline TEXT DEFAULT '',
      bio TEXT DEFAULT '',
      avatar_url TEXT DEFAULT '',
      resume_url TEXT DEFAULT '',
      resume_filename TEXT DEFAULT '',
      resume_uploaded_at TEXT,
      skills TEXT DEFAULT '[]',
      github_url TEXT DEFAULT '',
      linkedin_url TEXT DEFAULT '',
      portfolio_url TEXT DEFAULT '',
      twitter_url TEXT DEFAULT '',
      preferred_roles TEXT DEFAULT '[]',
      preferred_locations TEXT DEFAULT '[]',
      preferred_job_types TEXT DEFAULT '[]',
      expected_salary_min REAL DEFAULT 0,
      expected_salary_max REAL DEFAULT 0,
      open_to_remote INTEGER DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS education (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      institution TEXT NOT NULL,
      degree TEXT NOT NULL,
      field_of_study TEXT DEFAULT '',
      start_year INTEGER,
      end_year INTEGER,
      grade TEXT DEFAULT '',
      description TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS experience (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      company TEXT NOT NULL,
      role TEXT NOT NULL,
      location TEXT DEFAULT '',
      start_date TEXT NOT NULL,
      end_date TEXT DEFAULT '',
      is_current INTEGER DEFAULT 0,
      description TEXT DEFAULT '',
      skills_used TEXT DEFAULT '[]',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      logo_url TEXT DEFAULT '',
      location TEXT NOT NULL,
      job_type TEXT NOT NULL,
      experience_level TEXT NOT NULL,
      salary_min REAL NOT NULL,
      salary_max REAL NOT NULL,
      description TEXT NOT NULL,
      requirements TEXT NOT NULL,
      responsibilities TEXT NOT NULL,
      skills TEXT NOT NULL,
      benefits TEXT DEFAULT '[]',
      company_website TEXT DEFAULT '',
      company_size TEXT DEFAULT '50-200 employees',
      industry TEXT DEFAULT 'Information Technology',
      posted_at TEXT NOT NULL DEFAULT (datetime('now')),
      is_featured INTEGER DEFAULT 0,
      category TEXT DEFAULT 'Engineering'
    );

    CREATE TABLE IF NOT EXISTS collections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      color TEXT DEFAULT '#6366f1',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS saved_jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
      collection_id INTEGER REFERENCES collections(id) ON DELETE SET NULL,
      note TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id, job_id)
    );

    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'Applied',
      cover_letter TEXT DEFAULT '',
      resume_url TEXT DEFAULT '',
      notes TEXT DEFAULT '',
      interview_date TEXT DEFAULT '',
      interview_time TEXT DEFAULT '',
      meeting_link TEXT DEFAULT '',
      applied_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id, job_id)
    );

    CREATE TABLE IF NOT EXISTS application_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      application_id INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
      status TEXT NOT NULL,
      notes TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS notifications_prefs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      email_job_alerts INTEGER DEFAULT 1,
      email_application_updates INTEGER DEFAULT 1,
      email_weekly_digest INTEGER DEFAULT 1,
      in_app_notifications INTEGER DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS password_resets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      token TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      used INTEGER DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    /* STAGE 2 TABLES */
    CREATE TABLE IF NOT EXISTS career_roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT NOT NULL,
      salary_data TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS career_stages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role_id INTEGER NOT NULL REFERENCES career_roles(id) ON DELETE CASCADE,
      stage_order INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      estimated_time TEXT NOT NULL,
      project_ideas TEXT DEFAULT '[]',
      resources TEXT DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS career_skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stage_id INTEGER NOT NULL REFERENCES career_stages(id) ON DELETE CASCADE,
      role_id INTEGER NOT NULL REFERENCES career_roles(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT DEFAULT 'Core',
      importance TEXT DEFAULT 'Essential'
    );

    CREATE TABLE IF NOT EXISTS career_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      skill_id INTEGER NOT NULL REFERENCES career_skills(id) ON DELETE CASCADE,
      role_id INTEGER NOT NULL REFERENCES career_roles(id) ON DELETE CASCADE,
      completed_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id, skill_id)
    );

    CREATE TABLE IF NOT EXISTS career_goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      role_id INTEGER NOT NULL REFERENCES career_roles(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      target_date TEXT DEFAULT '',
      notes TEXT DEFAULT '',
      is_primary INTEGER DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS resumes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      template TEXT NOT NULL DEFAULT 'modern',
      accent_color TEXT NOT NULL DEFAULT '#4f46e5',
      font_family TEXT NOT NULL DEFAULT 'Inter',
      font_size TEXT NOT NULL DEFAULT 'normal',
      content TEXT NOT NULL,
      ats_score INTEGER DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS mock_interviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      role TEXT NOT NULL,
      role_title TEXT NOT NULL,
      interview_type TEXT NOT NULL,
      experience_level TEXT NOT NULL,
      job_description TEXT DEFAULT '',
      overall_score INTEGER DEFAULT 0,
      technical_score INTEGER DEFAULT 0,
      communication_score INTEGER DEFAULT 0,
      problem_solving_score INTEGER DEFAULT 0,
      confidence_score INTEGER DEFAULT 0,
      questions_json TEXT NOT NULL,
      summary_feedback TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Migration for applications table to support resume_id
  try {
    db.exec(`ALTER TABLE applications ADD COLUMN resume_id INTEGER REFERENCES resumes(id) ON DELETE SET NULL;`);
  } catch (e) {
    // Column already exists or error ignored
  }
}

initSchema();

module.exports = db;
