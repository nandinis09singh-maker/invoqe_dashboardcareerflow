import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Edit3,
  Copy,
  Trash2,
  Download,
  MoreVertical,
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';
import Button from '../ui/Button';
import { timeAgo } from '../../utils/formatters';

export default function ResumeCard({
  resume,
  onRename,
  onDuplicate,
  onDelete,
  onDownload
}) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const templateColors = {
    modern: 'bg-brand-600',
    classic: 'bg-slate-700',
    minimal: 'bg-slate-900',
    creative: 'bg-violet-600'
  };

  const accentColor = resume.accent_color || '#4f46e5';

  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 shadow-soft hover:shadow-soft-hover transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      {/* Thumbnail Area */}
      <div
        onClick={() => navigate(`/resume-builder/${resume.id}`)}
        className="relative h-44 bg-slate-50 dark:bg-slate-950/60 p-4 flex items-center justify-center cursor-pointer border-b border-slate-100 dark:border-slate-800/60 group-hover:bg-slate-100/50 dark:group-hover:bg-slate-900/40 transition-colors"
      >
        {/* Document Thumbnail representation */}
        <div className="w-28 h-36 bg-white dark:bg-slate-900 rounded-md shadow-md border border-slate-200/80 dark:border-slate-700/80 p-2.5 flex flex-col justify-between overflow-hidden relative group-hover:scale-105 transition-transform">
          {/* Header Bar Accent */}
          <div
            className="w-full h-2 rounded-sm mb-2 shrink-0"
            style={{ backgroundColor: accentColor }}
          />

          {/* Skeleton lines for realistic resume preview */}
          <div className="space-y-1.5 flex-1">
            <div className="w-3/4 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full" />
            <div className="w-1/2 h-1 bg-slate-200 dark:bg-slate-800 rounded-full" />
            <div className="pt-1.5 space-y-1">
              <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full" />
              <div className="w-5/6 h-1 bg-slate-200 dark:bg-slate-800 rounded-full" />
              <div className="w-4/6 h-1 bg-slate-200 dark:bg-slate-800 rounded-full" />
            </div>
            <div className="pt-1 space-y-1">
              <div className="w-1/3 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
              <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full" />
            </div>
          </div>

          {/* Footer dots */}
          <div className="flex gap-1 pt-1">
            <div className="w-2 h-1 bg-slate-200 dark:bg-slate-700 rounded-sm" />
            <div className="w-2 h-1 bg-slate-200 dark:bg-slate-700 rounded-sm" />
          </div>
        </div>

        {/* ATS Score Tag */}
        {resume.ats_score != null && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 dark:bg-slate-800/95 border border-slate-200 dark:border-slate-700 shadow-sm backdrop-blur-sm">
            <Sparkles className="w-3 h-3 text-brand-600 dark:text-brand-400" />
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
              ATS {resume.ats_score}%
            </span>
          </div>
        )}
      </div>

      {/* Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3
              onClick={() => navigate(`/resume-builder/${resume.id}`)}
              className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1 hover:text-brand-600 dark:hover:text-brand-400 cursor-pointer transition-colors"
              title={resume.title}
            >
              {resume.title}
            </h3>

            {/* Overflow Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label="Resume options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1.5 z-30 text-xs">
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onRename(resume);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-300"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                      Rename
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onDuplicate(resume.id);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-300"
                    >
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      Duplicate
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onDownload(resume);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-300"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-400" />
                      Download PDF
                    </button>
                    <div className="border-t border-slate-100 dark:border-slate-700 my-1" />
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        setIsDeleting(true);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Badges / Meta */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 capitalize">
              {resume.template || 'Modern'} Template
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {timeAgo(resume.updated_at)}
            </span>
          </div>
        </div>

        {/* Delete Confirmation or Card Footer Actions */}
        {isDeleting ? (
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
            <p className="text-xs text-red-600 dark:text-red-400 font-medium text-center">
              Confirm deleting &ldquo;{resume.title}&rdquo;?
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="danger"
                className="w-full text-xs py-1"
                onClick={() => {
                  onDelete(resume.id);
                  setIsDeleting(false);
                }}
              >
                Yes, Delete
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-full text-xs py-1"
                onClick={() => setIsDeleting(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/resume-builder/${resume.id}`)}
              className="text-xs font-semibold py-1.5 flex-1"
            >
              <Edit3 className="w-3.5 h-3.5 mr-1" />
              Edit Resume
            </Button>
            <button
              onClick={() => onDownload(resume)}
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
              title="Download PDF"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
