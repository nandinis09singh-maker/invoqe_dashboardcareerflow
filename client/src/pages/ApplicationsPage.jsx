import React, { useState, useEffect, useCallback } from 'react';
import {
  Kanban,
  Table as TableIcon,
  Search,
  Filter,
  PieChart,
  BarChart3,
  Calendar,
  Sparkles,
  TrendingUp,
  Award
} from 'lucide-react';
import KanbanBoard from '../components/applications/KanbanBoard';
import ApplicationTableView from '../components/applications/ApplicationTableView';
import TimelineModal from '../components/applications/TimelineModal';
import ScheduleInterviewModal from '../components/applications/ScheduleInterviewModal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'table'
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [timelineApp, setTimelineApp] = useState(null);
  const [interviewApp, setInterviewApp] = useState(null);
  const [withdrawApp, setWithdrawApp] = useState(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Fetch Applications
  const fetchApplications = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const res = await api.get('/applications', { params });
      if (res.data.success) {
        setApplications(res.data.applications);
      }
    } catch (err) {
      toast.error('Failed to load applications.');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, searchTerm]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Handle status update (from Kanban drop or Table selector)
  const handleStatusChange = async (appId, newStatus) => {
    // Optimistic UI update
    setApplications(prev =>
      prev.map(app => (app.id === appId ? { ...app, status: newStatus } : app))
    );

    try {
      await api.patch(`/applications/${appId}`, {
        status: newStatus,
        timeline_note: `Moved application to ${newStatus}`
      });
      toast.success(`Application updated to ${newStatus}`);
      fetchApplications();
    } catch (err) {
      toast.error('Failed to update status.');
      fetchApplications();
    }
  };

  // Handle Withdraw
  const handleConfirmWithdraw = async () => {
    if (!withdrawApp) return;
    try {
      setIsWithdrawing(true);
      await api.delete(`/applications/${withdrawApp.id}`);
      toast.success('Application withdrawn.');
      setApplications(prev => prev.filter(a => a.id !== withdrawApp.id));
      setWithdrawApp(null);
    } catch (err) {
      toast.error('Failed to withdraw application.');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const statusCounts = {
    total: applications.length,
    interview: applications.filter(a => a.status === 'Interview').length,
    offer: applications.filter(a => a.status === 'Offer').length
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Kanban className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            Application Tracker
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your hiring pipeline with interactive Kanban board and scheduled interviews
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-0.5 shadow-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'kanban'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              Kanban
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'table'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by company or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-transparent focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-500 text-slate-900 dark:text-slate-100 placeholder-slate-400"
          />
        </div>

        {/* Status filter dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 whitespace-nowrap">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="All">All Statuses ({applications.length})</option>
            <option value="Applied">Applied</option>
            <option value="Under Review">Under Review</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications View */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={Kanban}
          title="No applications tracked yet"
          description="Apply to positions across 50+ tech companies to track your recruitment stages with visual drag and drop."
          actionLabel="Explore Jobs & Apply"
          onAction={() => window.location.href = '/jobs'}
        />
      ) : viewMode === 'kanban' ? (
        <KanbanBoard
          applications={applications}
          onStatusChange={handleStatusChange}
          onOpenTimeline={(app) => setTimelineApp(app)}
          onOpenInterviewModal={(app) => setInterviewApp(app)}
          onWithdraw={(app) => setWithdrawApp(app)}
        />
      ) : (
        <ApplicationTableView
          applications={applications}
          onStatusChange={handleStatusChange}
          onOpenTimeline={(app) => setTimelineApp(app)}
          onOpenInterviewModal={(app) => setInterviewApp(app)}
          onWithdraw={(app) => setWithdrawApp(app)}
        />
      )}

      {/* Timeline Modal */}
      <TimelineModal
        isOpen={Boolean(timelineApp)}
        onClose={() => setTimelineApp(null)}
        application={timelineApp}
        onApplicationUpdated={(updated) => {
          setApplications(prev => prev.map(a => a.id === updated.id ? { ...a, ...updated } : a));
        }}
      />

      {/* Interview Scheduling Modal */}
      <ScheduleInterviewModal
        isOpen={Boolean(interviewApp)}
        onClose={() => setInterviewApp(null)}
        application={interviewApp}
        onScheduled={(updated) => {
          setApplications(prev => prev.map(a => a.id === updated.id ? { ...a, ...updated } : a));
        }}
      />

      {/* Withdraw Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(withdrawApp)}
        onClose={() => setWithdrawApp(null)}
        onConfirm={handleConfirmWithdraw}
        title="Withdraw Application"
        message={`Are you sure you want to withdraw your application for ${withdrawApp?.job?.title} at ${withdrawApp?.job?.company}? All interview records and notes for this position will be deleted.`}
        confirmText="Withdraw"
        isDanger={true}
        isLoading={isWithdrawing}
      />
    </div>
  );
}
