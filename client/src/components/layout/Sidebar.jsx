import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  Bookmark,
  Kanban,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Compass,
  FileText,
  Sparkles,
  Bot
} from 'lucide-react';

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  const navItems = [
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Explore Jobs', to: '/jobs', icon: Search },
    { label: 'Career Path', to: '/career-path', icon: Compass },
    { label: 'Resume Builder', to: '/resume-builder', icon: FileText },
    { label: 'AI Mock Interview', to: '/mock-interview', icon: Bot, isNew: true },
    { label: 'Saved Jobs', to: '/saved', icon: Bookmark },
    { label: 'Applications', to: '/applications', icon: Kanban },
    { label: 'Profile & Settings', to: '/profile', icon: UserCheck }
  ];

  const futureModules = [
    { label: 'Salary Negotiator', icon: Sparkles, stage: 'Pro' }
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside
        className={`hidden md:flex flex-col border-r border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-all duration-300 z-30 shrink-0 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/25 shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent truncate">
                Career<span className="text-brand-600 dark:text-brand-400">Flow</span>
              </span>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition hidden lg:block"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
          {!isCollapsed && (
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Menu
            </p>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-semibold shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100'
                  } ${isCollapsed ? 'justify-center px-0' : ''}`
                }
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
                {!isCollapsed && (
                  <span className="flex-1 flex items-center justify-between truncate">
                    <span className="truncate">{item.label}</span>
                    {item.isNew && (
                      <span className="text-[10px] font-extrabold bg-gradient-to-r from-brand-600 to-indigo-600 text-white px-1.5 py-0.2 rounded-full uppercase tracking-wider ml-1.5 shadow-sm">
                        AI
                      </span>
                    )}
                  </span>
                )}
              </NavLink>
            );
          })}

          {/* Extensibility modules for Stage 2 & Stage 3 */}
          <div className="pt-6">
            {!isCollapsed && (
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center justify-between">
                <span>Coming Soon</span>
                <Sparkles className="w-3 h-3 text-amber-500" />
              </p>
            )}
            {futureModules.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.label}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-slate-400 dark:text-slate-600 cursor-not-allowed select-none ${
                    isCollapsed ? 'justify-center px-0' : 'justify-between'
                  }`}
                  title={`${m.label} (${m.stage})`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon className="w-5 h-5 shrink-0" />
                    {!isCollapsed && <span className="truncate">{m.label}</span>}
                  </div>
                  {!isCollapsed && (
                    <span className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full">
                      {m.stage}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info in sidebar */}
        {!isCollapsed && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800/60 text-center">
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              CareerFlow Platform • v1.0.0
            </p>
          </div>
        )}
      </aside>

      {/* MOBILE BOTTOM NAVIGATION TAB BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800/80 px-1 py-1 flex items-center justify-around overflow-x-auto scrollbar-none shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition text-[10px] font-medium shrink-0 min-w-[54px] ${
                  isActive
                    ? 'text-brand-600 dark:text-brand-400 font-semibold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span className="truncate max-w-[60px]">{item.label.split(' ')[0]}</span>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}
