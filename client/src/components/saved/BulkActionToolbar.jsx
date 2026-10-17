import React from 'react';
import { Trash2, Folder, X } from 'lucide-react';
import Button from '../ui/Button';

export default function BulkActionToolbar({
  selectedCount,
  onClearSelection,
  onBulkDelete,
  onBulkMove,
  collections = [],
  isDeleting = false
}) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-4 border border-slate-700 animate-in fade-in slide-in-from-bottom-5">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-brand-400" />
        <span className="text-xs font-bold whitespace-nowrap">
          {selectedCount} {selectedCount === 1 ? 'job' : 'jobs'} selected
        </span>
      </div>

      <div className="h-4 w-px bg-slate-700" />

      {/* Move to folder */}
      <div className="flex items-center gap-2">
        <select
          onChange={(e) => {
            if (e.target.value) {
              onBulkMove(e.target.value === 'none' ? null : e.target.value);
              e.target.value = '';
            }
          }}
          className="text-xs rounded-xl bg-slate-800 border border-slate-700 text-white px-2.5 py-1.5 focus:outline-none cursor-pointer"
        >
          <option value="">Move to Folder...</option>
          <option value="none">Remove from Folder</option>
          {collections.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Delete selected */}
      <Button
        size="sm"
        variant="danger"
        onClick={onBulkDelete}
        isLoading={isDeleting}
        icon={Trash2}
      >
        Remove
      </Button>

      {/* Clear selection */}
      <button
        onClick={onClearSelection}
        className="p-1 text-slate-400 hover:text-white rounded-lg transition"
        title="Clear selection"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
