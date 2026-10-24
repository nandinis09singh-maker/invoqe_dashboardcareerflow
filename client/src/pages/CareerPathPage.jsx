import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Compass,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Target,
  Layers,
  Server,
  Layout,
  BarChart3,
  Brain,
  Palette,
  Cpu,
  Briefcase,
  Star
} from 'lucide-react';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

import RoadmapStage from '../components/career/RoadmapStage';
import SkillGapCard from '../components/career/SkillGapCard';
import SalaryChart from '../components/career/SalaryChart';
import CareerGoalModal from '../components/career/CareerGoalModal';
import MatchingJobsSection from '../components/career/MatchingJobsSection';
import Button from '../components/ui/Button';
import api from '../api/axios';
import {
  fetchCareerRoles,
  fetchCareerRoleDetail,
  fetchCareerGap,
  toggleCareerSkillProgress
} from '../utils/careerService';

const ROLE_ICONS = {
  'frontend-developer': Layout,
  'backend-developer': Server,
  'full-stack-developer': Layers,
  'data-analyst': BarChart3,
  'data-scientist': Brain,
  'ui-ux-designer': Palette,
  'devops-engineer': Cpu,
  'product-manager': Briefcase
};

export default function CareerPathPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [roles, setRoles] = useState([]);
  const [selectedRoleSlug, setSelectedRoleSlug] = useState(searchParams.get('role') || 'frontend-developer');
  const [roleDetail, setRoleDetail] = useState(null);
  const [gapData, setGapData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [highlightedSkillId, setHighlightedSkillId] = useState(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  // Fetch all 8 roles
  useEffect(() => {
    async function fetchRoles() {
      try {
        const data = await fetchCareerRoles();
        setRoles(data || []);
      } catch (e) {
        console.error('Failed to load roles', e);
      }
    }
    fetchRoles();
  }, []);

  // Fetch role detail & skill gap when selectedRoleSlug changes
  useEffect(() => {
    async function loadRoleData() {
      try {
        setIsLoading(true);
        const role = await fetchCareerRoleDetail(selectedRoleSlug);
        setRoleDetail(role);

        const gap = await fetchCareerGap(selectedRoleSlug);
        setGapData(gap);
      } catch (err) {
        console.error('Failed to load role data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    if (selectedRoleSlug) {
      loadRoleData();
      setSearchParams({ role: selectedRoleSlug }, { replace: true });
    }
  }, [selectedRoleSlug, setSearchParams]);

  // Handle skill toggle
  const handleToggleSkill = async (skillId, roleId, completed, stageId) => {
    try {
      const res = await api.post('/career/progress', {
        skillId,
        roleId,
        completed
      });

      if (res.data.success) {
        // Optimistically update local roleDetail state
        setRoleDetail((prev) => {
          if (!prev) return prev;
          const updatedStages = prev.stages.map((st) => {
            if (st.id === stageId) {
              const updatedSkills = st.skills.map((sk) =>
                sk.id === skillId ? { ...sk, isCompleted: res.data.isCompleted } : sk
              );
              const completedCount = updatedSkills.filter((s) => s.isCompleted).length;
              const percentage = Math.round((completedCount / updatedSkills.length) * 100);
              return {
                ...st,
                skills: updatedSkills,
                completedCount,
                percentage
              };
            }
            return st;
          });

          const totalSkills = prev.totalSkills;
          const completedCount = res.data.completedCount;
          const overallPercentage = res.data.overallPercentage;

          return {
            ...prev,
            stages: updatedStages,
            completedCount,
            overallPercentage
          };
        });

        // Refresh gap data
        const gapRes = await api.get(`/career/gap/${roleId}`);
        if (gapRes.data.success) {
          setGapData(gapRes.data);
        }

        // Celebrate if stage reached 100%!
        if (res.data.isStageCompleted && completed) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
          toast.success('🏆 Fantastic milestone! You completed an entire stage!');
        } else if (completed) {
          toast.success('Skill checked off in your roadmap!');
        }
      }
    } catch (err) {
      toast.error('Failed to update skill progress.');
    }
  };

  // Jump to skill in roadmap from Gap Analysis
  const handleJumpToSkill = (skillId, stageId) => {
    setHighlightedSkillId(skillId);
    const element = document.getElementById(`skill-${skillId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    // Remove highlight after 3 seconds
    setTimeout(() => {
      setHighlightedSkillId(null);
    }, 3000);
  };

  const overallPercentage = roleDetail?.overallPercentage || 0;
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallPercentage / 100) * circumference;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Compass className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            Career Path & Skill Roadmaps
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Structured 4-stage roadmaps, skill gap evaluation, and verified compensation bands
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            icon={Target}
            onClick={() => setIsGoalModalOpen(true)}
          >
            My Career Goals
          </Button>
        </div>
      </div>

      {/* ROLE SELECTOR PILL TABS (All 8 Roles) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {roles.map((r) => {
          const IconComponent = ROLE_ICONS[r.slug] || Compass;
          const isSelected = selectedRoleSlug === r.slug;

          return (
            <button
              key={r.slug}
              onClick={() => setSelectedRoleSlug(r.slug)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                isSelected
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <IconComponent className={`w-4 h-4 ${isSelected ? 'text-brand-400 dark:text-brand-600' : 'text-slate-400'}`} />
              <span>{r.title}</span>
              {r.userProgress && r.userProgress.percentage > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                  {r.userProgress.percentage}%
                </span>
              )}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="space-y-6 animate-pulse">
          <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>
      ) : roleDetail ? (
        <>
          {/* ROLE HERO OVERVIEW CARD */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>4 Stages • {roleDetail.totalSkills} Verified Competencies</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {roleDetail.title} Roadmap
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {roleDetail.description}
              </p>
            </div>

            {/* Circular Overall Progress Ring */}
            <div className="flex items-center gap-4 bg-slate-50/80 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 shrink-0">
              <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="6"
                    className="text-slate-200 dark:text-slate-700"
                    fill="transparent"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="text-brand-600 dark:text-brand-400 transition-all duration-700 ease-out"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute text-xs font-black text-slate-900 dark:text-slate-100">
                  {overallPercentage}%
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {roleDetail.completedCount} of {roleDetail.totalSkills} Completed
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Path progression
                </p>
              </div>
            </div>
          </div>

          {/* SKILL GAP ANALYSIS COMPONENT */}
          <SkillGapCard gapData={gapData} onJumpToSkill={handleJumpToSkill} />

          {/* 4 ROADMAP STAGES LIST */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  Interactive Learning Roadmap
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Progress step by step from foundational fundamentals to job-ready production mastery
                </p>
              </div>
            </div>

            {roleDetail.stages.map((stage) => (
              <RoadmapStage
                key={stage.id}
                stage={stage}
                roleId={roleDetail.id}
                onToggleSkill={handleToggleSkill}
                highlightedSkillId={highlightedSkillId}
              />
            ))}
          </div>

          {/* SALARY INSIGHTS CHART */}
          <SalaryChart
            roleTitle={roleDetail.title}
            salaryData={roleDetail.salaryData}
          />

          {/* JOBS MATCHING YOUR PATH */}
          <MatchingJobsSection
            roleTitle={roleDetail.title}
            roleSlug={roleDetail.slug}
          />
        </>
      ) : null}

      {/* CAREER GOALS MODAL */}
      <CareerGoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        currentRole={roleDetail}
        roles={roles}
        onGoalUpdated={() => {
          // re-fetch roles to update user progress
          api.get('/career/roles').then((r) => {
            if (r.data.success) setRoles(r.data.roles);
          });
        }}
      />
    </div>
  );
}
