import React from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Award, CheckCircle } from 'lucide-react';

export default function TemplateCreative({ content, accentColor = '#059669', fontSize = 'normal' }) {
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
    <div className={`bg-white text-slate-800 leading-relaxed font-sans ${fontSizeClass}`}>
      {/* VIBRANT TOP ACCENT BANNER */}
      <header className="p-8 text-white relative overflow-hidden" style={{ backgroundColor: accentColor }}>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
          {personal_info.full_name || 'Your Full Name'}
        </h1>
        {personal_info.headline && (
          <p className="text-sm font-semibold opacity-90 mt-1 tracking-wide">
            {personal_info.headline}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-4 text-xs opacity-95">
          {personal_info.email && (
            <span className="flex items-center gap-1.5 bg-black/15 px-2.5 py-1 rounded-lg backdrop-blur-xs">
              <Mail className="w-3 h-3" /> {personal_info.email}
            </span>
          )}
          {personal_info.phone && (
            <span className="flex items-center gap-1.5 bg-black/15 px-2.5 py-1 rounded-lg backdrop-blur-xs">
              <Phone className="w-3 h-3" /> {personal_info.phone}
            </span>
          )}
          {personal_info.location && (
            <span className="flex items-center gap-1.5 bg-black/15 px-2.5 py-1 rounded-lg backdrop-blur-xs">
              <MapPin className="w-3 h-3" /> {personal_info.location}
            </span>
          )}
          {personal_info.linkedin && (
            <span className="flex items-center gap-1.5 bg-black/15 px-2.5 py-1 rounded-lg backdrop-blur-xs">
              <Linkedin className="w-3 h-3" /> {personal_info.linkedin.replace(/^https?:\/\//, '')}
            </span>
          )}
          {personal_info.github && (
            <span className="flex items-center gap-1.5 bg-black/15 px-2.5 py-1 rounded-lg backdrop-blur-xs">
              <Github className="w-3 h-3" /> {personal_info.github.replace(/^https?:\/\//, '')}
            </span>
          )}
        </div>
      </header>

      {/* CONTENT BODY */}
      <div className="p-8 sm:p-10 space-y-6">
        {section_order.map((sectionKey) => {
          if (!isVisible(sectionKey)) return null;

          switch (sectionKey) {
            case 'summary':
              return summary ? (
                <section key="summary" className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      About Me
                    </span>
                    <span className="flex-1 h-px bg-slate-200" />
                  </div>
                  <p className="text-slate-700 leading-relaxed">{summary}</p>
                </section>
              ) : null;

            case 'experience':
              return experience.length > 0 ? (
                <section key="experience" className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Professional Experience
                    </span>
                    <span className="flex-1 h-px bg-slate-200" />
                  </div>
                  <div className="space-y-4">
                    {experience.map((exp) => (
                      <div key={exp.id || exp.role} className="space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h3 className="font-bold text-slate-900">
                            {exp.role}{' '}
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-md ml-1" style={{ backgroundColor: `${accentColor}18`, color: accentColor }}>
                              @{exp.company}
                            </span>
                          </h3>
                          <span className="text-[11px] font-semibold text-slate-500">
                            {exp.start_date} – {exp.is_current ? 'Present' : exp.end_date} {exp.location ? `• ${exp.location}` : ''}
                          </span>
                        </div>
                        {exp.bullets && exp.bullets.length > 0 && (
                          <ul className="list-disc list-outside ml-4 space-y-0.5 text-slate-700 pt-1">
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
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Featured Projects
                    </span>
                    <span className="flex-1 h-px bg-slate-200" />
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {projects.map((proj) => (
                      <div key={proj.id || proj.title} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-bold text-slate-900">{proj.title}</h3>
                          {proj.live_url && (
                            <span className="text-[11px] font-medium" style={{ color: accentColor }}>
                              {proj.live_url.replace(/^https?:\/\//, '')}
                            </span>
                          )}
                        </div>
                        {proj.description && <p className="text-slate-600 text-xs">{proj.description}</p>}
                        {proj.tech_stack && (
                          <p className="text-[11px] font-semibold text-slate-500">
                            Tech: <span className="font-normal text-slate-700">{proj.tech_stack}</span>
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              ) : null;

            case 'skills':
              return Object.keys(skills).length > 0 ? (
                <section key="skills" className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Technical Skills
                    </span>
                    <span className="flex-1 h-px bg-slate-200" />
                  </div>
                  <div className="space-y-2 pt-1">
                    {Object.entries(skills).map(([cat, list]) => {
                      const arr = Array.isArray(list) ? list : [list];
                      if (arr.length === 0) return null;
                      return (
                        <div key={cat} className="space-y-1">
                          <p className="text-[11px] font-bold text-slate-700">{cat}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {arr.map((item) => (
                              <span
                                key={item}
                                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ) : null;

            case 'education':
              return education.length > 0 ? (
                <section key="education" className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Education
                    </span>
                    <span className="flex-1 h-px bg-slate-200" />
                  </div>
                  <div className="space-y-2">
                    {education.map((edu) => (
                      <div key={edu.id || edu.institution} className="flex justify-between items-baseline">
                        <div>
                          <p className="font-bold text-slate-900">{edu.institution}</p>
                          <p className="text-slate-600 text-xs">{edu.degree} {edu.grade ? `(${edu.grade})` : ''}</p>
                        </div>
                        <span className="text-[11px] text-slate-500">{edu.start_year} – {edu.end_year}</span>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null;

            case 'certifications':
              return certifications.length > 0 ? (
                <section key="certifications" className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Certifications
                    </span>
                    <span className="flex-1 h-px bg-slate-200" />
                  </div>
                  <div className="space-y-1 text-xs">
                    {certifications.map((c) => (
                      <div key={c.id || c.name} className="flex justify-between">
                        <span><strong>{c.name}</strong> • {c.issuer}</span>
                        <span className="text-slate-500">{c.date}</span>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null;

            case 'achievements':
              return achievements.length > 0 ? (
                <section key="achievements" className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Awards & Achievements
                    </span>
                    <span className="flex-1 h-px bg-slate-200" />
                  </div>
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-xs">
                    {achievements.map((a, i) => (
                      <li key={i}><strong>{a.title}</strong>: {a.description}</li>
                    ))}
                  </ul>
                </section>
              ) : null;

            case 'languages':
              return languages.length > 0 ? (
                <section key="languages" className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Languages
                    </span>
                    <span className="flex-1 h-px bg-slate-200" />
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {languages.map((l) => (
                      <span key={l.id || l.language} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {l.language} ({l.proficiency})
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
