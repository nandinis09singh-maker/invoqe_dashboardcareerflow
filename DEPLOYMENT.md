# CareerFlow — Deployment Guide

This guide provides step-by-step instructions to deploy CareerFlow to production using **Vercel** for the React frontend and **Render** for the Express & SQLite backend.

---

## Architecture Overview

- **Frontend**: React 18 + Vite + Tailwind CSS + Framer Motion (Static Single-Page Application hosted on Vercel).
- **Backend**: Node.js + Express + better-sqlite3 + Multer + JWT (Web Service hosted on Render).
- **Database**: SQLite embedded database with auto-migration and idempotent seeding (`seedDatabase` triggers automatically on fresh spin-up).

---

## 1. Backend Deployment (Render)

### Step 1.1: Push Code to GitHub
Ensure your repository is pushed to GitHub or GitLab.

### Step 1.2: Create a New Web Service on Render
1. Log in to [Render](https://render.com).
2. Click **New +** > **Web Service**.
3. Connect your repository containing CareerFlow.
4. Configure the service settings:
   - **Name**: `careerflow-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Region**: Choose the closest region (e.g., Oregon, Frankfurt, Singapore)
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free` (or Starter for persistent disks)

### Step 1.3: Set Environment Variables
In the **Environment** tab on Render, add:
| Key | Value | Description |
|---|---|---|
| `NODE_ENV` | `production` | Enables production mode |
| `PORT` | `5000` | Port for Express (Render automatically maps this) |
| `JWT_SECRET` | *(Generated random 32+ char string)* | Secure secret for signing auth tokens |
| `CLIENT_URL` | `https://your-careerflow-frontend.vercel.app` | URL of your deployed Vercel frontend for CORS |
| `UPLOAD_DIR` | `uploads` | Folder for profile avatars and resumes |

### Step 1.4: SQLite Persistence Note
> [!NOTE]
> On Render's Free tier, the filesystem is ephemeral and may reset upon redeployment or prolonged inactivity. CareerFlow handles this automatically: **on startup, `server/src/index.js` checks if the database contains seed data; if empty or reset, it automatically runs `seedDatabase()`**, restoring all 50+ jobs, 8 career roadmaps, and the demo user (`demo@careerflow.com`).
> For permanent disk storage on Render, attach a persistent disk mounted at `/var/data` and point `server/src/db/database.js` to `/var/data/careerflow.db`.

### Step 1.5: Health Check
Render will probe `GET /api/health` to confirm the service is healthy:
```json
{
  "status": "healthy",
  "service": "CareerFlow API",
  "timestamp": "2026-10-17T15:00:00.000Z"
}
```
Copy your Render service URL (e.g., `https://careerflow-api.onrender.com`).

---

## 2. Frontend Deployment (Vercel)

### Step 2.1: Import Project to Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New...** > **Project**.
3. Import your CareerFlow repository.

### Step 2.2: Configure Project Settings
- **Framework Preset**: `Vite`
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 2.3: Set Environment Variables
In the **Environment Variables** section, add:
| Key | Value | Description |
|---|---|---|
| `VITE_API_URL` | `https://careerflow-api.onrender.com/api` | Base URL pointing to your Render backend |

### Step 2.4: Deploy & Verify SPA Routing
- Click **Deploy**.
- The included `client/vercel.json` contains the rewrite rule:
  ```json
  {
    "rewrites": [
      {
        "source": "/(.*)",
        "destination": "/index.html"
      }
    ]
  }
  ```
  This ensures deep links (e.g. `/jobs`, `/career-path`, `/resume-builder`, `/applications`) resolve correctly on page refresh without 404 errors.

---

## 3. Post-Deployment Verification Checklist

1. [ ] **Health Check**: Open `https://your-backend.onrender.com/api/health` in your browser. Verify `{ "status": "healthy" }`.
2. [ ] **Frontend Loading**: Visit `https://your-frontend.vercel.app`. The landing page should render with all features and statistics.
3. [ ] **Auth Flow**: Click **Demo User Login** (or login with `demo@careerflow.com` / `Demo@1234`). Confirm redirection to `/dashboard`.
4. [ ] **Jobs & Filters**: Go to `/jobs`, apply filters (e.g. Remote, Full-time), verify search works.
5. [ ] **Career Path**: Go to `/career-path`, toggle a skill checkbox, verify progress persists on refresh.
6. [ ] **Resume Builder**: Go to `/resume-builder`, click an existing resume, edit summary, check live preview, download PDF.
7. [ ] **Kanban Board**: Go to `/applications`, drag a card between columns, verify the status update is saved.
8. [ ] **Deep Link Refresh**: Refresh while on `/jobs/3` or `/profile` — page should load without errors.
