import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  Sparkles,
  Download,
  Printer,
  Eye,
  Edit3,
  UserCheck,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  FileSearch,
  Wand2,
  Palette,
  Type,
  Maximize2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import api from '../api/axios';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import ResumePreview from '../components/resume/ResumePreview';
import AtsScoreModal from '../components/resume/AtsScoreModal';
import JdMatchModal from '../components/resume/JdMatchModal';
import SuggestionHelperModal from '../components/resume/SuggestionHelperModal';
import toast from 'react-hot-toast';
import html2pdf from 'html2pdf.js';

const COLOR_PRESETS = [
  { name: 'Indigo', value: '#4f46e5' },
  { name: 'Sky Blue', value: '#0284c7' },
  { name: 'Teal', value: '#0d9488' },
  { name: 'Emerald', value: '#16a34a' },
  { name: 'Amber', value: '#d97706' },
  { name: 'Violet', value: '#7c3aed' },
  { name: 'Rose', value: '#e11d48' },
  { name: 'Slate', value: '#334155' }
];

const FONT_OPTIONS = [
  { label: 'Inter (Sans)', value: 'Inter' },
  { label: 'Roboto (Clean)', value: 'Roboto' },
  { label: 'Poppins (Geometric)', value: 'Poppins' },
  { label: 'Merriweather (Serif)', value: 'Merriweather' }
];

const INITIAL_RESUME_CONTENT = {
  personal_info: {
    full_name: '',
    headline: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: ''
  },
  summary: '',
  experience: [],
  education: [],
  projects: [],
  skills: {
    'Frontend': [],
    'Backend': [],
    'Database & Tools': []
  },
  certifications: [],
  achievements: [],
  languages: [],
  section_order: ['summary', 'experience', 'projects', 'skills', 'education', 'certifications', 'achievements', 'languages'],
  section_visibility: {
    summary: true,
    experience: true,
    projects: true,
    skills: true,
    education: true,
    certifications: true,
    achievements: true,
    languages: true
  }
};

