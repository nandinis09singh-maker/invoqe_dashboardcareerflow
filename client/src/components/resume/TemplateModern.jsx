import React from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

export default function TemplateModern({ content, accentColor = '#4f46e5', fontSize = 'normal' }) {
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
      {/* HEADER */}
      <header className="border-b-2 pb-6 mb-6" style={{ borderColor: accentColor }}>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 uppercase">
          {personal_info.full_name || 'Your Full Name'}
        </h1>
        {personal_info.headline && (
          <p className="text-sm sm:text-base font-semibold mt-1" style={{ color: accentColor }}>
            {personal_info.headline}
          </p>
        )}

        {/* Contact Links Bar */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-slate-600">
          {personal_info.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              {personal_info.email}
            </span>
          )}
          {personal_info.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              {personal_info.phone}
            </span>
          )}
          {personal_info.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {personal_info.location}
            </span>
          )}
          {personal_info.website && (
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              {personal_info.website.replace(/^https?:\/\//, '')}
            </span>
          )}
          {personal_info.linkedin && (
            <span className="flex items-center gap-1">
              <Linkedin className="w-3.5 h-3.5 text-slate-400" />
              {personal_info.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
            </span>
          )}
          {personal_info.github && (
            <span className="flex items-center gap-1">
              <Github className="w-3.5 h-3.5 text-slate-400" />
              {personal_info.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
            </span>
          )}
        </div>
      </header>

      {/* RENDER SECTIONS DYNAMICALLY IN ORDER */}
      <div className="space-y-5">
        {section_order.map((sectionKey) => {
          if (!isVisible(sectionKey)) return null;

          switch (sectionKey) {
            case 'summary':
              return summary ? (
                <section key="summary" className="space-y-1.5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: accentColor }} />
                    Professional Summary
                  </h2>
                  <p className="text-slate-700 leading-relaxed pt-0.5">{summary}</p>
                </section>
              ) : null;

            case 'experience':
              return experience.length > 0 ? (
                <section key="experience" className="space-y-3">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: accentColor }} />
                    Work Experience
                  </h2>
                  <div className="space-y-3.5">
                    {experience.map((exp) => (
                      <div key={exp.id || exp.role} className="space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                          <h3 className="font-bold text-slate-900">
                            {exp.role} <span className="font-semibold text-slate-500">at</span>{' '}
                            <span style={{ color: accentColor }}>{exp.company}</span>
                          </h3>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {exp.start_date} — {exp.is_current ? 'Present' : exp.end_date}{' '}
                            {exp.location ? `• ${exp.location}` : ''}
                          </span>
                        </div>
                        {exp.description && <p className="text-slate-600 text-[11px]">{exp.description}</p>}
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
                <section key="projects" className="space-y-3">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: accentColor }} />
                    Key Projects
                  </h2>
                  <div className="space-y-3">
                    {projects.map((proj) => (
                      <div key={proj.id || proj.title} className="space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                          <h3 className="font-bold text-slate-900">
                            {proj.title}
                            {proj.tech_stack && (
                              <span className="text-[11px] font-normal text-slate-500 ml-2">
                                ({proj.tech_stack})
                              </span>
                            )}
                          </h3>
                          {proj.live_url && (
                            <span className="text-[11px] text-slate-500">{proj.live_url.replace(/^https?:\/\//, '')}</span>
                          )}
                        </div>
                        {proj.description && <p className="text-slate-600">{proj.description}</p>}
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
                <section key="skills" className="space-y-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: accentColor }} />
                    Core Competencies & Skills
                  </h2>
                  <div className="space-y-1.5 pt-0.5">
                    {Object.entries(skills).map(([category, items]) => {
                      const list = Array.isArray(items) ? items : [items];
                      if (list.length === 0) return null;
                      return (
                        <div key={category} className="flex flex-wrap items-baseline gap-1.5 text-xs">
                          <span className="font-bold text-slate-800">{category}:</span>
                          <span className="text-slate-600">{list.join(' • ')}</span>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ) : null;

            case 'education':
              return education.length > 0 ? (
                <section key="education" className="space-y-2.5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: accentColor }} />
                    Education
                  </h2>
                  <div className="space-y-2">
                    {education.map((edu) => (
                      <div key={edu.id || edu.institution} className="flex flex-col sm:flex-row sm:items-center justify-between">
                        <div>
                          <h3 className="font-bold text-slate-900">{edu.institution}</h3>
                          <p className="text-slate-600">
                            {edu.degree} {edu.grade ? `(Grade: ${edu.grade})` : ''}
                          </p>
                        </div>
                        <span className="text-[11px] text-slate-500">
                          {edu.start_year} — {edu.end_year}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null;

            case 'certifications':
              return certifications.length > 0 ? (
                <section key="certifications" className="space-y-1.5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: accentColor }} />
                    Certifications
                  </h2>
                  <div className="space-y-1">
                    {certifications.map((c) => (
                      <div key={c.id || c.name} className="flex justify-between items-baseline">
                        <span className="font-semibold text-slate-800">
                          {c.name} {c.issuer ? `— ${c.issuer}` : ''}
                        </span>
                        <span className="text-[11px] text-slate-500">{c.date}</span>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null;

            case 'achievements':
              return achievements.length > 0 ? (
                <section key="achievements" className="space-y-1.5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: accentColor }} />
                    Key Achievements
                  </h2>
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-slate-700">
                    {achievements.map((a, i) => (
                      <li key={i}>
                        <strong>{a.title}</strong>: {a.description}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null;

            case 'languages':
              return languages.length > 0 ? (
                <section key="languages" className="space-y-1">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: accentColor }} />
                    Languages
                  </h2>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 pt-0.5">
                    {languages.map((l) => (
                      <span key={l.id || l.language} className="text-slate-700">
                        <strong>{l.language}</strong> ({l.proficiency})
                      </span>
                    ))}
                  </div>
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
