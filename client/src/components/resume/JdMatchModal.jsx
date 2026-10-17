import React, { useState } from 'react';
import { Sparkles, CheckCircle2, AlertCircle, Plus, ArrowRight } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function JdMatchModal({
  isOpen,
  onClose,
  resumeId,
  onAddSkillsToResume
}) {
  const [jdText, setJdText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!jdText.trim()) {
      toast.error('Please paste a job description.');
      return;
    }

    try {
      setIsAnalyzing(true);
      const res = await api.post(`/resumes/${resumeId}/jd-match`, {
        jobDescription: jdText
      });

      if (res.data.success) {
        setResult(res.data);
        toast.success(`Matched ${res.data.matchedKeywords.length} of ${res.data.totalJdKeywords} keywords!`);
      }
    } catch (err) {
      toast.error('Failed to match job description.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddSkill = (skill) => {
    if (onAddSkillsToResume) {
      onAddSkillsToResume([skill]);
      toast.success(`Added "${skill}" to resume skills!`);
      // Move from missing to matched locally
      setResult((prev) => {
        if (!prev) return prev;
        const newMissing = prev.missingKeywords.filter((k) => k !== skill);
        const newMatched = [...prev.matchedKeywords, skill];
        const newPct = prev.totalJdKeywords > 0
          ? Math.round((newMatched.length / prev.totalJdKeywords) * 100)
          : 100;
        return {
          ...prev,
          missingKeywords: newMissing,
          matchedKeywords: newMatched,
          matchPercentage: newPct
        };
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Job Description (JD) Keyword Matcher"
      description="Paste any job opening description to discover keyword alignment and identify missing skills."
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* INPUT TEXTAREA */}
        <form onSubmit={handleAnalyze} className="space-y-3">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Paste Target Job Description (Requirements, Responsibilities & Skills)
          </label>
          <textarea
            rows={5}
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste the job description from LinkedIn, Naukri, or company careers page here..."
            className="w-full text-xs p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none leading-relaxed"
          />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                setJdText('');
                setResult(null);
              }}
            >
              Clear
            </Button>
            <Button
              type="submit"
              size="sm"
              variant="primary"
              disabled={isAnalyzing || !jdText.trim()}
              icon={Sparkles}
            >
              {isAnalyzing ? 'Analyzing Keywords...' : 'Match Keywords'}
            </Button>
          </div>
        </form>

        {/* MATCH RESULTS */}
        {result && (
          <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            {/* Top Match Score Pill */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Keyword Alignment Score
                </p>
                <p className="text-[11px] text-slate-500">
                  {result.matchedKeywords.length} of {result.totalJdKeywords} target keywords found in your resume
                </p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-brand-600 dark:text-brand-400">
                  {result.matchPercentage}%
                </span>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Match</p>
              </div>
            </div>

            {/* Keyword Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Matched Keywords */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Matched Keywords ({result.matchedKeywords.length})
                </h4>

                <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 min-h-[90px]">
                  {result.matchedKeywords.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">None of the detected keywords matched.</p>
                  ) : (
                    result.matchedKeywords.map((kw) => (
                      <span
                        key={kw}
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                      >
                        ✓ {kw}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Missing Keywords ({result.missingKeywords.length})
                </h4>

                <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 min-h-[90px]">
                  {result.missingKeywords.length === 0 ? (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                      All detected JD keywords are covered in your resume!
                    </p>
                  ) : (
                    result.missingKeywords.map((kw) => (
                      <button
                        key={kw}
                        type="button"
                        onClick={() => handleAddSkill(kw)}
                        className="group inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-brand-500 hover:text-brand-600 transition"
                        title="Click to add to resume skills"
                      >
                        <span>{kw}</span>
                        <Plus className="w-3 h-3 text-slate-400 group-hover:text-brand-600" />
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