export default function ResumeEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [resumeData, setResumeData] = useState(null);
  const [title, setTitle] = useState('');
  const [template, setTemplate] = useState('modern');
  const [accentColor, setAccentColor] = useState('#4f46e5');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [fontSize, setFontSize] = useState('normal');
  const [content, setContent] = useState(INITIAL_RESUME_CONTENT);

  // Active section tab in editor
  const [activeTab, setActiveTab] = useState('personal');
  // Mobile preview vs edit switch
  const [mobileView, setMobileView] = useState('edit'); // 'edit' or 'preview'

  // Auto-save state
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'saving', 'unsaved'
  const [lastSavedTime, setLastSavedTime] = useState(null);
  const autoSaveTimerRef = useRef(null);
  const hasInitialized = useRef(false);

  // Modals state
  const [isAtsModalOpen, setIsAtsModalOpen] = useState(false);
  const [isJdModalOpen, setIsJdModalOpen] = useState(false);
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
  const [suggestionTarget, setSuggestionTarget] = useState({ type: 'summary', index: null });

  // DOM ref for printing and PDF generation
  const printPreviewRef = useRef(null);

  // Load Resume on Mount
  useEffect(() => {
    async function fetchResume() {
      try {
        setIsLoading(true);
        const res = await api.get(`/resumes/${id}`);
        if (res.data.success) {
          const r = res.data.resume;
          setResumeData(r);
          setTitle(r.title);
          setTemplate(r.template || 'modern');
          setAccentColor(r.accent_color || '#4f46e5');
          setFontFamily(r.font_family || 'Inter');
          setFontSize(r.font_size || 'normal');

          let parsed = INITIAL_RESUME_CONTENT;
          if (r.content) {
            try {
              parsed = typeof r.content === 'string' ? JSON.parse(r.content) : r.content;
            } catch (e) {
              console.error('Failed to parse resume content', e);
            }
          }
          setContent({ ...INITIAL_RESUME_CONTENT, ...parsed });
          setLastSavedTime(new Date().toLocaleTimeString());
        }
      } catch (err) {
        console.error('Failed to load resume', err);
        toast.error('Resume not found.');
        navigate('/resume-builder');
      } finally {
        setIsLoading(false);
        // Delay flag so initial fetch doesn't trigger auto-save
        setTimeout(() => {
          hasInitialized.current = true;
        }, 500);
      }
    }
    fetchResume();
  }, [id, navigate]);

  // Debounced auto-save function
  const triggerAutoSave = useCallback(
    (newTitle, newTemplate, newColor, newFont, newSize, newContent) => {
      if (!hasInitialized.current) return;
      setSaveStatus('unsaved');

      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      autoSaveTimerRef.current = setTimeout(async () => {
        try {
          setSaveStatus('saving');
          const res = await api.put(`/resumes/${id}`, {
            title: newTitle,
            template: newTemplate,
            accent_color: newColor,
            font_family: newFont,
            font_size: newSize,
            content: newContent
          });

          if (res.data.success) {
            setSaveStatus('saved');
            setLastSavedTime(new Date().toLocaleTimeString());
            if (res.data.resume?.ats_score != null) {
              setResumeData((prev) => ({ ...prev, ats_score: res.data.resume.ats_score }));
            }
          }
        } catch (err) {
          setSaveStatus('unsaved');
          console.error('Auto-save error', err);
        }
      }, 1500);
    },
    [id]
  );

  // Trigger auto-save whenever core attributes change
  useEffect(() => {
    if (hasInitialized.current) {
      triggerAutoSave(title, template, accentColor, fontFamily, fontSize, content);
    }
  }, [title, template, accentColor, fontFamily, fontSize, content, triggerAutoSave]);

  // Autofill from Profile
  const handleAutofillFromProfile = async () => {
    try {
      toast.loading('Fetching profile data...', { id: 'autofill' });
      const res = await api.get('/profile');
      if (res.data.success) {
        const { user, profile, education = [], experience = [] } = res.data;

        // Parse user skills
        let profileSkills = [];
        try {
          profileSkills = JSON.parse(profile?.skills || '[]');
        } catch (e) {
          profileSkills = [];
        }

        const newContent = {
          ...content,
          personal_info: {
            ...content.personal_info,
            full_name: user?.name || content.personal_info.full_name,
            headline: profile?.headline || content.personal_info.headline,
            email: user?.email || content.personal_info.email,
            phone: profile?.phone || content.personal_info.phone,
            location: profile?.location || content.personal_info.location,
            website: profile?.portfolio_url || content.personal_info.website,
            linkedin: profile?.linkedin_url || content.personal_info.linkedin,
            github: profile?.github_url || content.personal_info.github
          },
          summary: profile?.bio || content.summary,
          education:
            education.length > 0
              ? education.map((edu) => ({
                  id: String(edu.id),
                  institution: edu.institution,
                  degree: `${edu.degree} in ${edu.field_of_study}`,
                  location: profile?.location || '',
                  start_year: edu.start_year || '',
                  end_year: edu.is_current ? 'Present' : edu.end_year || '',
                  grade: edu.grade || ''
                }))
              : content.education,
          experience:
            experience.length > 0
              ? experience.map((exp) => ({
                  id: String(exp.id),
                  title: exp.title,
                  company: exp.company,
                  location: exp.location || '',
                  start_date: exp.start_date || '',
                  end_date: exp.is_current ? 'Present' : exp.end_date || '',
                  current: Boolean(exp.is_current),
                  description: exp.description || '',
                  bullets: exp.description
                    ? exp.description
                        .split('\n')
                        .map((l) => l.trim().replace(/^[-•*]\s*/, ''))
                        .filter(Boolean)
                    : []
                }))
              : content.experience,
          skills: {
            ...content.skills,
            'Profile Skills': profileSkills
          }
        };

        setContent(newContent);
        toast.success('Resume autofilled from your profile!', { id: 'autofill' });
      }
    } catch (err) {
      toast.error('Failed to load profile data.', { id: 'autofill' });
    }
  };

  // PDF Export
  const handleDownloadPdf = () => {
    if (!printPreviewRef.current) return;
    toast.loading('Generating A4 PDF...', { id: 'pdf-gen' });

    const opt = {
      margin: 0,
      filename: `${title.replace(/\s+/g, '_')}_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf()
      .set(opt)
      .from(printPreviewRef.current)
      .save()
      .then(() => {
        toast.success('PDF downloaded!', { id: 'pdf-gen' });
      })
      .catch((err) => {
        console.error(err);
        toast.error('Failed to export PDF file.', { id: 'pdf-gen' });
      });
  };

  // Print
  const handlePrint = () => {
    window.print();
  };

  // Helper insertion handler
  const handleInsertSuggestion = (text) => {
    if (suggestionTarget.type === 'summary') {
      setContent((prev) => ({
        ...prev,
        summary: prev.summary ? `${prev.summary}\n\n${text}` : text
      }));
    } else if (suggestionTarget.type === 'experience-bullet') {
      const idx = suggestionTarget.index;
      setContent((prev) => {
        const expList = [...prev.experience];
        if (expList[idx]) {
          const currentBullets = expList[idx].bullets || [];
          expList[idx] = {
            ...expList[idx],
            bullets: [...currentBullets, text]
          };
        }
        return { ...prev, experience: expList };
      });
    } else if (suggestionTarget.type === 'project-bullet') {
      const idx = suggestionTarget.index;
      setContent((prev) => {
        const projList = [...prev.projects];
        if (projList[idx]) {
          const currentBullets = projList[idx].bullets || [];
          projList[idx] = {
            ...projList[idx],
            bullets: [...currentBullets, text]
          };
        }
        return { ...prev, projects: projList };
      });
    }
  };

  // Section Handlers: Personal Info
  const updatePersonalInfo = (field, val) => {
    setContent((prev) => ({
      ...prev,
      personal_info: {
        ...prev.personal_info,
        [field]: val
      }
    }));
  };

  // Section Handlers: Experience
  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      title: 'Software Engineer',
      company: 'Company Name',
      location: 'Remote',
      start_date: 'Jan 2023',
      end_date: 'Present',
      current: true,
      description: '',
      bullets: ['Built core features resulting in 20% performance improvement.']
    };
    setContent((prev) => ({
      ...prev,
      experience: [newExp, ...prev.experience]
    }));
  };

  const updateExperience = (idx, field, val) => {
    setContent((prev) => {
      const updated = [...prev.experience];
      updated[idx] = { ...updated[idx], [field]: val };
      return { ...prev, experience: updated };
    });
  };

  const removeExperience = (idx) => {
    setContent((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== idx)
    }));
  };

  const moveExperience = (idx, direction) => {
    setContent((prev) => {
      const list = [...prev.experience];
      const targetIdx = idx + direction;
      if (targetIdx < 0 || targetIdx >= list.length) return prev;
      const temp = list[idx];
      list[idx] = list[targetIdx];
      list[targetIdx] = temp;
      return { ...prev, experience: list };
    });
  };

  // Section Handlers: Education
  const addEducation = () => {
    const newEdu = {
      id: Date.now().toString(),
      institution: 'University / Institute Name',
      degree: 'B.Tech / B.S. in Computer Science',
      location: 'City, Country',
      start_year: '2019',
      end_year: '2023',
      grade: '8.5 CGPA'
    };
    setContent((prev) => ({
      ...prev,
      education: [...prev.education, newEdu]
    }));
  };

  const updateEducation = (idx, field, val) => {
    setContent((prev) => {
      const updated = [...prev.education];
      updated[idx] = { ...updated[idx], [field]: val };
      return { ...prev, education: updated };
    });
  };

  const removeEducation = (idx) => {
    setContent((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== idx)
    }));
  };

  // Section Handlers: Projects
  const addProject = () => {
    const newProj = {
      id: Date.now().toString(),
      title: 'Full-Stack Web Application',
      tech_stack: 'React, Node.js, PostgreSQL',
      live_url: 'https://demo.app',
      github_url: 'https://github.com/user/project',
      description: 'Engineered high-concurrency application with responsive user interface.',
      bullets: ['Improved query response times by 35% through Redis caching layer.']
    };
    setContent((prev) => ({
      ...prev,
      projects: [...prev.projects, newProj]
    }));
  };

  const updateProject = (idx, field, val) => {
    setContent((prev) => {
      const updated = [...prev.projects];
      updated[idx] = { ...updated[idx], [field]: val };
      return { ...prev, projects: updated };
    });
  };

  const removeProject = (idx) => {
    setContent((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== idx)
    }));
  };

  // Section Handlers: Skills
  const [newSkillCategory, setNewSkillCategory] = useState('');
  const [newSkillTag, setNewSkillTag] = useState({});

  const addSkillCategory = () => {
    if (!newSkillCategory.trim()) return;
    setContent((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [newSkillCategory.trim()]: []
      }
    }));
    setNewSkillCategory('');
  };

  const removeSkillCategory = (cat) => {
    setContent((prev) => {
      const updated = { ...prev.skills };
      delete updated[cat];
      return { ...prev, skills: updated };
    });
  };

  const addSkillChip = (cat) => {
    const tag = (newSkillTag[cat] || '').trim();
    if (!tag) return;
    setContent((prev) => {
      const cur = prev.skills[cat] || [];
      if (cur.includes(tag)) return prev;
      return {
        ...prev,
        skills: {
          ...prev.skills,
          [cat]: [...cur, tag]
        }
      };
    });
    setNewSkillTag((prev) => ({ ...prev, [cat]: '' }));
  };

  const removeSkillChip = (cat, tagToRemove) => {
    setContent((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [cat]: (prev.skills[cat] || []).filter((s) => s !== tagToRemove)
      }
    }));
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto animate-pulse">
        <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 h-[700px] bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="lg:col-span-6 h-[700px] bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  const TABS = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'summary', label: 'Summary' },
    { id: 'experience', label: `Experience (${content.experience?.length || 0})` },
    { id: 'projects', label: `Projects (${content.projects?.length || 0})` },
    { id: 'skills', label: 'Skills' },
    { id: 'education', label: `Education (${content.education?.length || 0})` },
    { id: 'design', label: 'Style & Layout' }
  ];

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto pb-12">
      {/* TOP CONTROLS & STATUS BAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-4 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left: Back & Editable Title */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link
            to="/resume-builder"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0"
            title="Back to Resumes"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Resume Title"
              className="text-base sm:text-lg font-bold text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-brand-500 focus:outline-none w-full truncate transition-colors py-0.5"
            />
            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
              {saveStatus === 'saving' && (
                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                  Saving changes...
                </span>
              )}
              {saveStatus === 'saved' && (
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Saved {lastSavedTime ? `at ${lastSavedTime}` : ''}
                </span>
              )}
              {saveStatus === 'unsaved' && (
                <span className="text-slate-400">Unsaved edits...</span>
              )}

              {resumeData?.ats_score != null && (
                <>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="font-semibold text-brand-600 dark:text-brand-400">
                    ATS Score: {resumeData.ats_score}%
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions Toolbar */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          {/* Mobile View Toggle */}
          <div className="flex lg:hidden rounded-xl border border-slate-200 dark:border-slate-800 p-0.5 bg-slate-100 dark:bg-slate-800">
            <button
              onClick={() => setMobileView('edit')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                mobileView === 'edit'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5 inline mr-1" />
              Edit
            </button>
            <button
              onClick={() => setMobileView('preview')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                mobileView === 'preview'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              <Eye className="w-3.5 h-3.5 inline mr-1" />
              Preview
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleAutofillFromProfile}
            className="text-xs font-medium"
            title="Import headline, bio, experience, and education from your profile"
          >
            <UserCheck className="w-3.5 h-3.5 mr-1 text-brand-600 dark:text-brand-400" />
            <span className="hidden sm:inline">Autofill Profile</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAtsModalOpen(true)}
            className="text-xs font-medium"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-500" />
            <span>ATS Checker</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsJdModalOpen(true)}
            className="text-xs font-medium"
          >
            <FileSearch className="w-3.5 h-3.5 mr-1 text-indigo-500" />
            <span className="hidden sm:inline">Match Job</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleDownloadPdf}
            className="text-xs font-semibold shadow-sm"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            <span>Download PDF</span>
          </Button>

          <button
            onClick={handlePrint}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            title="Print Document"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* QUICK STYLING BAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl px-4 py-2.5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Template Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Template:
          </span>
          <select
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="text-xs font-bold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="modern">Modern Clean (2-Col)</option>
            <option value="classic">Classic Executive (Serif)</option>
            <option value="minimal">Minimal Tech (Notion)</option>
            <option value="creative">Creative Portfolio (Banner)</option>
          </select>
        </div>

        {/* Accent Color Picker */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Accent:
          </span>
          <div className="flex items-center gap-1.5">
            {COLOR_PRESETS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setAccentColor(c.value)}
                className={`w-5 h-5 rounded-full transition-transform ${
                  accentColor === c.value ? 'scale-125 ring-2 ring-offset-2 ring-brand-500' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c.value }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        {/* Typography & Size */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Font:
            </span>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="text-xs font-medium text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 focus:outline-none"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Size:
            </span>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="text-xs font-medium text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 focus:outline-none"
            >
              <option value="compact">Compact</option>
              <option value="normal">Normal</option>
              <option value="relaxed">Relaxed</option>
            </select>
          </div>
        </div>
      </div>

      {/* SPLIT SCREEN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: EDITOR TABS & FORMS */}
        <div
          className={`lg:col-span-6 space-y-4 ${
            mobileView === 'preview' ? 'hidden lg:block' : 'block'
          }`}
        >
          {/* Section Navigation Tabs */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-2 shadow-sm overflow-x-auto flex gap-1 scrollbar-none">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  activeTab === t.id
                    ? 'bg-brand-50 text-brand-600 dark:bg-brand-950/70 dark:text-brand-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* TAB 1: PERSONAL INFO */}
          {activeTab === 'personal' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-6 shadow-card space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Personal Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={content.personal_info.full_name}
                  onChange={(e) => updatePersonalInfo('full_name', e.target.value)}
                  placeholder="e.g. Alex Mercer"
                  required
                />
                <Input
                  label="Professional Headline"
                  value={content.personal_info.headline}
                  onChange={(e) => updatePersonalInfo('headline', e.target.value)}
                  placeholder="e.g. Senior Full-Stack Engineer"
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={content.personal_info.email}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  placeholder="alex@domain.com"
                  required
                />
                <Input
                  label="Phone Number"
                  value={content.personal_info.phone}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                />
                <Input
                  label="Location"
                  value={content.personal_info.location}
                  onChange={(e) => updatePersonalInfo('location', e.target.value)}
                  placeholder="e.g. Bengaluru, India or Remote"
                />
                <Input
                  label="Portfolio / Website"
                  value={content.personal_info.website}
                  onChange={(e) => updatePersonalInfo('website', e.target.value)}
                  placeholder="https://yourportfolio.dev"
                />
                <Input
                  label="LinkedIn URL"
                  value={content.personal_info.linkedin}
                  onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                />
                <Input
                  label="GitHub URL"
                  value={content.personal_info.github}
                  onChange={(e) => updatePersonalInfo('github', e.target.value)}
                  placeholder="https://github.com/username"
                />
              </div>
            </div>
          )}

          {/* TAB 2: SUMMARY */}
          {activeTab === 'summary' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-6 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Executive Summary
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    A punchy 2-4 sentence narrative highlighting your years of experience, core tech stack, and key value proposition.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSuggestionTarget({ type: 'summary', index: null });
                    setIsSuggestionModalOpen(true);
                  }}
                  className="text-xs font-semibold text-brand-600 dark:text-brand-400"
                >
                  <Wand2 className="w-3.5 h-3.5 mr-1" />
                  AI Suggestions
                </Button>
              </div>

              <textarea
                rows={6}
                value={content.summary}
                onChange={(e) => setContent((prev) => ({ ...prev, summary: e.target.value }))}
                placeholder="Write an impactful summary or click AI Suggestions to insert a battle-tested template..."
                className="w-full text-xs font-normal leading-relaxed bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-y"
              />
            </div>
          )}

          {/* TAB 3: EXPERIENCE */}
          {activeTab === 'experience' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-4 shadow-sm">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Work Experience
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Chronological work history with metric-driven bullet points.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={addExperience}
                  className="text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add Position
                </Button>
              </div>

              {content.experience?.map((exp, idx) => (
                <div
                  key={exp.id || idx}
                  className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-5 shadow-card space-y-4"
                >
                  {/* Item Header Controls */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 flex items-center justify-center text-xs">
                        {idx + 1}
                      </span>
                      {exp.title || 'Untitled Role'} @ {exp.company || 'Company'}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveExperience(idx, -1)}
                        disabled={idx === 0}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 disabled:opacity-30 transition"
                        title="Move Up"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveExperience(idx, 1)}
                        disabled={idx === content.experience.length - 1}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 disabled:opacity-30 transition"
                        title="Move Down"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeExperience(idx)}
                        className="p-1 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 transition ml-2"
                        title="Delete Role"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Form fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Job Title"
                      value={exp.title}
                      onChange={(e) => updateExperience(idx, 'title', e.target.value)}
                    />
                    <Input
                      label="Company"
                      value={exp.company}
                      onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                    />
                    <Input
                      label="Location"
                      value={exp.location}
                      onChange={(e) => updateExperience(idx, 'location', e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        label="Start Date"
                        value={exp.start_date}
                        onChange={(e) => updateExperience(idx, 'start_date', e.target.value)}
                        placeholder="e.g. Jan 2022"
                      />
                      <Input
                        label="End Date"
                        value={exp.end_date}
                        onChange={(e) => updateExperience(idx, 'end_date', e.target.value)}
                        placeholder="e.g. Present"
                      />
                    </div>
                  </div>

                  {/* Bullets List */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                        Key Responsibilities & Achievements
                      </label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSuggestionTarget({ type: 'experience-bullet', index: idx });
                          setIsSuggestionModalOpen(true);
                        }}
                        className="text-[11px] py-1 px-2.5 h-auto text-brand-600 dark:text-brand-400"
                      >
                        <Wand2 className="w-3 h-3 mr-1" />
                        Insert Action Bullet
                      </Button>
                    </div>

                    {(exp.bullets || []).map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-2">
                        <span className="text-slate-400 text-xs font-mono">•</span>
                        <input
                          type="text"
                          value={bullet}
                          onChange={(e) => {
                            const updatedBullets = [...exp.bullets];
                            updatedBullets[bIdx] = e.target.value;
                            updateExperience(idx, 'bullets', updatedBullets);
                          }}
                          className="flex-1 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-500"
                        />
                        <button
                          onClick={() => {
                            const updatedBullets = exp.bullets.filter((_, i) => i !== bIdx);
                            updateExperience(idx, 'bullets', updatedBullets);
                          }}
                          className="text-slate-400 hover:text-red-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const cur = exp.bullets || [];
                        updateExperience(idx, 'bullets', [...cur, '']);
                      }}
                      className="text-xs text-brand-600 dark:text-brand-400"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add bullet line
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-4 shadow-sm">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Key Projects
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Showcase noteworthy applications and code repositories.
                  </p>
                </div>
                <Button variant="primary" size="sm" onClick={addProject} className="text-xs font-semibold">
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add Project
                </Button>
              </div>

              {content.projects?.map((proj, idx) => (
                <div
                  key={proj.id || idx}
                  className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-5 shadow-card space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {proj.title || 'Untitled Project'}
                    </span>
                    <button
                      onClick={() => removeProject(idx)}
                      className="p-1 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Project Title"
                      value={proj.title}
                      onChange={(e) => updateProject(idx, 'title', e.target.value)}
                    />
                    <Input
                      label="Tech Stack"
                      value={proj.tech_stack}
                      onChange={(e) => updateProject(idx, 'tech_stack', e.target.value)}
                      placeholder="e.g. React, Node.js, SQLite"
                    />
                    <Input
                      label="Live URL"
                      value={proj.live_url}
                      onChange={(e) => updateProject(idx, 'live_url', e.target.value)}
                      placeholder="https://app.com"
                    />
                    <Input
                      label="GitHub URL"
                      value={proj.github_url}
                      onChange={(e) => updateProject(idx, 'github_url', e.target.value)}
                      placeholder="https://github.com/..."
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      Brief Description
                    </label>
                    <textarea
                      rows={2}
                      value={proj.description}
                      onChange={(e) => updateProject(idx, 'description', e.target.value)}
                      className="w-full text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: SKILLS */}
          {activeTab === 'skills' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-6 shadow-card space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Technical Skills & Competencies
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Organize skills by domain (e.g. Frontend, Backend, Cloud) for clean ATS parser parsing.
                </p>
              </div>

              {/* Add New Category */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="New Category (e.g. DevOps & Cloud)"
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value)}
                  className="flex-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addSkillCategory}
                  className="text-xs font-semibold shrink-0"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add Category
                </Button>
              </div>

              {/* Categories */}
              <div className="space-y-5">
                {Object.entries(content.skills || {}).map(([cat, tags]) => (
                  <div
                    key={cat}
                    className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                        {cat}
                      </span>
                      <button
                        onClick={() => removeSkillCategory(cat)}
                        className="text-slate-400 hover:text-red-500 text-xs transition"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Skill chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {(tags || []).map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 shadow-xs"
                        >
                          {t}
                          <button
                            onClick={() => removeSkillChip(cat, t)}
                            className="text-slate-400 hover:text-red-500"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>

                    {/* Add Chip Input */}
                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        placeholder={`Add skill to ${cat}...`}
                        value={newSkillTag[cat] || ''}
                        onChange={(e) =>
                          setNewSkillTag((prev) => ({ ...prev, [cat]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addSkillChip(cat);
                          }
                        }}
                        className="flex-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addSkillChip(cat)}
                        className="text-xs"
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: EDUCATION */}
          {activeTab === 'education' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-4 shadow-sm">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Education & Credentials
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Degrees, universities, grades, and academic achievements.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={addEducation}
                  className="text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add Education
                </Button>
              </div>

              {content.education?.map((edu, idx) => (
                <div
                  key={edu.id || idx}
                  className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-5 shadow-card space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {edu.institution || 'University Name'}
                    </span>
                    <button
                      onClick={() => removeEducation(idx)}
                      className="p-1 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Institution"
                      value={edu.institution}
                      onChange={(e) => updateEducation(idx, 'institution', e.target.value)}
                    />
                    <Input
                      label="Degree & Field"
                      value={edu.degree}
                      onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                    />
                    <Input
                      label="Start Year"
                      value={edu.start_year}
                      onChange={(e) => updateEducation(idx, 'start_year', e.target.value)}
                      placeholder="e.g. 2019"
                    />
                    <Input
                      label="End Year / Graduated"
                      value={edu.end_year}
                      onChange={(e) => updateEducation(idx, 'end_year', e.target.value)}
                      placeholder="e.g. 2023"
                    />
                    <Input
                      label="Grade / GPA"
                      value={edu.grade}
                      onChange={(e) => updateEducation(idx, 'grade', e.target.value)}
                      placeholder="e.g. 3.8 / 4.0 or 85%"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 7: DESIGN, SECTION VISIBILITY & ORDER */}
          {activeTab === 'design' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-6 shadow-card space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Section Order & Visibility
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Toggle sections on or off or customize the layout presentation.
                </p>
              </div>

              <div className="space-y-2">
                {[
                  { key: 'summary', label: 'Summary / Profile' },
                  { key: 'experience', label: 'Work Experience' },
                  { key: 'projects', label: 'Key Projects' },
                  { key: 'skills', label: 'Core Skills' },
                  { key: 'education', label: 'Education' },
                  { key: 'certifications', label: 'Certifications' },
                  { key: 'achievements', label: 'Key Achievements' },
                  { key: 'languages', label: 'Languages' }
                ].map((s) => {
                  const isVis = content.section_visibility?.[s.key] !== false;
                  return (
                    <div
                      key={s.key}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                    >
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {s.label}
                      </span>
                      <button
                        onClick={() => {
                          setContent((prev) => ({
                            ...prev,
                            section_visibility: {
                              ...prev.section_visibility,
                              [s.key]: !isVis
                            }
                          }));
                        }}
                        className={`text-xs font-bold px-3 py-1 rounded-lg transition ${
                          isVis
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                        }`}
                      >
                        {isVis ? 'Visible' : 'Hidden'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: LIVE A4 PREVIEW (STICKY) */}
        <div
          className={`lg:col-span-6 sticky top-20 ${
            mobileView === 'edit' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="bg-slate-100 dark:bg-slate-950/80 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-4 sm:p-6 shadow-inner overflow-auto max-h-[calc(100vh-140px)] flex justify-center">
            <ResumePreview
              ref={printPreviewRef}
              content={content}
              template={template}
              accentColor={accentColor}
              fontFamily={fontFamily}
              fontSize={fontSize}
            />
          </div>
        </div>
      </div>

      {/* ATS CHECKER MODAL */}
      <AtsScoreModal
        isOpen={isAtsModalOpen}
        onClose={() => setIsAtsModalOpen(false)}
        resumeId={id}
        resumeContent={content}
      />

      {/* JOB DESCRIPTION MATCH MODAL */}
      <JdMatchModal
        isOpen={isJdModalOpen}
        onClose={() => setIsJdModalOpen(false)}
        resumeId={id}
        resumeContent={content}
        onAddSkillsToResume={(skillsToAdd) => {
          setContent((prev) => {
            const currentOther = prev.skills['Keywords & Domain'] || [];
            const merged = Array.from(new Set([...currentOther, ...skillsToAdd]));
            return {
              ...prev,
              skills: {
                ...prev.skills,
                'Keywords & Domain': merged
              }
            };
          });
          toast.success(`Added ${skillsToAdd.length} missing keywords to your resume!`);
        }}
      />

      {/* SUGGESTION HELPER MODAL */}
      <SuggestionHelperModal
        isOpen={isSuggestionModalOpen}
        onClose={() => setIsSuggestionModalOpen(false)}
        targetType={suggestionTarget.type}
        onInsert={handleInsertSuggestion}
      />
    </div>
  );
}
