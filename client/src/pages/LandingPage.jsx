import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  MapPin,
  Briefcase,
  TrendingUp,
  Award,
  Users,
  Building2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Database,
  Palette,
  Terminal,
  ShieldCheck,
  Compass,
  FileText,
  Star,
  Quote,
  Zap,
  Check
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import JobCard from '../components/jobs/JobCard';
import api from '../api/axios';
import { fetchJobsList } from '../utils/jobService';

const CATEGORIES = [
  { name: 'Engineering', count: '35+ Jobs', icon: Terminal, accent: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60' },
  { name: 'Data & AI', count: '18+ Jobs', icon: Database, accent: 'text-violet-600 bg-violet-50 dark:bg-violet-950/60' },
  { name: 'Product', count: '12+ Jobs', icon: TrendingUp, accent: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60' },
  { name: 'Design', count: '10+ Jobs', icon: Palette, accent: 'text-rose-600 bg-rose-50 dark:bg-rose-950/60' },
  { name: 'DevOps & Cloud', count: '15+ Jobs', icon: Cpu, accent: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60' },
  { name: 'Security & QA', count: '8+ Jobs', icon: ShieldCheck, accent: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/60' },
];

const TESTIMONIALS = [
  {
    name: 'Ananya Deshmukh',
    role: 'Senior Frontend Engineer @ Razorpay',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    content: 'The ATS Score Scanner was an eye-opener. I adjusted my action verbs and quantifiable metrics, and my recruiter callback rate jumped from under 15% to over 65%. Signed my dream offer in 3 weeks!',
    rating: 5,
    tag: '42% Salary Hike'
  },
  {
    name: 'Rohan Kulkarni',
    role: 'Staff Platform Architect @ Swiggy',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    content: 'The Career Path roadmap laid out every single gap between Senior and Staff level. Ticking off Kubernetes and distributed caching milestones gave me the exact confidence needed for system design rounds.',
    rating: 5,
    tag: 'Staff Promotion'
  },
  {
    name: 'Priya Sundaram',
    role: 'Lead Product Designer @ Cred',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    content: 'CareerFlow is built with real design care. The drag-and-drop Kanban application tracker paired with instant resume autofill made managing 18 parallel interviews feel effortless and stress-free.',
    rating: 5,
    tag: 'Fast Interview Cycle'
  }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activePreviewTab, setActivePreviewTab] = useState('roadmap'); // 'roadmap', 'resume', 'tracker'

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const data = await fetchJobsList({ limit: 6, sort: 'newest' });
        if (data.jobs && data.jobs.length > 0) {
          setFeaturedJobs(data.jobs);
        }
      } catch (e) {
        console.error('Failed to load featured jobs', e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.append('search', searchTerm.trim());
    if (locationTerm.trim()) params.append('location', locationTerm.trim());
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-brand-500 selection:text-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden border-b border-slate-200/70 dark:border-slate-800/80 bg-canvas-pattern">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Top Status Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold mb-8 shadow-card"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Over 50+ Verified Tech Openings in India & Remote</span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-brand-600 dark:text-brand-400 font-bold">₹28 LPA Avg Package</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.12]"
          >
            The Intelligent Career Platform for{' '}
            <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 dark:from-brand-400 dark:via-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
              Ambitious Tech Talent
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Search verified high-paying engineering roles, bridge your skill gap with interactive visual roadmaps, build ATS-optimized resumes, and manage offers on an intuitive Kanban pipeline.
          </motion.p>

          {/* DYNAMIC SEARCH BAR */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 max-w-3xl mx-auto"
          >
            <form
              onSubmit={handleSearch}
              className="p-2 sm:p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-elevated flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
            >
              <div className="flex-1 flex items-center px-3 gap-2.5 min-w-0">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Role, tech stack, or company (e.g. React, Razorpay)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-transparent border-none text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div className="hidden sm:block w-px h-8 bg-slate-200 dark:bg-slate-800 shrink-0" />

              <div className="flex-1 flex items-center px-3 gap-2.5 min-w-0">
                <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="City or Remote (e.g. Bengaluru, Remote)..."
                  value={locationTerm}
                  onChange={(e) => setLocationTerm(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-transparent border-none text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="font-semibold text-xs sm:text-sm shadow-sm shrink-0"
              >
                Search Openings
              </Button>
            </form>

            {/* POPULAR SEARCH TAGS */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-500">
              <span className="font-semibold text-slate-600 dark:text-slate-400">Popular:</span>
              {['React', 'Node.js', 'Remote', 'Bengaluru', 'Senior Engineer', 'DevOps', '30+ LPA'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => navigate(`/jobs?search=${encodeURIComponent(tag)}`)}
                  className="px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-brand-500 hover:text-brand-600 transition"
                >
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Quick CTAs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Link to="/career-path">
              <Button variant="outline" size="sm" className="font-semibold text-xs">
                <Compass className="w-3.5 h-3.5 mr-1.5 text-brand-600 dark:text-brand-400" />
                Explore Career Roadmaps
              </Button>
            </Link>
            <Link to="/resume-builder">
              <Button variant="outline" size="sm" className="font-semibold text-xs">
                <FileText className="w-3.5 h-3.5 mr-1.5 text-indigo-600 dark:text-indigo-400" />
                Build ATS-Friendly Resume
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* TOP TECH HIRING COMPANIES ROW */}
      <section id="top-companies" className="py-10 border-b border-slate-200/70 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/40 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-5">
            Verified Opportunities from India&apos;s Leading Engineering Teams • Click Any Company to View Openings
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
            {['Razorpay', 'Swiggy', 'Cred', 'Zerodha', 'Flipkart', 'PhonePe', 'Zomato', 'Stripe'].map((brand) => (
              <button
                key={brand}
                type="button"
                onClick={() => navigate(`/jobs?search=${encodeURIComponent(brand)}`)}
                className="px-4 py-2 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm sm:text-base font-bold text-slate-700 dark:text-slate-300 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 hover:shadow-sm transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE PLATFORM PREVIEW SECTION */}
      <section id="preview" className="py-20 border-b border-slate-200/70 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Complete Career Operating System
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">
              Engineered for Every Stage of Your Career
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              Everything you need to level up, build publication-grade applications, and negotiate top offers.
            </p>
          </div>

          {/* Tab Controls */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <button
              onClick={() => setActivePreviewTab('roadmap')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                activePreviewTab === 'roadmap'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Compass className="w-4 h-4 inline mr-1.5" />
              Career Path & Gap Analysis
            </button>
            <button
              onClick={() => setActivePreviewTab('resume')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                activePreviewTab === 'resume'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-1.5" />
              ATS Resume Builder
            </button>
            <button
              onClick={() => setActivePreviewTab('tracker')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                activePreviewTab === 'tracker'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-4 h-4 inline mr-1.5" />
              Kanban Application Tracker
            </button>
          </div>

          {/* Tab 1: Roadmap Preview */}
          {activePreviewTab === 'roadmap' && (
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-card grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                  Visual Roadmaps & Skill Audits
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Navigate from Junior to Lead with Precision
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Choose from 8 curated tech disciplines. Compare your active profile skills against target requirements, identify knowledge gaps, and check off milestones as you build production projects.
                </p>
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>4 progression stages: Beginner, Intermediate, Advanced, Job-ready</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Real-world portfolio projects & verified learning resources</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Recharts LPA compensation benchmarks by experience tier</span>
                  </div>
                </div>
                <Link to="/career-path">
                  <Button variant="primary" size="sm" className="mt-2 font-semibold">
                    <span>Explore 8 Career Roadmaps</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>

              {/* Graphic Card */}
              <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Full-Stack Developer Roadmap
                  </span>
                  <span className="text-xs font-bold text-brand-600">65% Job-Ready</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-600 h-full rounded-full w-[65%]" />
                </div>
                <div className="space-y-2 pt-2">
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">React & Modern State (Zustand)</span>
                    <span className="text-emerald-600 font-bold">✓ Mastered</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">PostgreSQL Schema Migrations</span>
                    <span className="text-emerald-600 font-bold">✓ Mastered</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Docker & Kubernetes Deployments</span>
                    <span className="text-amber-600 font-bold">In Progress</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Resume Builder Preview */}
          {activePreviewTab === 'resume' && (
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-card grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  ATS Scanner & Editor
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Pass Recruiter Screeners with ATS Scored Resumes
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Build publication-grade resumes in 4 templates. Score your document out of 100 with automated feedback on action verbs, quantifiable metrics, and job description keyword matching.
                </p>
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>1-click Profile Autofill imports your experience instantly</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Instant clean A4 PDF export with selectable vector text</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Job Description Keyword Matcher identifies missing skills</span>
                  </div>
                </div>
                <Link to="/resume-builder">
                  <Button variant="primary" size="sm" className="mt-2 font-semibold">
                    <span>Create ATS Resume</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>

              {/* Graphic Card */}
              <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 rounded-full border-4 border-emerald-500 flex items-center justify-center bg-white dark:bg-slate-900 shadow-sm">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">92</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Excellent ATS Readiness</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Meets recruiter screening requirements across all 6 parser checks</p>
                </div>
                <div className="grid grid-cols-3 gap-2 w-full pt-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 block">Metrics</span>
                    <span className="font-bold text-emerald-600">15/15</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 block">Keywords</span>
                    <span className="font-bold text-emerald-600">14/15</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 block">Actions</span>
                    <span className="font-bold text-emerald-600">20/20</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Tracker Preview */}
          {activePreviewTab === 'tracker' && (
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-card grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Visual Pipeline
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Drag-and-Drop Kanban Application Tracker
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Eliminate spreadsheet chaos. Manage applications across 5 stages with HTML5 drag and drop, schedule interviews with Google Meet/Zoom links, and celebrate offers with confetti.
                </p>
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>5 Pipeline columns: Applied, Review, Interview, Offer, Rejected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Full chronological audit timeline of status transitions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Interview scheduler with date, time, and meeting link sync</span>
                  </div>
                </div>
                <Link to="/applications">
                  <Button variant="primary" size="sm" className="mt-2 font-semibold">
                    <span>Open Application Tracker</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>

              {/* Graphic Card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span>Live Application Pipeline</span>
                  <span className="text-emerald-600">1 Offer Extended 🎉</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-indigo-600 block">Applied (4)</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200 truncate">Swiggy</p>
                    <span className="text-[10px] text-slate-400">₹35 LPA</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-amber-600 block">Interview (2)</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200 truncate">Cred</p>
                    <span className="text-[10px] text-slate-400">Round 2 Tech</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-600 block">Offer (1)</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200 truncate">Razorpay</p>
                    <span className="text-[10px] text-emerald-600 font-bold">₹42 LPA</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FEATURED JOBS SECTION */}
      <section id="featured-jobs" className="py-20 bg-white dark:bg-slate-900/40 border-b border-slate-200/70 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Curated Opportunities
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight">
                Featured Tech Positions
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Hand-picked roles with verified compensation ranges and direct recruiter pipelines.
              </p>
            </div>
            <Link to="/jobs">
              <Button variant="outline" size="sm" icon={ArrowRight}>
                View All 50+ Jobs
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </section>

      {/* TOP CATEGORIES */}
      <section className="py-20 border-b border-slate-200/70 dark:border-slate-800/80 bg-[#fafaf9] dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Browse Categories
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight">
              Explore by Tech Discipline
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.name}
                  onClick={() => navigate(`/jobs?category=${encodeURIComponent(cat.name)}`)}
                  className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 text-center hover:border-slate-300 dark:hover:border-slate-700 shadow-card hover:shadow-soft-hover transition-all cursor-pointer group"
                >
                  <div className={`w-12 h-12 rounded-2xl ${cat.accent} flex items-center justify-center mx-auto mb-3 border border-slate-200/50 dark:border-slate-800 group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    {cat.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{cat.count}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CANDIDATE TESTIMONIALS SECTION */}
      <section id="testimonials" className="py-20 bg-white dark:bg-slate-900/40 border-b border-slate-200/70 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Success Stories
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight">
              Trusted by Top Engineers & Leaders
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Read how candidates accelerate their interviews and land life-changing roles with CareerFlow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-6 shadow-soft flex flex-col justify-between space-y-4 relative group hover:shadow-soft-hover transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1 text-amber-500">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {t.tag}
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                    &ldquo;{t.content}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {t.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION BANNER */}
      <section className="py-20 text-center relative overflow-hidden bg-[#fafaf9] dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-14 border border-slate-800 shadow-elevated relative overflow-hidden bg-grid-subtle">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to take full ownership of your career trajectory?
            </h2>
            <p className="mt-4 text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Create your candidate profile in 2 minutes, get your free ATS resume score, and browse 50+ verified openings.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/signup')}
                className="bg-white text-slate-950 hover:bg-slate-100 font-semibold shadow-md"
              >
                Create Free Account
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/jobs')}
                className="border-slate-700 text-white hover:bg-slate-800 font-semibold"
              >
                Browse Open Roles
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
