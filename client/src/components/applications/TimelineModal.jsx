import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { formatDate, timeAgo, getStatusStyle } from '../../utils/formatters';
import { Clock, Plus, CheckCircle, Calendar, MessageSquare } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function TimelineModal({
  isOpen,
  onClose,
  application,
  onApplicationUpdated
}) {
  const [timeline, setTimeline] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);

  useEffect(() => {
    if (application) {
      setTimeline(application.timeline || []);
      setNewNote(application.notes || '');
    }
  }, [application, isOpen]);

  if (!application) return null;

  const handleSaveNote = async () => {
    try {
      setIsSavingNote(true);
      const res = await api.patch(`/applications/${application.id}`, {
        notes: newNote
      });
      toast.success('Notes updated.');
      if (onApplicationUpdated) onApplicationUpdated(res.data.application);
      onClose();
    } catch (e) {
      toast.error('Failed to update notes.');
    } finally {
      setIsSavingNote(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${application.job?.title} @ ${application.job?.company}`}
      subtitle={`Application Timeline & Notes • Current Status: ${application.status}`}
      maxWidth="max-w-lg"
    >
      <div className="space-y-6">
        {/* Timeline Events list */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Activity History
          </h4>

          {timeline.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No timeline events recorded yet.</p>
          ) : (
            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {timeline.map((event, idx) => {
                const style = getStatusStyle(event.status);
                return (
                  <div key={event.id || idx} className="relative">
                    {/* Dot on timeline line */}
                    <div className={`absolute -left-6 top-1 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${style.badge}`} />
                    
                    <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${style.bg}`}>
                          {event.status}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {formatDate(event.created_at)} ({timeAgo(event.created_at)})
                        </span>
                      </div>
                      {event.notes && (
                        <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300">
                          {event.notes}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Editable Notes Section */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" /> Candidate Notes
          </label>
          <textarea
            rows={3}
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Keep track of salary discussions, interview feedback, or follow-ups..."
            className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 resize-none leading-relaxed"
          />
        </div>

        {/* Modal Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveNote} isLoading={isSavingNote}>
            Save Notes
          </Button>
        </div>
      </div>
    </Modal>
  );
}
