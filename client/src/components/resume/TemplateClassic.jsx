import React from 'react';

export default function TemplateClassic({ content, accentColor = '#1e293b', fontSize = 'normal' }) {
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
    <div className={`p-8 sm:p-10 bg-white text-slate-800 leading-relaxed font-serif ${fontSizeClass}`}>
      {/* CLASSIC CENTERED HEADER */}
      <header className="text-center pb-5 mb-5 border-b border-slate-300">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-normal text-slate-900">
          {personal_info.full_name || 'Your Full Name'}
        </h1>
        {personal_info.headline && (
          <p className="text-sm italic text-slate-600 mt-1">
            {personal_info.headline}
          </p>
        )}

        {/* Contact links separated by bullets */}
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 mt-2.5 text-xs text-slate-600 font-sans">
          {personal_info.email && <span>{personal_info.email}</span>}
          {personal_info.phone && <span>• {personal_info.phone}</span>}
          {personal_info.location && <span>• {personal_info.location}</span>}
          {personal_info.linkedin && <span>• {personal_info.linkedin.replace(/^https?:\/\//, '')}</span>}
          {personal_info.github && <span>• {personal_info.github.replace(/^https?:\/\//, '')}</span>}
          {personal_info.website && <span>• {personal_info.website.replace(/^https?:\/\//, '')}</span>}
        </div>
      </header>

      {/* DYNAMIC SECTIONS */}
      <div className="space-y-4">
        {section_order.map((sectionKey) => {
          if (!isVisible(sectionKey)) return null;

          switch (sectionKey) {
            case 'summary':
              return summary ? (
                <section key="summary" className="space-y-1">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">
                    Professional Summary
                  </h2>
                  <p className="text-slate-700 pt-0.5">{summary}</p>
                </section>
              ) : null;

            case 'experience':
              return experience.length > 0 ? (
                <section key="experience" className="space-y-3">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">
                    Work Experience
                  </h2>
                  <div className="space-y-3">
                    {experience.map((exp) => (
                      <div key={exp.id || exp.role} className="space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                          <h3 className="font-bold text-slate-900">
                            {exp.role}, <span className="font-semibold italic text-slate-700">{exp.company}</span>
                          </h3>
                          <span className="text-[11px] font-sans text-slate-500">
                            {exp.start_date} – {exp.is_current ? 'Present' : exp.end_date} | {exp.location}
                          </span>
                        </div>
                        {exp.bullets && exp.bullets.length > 0 && (
                          <ul className="list-disc list-outside ml-4 space-y-0.5 text-slate-700">
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
                <section key="projects" className="space-y-2.5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">
                    Selected Projects
                  </h2>
                  <div className="space-y-2.5">
                    {projects.map((proj) => (
                      <div key={proj.id || proj.title} className="space-y-0.5">
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-bold text-slate-900">
                            {proj.title}
                            {proj.tech_stack && <span className="text-slate-600 font-normal italic ml-2">({proj.tech_stack})</span>}
                          </h3>
                          {proj.live_url && <span className="text-[11px] font-sans text-slate-500">{proj.live_url}</span>}
                        </div>
                        {proj.description && <p className="text-slate-700">{proj.description}</p>}
                        {proj.bullets && proj.bullets.length > 0 && (
                          <ul className="list-disc list-outside ml-4 space-y-0.5 text-slate-700">
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
                <section key="skills" className="space-y-1.5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">
                    Technical & Professional Skills
                  </h2>
                  <div className="space-y-1 pt-0.5 font-sans text-xs">
                    {Object.entries(skills).map(([category, items]) => {
                      const list = Array.isArray(items) ? items : [items];
                      if (list.length === 0) return null;
                      return (
                        <div key={category} className="flex flex-wrap items-baseline gap-1.5">
                          <span className="font-bold text-slate-800">{category}:</span>
                          <span className="text-slate-600">{list.join(', ')}</span>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ) : null;

            case 'education':
              return education.length > 0 ? (
                <section key="education" className="space-y-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">
                    Education
                  </h2>
                  <div className="space-y-1.5">
                    {education.map((edu) => (
                      <div key={edu.id || edu.institution} className="flex justify-between items-baseline">
                        <div>
                          <span className="font-bold text-slate-900">{edu.institution}</span> —{' '}
                          <span className="italic">{edu.degree}</span>
                          {edu.grade ? ` (GPA: ${edu.grade})` : ''}
                        </div>
                        <span className="text-[11px] font-sans text-slate-500">
                          {edu.start_year} – {edu.end_year}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null;

            case 'certifications':
              return certifications.length > 0 ? (
                <section key="certifications" className="space-y-1">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">
                    Certifications
                  </h2>
                  {certifications.map((c) => (
                    <div key={c.id || c.name} className="flex justify-between items-baseline">
                      <span><strong>{c.name}</strong>, {c.issuer}</span>
                      <span className="text-[11px] font-sans text-slate-500">{c.date}</span>
                    </div>
                  ))}
                </section>
              ) : null;

            case 'achievements':
              return achievements.length > 0 ? (
                <section key="achievements" className="space-y-1">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">
                    Honors & Achievements
                  </h2>
                  <ul className="list-disc list-outside ml-4 space-y-0.5">
                    {achievements.map((a, i) => (
                      <li key={i}><strong>{a.title}</strong>: {a.description}</li>
                    ))}
                  </ul>
                </section>
              ) : null;

            case 'languages':
              return languages.length > 0 ? (
                <section key="languages" className="space-y-1">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">
                    Languages
                  </h2>
                  <p className="font-sans text-xs text-slate-700">
                    {languages.map((l) => `${l.language} (${l.proficiency})`).join(' • ')}
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
