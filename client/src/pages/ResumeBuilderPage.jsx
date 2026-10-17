import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Plus,
  Sparkles,
  CheckCircle2,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layout,
  ExternalLink
} from 'lucide-react';
import api from '../api/axios';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import ResumeCard from '../components/resume/ResumeCard';
import ResumePreview from '../components/resume/ResumePreview';
import toast from 'react-hot-toast';
import html2pdf from 'html2pdf.js';

const TEMPLATE_OPTIONS = [
  { id: 'modern', name: 'Modern Clean', desc: 'Sleek two-column layout with sidebar metrics' },
  { id: 'classic', name: 'Classic Executive', desc: 'Serif font with traditional top-to-bottom flow' },
  { id: 'minimal', name: 'Minimal Tech', desc: 'Notion & Linear inspired mono-accented layout' },
  { id: 'creative', name: 'Creative Portfolio', desc: 'Vibrant header banner with high visual contrast' }
];

export default function ResumeBuilderPage() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [activeResumeForRename, setActiveResumeForRename] = useState(null);
  const [renameTitle, setRenameTitle] = useState('');

  // Create Form State
  const [newTitle, setNewTitle] = useState('My Professional Resume');
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [isCreating, setIsCreating] = useState(false);

  // Hidden PDF Generation Ref
  const [pdfGeneratingResume, setPdfGeneratingResume] = useState(null);
  const pdfDownloadRef = useRef(null);

  const fetchResumes = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/resumes');
      if (res.data.success) {
        setResumes(res.data.resumes || []);
      }
    } catch (err) {
      console.error('Failed to load resumes', err);
      toast.error('Failed to load your resumes.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleCreateResume = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error('Please enter a title for your resume.');
      return;
    }

    try {
      setIsCreating(true);
      const res = await api.post('/resumes', {
        title: newTitle.trim(),
        template: selectedTemplate,
        accent_color: selectedTemplate === 'creative' ? '#7c3aed' : '#4f46e5',
        font_family: selectedTemplate === 'classic' ? 'serif' : 'sans'
      });

      if (res.data.success) {
        toast.success('Resume created successfully!');
        setIsCreateModalOpen(false);
        navigate(`/resume-builder/${res.data.resume.id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create resume.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleRenameSubmit = async (e) => {
    e.preventDefault();
    if (!renameTitle.trim() || !activeResumeForRename) return;

    try {
      const res = await api.put(`/resumes/${activeResumeForRename.id}`, {
        title: renameTitle.trim()
      });

      if (res.data.success) {
        toast.success('Resume renamed!');
        setIsRenameModalOpen(false);
        setResumes((prev) =>
          prev.map((r) =>
            r.id === activeResumeForRename.id ? { ...r, title: renameTitle.trim() } : r
          )
        );
      }
    } catch (err) {
      toast.error('Failed to rename resume.');
    }
  };

  const handleDuplicate = async (id) => {
    try {
      const res = await api.post(`/resumes/${id}/duplicate`);
      if (res.data.success) {
        toast.success('Resume duplicated!');
        fetchResumes();
      }
    } catch (err) {
      toast.error('Failed to duplicate resume.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await api.delete(`/resumes/${id}`);
      if (res.data.success) {
        toast.success('Resume deleted.');
        setResumes((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      toast.error('Failed to delete resume.');
    }
  };

  const handleDownload = async (resume) => {
    try {
      toast.loading('Preparing PDF...', { id: 'pdf-dl' });
      // Fetch full resume data to guarantee complete content
      const res = await api.get(`/resumes/${resume.id}`);
      if (res.data.success) {
        setPdfGeneratingResume(res.data.resume);
        setTimeout(() => {
          if (pdfDownloadRef.current) {
            const opt = {
              margin: 0,
              filename: `${resume.title.replace(/\s+/g, '_')}_Resume.pdf`,
              image: { type: 'jpeg', quality: 0.98 },
              html2canvas: { scale: 2, useCORS: true, logging: false },
              jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            html2pdf()
              .set(opt)
              .from(pdfDownloadRef.current)
              .save()
              .then(() => {
                toast.success('PDF downloaded!', { id: 'pdf-dl' });
                setPdfGeneratingResume(null);
              })
              .catch((err) => {
                console.error(err);
                toast.error('Could not generate PDF file.', { id: 'pdf-dl' });
                setPdfGeneratingResume(null);
              });
          }
        }, 300);
      }
    } catch (err) {
      toast.error('Failed to export PDF.', { id: 'pdf-dl' });
    }
  };

  const filteredResumes = resumes.filter((r) =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Hero / Header */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ATS-Optimized Resume Architect</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Resume Builder
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Build, tailor, and score publication-grade resumes with real-time ATS keyword matching, one-click profile autofill, and pristine A4 PDF exports.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="primary"
            onClick={() => {
              setNewTitle('Senior Software Engineer Resume');
              setSelectedTemplate('modern');
              setIsCreateModalOpen(true);
            }}
            className="flex items-center gap-2 shadow-sm font-semibold"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Resume</span>
          </Button>
        </div>
      </div>

      {/* Feature Highlights Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/50 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              ATS-Passed Parser Formatting
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Strict semantic headings, machine-readable layouts, and zero-break text flows.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/50 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-brand-50 dark:bg-brand-950/50 text-brand-600 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              One-Click Profile Autofill
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Import your experience, education, headline, and skills straight from your profile.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/50 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 shrink-0">
            <Layout className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Job Description Matcher
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Paste target job postings to spot missing keywords and raise your match score.
            </p>
          </div>
        </div>
      </div>

      {/* Search & List Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search resumes by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
          />
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium self-start sm:self-center">
          Showing <span className="font-bold text-slate-900 dark:text-slate-100">{filteredResumes.length}</span> {filteredResumes.length === 1 ? 'resume' : 'resumes'}
        </p>
      </div>

      {/* Resumes Grid / Empty State */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-72 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : filteredResumes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResumes.map((resume) => (
            <ResumeCard
              key={resume.id}
              resume={resume}
              onRename={(r) => {
                setActiveResumeForRename(r);
                setRenameTitle(r.title);
                setIsRenameModalOpen(true);
              }}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
              onDownload={handleDownload}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-600 flex items-center justify-center mx-auto shadow-sm">
            <FileText className="w-7 h-7" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              No resumes found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {searchQuery
                ? 'No resumes matched your search term. Try a different keyword.'
                : 'Create your first professional resume customized for your next career move.'}
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => {
              setNewTitle('My Professional Resume');
              setIsCreateModalOpen(true);
            }}
            className="text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Create Your First Resume
          </Button>
        </div>
      )}

      {/* CREATE NEW RESUME MODAL */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Resume"
        subtitle="Choose a title and an initial template. You can customize colors, fonts, and sections anytime in the editor."
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleCreateResume} className="space-y-5">
          <Input
            label="Resume Title"
            placeholder="e.g. Senior Frontend Developer - React / Next.js"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Select Starting Template
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TEMPLATE_OPTIONS.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition ${
                    selectedTemplate === tmpl.id
                      ? 'border-brand-500 bg-brand-50/70 dark:bg-brand-950/40 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {tmpl.name}
                    </span>
                    {selectedTemplate === tmpl.id && (
                      <CheckCircle2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                    {tmpl.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isCreating}
              className="font-semibold"
            >
              Start Building
            </Button>
          </div>
        </form>
      </Modal>

      {/* RENAME RESUME MODAL */}
      <Modal
        isOpen={isRenameModalOpen}
        onClose={() => setIsRenameModalOpen(false)}
        title="Rename Resume"
        subtitle="Update the title for this resume document."
        maxWidth="max-w-md"
      >
        <form onSubmit={handleRenameSubmit} className="space-y-4">
          <Input
            label="Resume Title"
            value={renameTitle}
            onChange={(e) => setRenameTitle(e.target.value)}
            required
            autoFocus
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsRenameModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Title
            </Button>
          </div>
        </form>
      </Modal>

      {/* Hidden Offscreen PDF Rendering Container for Direct Downloads */}
      {pdfGeneratingResume && (
        <div style={{ position: 'fixed', left: '-9999px', top: '0', zIndex: -100 }}>
          <ResumePreview
            ref={pdfDownloadRef}
            resume={pdfGeneratingResume}
            template={pdfGeneratingResume.template}
            accentColor={pdfGeneratingResume.accent_color}
            fontFamily={pdfGeneratingResume.font_family}
            fontSize="normal"
          />
        </div>
      )}
    </div>
  );
}
