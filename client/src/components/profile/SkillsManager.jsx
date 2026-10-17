import React, { useState } from 'react';
import { Tag, Plus, X, Sparkles } from 'lucide-react';

const POPULAR_SUGGESTIONS = [
  'React', 'Node.js', 'TypeScript', 'JavaScript', 'Python', 'Go',
  'Next.js', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS', 'GraphQL',
  'Tailwind CSS', 'Redux', 'MongoDB', 'Redis', 'Kafka', 'Figma', 'System Design'
];

export default function SkillsManager({ skills = [], onChange }) {
  const [skillInput, setSkillInput] = useState('');

  const handleAddSkill = (skillToAdd) => {
    const trimmed = skillToAdd.trim();
    if (!trimmed) return;
    if (skills.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      setSkillInput('');
      return;
    }
    onChange([...skills, trimmed]);
    setSkillInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill(skillInput);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    onChange(skills.filter(s => s !== skillToRemove));
  };

  return (
    <div className="space-y-4">
      {/* Input box */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a skill and press Enter (e.g. Next.js, Docker)..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        <button
          type="button"
          onClick={() => handleAddSkill(skillInput)}
          className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-brand-600 hover:bg-brand-700 text-white flex items-center gap-1 transition"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {/* Active Skills List */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
          Your Skills ({skills.length})
        </label>
        {skills.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No skills added yet. Add at least 3 skills to get high match ratings.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-rose-500 transition"
                  title="Remove skill"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Suggested Skills */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Click to add suggestions:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_SUGGESTIONS.filter(s => !skills.includes(s)).slice(0, 12).map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleAddSkill(suggestion)}
              className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:border-brand-500 hover:text-brand-600 transition flex items-center gap-1"
            >
              <Plus className="w-3 h-3 text-slate-400" />
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
