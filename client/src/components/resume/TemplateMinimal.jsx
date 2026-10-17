import React from 'react';

export default function TemplateMinimal({ content, accentColor = '#475569', fontSize = 'normal' }) {
  if (!content) return null;

  const {
    personal_info = {},
    summary = '',
    experience = [],
    education = [],
    projects = [],
    skills = {},
    certifications = [],
    achievements = [],
    languages = [],
    section_order = ['summary', 'experience', 'projects', 'skills', 'education', 'certifications', 'achievements', 'languages'],
    section_visibility = {}
  } = content;

  const isVisible = (sec) => section_visibility[sec] !== false;

  const fontSizeClass =
    fontSize === 'compact' ? 'text-[11px]' : fontSize === 'relaxed' ? 'text-[13px]' : 'text-[12px]';

  return (
    <div className={`p-8 sm:p-10 bg-white text-slate-800 leading-relaxed font-sans ${fontSizeClass}`}>
      {/* MINIMAL HEADER */}
      <header className="pb-6 mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {personal_info.full_name || 'Your Full Name'}
        </h1>
        {personal_info.headline && (
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1">
            {personal_info.headline}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-slate-500">
          {personal_info.email && <span>{personal_info.email}</span>}
          {personal_info.phone && <span>/ {personal_info.phone}</span>}
          {personal_info.location && <span>/ {personal_info.location}</span>}
          {personal_info.linkedin && <span>/ {personal_info.linkedin.replace(/^https?:\/\//, '')}</span>}
          {personal_info.github && <span>/ {personal_info.github.replace(/^https?:\/\//, '')}</span>}
        </div>
      </header>

      {/* SECTIONS WITH LEFT ACCENT BAR */}
      <div className="space-y-6">
        {section_order.map((sectionKey) => {
          if (!isVisible(sectionKey)) return null;

          switch (sectionKey) {
            case 'summary':
              return summary ? (
                <section key="summary" className="space-y-1">
                  <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Summary
                  </h2>
                  <p className="text-slate-700 leading-relaxed pl-3 border-l-2 border-slate-200">
                    {summary}
                  </p>
                </section>
              ) : null;

            case 'experience':
              return experience.length > 0 ? (
                <section key="experience" className="space-y-3">
                  <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Experience
                  </h2>
                  <div className="space-y-3.5 pl-3 border-l-2 border-slate-200">
                    {experience.map((exp) => (
                      <div key={exp.id || exp.role} className="space-y-1">
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-bold text-slate-900">
                            {exp.role} · <span className="font-normal text-slate-600">{exp.company}</span>
                          </h3>
                          <span className="text-[11px] text-slate-400">
                            {exp.start_date} – {exp.is_current ? 'Present' : exp.end_date}
                          </span>
                        </div>
                        {exp.bullets && exp.bullets.length > 0 && (
                          <ul className="list-disc list-outside ml-4 space-y-0.5 text-slate-700 text-xs">
                            {exp.bullets.map((b, i) => (
                              <li key={i}>{b}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              ) : null;

            case 'projects':
              return projects.length > 0 ? (
                <section key="projects" className="space-y-3">
                  <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Projects
                  </h2>
                  <div className="space-y-2.5 pl-3 border-l-2 border-slate-200">
                    {projects.map((proj) => (
                      <div key={proj.id || proj.title} className="space-y-0.5">
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-bold text-slate-900">
                            {proj.title}
                            {proj.tech_stack && <span className="text-slate-400 font-normal ml-2">[{proj.tech_stack}]</span>}
                          </h3>
                          {proj.live_url && <span className="text-[11px] text-slate-400">{proj.live_url}</span>}
                        </div>
                        {proj.description && <p className="text-slate-600 text-xs">{proj.description}</p>}
                        {proj.bullets && proj.bullets.length > 0 && (
                          <ul className="list-disc list-outside ml-4 space-y-0.5 text-slate-700 text-xs">
                            {proj.bullets.map((b, i) => (
                              <li key={i}>{b}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              ) : null;

            case 'skills':
              return Object.keys(skills).length > 0 ? (
                <section key="skills" className="space-y-2">
                  <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Skills
                  </h2>
                  <div className="space-y-1 pl-3 border-l-2 border-slate-200 text-xs">
                    {Object.entries(skills).map(([cat, list]) => {
                      const arr = Array.isArray(list) ? list : [list];
                      if (arr.length === 0) return null;
                      return (
                        <div key={cat} className="flex gap-2">
                          <span className="font-bold text-slate-900 shrink-0 w-28">{cat}:</span>
                          <span className="text-slate-600">{arr.join(', ')}</span>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ) : null;

            case 'education':
              return education.length > 0 ? (
                <section key="education" className="space-y-2">
                  <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Education
                  </h2>
                  <div className="space-y-1.5 pl-3 border-l-2 border-slate-200 text-xs">
                    {education.map((edu) => (
                      <div key={edu.id || edu.institution} className="flex justify-between">
                        <div>
                          <span className="font-bold text-slate-900">{edu.institution}</span> ·{' '}
                          <span className="text-slate-600">{edu.degree}</span>
                        </div>
                        <span className="text-slate-400 text-[11px]">{edu.start_year} – {edu.end_year}</span>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null;

            case 'certifications':
              return certifications.length > 0 ? (
                <section key="certifications" className="space-y-1">
                  <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Certifications
                  </h2>
                  <div className="pl-3 border-l-2 border-slate-200 text-xs space-y-0.5">
                    {certifications.map((c) => (
                      <div key={c.id || c.name} className="flex justify-between">
                        <span><strong>{c.name}</strong>, {c.issuer}</span>
                        <span className="text-slate-400 text-[11px]">{c.date}</span>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null;

            case 'achievements':
              return achievements.length > 0 ? (
                <section key="achievements" className="space-y-1">
                  <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Achievements
                  </h2>
                  <div className="pl-3 border-l-2 border-slate-200 text-xs space-y-0.5">
                    {achievements.map((a, i) => (
                      <p key={i}><strong>{a.title}</strong> — {a.description}</p>
                    ))}
                  </div>
                </section>
              ) : null;

            case 'languages':
              return languages.length > 0 ? (
                <section key="languages" className="space-y-1">
                  <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Languages
                  </h2>
                  <p className="pl-3 border-l-2 border-slate-200 text-xs text-slate-600">
                    {languages.map((l) => `${l.language} (${l.proficiency})`).join(' · ')}
                  </p>
                </section>
              ) : null;

            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}
