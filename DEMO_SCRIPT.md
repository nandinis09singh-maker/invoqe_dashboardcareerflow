# CareerFlow — 2 to 3 Minute Video Demo / Presentation Script

This script provides an exact chronological walkthrough to showcase all major features of CareerFlow in 2–3 minutes for an evaluation, live presentation, or screen recording.

---

## 🎬 Pre-Demo Setup (10 Seconds)
1. Ensure both client and server are running: `npm run dev`.
2. Open browser at `http://localhost:5173`.
3. If already logged in, log out to start fresh at the landing page.

---

## ⏱ Act 1: The Landing Page (0:00 – 0:30)
**Goal: Showcase brand identity, modern SaaS polish, and guest capabilities.**

- **0:00 – 0:10 | Hero & Search Bar**
  - Point out the headline: *"Accelerate Your Career with Intelligent Matchmaking & Guidance."*
  - Type `"React"` or `"Full-Stack"` in the hero search input, click **Find Jobs**.
  - Show seamless transition directly to `/jobs` with filtered results.
- **0:10 – 0:20 | Platform Preview Tabs**
  - Return to the landing page (`/`).
  - Scroll down to the **"A Unified Suite for Career Progression"** section.
  - Click through the 3 interactive feature tabs:
    1. **Career Roadmaps**: Visual stage progression & skill checks.
    2. **ATS Resume Builder**: Live split-pane editor with ATS audit score.
    3. **Application Kanban**: Real-time drag-and-drop tracker.
- **0:20 – 0:30 | Social Proof & Stats**
  - Briefly scroll past the hiring partners banner (Google, Microsoft, Amazon, Stripe) and candidate testimonials.
  - Click **"Sign In"** in the top navigation.

---

## ⏱ Act 2: Authentication & The Dashboard (0:30 – 0:50)
**Goal: Demonstrate seamless authentication, onboarding checklist, and analytics.**

- **0:30 – 0:38 | Quick Login**
  - Click the **"Fill Demo Account"** button on `/login`.
  - Click **"Sign In"**. You are smoothly redirected to `/dashboard`.
- **0:38 – 0:50 | Dashboard & Onboarding Progress**
  - Point out the top **Getting Started Checklist**: show interactive completion badges (Profile, Career Goal, Resume, Job Application).
  - Highlight the 4 metric cards (Saved Jobs, Applications, Interview Rate, Active Goal).
  - Note the dynamic application activity chart (Recharts) and Recommended Jobs based on user skill match percentage.

---

## ⏱ Act 3: Career Path & Skill Gap Analysis (0:50 – 1:25)
**Goal: Showcase guided progression, LPA salary insights, and interactive roadmaps.**

- **0:50 – 1:00 | Select a Role & Explore Roadmap**
  - Click **"Career Path"** in the navigation bar (`/career-path`).
  - Switch between roles (e.g. *"Full-Stack Developer"* or *"DevOps Engineer"*).
  - Point out the 4 progressive stages: **Beginner**, **Intermediate**, **Advanced**, **Job-ready**.
- **1:00 – 1:12 | Real-time Checkboxes & Milestones**
  - Toggle a skill checkbox in Stage 2 or Stage 3.
  - Notice the instant progress update in the stage progress bar and the circular role percentage ring.
  - (If completing all skills in a stage, celebrate with milestone confetti).
- **1:12 – 1:25 | Skill Gap Analyzer & LPA Salary Insights**
  - Scroll down to the **Skill Gap Analysis**: show "You Have" vs. "You Need to Learn" tags.
  - Highlight the **Salary Insights Chart** displaying compensation growth from Entry-Level to Principal in LPA.
  - Click the **"View Matching Jobs"** link to transition to the job board.

---

## ⏱ Act 4: Resume Builder with Live ATS Audit (1:25 – 2:05)
**Goal: Demonstrate live split-pane editing, template swapping, ATS scoring, and PDF generation.**

- **1:25 – 1:35 | Resume Dashboard**
  - Click **"Resume Builder"** in navigation (`/resume-builder`).
  - Show the saved resume cards with last edited timestamps and template tags.
  - Click **"Edit"** on `"Senior Full Stack Developer"`.
- **1:35 – 1:50 | Live Split-Pane Editor & Templates**
  - Make a quick text change in the **Summary** or add a skill chip (e.g., `"Docker"`).
  - Point to the live preview on the right instantly reflecting the change.
  - Note the subtle **"Saving... / Saved"** auto-save indicator (1.5s debounced).
  - Switch templates between **Modern**, **Classic**, and **Minimal** with one click.
- **1:50 – 2:05 | ATS Score Checker & PDF Export**
  - Click the **"ATS Audit"** or score pill (e.g., 88/100).
  - Expand the breakdown: Contact Details, Action Verbs, Section Completeness, and JD Keyword Matcher.
  - Click **"Download PDF"** to demonstrate clean, A4 formatted PDF generation with selectable text.

---

## ⏱ Act 5: Job Search & Application Tracker Kanban (2:05 – 2:45)
**Goal: Demonstrate filter combinations, modal application with resume attachment, and drag-and-drop Kanban.**

- **2:05 – 2:20 | Job Search & Filter Combinations**
  - Click **"Jobs"** (`/jobs`).
  - Search by keyword (`"React"`), toggle the **"Remote"** pill, and sort by **"Salary: High to Low"**.
  - Click on a job to open its details page or click **"Apply Now"**.
- **2:20 – 2:32 | Applying with Built Resume**
  - In the Apply modal, note the user's profile information is prefilled.
  - In the **"Select Resume"** dropdown, select the resume built earlier in the Resume Builder.
  - Submit the application: a success toast appears and the button turns to a green **"Applied"** badge.
- **2:32 – 2:45 | Kanban Tracker Drag & Drop**
  - Navigate to **"Applications"** (`/applications`).
  - View the board columns: *Applied*, *Under Review*, *Interview*, *Offer*, *Rejected*.
  - Grab the application card just submitted and drag it from **Applied** to **Interview**.
  - Show the timeline history update and add an interview date note.
  - Toggle between **Kanban Board** and **Table View**.

---

## ⏱ Wrap-Up (2:45 – 3:00)
- Toggle **Dark Mode / Light Mode** using the theme switcher icon in the top navbar to show 100% theme consistency across all pages, modals, and charts.
- Conclude: *"CareerFlow is a complete, production-ready career platform with zero mock data, resilient database persistence, and end-to-end user workflows."*
