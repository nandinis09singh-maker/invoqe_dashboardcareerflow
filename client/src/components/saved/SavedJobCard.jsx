import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Briefcase,
  DollarSign,
  Folder,
  Trash2,
  Edit3,
  Check,
  X,
  Send,
  CheckCircle2
} from 'lucide-react';
import { formatSalary, timeAgo, getInitials, getAvatarGradient } from '../../utils/formatters';
import Button from '../ui/Button';
import ApplyModal from '../jobs/ApplyModal';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function SavedJobCard({
  savedItem,
  viewMode = 'grid', // 'grid' | 'list'
  isSelected,
  onSelectToggle,
  onRemove,
  onUpdateNote,
  onMoveCollection,
  collections = []
}) {
  const { job } = savedItem;
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteText, setNoteText] = useState(savedItem.note || '');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isApplied, setIsApplied] = useState(savedItem.is_applied);

  const handleSaveNote = async () => {
    try {
      await api.patch(`/saved/${savedItem.id}`, { note: noteText });
      setIsEditingNote(false);
      toast.success('Private note updated.');
      if (onUpdateNote) onUpdateNote(savedItem.id, noteText);
    } catch (e) {
      toast.error('Failed to save note.');
    }
  };

  const handleMoveChange = async (e) => {
    const colId = e.target.value === 'none' ? null : e.target.value;
    try {
      await api.patch(`/saved/${savedItem.id}`, { collection_id: colId });
      toast.success('Moved to collection.');
      if (onMoveCollection) onMoveCollection(savedItem.id, colId);
    } catch (e) {
      toast.error('Failed to move collection.');
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-card hover:shadow-soft-hover transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Checkbox for bulk actions */}
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelectToggle(savedItem.id)}
            className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
          />

          {/* Logo or Gradient Initials */}
          {job.logo_url ? (
            <img
              src={job.logo_url}
              alt={job.company}
              className="w-10 h-10 rounded-xl object-cover border border-slate-100 dark:border-slate-800 shrink-0"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          ) : (
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getAvatarGradient(
                job.company
              )} flex items-center justify-center text-white font-bold text-xs shrink-0`}
            >
              {getInitials(job.company)}
            </div>
          )}

          <div className="min-w-0">
            <Link
              to={`/jobs/${job.id}`}
              className="text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-brand-600 dark:hover:text-brand-400 truncate block"
            >
              {job.title}
            </Link>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold">{job.company}</span>
              <span>•</span>
              <span>{job.location}</span>
              <span>•</span>
              <span className="text-brand-600 dark:text-brand-400 font-semibold">
                {formatSalary(job.salary_min, job.salary_max)}
              </span>
            </div>
          </div>
        </div>

        {/* Collection & Actions */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Collection Selector */}
          <select
            value={savedItem.collection_id || 'none'}
            onChange={handleMoveChange}
            className="text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1.5 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="none">No Folder</option>
            {collections.map((c) => (
              <option key={c.id} value={c.id}>
                📁 {c.name}
              </option>
            ))}
          </select>

          {/* Apply or Applied */}
          {isApplied ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3 h-3" /> Applied
            </span>
          ) : (
            <Button
              size="sm"
              variant="primary"
              onClick={() => setIsApplyModalOpen(true)}
            >
              Apply
            </Button>
          )}

          {/* Remove Button */}
          <button
            onClick={() => onRemove(savedItem)}
            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Remove from saved"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <ApplyModal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          job={job}
          onSuccess={() => setIsApplied(true)}
        />
      </div>
    );
  }

  // GRID VIEW (default)
  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-card hover:shadow-soft-hover transition flex flex-col justify-between relative group">
      <div>
        {/* Top bar with Select checkbox and Collection Badge */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelectToggle(savedItem.id)}
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
            />
            {savedItem.collection_name ? (
              <span
                className="text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
                style={{
                  backgroundColor: `${savedItem.collection_color || '#6366f1'}20`,
                  color: savedItem.collection_color || '#6366f1'
                }}
              >
                <Folder className="w-3 h-3" />
                {savedItem.collection_name}
              </span>
            ) : (
              <span className="text-[11px] text-slate-400">Uncategorized</span>
            )}
          </div>

          <button
            onClick={() => onRemove(savedItem)}
            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Remove from saved"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Company & Role */}
        <div className="flex items-start gap-3">
          {job.logo_url ? (
            <img
              src={job.logo_url}
              alt={job.company}
              className="w-10 h-10 rounded-xl object-cover border border-slate-100 dark:border-slate-800 shrink-0"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          ) : (
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getAvatarGradient(
                job.company
              )} flex items-center justify-center text-white font-bold text-xs shrink-0`}
            >
              {getInitials(job.company)}
            </div>
          )}

          <div className="min-w-0">
            <Link
              to={`/jobs/${job.id}`}
              className="text-base font-bold text-slate-900 dark:text-slate-100 hover:text-brand-600 dark:hover:text-brand-400 transition truncate block"
            >
              {job.title}
            </Link>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
              {job.company} • {job.location}
            </p>
          </div>
        </div>

        {/* Salary & Type */}
        <div className="mt-3 flex items-center gap-2 text-xs">
          <span className="font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 px-2 py-0.5 rounded-md">
            {formatSalary(job.salary_min, job.salary_max)}
          </span>
          <span className="text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
            {job.job_type}
          </span>
        </div>

        {/* Private Note Section */}
        <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Private Note
            </span>
            {!isEditingNote && (
              <button
                onClick={() => setIsEditingNote(true)}
                className="text-slate-400 hover:text-brand-600 dark:hover:text-brand-400"
              >
                <Edit3 className="w-3 h-3" />
              </button>
            )}
          </div>

          {isEditingNote ? (
            <div className="space-y-2">
              <textarea
                rows={2}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a private note about this job..."
                className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none"
              />
              <div className="flex justify-end gap-1">
                <button
                  onClick={() => setIsEditingNote(false)}
                  className="px-2 py-1 text-[11px] text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNote}
                  className="px-2 py-1 text-[11px] font-semibold bg-brand-600 text-white rounded-md"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-600 dark:text-slate-400 italic">
              {noteText ? `"${noteText}"` : 'No notes added yet. Click edit to add.'}
            </p>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        {/* Move to folder dropdown */}
        <select
          value={savedItem.collection_id || 'none'}
          onChange={handleMoveChange}
          className="text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 py-1 text-slate-600 dark:text-slate-400 max-w-[130px] truncate"
        >
          <option value="none">Folder...</option>
          {collections.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Apply Button */}
        {isApplied ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" /> Applied
          </span>
        ) : (
          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsApplyModalOpen(true)}
          >
            Apply
          </Button>
        )}
      </div>

      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        job={job}
        onSuccess={() => setIsApplied(true)}
      />
    </div>
  );
}
