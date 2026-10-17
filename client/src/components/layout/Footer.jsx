import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Heart, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-sm">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                Career<span className="text-brand-600">Flow</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              The all-in-one modern job search, career intelligence, and application tracking platform designed for ambitious professionals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link to="/jobs" className="hover:text-brand-600 transition">Browse Tech Jobs</Link></li>
              <li><Link to="/jobs?job_type=Remote" className="hover:text-brand-600 transition">Remote Opportunities</Link></li>
              <li><Link to="/jobs?experience_level=Entry+Level" className="hover:text-brand-600 transition">Entry Level Positions</Link></li>
              <li><Link to="/jobs?experience_level=Senior+Level" className="hover:text-brand-600 transition">Senior Engineering Roles</Link></li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link to="/dashboard" className="hover:text-brand-600 transition">Candidate Dashboard</Link></li>
              <li><Link to="/applications" className="hover:text-brand-600 transition">Kanban Application Tracker</Link></li>
              <li><Link to="/saved" className="hover:text-brand-600 transition">Bookmark Collections</Link></li>
              <li><Link to="/profile" className="hover:text-brand-600 transition">Profile & Preferences</Link></li>
            </ul>
          </div>

          {/* Social & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Connect
            </h4>
            <div className="flex items-center gap-3 mb-4 text-slate-500">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-brand-600 transition" aria-label="GitHub">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-brand-600 transition" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-brand-600 transition" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
            <p className="text-xs text-slate-400">
              Built with precision for top-tier software talent.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CareerFlow Inc. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Designed with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
            <span>for developers worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
