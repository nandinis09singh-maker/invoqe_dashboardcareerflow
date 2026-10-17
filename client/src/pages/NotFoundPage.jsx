import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-6 shadow-inner">
        <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: '20s' }} />
      </div>

      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
        404 — Page Not Found
      </h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-md">
        The career destination you are searching for does not exist or has been relocated.
      </p>

      <div className="mt-8 flex items-center gap-3">
        <Link to="/">
          <Button variant="primary" icon={ArrowLeft}>
            Return Home
          </Button>
        </Link>
        <Link to="/jobs">
          <Button variant="outline">
            Browse Jobs
          </Button>
        </Link>
      </div>
    </div>
  );
}
