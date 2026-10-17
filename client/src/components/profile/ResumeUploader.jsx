import React, { useState } from 'react';
import { FileText, Upload, Trash2, Download, ExternalLink, Loader2, CheckCircle2 } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function ResumeUploader({ user, onResumeUpdated }) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const profile = user?.profile || {};
  const hasResume = Boolean(profile.resume_url);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Resume PDF size must be less than 2MB.');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('resume', file);

      const res = await api.post('/profile/resume-file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        toast.success('Resume uploaded successfully!');
        if (onResumeUpdated) onResumeUpdated(res.data.resume_url, res.data.resume_filename);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload resume.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await api.delete('/profile/resume-file');
      if (res.data.success) {
        toast.success('Resume removed successfully.');
        if (onResumeUpdated) onResumeUpdated('', '');
      }
    } catch (err) {
      toast.error('Failed to delete resume.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            Resume / Curriculum Vitae
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Attach your primary resume (PDF, max 2MB) for instant 1-click job applications.
          </p>
        </div>
      </div>

      {hasResume ? (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-brand-200 dark:border-brand-900/60 bg-brand-50/50 dark:bg-brand-950/20 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                {profile.resume_filename || 'Candidate_Resume.pdf'}
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Uploaded {formatDate(profile.resume_uploaded_at) || 'recently'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <a
              href={profile.resume_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-brand-600 transition shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View / Download
            </a>

            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition"
              title="Delete resume"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      ) : (
        <div className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-center bg-slate-50/50 dark:bg-slate-950/50">
          <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No resume uploaded yet
          </p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto mb-4">
            Uploading your resume boosts application speed and matches your profile with high-paying openings.
          </p>
          <label className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-brand-600 hover:bg-brand-700 text-white cursor-pointer shadow-sm transition">
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            <span>Select PDF File</span>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        </div>
      )}
    </div>
  );
}
