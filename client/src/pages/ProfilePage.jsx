import React, { useState, useEffect } from 'react';
import {
  User,
  Briefcase,
  GraduationCap,
  Sliders,
  Shield,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  Twitter,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import AvatarUploader from '../components/profile/AvatarUploader';
import ResumeUploader from '../components/profile/ResumeUploader';
import SkillsManager from '../components/profile/SkillsManager';
import EducationModal from '../components/profile/EducationModal';
import ExperienceModal from '../components/profile/ExperienceModal';
import JobPreferencesForm from '../components/profile/JobPreferencesForm';
import SecuritySettings from '../components/profile/SecuritySettings';
import ProfileCompletionCard from '../components/profile/ProfileCompletionCard';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { formatDate } from '../utils/formatters';

export default function ProfilePage() {
  const { user, refreshUser, updateProfileState } = useAuth();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'experience' | 'preferences' | 'security'

  const [profileData, setProfileData] = useState(null);
  const [educationList, setEducationList] = useState([]);
  const [experienceList, setExperienceList] = useState([]);
  const [completion, setCompletion] = useState({ percentage: 75, tips: [] });
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [eduModalOpen, setEduModalOpen] = useState(false);
  const [selectedEdu, setSelectedEdu] = useState(null);
  const [expModalOpen, setExpModalOpen] = useState(false);
  const [selectedExp, setSelectedExp] = useState(null);

  // Delete confirmations
  const [deleteEduId, setDeleteEduId] = useState(null);
  const [deleteExpId, setDeleteExpId] = useState(null);

  // Basic Profile Form States
  const [name, setName] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [skills, setSkills] = useState([]);
  const [isSavingBasic, setIsSavingBasic] = useState(false);

  // Load Profile from API
  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/profile');
      if (res.data.success) {
        setProfileData(res.data.profile);
        setEducationList(res.data.education || []);
        setExperienceList(res.data.experience || []);
        setCompletion({
          percentage: res.data.completionPercentage,
          tips: res.data.tips
        });

        // Populate fields
        setName(res.data.user.name || '');
        setHeadline(res.data.profile?.headline || '');
        setBio(res.data.profile?.bio || '');
        setPhone(res.data.profile?.phone || '');
        setLocation(res.data.profile?.location || '');
        setGithubUrl(res.data.profile?.github_url || '');
        setLinkedinUrl(res.data.profile?.linkedin_url || '');
        setPortfolioUrl(res.data.profile?.portfolio_url || '');
        setTwitterUrl(res.data.profile?.twitter_url || '');
        setSkills(res.data.profile?.skills || []);
      }
    } catch (err) {
      toast.error('Failed to load profile details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaveBasic = async (e) => {
    e.preventDefault();
    try {
      setIsSavingBasic(true);
      const payload = {
        name,
        headline,
        bio,
        phone,
        location,
        skills,
        github_url: githubUrl,
        linkedin_url: linkedinUrl,
        portfolio_url: portfolioUrl,
        twitter_url: twitterUrl
      };

      const res = await api.put('/profile', payload);
      if (res.data.success) {
        toast.success('Profile details saved!');
        refreshUser();
        fetchProfile();
      }
    } catch (err) {
      toast.error('Failed to update profile.');
    } finally {
      setIsSavingBasic(false);
    }
  };

  const handleDeleteEdu = async () => {
    if (!deleteEduId) return;
    try {
      await api.delete(`/profile/education/${deleteEduId}`);
      toast.success('Education record removed.');
      setDeleteEduId(null);
      fetchProfile();
    } catch (e) {
      toast.error('Failed to delete education.');
    }
  };

  const handleDeleteExp = async () => {
    if (!deleteExpId) return;
    try {
      await api.delete(`/profile/experience/${deleteExpId}`);
      toast.success('Experience record removed.');
      setDeleteExpId(null);
      fetchProfile();
    } catch (e) {
      toast.error('Failed to delete experience.');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <User className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            Profile & Settings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your professional presence, portfolio resume, and career parameters
          </p>
        </div>
      </div>

      {/* Completion Ring Banner */}
      <ProfileCompletionCard
        percentage={completion.percentage}
        tips={completion.tips}
      />

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1">
        {[
          { id: 'profile', label: 'Basic Info & Bio', icon: User },
          { id: 'experience', label: 'Experience & Education', icon: Briefcase },
          { id: 'preferences', label: 'Career Preferences', icon: Sliders },
          { id: 'security', label: 'Security & Account', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
                isActive
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-950/20'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: BASIC INFO & BIO */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          {/* Avatar Uploader */}
          <AvatarUploader
            user={user}
            onAvatarUpdated={(newUrl) => {
              updateProfileState({ avatar_url: newUrl });
              fetchProfile();
            }}
          />

          {/* Resume Uploader */}
          <ResumeUploader
            user={user}
            onResumeUpdated={(url, name) => {
              updateProfileState({ resume_url: url, resume_filename: name });
              fetchProfile();
            }}
          />

          {/* Main Profile Form */}
          <form onSubmit={handleSaveBasic} className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-card space-y-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Personal & Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                placeholder="Rajveer Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Professional Headline"
                placeholder="e.g. Senior Full-Stack Engineer | React & Node.js"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Location (City, Country)"
                icon={MapPin}
                placeholder="Bengaluru, India"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <Input
                label="Phone Number"
                icon={Phone}
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Professional Bio / Summary
              </label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Experienced software engineer with expertise in scalable web architectures, micro-frontends, and cloud native backends..."
                className="w-full text-xs p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 resize-none leading-relaxed"
              />
            </div>

            {/* Social Links */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Social & Portfolio Links
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="GitHub Profile URL"
                  icon={Github}
                  placeholder="https://github.com/username"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                />
                <Input
                  label="LinkedIn Profile URL"
                  icon={Linkedin}
                  placeholder="https://linkedin.com/in/username"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                />
                <Input
                  label="Portfolio Website"
                  icon={Globe}
                  placeholder="https://careerflow.dev/username"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                />
                <Input
                  label="Twitter / X Profile"
                  icon={Twitter}
                  placeholder="https://twitter.com/username"
                  value={twitterUrl}
                  onChange={(e) => setTwitterUrl(e.target.value)}
                />
              </div>
            </div>

            {/* Skills Manager */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <SkillsManager
                skills={skills}
                onChange={(updatedSkills) => setSkills(updatedSkills)}
              />
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <Button type="submit" variant="primary" isLoading={isSavingBasic}>
                Save Profile Changes
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: EXPERIENCE & EDUCATION */}
      {activeTab === 'experience' && (
        <div className="space-y-8">
          {/* Work Experience Section */}
          <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-brand-600" /> Work Experience
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Showcase past positions, impact metrics, and technologies used
                </p>
              </div>
              <Button
                size="sm"
                variant="primary"
                icon={Plus}
                onClick={() => {
                  setSelectedExp(null);
                  setExpModalOpen(true);
                }}
              >
                Add Experience
              </Button>
            </div>

            {experienceList.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 text-center">No work experience listed yet.</p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {experienceList.map((exp) => (
                  <div key={exp.id} className="py-4 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                          {exp.role}
                        </h4>
                        <span className="text-xs text-slate-400">at</span>
                        <span className="font-semibold text-xs text-brand-600 dark:text-brand-400">
                          {exp.company}
                        </span>
                        {exp.is_current ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
                            Current
                          </span>
                        ) : null}
                      </div>

                      <p className="text-xs text-slate-400">
                        {formatDate(exp.start_date)} — {exp.is_current ? 'Present' : formatDate(exp.end_date)}{' '}
                        {exp.location ? `• ${exp.location}` : ''}
                      </p>

                      {exp.description && (
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                          {exp.description}
                        </p>
                      )}

                      {exp.skills_used && exp.skills_used.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1.5">
                          {exp.skills_used.map((sk) => (
                            <span key={sk} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
                              {sk}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setSelectedExp(exp);
                          setExpModalOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteExpId(exp.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Education Section */}
          <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-brand-600" /> Education & Degrees
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Degrees, institutions, honors, and academic backgrounds
                </p>
              </div>
              <Button
                size="sm"
                variant="primary"
                icon={Plus}
                onClick={() => {
                  setSelectedEdu(null);
                  setEduModalOpen(true);
                }}
              >
                Add Education
              </Button>
            </div>

            {educationList.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 text-center">No education records listed yet.</p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {educationList.map((edu) => (
                  <div key={edu.id} className="py-4 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {edu.institution}
                      </h4>
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        {edu.degree} {edu.field_of_study ? `in ${edu.field_of_study}` : ''}
                      </p>
                      <p className="text-xs text-slate-400">
                        {edu.start_year || ''} — {edu.end_year || ''}{' '}
                        {edu.grade ? `• Grade: ${edu.grade}` : ''}
                      </p>
                      {edu.description && (
                        <p className="text-xs text-slate-500 pt-1">{edu.description}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setSelectedEdu(edu);
                          setEduModalOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteEduId(edu.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: CAREER PREFERENCES */}
      {activeTab === 'preferences' && (
        <JobPreferencesForm
          user={user}
          onSaved={() => {
            refreshUser();
            fetchProfile();
          }}
        />
      )}

      {/* TAB 4: SECURITY & ACCOUNT */}
      {activeTab === 'security' && (
        <SecuritySettings
          user={user}
          onEmailUpdated={() => {
            refreshUser();
            fetchProfile();
          }}
        />
      )}

      {/* Modals */}
      <EducationModal
        isOpen={eduModalOpen}
        onClose={() => setEduModalOpen(false)}
        educationToEdit={selectedEdu}
        onSaved={fetchProfile}
      />

      <ExperienceModal
        isOpen={expModalOpen}
        onClose={() => setExpModalOpen(false)}
        experienceToEdit={selectedExp}
        onSaved={fetchProfile}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteEduId)}
        onClose={() => setDeleteEduId(null)}
        onConfirm={handleDeleteEdu}
        title="Delete Education Record"
        message="Are you sure you want to remove this education entry?"
        isDanger={true}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteExpId)}
        onClose={() => setDeleteExpId(null)}
        onConfirm={handleDeleteExp}
        title="Delete Experience Record"
        message="Are you sure you want to delete this work experience entry?"
        isDanger={true}
      />
    </div>
  );
}
