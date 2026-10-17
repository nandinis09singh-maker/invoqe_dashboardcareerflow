# CareerFlow — Modern Job Search & Career Platform

[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20Express%20%7C%20SQLite-indigo.svg)](#tech-stack)
[![Stage](https://img.shields.io/badge/Stage-3%20of%203%20Complete%20(Production%20Ready)-emerald.svg)](#complete-feature-summary)
[![Tests](https://img.shields.io/badge/Tests-Jest%20%26%20Supertest%20Passing-success.svg)](#backend-automated-tests)
[![Design](https://img.shields.io/badge/Design-Tailwind%20%2B%20Framer%20Motion-violet.svg)](#uiux-design)

**CareerFlow** is a complete, production-quality, full-stack Job Search, Career Path, and Resume Intelligence platform designed with a modern SaaS aesthetic (inspired by Linear and Stripe). It empowers tech talent with interactive role roadmaps, live ATS resume building, end-to-end job application tracking, and automated career goal progression.

---

## 🌟 Complete Feature Summary

### 🧭 1. Career Path & Roadmaps (`/career-path`)
- **8 Target Roles**: Frontend Developer, Backend Developer, Full-Stack Developer, Data Analyst, Data Scientist, UI/UX Designer, DevOps Engineer, Product Manager.
- **4-Stage Interactive Roadmaps**: Beginner, Intermediate, Advanced, and Job-ready. Each stage contains vetted core skills, verified free learning resources (real documentation & course links), real-world portfolio project specifications, and estimated time to completion.
- **Persistent Skill Checklists**: Checking off skills updates the user's progress per stage and overall completion percentage in SQLite (`career_progress` table).
- **Skill Gap Analysis**: Compares candidate profile skills against role requirements to display "You Have" vs "You Need to Learn", an overall match percentage, and a 1-click button to jump directly to any missing skill in the roadmap.
- **Interactive Salary Insights**: Recharts bar chart depicting Indian tech industry salary benchmarks (Entry, Mid, Senior, Lead / Staff) in LPA for each selected role.
- **Matching Live Jobs**: Real openings from the database dynamically filtered and matched to the selected career path, with 1-click links to `/jobs`.
- **Career Goals Management**: Create milestone goals with target dates, notes, and a toggle to set one as the **Primary Goal** (which displays dynamically on the dashboard).
- **Stage Milestone Celebrations**: Triggers celebratory confetti (`canvas-confetti`) and milestone toasts whenever a user completes 100% of the skills in any stage.

---

### 📄 2. Resume Builder & Live ATS Audit (`/resume-builder` & `/resume-builder/:id`)
- **Document Management List**: Saved resumes displayed as cards with miniature A4 visual thumbnails, title, template badge, ATS score tag, last modified timestamp, and action menu (Edit, Rename, Duplicate, Download PDF, Delete with confirmation).
- **Split-Screen Live Editor**: Responsive split-screen workspace with section tabs on the desktop left and a pixel-perfect, sticky A4 paper `ResumePreview` on the right (with a seamless Edit/Preview tab switcher on mobile).
- **Complete Resume Sections**:
  - Personal Information (Full Name, Headline, Email, Phone, Location, Portfolio, LinkedIn, GitHub)
  - Executive Summary (with 1-click AI suggestions helper)
  - Work Experience (Chronological positions, metric bullets, up/down reordering, delete)
  - Education (Degrees, institutions, graduation years, grades)
  - Projects (Titles, tech stack, live and GitHub links, impact bullets)
  - Technical Skills (Categorized skill chips by domain with instant add/remove)
  - Certifications, Achievements, and Languages
  - Section Order & Visibility toggles (hide/show any section on demand)
- **4 Publication-Grade Templates**:
  - **Modern Clean**: 2-column layout with sidebar metrics and crisp dividers
  - **Classic Executive**: Elegant serif font with traditional linear reading flow
  - **Minimal Tech**: Notion- and Linear-inspired monochromatic layout
  - **Creative Portfolio**: Vibrant accent header banner with high visual contrast
- **Styling Customizer**: Real-time palette accent colors (Indigo, Sky, Teal, Emerald, Amber, Violet, Rose, Slate), typography switcher (Inter, Roboto, Poppins, Merriweather), and font density scaling (compact, normal, relaxed).
- **One-Click Profile Autofill**: Instantly imports headline, bio summary, experience history, education, location, phone, and skills from the user profile.
- **Debounced Auto-Save**: Automatically persists all edits after 1.5s of inactivity with a live "Saving changes..." / "Saved at hh:mm:ss" indicator.
- **Clean A4 PDF Export & Print**: Client-side vector PDF generation via `html2pdf.js` with selectable text and dedicated `@media print` print styling.
- **ATS Score Checker**: Evaluates resume across 6 rigorous recruiter criteria out of 100 (Contact Info, Section Completeness, Word Density, Action Verbs, Quantifiable Metrics, Technical Keywords) with actionable improvement suggestions.
- **Job Description Matcher**: Paste any target job posting to get an instant match score, a list of matched keywords, and missing keywords with a 1-click "Add to Resume" action.
- **Suggestion Helper**: Built-in repository of action-driven summary statements and metric bullets (Action + Metric + Result formula) across all 8 roles.
- **Job Application Integration**: Created resumes appear as a 1-click selectable document inside `ApplyModal`.

---

### 💼 3. Job Search, Saved Jobs & Application Tracker
- **Executive Dashboard (`/dashboard`)**:
  - **First-Time User Onboarding Checklist**: Complete Profile, Save a Job, Apply to a Job, Pick a Career Goal, Build a Resume with live progress tracking.
  - Stat cards (Total Jobs, Saved, Applications, Interviews, Offers), Primary Career Goal progress card, Latest Resume ATS Score badge, weekly application volume chart, and live profile completion ring.
- **Job Search & Filters (`/jobs`)**: 400ms debounced search, multi-faceted filtering (location, type, experience, LPA salary slider, skill chips), sorting, and backend pagination.
- **Job Details (`/jobs/:id`)**: Comprehensive role specs, company background, similar openings, and unified apply modal.
- **Saved Jobs & Collections (`/saved`)**: Grid/list view, custom collections/folders (e.g. "Dream Companies", "Apply Later"), private notes, bulk removal, and undo toast.
- **Application Tracker (`/applications`)**: Drag-and-drop Kanban board (Applied, Under Review, Interview, Offer, Rejected), status timeline audit logs, interview scheduler, and confetti celebrations.
- **Profile & Settings (`/profile`)**: Avatar upload, PDF resume upload, skills manager, work experience, education credentials, password/email updates, and account deletion.

---

### 🛡️ 4. Resilience & Enterprise Quality (Stage 3 Additions)
- **Top-Level Error Boundary (`ErrorBoundary.jsx`)**: Catches unexpected render crashes and provides clean user-facing recovery with 1-click reload and navigation back to safety.
- **Route Lazy-Loading (`React.lazy` + `Suspense`)**: Fast initial bundle load with sleek branded skeleton page loaders.
- **Production Hardened**: `helmet` security headers, CORS origin enforcement, express rate-limiting on authentication routes, bcrypt password hashing, and secure httpOnly JWT cookies.
- **Zero Mock Data**: 50+ rich real-world seeded tech jobs across India and remote, 8 complete career roadmaps, and auto-seeding idempotency on startup.

---

## 💻 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18 (Vite), React Router v6, Tailwind CSS, Framer Motion, Lucide Icons, Recharts, `html2pdf.js`, `canvas-confetti`, React Hot Toast |
| **Backend** | Node.js, Express.js REST API |
| **Database** | SQLite via `better-sqlite3` (WAL mode, foreign keys, auto-migrated schema, auto-seeded) |
| **Testing** | Jest, Supertest |
| **Authentication** | JWT (`httpOnly` cookies), `bcryptjs`, `express-rate-limit`, `helmet`, `cors` |
| **File Uploads** | `multer` (max 2MB, validated MIME types for avatars and PDF resumes) |

---

## 📁 Project Structure

```
├── client/                     # Vite + React Frontend
│   ├── public/                 # Static assets & favicon
│   ├── src/
│   │   ├── api/                # Axios instance with interceptors & VITE_API_URL
│   │   ├── components/
│   │   │   ├── applications/   # KanbanBoard, ApplicationCard, TimelineModal
│   │   │   ├── career/         # RoadmapStage, SkillGapCard, SalaryChart, CareerGoalModal
│   │   │   ├── dashboard/      # OnboardingChecklist, StatCard, ActivityChart
│   │   │   ├── jobs/           # JobCard, JobFilters, ApplyModal
│   │   │   ├── layout/         # Navbar, Sidebar, Topbar, AppLayout, Footer
│   │   │   ├── profile/        # AvatarUploader, ResumeUploader, SkillsManager
│   │   │   ├── resume/         # TemplateModern, TemplateClassic, TemplateMinimal, TemplateCreative,
│   │   │   │                   # ResumePreview, ResumeCard, AtsScoreModal, JdMatchModal
│   │   │   ├── saved/          # SavedJobCard, CollectionModal, BulkActionToolbar
│   │   │   └── ui/             # Button, Input, Modal, Drawer, Badge, Skeleton, ErrorBoundary
│   │   ├── context/            # AuthContext, ThemeContext
│   │   ├── pages/              # Lazy-loaded Dashboard, CareerPath, ResumeBuilder, ResumeEditor, Jobs, etc.
│   │   └── utils/              # formatters.js, constants.js
│   ├── vercel.json             # Vercel SPA routing rewrite rules
│   └── vite.config.js
├── server/                     # Node.js + Express Backend
│   ├── data/                   # SQLite database file (careerflow.db)
│   ├── src/
│   │   ├── db/                 # database.js, seed.js, seedStage2.js
│   │   ├── middleware/         # auth.js, upload.js, errorHandler.js
│   │   ├── routes/             # auth, jobs, saved, collections, applications, profile, analytics, career, resumes
│   │   └── index.js            # Express app entry & health check
│   └── tests/                  # Jest & Supertest automated test suites (auth, jobs, applications)
├── DEPLOYMENT.md               # Step-by-step Vercel & Render production deployment guide
├── DEMO_SCRIPT.md              # 2-3 minute structured presentation & video walkthrough script
└── package.json                # Root concurrently script ("npm run dev", "npm test")
```

---

## 🚀 Quick Start (One Command)

### Prerequisites
- Node.js v18+ (tested on Node v20)
- npm v9+

### 1. Installation
Install all root, client, and server dependencies:
```bash
npm install
npm run install:all
```

### 2. Run Application
Start client (Vite on port 5173) and backend API (Express on port 5000) concurrently:
```bash
npm run dev
```

The database auto-seeds on first boot. Open your browser:
```
http://localhost:5173
```

### 3. Demo Credentials
Click **"Fill Demo Account"** on the login screen, or enter:
- **Email**: `demo@careerflow.com`
- **Password**: `Demo@1234`

### 4. Run Automated Tests
Execute backend automated test suites (Jest + Supertest):
```bash
npm test
```

---

## 🧪 Backend Automated Tests

The backend includes comprehensive test coverage for core business logic:
- **`tests/auth.test.js`**: Signup validation, unique email enforcement, password hashing, valid/invalid login, `GET /api/auth/me` cookie verification, logout cookie clearance.
- **`tests/jobs.test.js`**: Paginated jobs listing, keyword search filtering, job type filtering, salary sorting, single job lookup, 404 validation, meta filter options.
- **`tests/applications.test.js`**: 401 unauthorized protection, fetching user applications, applying to jobs, duplicate application rejection, status transitions (Applied -> Interview -> Offer) with audit log creation.

Run directly via:
```bash
cd server
npm test
```

---

## 🌐 Production Deployment

Refer to [`DEPLOYMENT.md`](file:///c:/Users/rajveer%20singh/Documents/Arduino/libraries/DEPLOYMENT.md) for full instructions:
- **Frontend (Vercel)**: Configured with `client/vercel.json` for seamless SPA deep link routing.
- **Backend (Render)**: Configured with health check (`/api/health`), dynamic CORS, and auto-seed recovery on restart.

---

## 🎬 Video Demo & Presentation

Refer to [`DEMO_SCRIPT.md`](file:///c:/Users/rajveer%20singh/Documents/Arduino/libraries/DEMO_SCRIPT.md) for a structured 2-3 minute presentation walkthrough.

---

## 📄 License
This project is open-source under the MIT License.
