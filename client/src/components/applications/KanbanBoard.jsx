import React, { useState } from 'react';
import ApplicationCard from './ApplicationCard';
import confetti from 'canvas-confetti';

const COLUMNS = [
  { id: 'Applied', title: 'Applied', color: 'border-indigo-500', badge: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400' },
  { id: 'Under Review', title: 'Under Review', color: 'border-amber-500', badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400' },
  { id: 'Interview', title: 'Interview', color: 'border-blue-500', badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400' },
  { id: 'Offer', title: 'Offer', color: 'border-emerald-500', badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' },
  { id: 'Rejected', title: 'Rejected', color: 'border-rose-500', badge: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400' },
];

export default function KanbanBoard({
  applications,
  onStatusChange,
  onOpenTimeline,
  onOpenInterviewModal,
  onWithdraw
}) {
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== colId) {
      setDragOverColumn(colId);
    }
  };

  const handleDragLeave = (e, colId) => {
    if (dragOverColumn === colId) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const appIdStr = e.dataTransfer.getData('text/plain');
    if (!appIdStr) return;

    const appId = parseInt(appIdStr, 10);
    const app = applications.find(a => a.id === appId);

    if (app && app.status !== targetStatus) {
      // Trigger confetti celebration if moving to 'Offer'!
      if (targetStatus === 'Offer') {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      onStatusChange(appId, targetStatus);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start overflow-x-auto pb-4">
      {COLUMNS.map((col) => {
        const colApps = applications.filter((a) => a.status === col.id);
        const isHovered = dragOverColumn === col.id;

        return (
          <div
            key={col.id}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={(e) => handleDragLeave(e, col.id)}
            onDrop={(e) => handleDrop(e, col.id)}
            className={`flex flex-col rounded-2xl bg-slate-100/70 dark:bg-slate-900/40 border-2 transition-all p-3.5 min-h-[500px] ${
              isHovered
                ? 'border-brand-500 bg-brand-50/30 dark:bg-brand-950/20 scale-[1.01]'
                : 'border-transparent'
            }`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${col.color.replace('border-', 'bg-')}`} />
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  {col.title}
                </h4>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${col.badge}`}>
                {colApps.length}
              </span>
            </div>

            {/* Applications Cards List */}
            <div className="space-y-3 flex-1">
              {colApps.length === 0 ? (
                <div className="h-40 flex items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400 text-center p-4">
                  Drag applications here
                </div>
              ) : (
                colApps.map((app) => (
                  <ApplicationCard
                    key={app.id}
                    application={app}
                    onOpenTimeline={onOpenTimeline}
                    onOpenInterviewModal={onOpenInterviewModal}
                    onWithdraw={onWithdraw}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
