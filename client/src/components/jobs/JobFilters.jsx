import React from 'react';
import { Filter, RotateCcw, MapPin, Briefcase, Award, DollarSign, Tag } from 'lucide-react';
import Button from '../ui/Button';

export default function JobFilters({
  filters,
  onChange,
  onReset,
  metaFilters
}) {
  const jobTypes = ['Full-time', 'Remote', 'Internship', 'Contract', 'Part-time'];
  const expLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Lead / Staff', 'Director'];

  const locationsList = metaFilters?.locations || ['Bengaluru', 'Delhi NCR', 'Mumbai', 'Hyderabad', 'Pune', 'Remote'];
  const popularSkills = metaFilters?.skills?.slice(0, 15) || [
    'React', 'Node.js', 'TypeScript', 'Python', 'Go', 'Docker', 'PostgreSQL', 'AWS', 'Kubernetes', 'Tailwind CSS', 'Figma'
  ];

  const handleSkillToggle = (skill) => {
    const current = filters.skills ? filters.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
    let updated;
    if (current.includes(skill)) {
      updated = current.filter(s => s !== skill);
    } else {
      updated = [...current, skill];
    }
    onChange({ skills: updated.join(',') });
  };

  const selectedSkills = filters.skills ? filters.skills.split(',').map(s => s.trim()).filter(Boolean) : [];

  return (
    <div className="space-y-6">
      {/* Header with Clear All */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
            Filters
          </h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 flex items-center gap-1 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear All
        </button>
      </div>

      {/* Location Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" /> Location
        </label>
        <select
          value={filters.location || ''}
          onChange={(e) => onChange({ location: e.target.value })}
          className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-3 py-2.5 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        >
          <option value="">All Locations</option>
          {locationsList.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Job Type Pills */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5" /> Job Type
        </label>
        <div className="flex flex-wrap gap-1.5">
          {jobTypes.map((type) => {
            const isSelected = filters.job_type === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => onChange({ job_type: isSelected ? '' : type })}
                className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                  isSelected
                    ? 'bg-brand-600 border-brand-600 text-white font-semibold shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Experience Level */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5" /> Experience Level
        </label>
        <div className="flex flex-wrap gap-1.5">
          {expLevels.map((lvl) => {
            const isSelected = filters.experience_level === lvl;
            return (
              <button
                key={lvl}
                type="button"
                onClick={() => onChange({ experience_level: isSelected ? '' : lvl })}
                className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                  isSelected
                    ? 'bg-brand-600 border-brand-600 text-white font-semibold shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {lvl}
              </button>
            );
          })}
        </div>
      </div>

      {/* Salary Slider (in LPA) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5" /> Min Salary
          </label>
          <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
            {filters.salary_min ? `₹${filters.salary_min} LPA+` : 'Any'}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="60"
          step="2"
          value={filters.salary_min || 0}
          onChange={(e) => onChange({ salary_min: parseInt(e.target.value, 10) || '' })}
          className="w-full accent-brand-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg"
        />
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>₹0 LPA</span>
          <span>₹30 LPA</span>
          <span>₹60 LPA+</span>
        </div>
      </div>

      {/* Popular Skills Selection */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5" /> Skills Filter
        </label>
        <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
          {popularSkills.map((skill) => {
            const isSelected = selectedSkills.includes(skill);
            return (
              <button
                key={skill}
                type="button"
                onClick={() => handleSkillToggle(skill)}
                className={`text-[11px] px-2 py-0.5 rounded-md border transition ${
                  isSelected
                    ? 'bg-brand-500 border-brand-500 text-white font-medium'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                {skill}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
