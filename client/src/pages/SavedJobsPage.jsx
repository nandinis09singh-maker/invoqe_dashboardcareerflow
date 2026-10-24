import React, { useState, useEffect, useCallback } from 'react';
import {
  Bookmark,
  Folder,
  Plus,
  LayoutGrid,
  List,
  ArrowUpDown,
  Trash2,
  Undo2,
  FolderPlus
} from 'lucide-react';
import SavedJobCard from '../components/saved/SavedJobCard';
import CollectionModal from '../components/saved/CollectionModal';
import BulkActionToolbar from '../components/saved/BulkActionToolbar';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import api from '../api/axios';
import {
  fetchSavedJobsList,
  fetchCollectionsList,
  removeSavedJob,
  createCollectionDoc,
  toggleJobSave
} from '../utils/savedJobService';
import toast from 'react-hot-toast';

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [collections, setCollections] = useState([]);
  const [activeCollection, setActiveCollection] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedIds, setSelectedIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Collection modal
  const [isColModalOpen, setIsColModalOpen] = useState(false);

  // Fetch Collections
  const fetchCollections = async () => {
    try {
      const res = await api.get('/collections');
      if (res.data.success) {
        setCollections(res.data.collections);
      }
    } catch (e) {
      console.error('Failed to load collections', e);
    }
  };

  // Fetch Saved Jobs
  const fetchSavedJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = { sort: sortBy };
      if (activeCollection !== 'all') {
        params.collection_id = activeCollection;
      }
      const res = await api.get('/saved', { params });
      if (res.data.success) {
        setSavedJobs(res.data.saved_jobs);
      }
    } catch (err) {
      toast.error('Failed to load saved jobs.');
    } finally {
      setIsLoading(false);
    }
  }, [activeCollection, sortBy]);

  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    fetchSavedJobs();
  }, [fetchSavedJobs]);

  // Remove saved job with undo toast
  const handleRemove = async (savedItem) => {
    try {
      await api.delete(`/saved/${savedItem.id}`);
      setSavedJobs(prev => prev.filter(s => s.id !== savedItem.id));
      setSelectedIds(prev => prev.filter(id => id !== savedItem.id));

      // Toast with undo option
      toast((t) => (
        <div className="flex items-center gap-3">
          <span className="text-xs">Removed <strong>{savedItem.job?.title}</strong></span>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              await api.post(`/jobs/${savedItem.job_id}/save`);
              fetchSavedJobs();
              toast.success('Restored job to bookmarks!');
            }}
            className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
          >
            <Undo2 className="w-3 h-3" /> Undo
          </button>
        </div>
      ), { duration: 5000 });
    } catch (e) {
      toast.error('Failed to remove saved job.');
    }
  };

  // Bulk actions
  const handleSelectToggle = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === savedJobs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(savedJobs.map(s => s.id));
    }
  };

  const handleBulkDelete = async () => {
    try {
      await api.post('/saved/bulk-delete', { ids: selectedIds });
      toast.success(`Removed ${selectedIds.length} saved jobs.`);
      setSelectedIds([]);
      fetchSavedJobs();
    } catch (e) {
      toast.error('Bulk removal failed.');
    }
  };

  const handleBulkMove = async (colId) => {
    try {
      await api.post('/saved/bulk-move', { ids: selectedIds, collection_id: colId });
      toast.success('Updated collection for selected jobs.');
      setSelectedIds([]);
      fetchSavedJobs();
      fetchCollections();
    } catch (e) {
      toast.error('Failed to move jobs.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            Saved Bookmarks
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Organize bookmarked roles into collections and manage personal notes
          </p>
        </div>

        {/* View Mode & Sort Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* New Collection Button */}
          <Button
            size="sm"
            variant="outline"
            icon={FolderPlus}
            onClick={() => setIsColModalOpen(true)}
          >
            New Folder
          </Button>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="date">Date Saved</option>
            <option value="salary">Highest Salary</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'grid'
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'list'
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Collection Folders Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveCollection('all')}
          className={`text-xs px-3.5 py-1.5 rounded-xl font-semibold transition shrink-0 ${
            activeCollection === 'all'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
          }`}
        >
          All Saved ({savedJobs.length})
        </button>

        {collections.map((col) => (
          <button
            key={col.id}
            onClick={() => setActiveCollection(col.id.toString())}
            className={`text-xs px-3.5 py-1.5 rounded-xl font-semibold transition shrink-0 flex items-center gap-1.5 ${
              activeCollection === col.id.toString()
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
            }`}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: col.color || '#6366f1' }}
            />
            <span>{col.name}</span>
            <span className="text-[10px] opacity-75">({col.job_count || 0})</span>
          </button>
        ))}

        <button
          onClick={() => setActiveCollection('none')}
          className={`text-xs px-3.5 py-1.5 rounded-xl font-semibold transition shrink-0 ${
            activeCollection === 'none'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
          }`}
        >
          Uncategorized
        </button>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
      ) : savedJobs.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved jobs in this folder"
          description="Explore high-paying tech openings and bookmark roles you'd like to apply for later."
          actionLabel="Browse Available Jobs"
          onAction={() => window.location.href = '/jobs'}
        />
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'
              : 'space-y-3'
          }
        >
          {savedJobs.map((item) => (
            <SavedJobCard
              key={item.id}
              savedItem={item}
              viewMode={viewMode}
              isSelected={selectedIds.includes(item.id)}
              onSelectToggle={handleSelectToggle}
              onRemove={handleRemove}
              onUpdateNote={(id, note) => {
                setSavedJobs(prev => prev.map(s => s.id === id ? { ...s, note } : s));
              }}
              onMoveCollection={(id, colId) => {
                fetchSavedJobs();
                fetchCollections();
              }}
              collections={collections}
            />
          ))}
        </div>
      )}

      {/* Bulk Action Toolbar */}
      <BulkActionToolbar
        selectedCount={selectedIds.length}
        onClearSelection={() => setSelectedIds([])}
        onBulkDelete={handleBulkDelete}
        onBulkMove={handleBulkMove}
        collections={collections}
      />

      {/* Collection Modal */}
      <CollectionModal
        isOpen={isColModalOpen}
        onClose={() => setIsColModalOpen(false)}
        onSaved={() => {
          fetchCollections();
          fetchSavedJobs();
        }}
      />
    </div>
  );
}
