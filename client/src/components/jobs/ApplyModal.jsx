import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FileText, Upload, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

export default function ApplyModal({ isOpen, onClose, job, onSuccess }) {
  const { user } = useAuth();
  const [coverLetter, setCoverLetter] = useState(
    `Dear Hiring Team at ${job?.company || 'the company'},\n\nI am writing to express my strong interest in the ${job?.title || 'position'}. With my hands-on background in full-stack architecture and shipping reliable software, I am excited about contributing to your team's success.`
  );
  const [notes, setNotes] = useState('');

  // Mode: 'saved_resume' | 'profile_resume' | 'upload'
  const [resumeSource, setResumeSource] = useState('saved_resume');
  const [savedResumes, setSavedResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasProfileResume = Boolean(user?.profile?.resume_url);

  // Fetch saved resumes on modal open
  useEffect(() => {
    if (isOpen) {
      async function loadResumes() {
        try {
          const res = await api.get('/resumes');
          if (res.data.success && res.data.resumes?.length > 0) {
            setSavedResumes(res.data.resumes);
            setSelectedResumeId(res.data.resumes[0].id.toString());
            setResumeSource('saved_resume');
          } else if (hasProfileResume) {
            setResumeSource('profile_resume');
          } else {
            setResumeSource('upload');
          }
        } catch (e) {
          if (hasProfileResume) setResumeSource('profile_resume');
          else setResumeSource('upload');
        }
      }
      loadResumes();
    }
  }, [isOpen, hasProfileResume]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (resumeSource === 'upload' && !resumeFile) {
      toast.error('Please upload a resume file or select a saved resume.');
      return;
    }

    if (resumeSource === 'saved_resume' && !selectedResumeId) {
      toast.error('Please select one of your saved resumes.');
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('cover_letter', coverLetter);
      formData.append('notes', notes);

      if (resumeSource === 'saved_resume') {
        formData.append('resume_id', selectedResumeId);
        formData.append('use_profile_resume', 'false');
      } else if (resumeSource === 'profile_resume') {
        formData.append('use_profile_resume', 'true');
      } else if (resumeSource === 'upload' && resumeFile) {
        formData.append('resume', resumeFile);
        formData.append('use_profile_resume', 'false');
      }

      const res = await api.post(`/jobs/${job.id}/apply`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        toast.success(res.data.message || 'Application submitted successfully!');
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit application.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Apply to ${job?.company}`}
      subtitle={`Position: ${job?.title} • ${job?.location}`}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Applicant Summary */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Applicant Details
          </p>
          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
            {user?.name}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {user?.email} • {user?.profile?.headline || 'Candidate'}
          </p>
        </div>

        {/* Resume Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Select Resume / CV
          </label>

          {/* Option A: Saved Resume from Resume Builder */}
          {savedResumes.length > 0 && (
            <div
              onClick={() => setResumeSource('saved_resume')}
              className={`p-3.5 rounded-xl border cursor-pointer transition ${
                resumeSource === 'saved_resume'
                  ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-950/30'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Use resume from Resume Builder
                  </span>
                </div>
                {resumeSource === 'saved_resume' && (
                  <CheckCircle className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                )}
              </div>

              {resumeSource === 'saved_resume' && (
                <div className="mt-2 space-y-2">
                  <select
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    className="w-full text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {savedResumes.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.title} ({r.template} template{r.ats_score ? ` • ATS ${r.ats_score}%` : ''})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Option B: Profile PDF Resume */}
          {hasProfileResume && (
            <div
              onClick={() => {
                setResumeSource('profile_resume');
                setResumeFile(null);
              }}
              className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                resumeSource === 'profile_resume'
                  ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-950/30'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    Use uploaded profile resume
                  </p>
                  <p className="text-[11px] text-slate-500 truncate max-w-[250px]">
                    {user?.profile?.resume_filename || 'Default_Resume.pdf'}
                  </p>
                </div>
              </div>
              {resumeSource === 'profile_resume' && (
                <CheckCircle className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              )}
            </div>
          )}

          {/* Option C: Upload new file */}
          <div
            onClick={() => setResumeSource('upload')}
            className={`p-3.5 rounded-xl border transition cursor-pointer ${
              resumeSource === 'upload'
                ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-950/30'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                Upload customized resume file for this role
              </span>
              {resumeSource === 'upload' && (
                <CheckCircle className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              )}
            </div>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  if (file.size > 2 * 1024 * 1024) {
                    toast.error('File size exceeds 2MB limit.');
                    return;
                  }
                  setResumeFile(file);
                  setResumeSource('upload');
                }
              }}
              className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-100 dark:file:bg-brand-950 file:text-brand-700 dark:file:text-brand-300 hover:file:bg-brand-200 cursor-pointer"
            />
            {resumeFile && (
              <p className="mt-1.5 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle className="w-3.5 h-3.5" />
                Selected: {resumeFile.name} ({(resumeFile.size / 1024).toFixed(0)} KB)
              </p>
            )}
          </div>
        </div>

        {/* Cover Letter */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Cover Letter / Introduction
          </label>
          <textarea
            rows={5}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            className="block w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition resize-none leading-relaxed"
            placeholder="Introduce yourself and explain why you're a great fit..."
          />
        </div>

        {/* Private Notes */}
        <Input
          label="Private Notes for Yourself (Optional)"
          placeholder="e.g. Referred by Rahul, salary expected ₹32 LPA"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {/* Submit and Cancel Actions */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
          >
            Submit Application
          </Button>
        </div>
      </form>
    </Modal>
  );
}
